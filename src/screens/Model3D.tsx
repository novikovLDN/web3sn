import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { Character } from '../island/Character'
import { LIT_STAGES, type ModelStats, type PipelineStage } from './modeling/stages'

/**
 * Стенд просмотра модели.
 *
 * ПОЧЕМУ ЗДЕСЬ ШЕСТЬ СТАДИЙ, А НЕ ОДИН КРАСИВЫЙ РЕНДЕР
 * ───────────────────────────────────────────────────
 * Финальный кадр — единственный взгляд на модель, по которому о модели
 * судить нельзя: он одинаково хорошо прячет чистую сетку и грязную.
 * Стенд показывает один и тот же объект так, как его смотрит человек,
 * который принимает работу: сеткой, ретопологией, развёрткой, глиной,
 * затенением и только в конце — финальным кадром.
 *
 * Смена стадии — подмена материала на уже загруженной геометрии: ноль
 * сетевых запросов и один кадр. Сцена не пересобирается.
 *
 * ПОЧЕМУ СТЕНД САМ СЕБЯ ИЗМЕРЯЕТ
 * ──────────────────────────────
 * Все числа на экране приходят отсюда: обход геометрии даёт треугольники,
 * вершины, материалы и плотность текселя, renderer.info — реальное число
 * вызовов отрисовки за кадр. Написать в вёрстке «оптимизировано» может
 * кто угодно; посчитать это на клиенте из того самого файла, который
 * сейчас крутится в кадре, — нет.
 *
 * ВАЖНО: модель подхватывается через import.meta.glob из src/models/*.glb —
 * пользователь кладёт файлы туда сам. Этот механизм трогать нельзя.
 */

// Авто-подхват своей 3D-модели из src/models (просто положите туда .glb).
const modelFiles = import.meta.glob('../models/*.{glb,gltf}', { eager: true, query: '?url', import: 'default' })
const MODEL_URL = (Object.entries(modelFiles).sort(([a], [b]) => a.localeCompare(b))[0]?.[1] as string | undefined)

/** Исходные материалы мешей. WeakMap — чтобы не держать сцену от сборки мусора. */
const ORIGINALS = new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>()
/** Оверлей сетки, привязанный к своему мешу. Создаётся один раз, дальше только прячется. */
const OVERLAYS = new WeakMap<THREE.Mesh, THREE.Mesh>()

/* ── Шейдер развёртки ──────────────────────────────────────────────────
   Клетка по UV показывает сразу две вещи: плотность текселей (клетки
   разного размера = разное разрешение текстуры на разных участках) и
   направление развёртки (подмешанный в цвет сам vUv). Растянутая клетка —
   это шов или плохой островок, и на финальном кадре этого не видно. */
const UV_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const UV_FRAG = `
  varying vec2 vUv;
  void main() {
    float c = mod(floor(vUv.x * 8.0) + floor(vUv.y * 8.0), 2.0);
    vec3 base = mix(vec3(0.10, 0.08, 0.07), vec3(0.79, 0.66, 0.51), c);
    // Подмешиваем координаты: по цвету читается, куда «течёт» развёртка.
    base += vec3(vUv.x * 0.18, vUv.y * 0.10, 0.0);
    gl_FragColor = vec4(base, 1.0);
  }
`

/* ══════════════════════════════════════════════════════════════════════
   ИЗМЕРЕНИЕ
   ══════════════════════════════════════════════════════════════════════ */

/** Треугольники геометрии — по индексу, если он есть, иначе по вершинам. */
function triCount(g: THREE.BufferGeometry): number {
  const idx = g.getIndex()
  const pos = g.getAttribute('position')
  if (!pos) return 0
  return Math.floor((idx ? idx.count : pos.count) / 3)
}

/**
 * Площадь меша в мире и в UV-пространстве.
 *
 * Отношение одного к другому и есть плотность текселя: сколько пикселей
 * текстуры приходится на единицу поверхности. Считаем честно, по треугольникам,
 * с применением мировой матрицы — масштаб объекта в плотность входит.
 *
 * Потолок в 200 000 треугольников: полный обход тяжёлой модели заблокировал
 * бы кадр, а точность оценки от выборки почти не страдает.
 */
