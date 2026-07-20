import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { Character } from '../island/Character'

/**
 * Стенд для 3D-модели.
 *
 * ПОЧЕМУ ЗДЕСЬ ЧЕТЫРЕ РЕЖИМА, А НЕ ОДИН КРАСИВЫЙ РЕНДЕР
 * ────────────────────────────────────────────────────
 * Рендер — единственный взгляд на модель, по которому нельзя судить о модели.
 * Он скрывает ровно то, за что платят: сетку, направление нормалей и качество
 * развёртки. Поэтому стенд умеет показывать один и тот же объект четырьмя
 * способами — так же, как его смотрит человек, который принимает работу.
 *
 * Смена режима — это подмена материала на уже загруженной геометрии, а не
 * перезагрузка сцены: переключение стоит ноль сетевых запросов и один кадр.
 *
 * ВАЖНО: модель подхватывается через import.meta.glob из src/models/*.glb —
 * пользователь кладёт файлы туда сам. Этот механизм трогать нельзя.
 */

export type ShadingMode = 'render' | 'wire' | 'normals' | 'uv'

// Авто-подхват своей 3D-модели из src/models (просто положите туда .glb).
const modelFiles = import.meta.glob('../models/*.{glb,gltf}', { eager: true, query: '?url', import: 'default' })
const MODEL_URL = (Object.entries(modelFiles).sort(([a], [b]) => a.localeCompare(b))[0]?.[1] as string | undefined)

/** Исходные материалы мешей. WeakMap — чтобы не держать сцену от сборки мусора. */
const ORIGINALS = new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>()

/* ── Шейдер развёртки ──────────────────────────────────────────────────
   Клетка по UV показывает сразу две вещи: плотность текселей (клетки разного
   размера = разное разрешение текстуры на разных участках) и направление
   развёртки (подмешанный в цвет сам vUv). Растянутая клетка — это шов или
   плохой островок, и на рендере этого не видно. */
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

/**
 * Подменяет материалы поддерева под выбранный режим.
 *
 * Эффект намеренно без списка зависимостей: содержимое сцены домонтируется
 * асинхронно (GLB приезжает через Suspense уже после первого коммита), и
 * новым мешам материал нужно навесить тем же проходом. Обход дешёвый —
 * компонент перерисовывается только при смене режима.
 */
function Shaded({ mode, children }: { mode: ShadingMode; children: ReactNode }) {
  const root = useRef<THREE.Group>(null)

  const overrides = useMemo(
    () => ({
      wire: new THREE.MeshBasicMaterial({ color: '#d8bd94', wireframe: true }),
      normals: new THREE.MeshNormalMaterial(),
      uv: new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: UV_FRAG }),
    }),
    []
  )

  // Материалы создаются один раз на жизнь стенда и освобождаются при уходе:
  // без dispose каждая пересборка сцены оставляла бы программу в GPU-памяти.
  useEffect(() => {
    return () => {
      overrides.wire.dispose()
      overrides.normals.dispose()
      overrides.uv.dispose()
    }
  }, [overrides])

  useEffect(() => {
    const g = root.current
    if (!g) return
    g.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      if (!ORIGINALS.has(m)) ORIGINALS.set(m, m.material)
      m.material = mode === 'render' ? ORIGINALS.get(m)! : overrides[mode]
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

/** Персонаж-заглушка на поворотном столе (пока нет своей модели). */
function CharacterTurntable({ spin }: { spin: boolean }) {
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
  mode = 'render',
  spin = true,
}: {
  mode?: ShadingMode
  spin?: boolean
}) {
  // В технических режимах студийный свет не нужен: базовый, нормальный и
  // UV-материалы его игнорируют, а окружение продолжало бы считаться каждый
  // кадр. Снимаем то, что заведомо не влияет на картинку.
  const lit = mode === 'render'

  return (
    <Canvas
      shadows={lit}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.35, 6], fov: 34 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      {lit && (
        <>
          <ambientLight intensity={0.3} color="#d8c8b0" />
          <directionalLight position={[4, 7, 4]} intensity={2.2} color="#fff3e0" castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-5, 2, -3]} intensity={1.6} color="#ef4a23" />
          <directionalLight position={[4, 1, -4]} intensity={1.1} color="#c9a882" />
        </>
      )}

      <group position={[0, -0.15, 0]}>
        <Shaded mode={mode}>
          {MODEL_URL ? <UserModel url={MODEL_URL} spin={spin} /> : <CharacterTurntable spin={spin} />}
        </Shaded>
        {lit && (
          <ContactShadows position={[0, -1.28, 0]} opacity={0.55} scale={9} blur={2.6} far={4.5} color="#000000" />
        )}
      </group>

      {lit && (
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 8, 1]} color="#ffffff" />
          <Lightformer intensity={1.4} position={[-4, 1, -2]} scale={[5, 5, 1]} color="#ef4a23" />
          <Lightformer intensity={1.0} position={[4, 1, -2]} scale={[5, 5, 1]} color="#c9a882" />
        </Environment>
      )}
    </Canvas>
  )
}
