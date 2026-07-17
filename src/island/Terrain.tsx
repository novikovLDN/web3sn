import { useMemo } from 'react'
import { RigidBody, HeightfieldCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { WORLD, PAL } from './config'
import { terrainHeight, terrainSlope } from './heightmap'
import { QUALITY } from './quality'

const SEG = QUALITY.seg
const PHYS_SEG = QUALITY.physSeg

/**
 * Остров: детальный визуальный меш (вершинные цвета по биомам + наклон)
 * и физический heightfield, построенные из одной функции высоты.
 */
export default function Terrain() {
  // ── heightfield для физики (column-major, i↔Z fast, j↔X slow) ──
  const heights = useMemo(() => {
    const N = PHYS_SEG + 1
    const arr: number[] = new Array(N * N)
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = -WORLD / 2 + (j / PHYS_SEG) * WORLD
        const z = -WORLD / 2 + (i / PHYS_SEG) * WORLD
        arr[i + j * N] = terrainHeight(x, z)
      }
    }
    return arr
  }, [])

  // ── детальный визуальный меш ──
  const geo = useMemo(() => {
    const N = SEG + 1
    const positions = new Float32Array(N * N * 3)
    const colors = new Float32Array(N * N * 3)

    const cSand = new THREE.Color(PAL.sand)
    const cGrassLow = new THREE.Color(PAL.grassLow)
    const cGrass = new THREE.Color(PAL.grass)
    const cGrassHigh = new THREE.Color(PAL.grassHigh)
    const cRock = new THREE.Color(PAL.rock)
    const cRockDark = new THREE.Color(PAL.rockDark)
    const cSnow = new THREE.Color(PAL.snow)
    // Подводный грунт — тёмно-бирюзовый, чтобы сливался с водой (без «квадрата дна»).
    const cMud = new THREE.Color('#0f3a48')
    const tmp = new THREE.Color()
    const out = new THREE.Color()

    const lerpC = (a: THREE.Color, b: THREE.Color, t: number) =>
      tmp.copy(a).lerp(b, THREE.MathUtils.clamp(t, 0, 1))

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = -WORLD / 2 + (i / SEG) * WORLD
        const z = -WORLD / 2 + (j / SEG) * WORLD
        const y = terrainHeight(x, z)
        const slope = terrainSlope(x, z)
        const k = (i * N + j) * 3
        positions[k] = x
        positions[k + 1] = y
        positions[k + 2] = z

        // Биом по высоте с плавными переходами.
        if (y < -1.5) out.copy(cMud)
        else if (y < 0.6) out.copy(lerpC(cMud, cSand, (y + 1.5) / 2.1))
        else if (y < 1.6) out.copy(lerpC(cSand, cGrassLow, (y - 0.6) / 1.0))
        else if (y < 7) out.copy(lerpC(cGrassLow, cGrass, (y - 1.6) / 5.4))
        else if (y < 12) out.copy(lerpC(cGrass, cGrassHigh, (y - 7) / 5))
        else if (y < 16) out.copy(lerpC(cGrassHigh, cRock, (y - 12) / 4))
        else out.copy(lerpC(cRock, cSnow, (y - 16) / 6))

        // Только по-настоящему крутые обрывы → камень.
        if (slope > 0.8 && y > 1) {
          out.lerp(lerpC(cRockDark, cRock, 0.5).clone(), THREE.MathUtils.clamp((slope - 0.8) / 0.2, 0, 1))
        }

        // Мелкая цветовая вариация, чтобы «блоки» читались детально.
        const varn = (vhash(i, j) - 0.5) * 0.05
        out.offsetHSL(0, 0.02 * Math.sin(x * 0.3 + z * 0.2), varn)

        colors[k] = out.r
        colors[k + 1] = out.g
        colors[k + 2] = out.b
      }
    }

    const indices = new Uint32Array(SEG * SEG * 6)
    let t = 0
    for (let i = 0; i < SEG; i++) {
      for (let j = 0; j < SEG; j++) {
        const a = i * N + j
        const b = a + 1
        const c = a + N
        const d = c + 1
        // обмотка CCW при взгляде сверху → нормали вверх (иначе backface cull + тьма)
        indices[t++] = a
        indices[t++] = b
        indices[t++] = c
        indices[t++] = b
        indices[t++] = d
        indices[t++] = c
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setIndex(new THREE.BufferAttribute(indices, 1))
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group>
      <RigidBody type="fixed" colliders={false} friction={1}>
        <HeightfieldCollider args={[PHYS_SEG, PHYS_SEG, heights, { x: WORLD, y: 1, z: WORLD }]} />
      </RigidBody>
      <mesh geometry={geo} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.96} metalness={0} flatShading={false} />
      </mesh>
    </group>
  )
}

function vhash(i: number, j: number) {
  const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453
  return s - Math.floor(s)
}