const AREA_LIMIT = 200_000

function meshAreas(mesh: THREE.Mesh): { world: number; uv: number } {
  const g = mesh.geometry
  const pos = g.getAttribute('position')
  const uv = g.getAttribute('uv')
  if (!pos) return { world: 0, uv: 0 }

  const idx = g.getIndex()
  const total = idx ? idx.count : pos.count
  // Шаг выборки: на плотных моделях берём каждый n-й треугольник и
  // домножаем результат обратно — площадь распределена равномерно.
  const tris = Math.floor(total / 3)
  const step = tris > AREA_LIMIT ? Math.ceil(tris / AREA_LIMIT) : 1

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const m = mesh.matrixWorld

  let world = 0
  let uvArea = 0

  for (let t = 0; t < tris; t += step) {
    const i = t * 3
    const i0 = idx ? idx.getX(i) : i
    const i1 = idx ? idx.getX(i + 1) : i + 1
    const i2 = idx ? idx.getX(i + 2) : i + 2

    a.fromBufferAttribute(pos, i0).applyMatrix4(m)
    b.fromBufferAttribute(pos, i1).applyMatrix4(m)
    c.fromBufferAttribute(pos, i2).applyMatrix4(m)
    world += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * 0.5

    if (uv) {
      const u0x = uv.getX(i0)
      const u0y = uv.getY(i0)
      const u1x = uv.getX(i1)
      const u1y = uv.getY(i1)
      const u2x = uv.getX(i2)
      const u2y = uv.getY(i2)
      uvArea += Math.abs((u1x - u0x) * (u2y - u0y) - (u2x - u0x) * (u1y - u0y)) * 0.5
    }
  }

  return { world: world * step, uv: uvArea * step }
}

/** Обход сцены. Возвращает null, пока меши ещё не приехали через Suspense. */
function measure(root: THREE.Object3D, gl: THREE.WebGLRenderer, source: 'user' | 'demo'): ModelStats | null {
  let triangles = 0
  let vertices = 0
  let meshes = 0
  let worldArea = 0
  let uvArea = 0
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  let maxTexSide = 0
  let texturePixels = 0

  root.updateWorldMatrix(true, true)
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    // Оверлей сетки — наш собственный служебный меш, в статистику модели
    // он входить не должен: это инструмент просмотра, а не часть объекта.
    if (!mesh.isMesh || mesh.userData.m3Overlay) return

    meshes += 1
    triangles += triCount(mesh.geometry)
    vertices += mesh.geometry.getAttribute('position')?.count ?? 0

    const areas = meshAreas(mesh)
    worldArea += areas.world
    uvArea += areas.uv

    // Материал берём исходный: на технических стадиях он подменён, и
    // считать пришлось бы наши же оверрайды вместо материалов модели.
    const own = ORIGINALS.get(mesh) ?? mesh.material
    for (const mat of Array.isArray(own) ? own : [own]) {
      if (!mat) continue
      materials.add(mat)
      for (const value of Object.values(mat as unknown as Record<string, unknown>)) {
        if (!(value instanceof THREE.Texture)) continue
        if (textures.has(value)) continue
        const img = value.image as { width?: number; height?: number } | undefined
        if (!img?.width || !img?.height) continue
        textures.add(value)
        texturePixels += img.width * img.height
        maxTexSide = Math.max(maxTexSide, img.width, img.height)
      }
    }
  })

  if (meshes === 0) return null

  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())

  // Плотность текселя: корень из (доля UV-площади × пикселей текстуры),
  // делённый на корень из площади поверхности. Если своих текстур нет —
  // считаем «если натянуть 2K», и честно помечаем это в интерфейсе.
  const texelAssumed = maxTexSide === 0
  const basis = texelAssumed ? 2048 : maxTexSide
  const texel =
    worldArea > 0 && uvArea > 0 ? Math.sqrt((uvArea * basis * basis) / worldArea) : null

  return {
    triangles,
    vertices,
    meshes,
    materials: materials.size,
    textures: textures.size,
    texturePixels,
    texel,
    texelBasis: basis,
    texelAssumed,
    calls: gl.info.render.calls,
    bounds: [size.x, size.y, size.z],
    source,
  }
}

/**
 * Измеритель. Живёт внутри Canvas, потому что показания рендерера доступны
 * только оттуда.
 *
 * Мерим не в эффекте, а в кадре: GLB приезжает через Suspense уже после
 * первого коммита, и на момент эффекта поддерево ещё пустое. Первый кадр
 * тоже пропускаем — gl.info.render.calls там нулевой, отрисовка ещё не
 * прошла. После успешного замера цикл выключается до смены стадии:
 * число вызовов от стадии зависит (оверлей сетки — это лишние вызовы),
 * а всё остальное — нет.
 */
function Measure({
  stage,
  source,
  onStats,
  children,
}: {
  stage: PipelineStage
  source: 'user' | 'demo'
  onStats?: (s: ModelStats) => void
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const gl = useThree((s) => s.gl)
  const done = useRef(false)

  useEffect(() => {
    done.current = false
  }, [stage])

  useFrame(() => {
    if (done.current || !onStats) return
    const g = group.current
    if (!g || gl.info.render.calls === 0) return
    const stats = measure(g, gl, source)
    if (!stats) return
    done.current = true
    onStats(stats)
  })

  return <group ref={group}>{children}</group>
}

/* ══════════════════════════════════════════════════════════════════════
   СТАДИИ
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Подменяет материалы поддерева под выбранную стадию.
 *
 * Эффект намеренно без списка зависимостей: содержимое сцены домонтируется
 * асинхронно, и новым мешам материал нужно навесить тем же проходом.
 * Обход дешёвый — компонент перерисовывается только при смене стадии.
 */
function Staged({ stage, children }: { stage: PipelineStage; children: ReactNode }) {
  const root = useRef<THREE.Group>(null)

  const mats = useMemo(() => {
    // Глина: матовая, без единой карты. polygonOffset — чтобы линии
    // оверлея на ретопологии не дрались с поверхностью за глубину.
    const clay = new THREE.MeshStandardMaterial({
      color: '#b98e68',
      roughness: 0.92,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    })
    return {
      wireframe: new THREE.MeshBasicMaterial({ color: '#8fb6c9', wireframe: true }),
      clay,
      // Затенение: белая ламбертовская поверхность. Цвет модели убран
      // намеренно — проход затенения смотрят именно без него.
      ao: new THREE.MeshStandardMaterial({
        color: '#e8e4dd',
        roughness: 1,
        metalness: 0,
      }),
      uv: new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: UV_FRAG }),
      // Оверлей ретопологии. depthWrite выключен: линии не должны
      // закрывать собой то, что за ними.
      overlay: new THREE.MeshBasicMaterial({
        color: '#6fbf95',
        wireframe: true,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      }),
    }
  }, [])

  // Без dispose каждая пересборка стенда оставляла бы программы в GPU-памяти.
  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m) => m.dispose())
    }
  }, [mats])

  useEffect(() => {
    const g = root.current
    if (!g) return
    g.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh || mesh.userData.m3Overlay) return

      if (!ORIGINALS.has(mesh)) ORIGINALS.set(mesh, mesh.material)

      mesh.material =
        stage === 'wireframe'
          ? mats.wireframe
          : stage === 'uv'
            ? mats.uv
            : stage === 'ao'
              ? mats.ao
              : stage === 'clay' || stage === 'retopo'
                ? mats.clay
                : ORIGINALS.get(mesh)!

      // Оверлей сетки создаётся один раз на меш и дальше только прячется:
      // монтировать десятки мешей на каждое переключение стадии — это
      // потерянный кадр ровно в тот момент, когда человек ждёт ответа.
      let overlay = OVERLAYS.get(mesh)
      if (!overlay && stage === 'retopo') {
        overlay = new THREE.Mesh(mesh.geometry, mats.overlay)
        overlay.userData.m3Overlay = true
        // Геометрия общая с родителем, поэтому оверлей — его ребёнок
        // с нулевым трансформом: он повторяет любую анимацию бесплатно.
        mesh.add(overlay)
        OVERLAYS.set(mesh, overlay)
      }
      if (overlay) overlay.visible = stage === 'retopo'
    })
  })

  return <group ref={root}>{children}</group>
}

/** Пользовательская модель: центрируется, масштабируется, играет анимацию или крутится. */
function UserModel({ url, spin }: { url: string; spin: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const { actions } = useAnimations(animations, group)

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = 2.8 / maxDim
    return { scale: s, offset: center.multiplyScalar(-s) }
  }, [cloned])

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.reset().play())
  }, [actions])

  useFrame((_, dt) => {
    if (spin && group.current && animations.length === 0) group.current.rotation.y += dt * 0.5
  })

  return (
    <group ref={group}>
      <group scale={scale} position={[offset.x, offset.y, offset.z]}>
        <primitive object={cloned} />
      </group>
    </group>
  )
}

/** Демонстрационный объект на поворотном столе — пока в src/models нет своего .glb. */
function DemoTurntable({ spin }: { spin: boolean }) {
  const g = useRef<THREE.Group>(null)
  const nl = useRef<THREE.Group>(null)
  const nr = useRef<THREE.Group>(null)
  const al = useRef<THREE.Group>(null)
  const ar = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (spin && g.current) g.current.rotation.y += dt * 0.5
  })
  return (
    <group ref={g}>
      <Character legL={nl} legR={nr} armL={al} armR={ar} />
      <mesh position={[0, -1.18, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.2, 0.22, 56]} />
        <meshStandardMaterial color="#17150f" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function Model3D({
  stage = 'beauty',
  spin = true,
  onStats,
}: {
  stage?: PipelineStage
  spin?: boolean
  onStats?: (s: ModelStats) => void
}) {
  const lit = LIT_STAGES.includes(stage)
  // Затенение смотрят под одним ровным рассеянным светом: направленные
  // источники и окружение вернули бы в кадр ровно ту информацию, ради
  // отсутствия которой этот проход и существует.
  const flat = stage === 'ao'

  return (
    <Canvas
      shadows={lit && !flat}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.35, 6], fov: 34 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      {flat && (
        <>
          <hemisphereLight args={['#ffffff', '#3a3a3a', 2.6]} />
          <ambientLight intensity={0.35} />
        </>
      )}

      {lit && !flat && (
        <>
          <ambientLight intensity={0.3} color="#d8c8b0" />
          <directionalLight position={[4, 7, 4]} intensity={2.2} color="#fff3e0" castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-5, 2, -3]} intensity={1.6} color="#ef4a23" />
          <directionalLight position={[4, 1, -4]} intensity={1.1} color="#c9a882" />
        </>
      )}

      <group position={[0, -0.15, 0]}>
        <Measure stage={stage} source={MODEL_URL ? 'user' : 'demo'} onStats={onStats}>
          <Staged stage={stage}>
            {MODEL_URL ? <UserModel url={MODEL_URL} spin={spin} /> : <DemoTurntable spin={spin} />}
          </Staged>
        </Measure>
        {lit && (
          <ContactShadows
            position={[0, -1.28, 0]}
            opacity={flat ? 0.4 : 0.55}
            scale={9}
            blur={2.6}
            far={4.5}
            color="#000000"
          />
        )}
      </group>

      {lit && !flat && (
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 8, 1]} color="#ffffff" />
          <Lightformer intensity={1.4} position={[-4, 1, -2]} scale={[5, 5, 1]} color="#ef4a23" />
          <Lightformer intensity={1.0} position={[4, 1, -2]} scale={[5, 5, 1]} color="#c9a882" />
        </Environment>
      )}
    </Canvas>
  )
}
