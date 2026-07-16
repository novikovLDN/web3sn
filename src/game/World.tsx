import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import {
  HALF,
  PITS,
  pitAt,
  inSea,
  inAnyWater,
  isBeach,
  type Pit,
} from './playerState'
import { makeBlockNoise, makeBlockNormal } from './textures'
import { biomeAt, BIOMES } from './biomes'

function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/* ── Инстансированный воксельный пол ──────────────────────────── */
function VoxelFloor() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const noise = useMemo(() => makeBlockNoise(16, 0.18), [])
  const normal = useMemo(() => makeBlockNormal(16, 1.3), [])
  const data = useMemo(() => {
    const items: { x: number; z: number; y: number; color: THREE.Color }[] = []
    const sand = new THREE.Color('#c2b27a')
    const seabed = new THREE.Color('#8a7f52')
    const path = new THREE.Color('#8a8577')
    const tmp = new THREE.Color()
    const STEP = 0.5 // мелкие блоки — вдвое детальнее текстуры
    for (let x = -HALF; x < HALF; x += STEP) {
      for (let z = -HALF; z < HALF; z += STEP) {
        const cx = x + STEP / 2
        const cz = z + STEP / 2
        if (pitAt(cx, cz)) continue // дно ям строится отдельно
        let c: THREE.Color
        if (inAnyWater(cx, cz)) {
          c = inSea(cx, cz) ? seabed : sand
        } else if (isBeach(cx, cz)) {
          c = sand
        } else {
          const b = BIOMES[biomeAt(cx, cz)]
          const n = hash(x, z)
          tmp.set(n > 0.5 ? b.ground[0] : b.ground[1])
          c = tmp.clone()
          if (Math.abs(x) < 2 && cz < 22) c = path.clone()
          const patch = hash(Math.floor(x / 4), Math.floor(z / 4))
          if (patch < 0.07) c = new THREE.Color(b.dirt)
        }
        const y = -0.5 + (hash(x + 99, z - 99) > 0.95 ? 0.06 : 0)
        items.push({ x: cx, z: cz, y, color: c.clone() })
      }
    }
    return items
  }, [])

  const STEP = 0.5

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    data.forEach((it, i) => {
      dummy.position.set(it.x, it.y, it.z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, it.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined as never, undefined as never, data.length]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[STEP, 1, STEP]} />
      <meshStandardMaterial
        map={noise}
        normalMap={normal}
        normalScale={new THREE.Vector2(0.45, 0.45)}
        roughness={0.95}
        metalness={0}
      />
    </instancedMesh>
  )
}

/* ── Коллайдеры земли сеткой (с прорезями под ямы) ────────────── */
function GroundColliders() {
  const cells = useMemo(() => {
    const S = 10
    const arr: [number, number, number][] = []
    for (let x = -HALF; x < HALF; x += S) {
      for (let z = -HALF; z < HALF; z += S) {
        const cx = x + S / 2
        const cz = z + S / 2
        if (pitAt(cx, cz)) continue // прорезь под яму
        arr.push([cx, cz, S])
      }
    }
    return arr
  }, [])

  return (
    <RigidBody type="fixed" colliders={false} friction={1}>
      {cells.map(([cx, cz, s], i) => (
        // толстая плита (верх на y=0) + небольшое перекрытие швов, чтобы не проваливаться
        <CuboidCollider key={i} args={[s / 2 + 0.05, 1.5, s / 2 + 0.05]} position={[cx, -1.5, cz]} />
      ))}
      {/* границы мира */}
      <CuboidCollider args={[HALF, 6, 0.5]} position={[0, 6, -HALF]} />
      <CuboidCollider args={[HALF, 6, 0.5]} position={[0, 6, HALF]} />
      <CuboidCollider args={[0.5, 6, HALF]} position={[-HALF, 6, 0]} />
      <CuboidCollider args={[0.5, 6, HALF]} position={[HALF, 6, 0]} />
    </RigidBody>
  )
}

/* ── Яма-карьер с рудой и лестницей ───────────────────────────── */
const ORE = [
  { color: '#ffcf3a', emissive: '#ffb000', name: 'gold' },
  { color: '#b9a58a', emissive: '#6a5a44', name: 'iron' },
  { color: '#6fe0ff', emissive: '#2aa8d0', name: 'crystal' },
  { color: '#c07fe6', emissive: '#7a2ad0', name: 'amethyst' },
]

type QBox = {
  x: number
  y: number
  z: number
  sx: number
  sy: number
  sz: number
  color: string
  floor?: boolean
}

function Quarry({ pit }: { pit: Pit }) {
  const { x0, x1, z0, z1 } = pit
  const w = x1 - x0
  const d = z1 - z0
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2
  const RINGS = Math.max(2, Math.min(3, Math.floor(Math.min(w, d) / 2) - 1))
  const stoneTex = useMemo(() => makeBlockNoise(16, 0.22), [])
  const stoneNrm = useMemo(() => makeBlockNormal(16, 1.6), [])

  // Террасная чаша: концентрические ступени по 1 блоку (спуск/подъём пешком)
  const boxes = useMemo(() => {
    const list: QBox[] = []
    const stoneA = '#6f727b'
    const stoneB = '#5c5f68'
    for (let r = 1; r <= RINGS; r++) {
      const cy = -r - 0.5 // центр блока, верх на -r
      const o = r - 1
      const ax0 = x0 + o
      const ax1 = x1 - o
      const az0 = z0 + o
      const az1 = z1 - o
      const lenX = ax1 - ax0
      const col = r % 2 ? stoneA : stoneB
      // южный и северный «протекторы» (по всей ширине)
      list.push({ x: (ax0 + ax1) / 2, y: cy, z: az0 + 0.5, sx: lenX, sy: 1, sz: 1, color: col })
      list.push({ x: (ax0 + ax1) / 2, y: cy, z: az1 - 0.5, sx: lenX, sy: 1, sz: 1, color: col })
      // западный и восточный (без углов)
      const lenZ = az1 - az0 - 2
      if (lenZ > 0) {
        list.push({ x: ax0 + 0.5, y: cy, z: (az0 + az1) / 2, sx: 1, sy: 1, sz: lenZ, color: col })
        list.push({ x: ax1 - 0.5, y: cy, z: (az0 + az1) / 2, sx: 1, sy: 1, sz: lenZ, color: col })
      }
    }
    // дно
    const fo = RINGS
    const fx0 = x0 + fo
    const fx1 = x1 - fo
    const fz0 = z0 + fo
    const fz1 = z1 - fo
    list.push({
      x: (fx0 + fx1) / 2,
      y: -RINGS - 1,
      z: (fz0 + fz1) / 2,
      sx: fx1 - fx0,
      sy: 2,
      sz: fz1 - fz0,
      color: '#4d4f57',
      floor: true,
    })
    return list
  }, [pit, RINGS, cx, cz, w, d])

  // руда — кубики на ступенях и дне
  const ores = useMemo(() => {
    const arr: { pos: [number, number, number]; ore: (typeof ORE)[number] }[] = []
    for (let i = 0; i < 12; i++) {
      const r = 1 + Math.floor(hash(i, pit.x0) * (RINGS + 1))
      const o = r - 1
      const px = x0 + o + 0.5 + hash(i * 1.7, pit.z0) * (w - 2 * o - 1)
      const pz = z0 + o + 0.5 + hash(i * 2.3, pit.z0) * (d - 2 * o - 1)
      const py = -Math.min(r, RINGS + 1) + 0.35
      arr.push({ pos: [px, py, pz], ore: ORE[Math.floor(hash(i, 7) * ORE.length)] })
    }
    return arr
  }, [pit, RINGS, w, d])

  return (
    <group>
      <RigidBody type="fixed" colliders={false} friction={1}>
        {boxes.map((b, i) => (
          <CuboidCollider
            key={i}
            args={[b.sx / 2 + 0.02, b.sy / 2, b.sz / 2 + 0.02]}
            position={[b.x, b.y, b.z]}
          />
        ))}
      </RigidBody>

      {boxes.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} receiveShadow castShadow>
          <boxGeometry args={[b.sx, b.sy, b.sz]} />
          <meshStandardMaterial
            color={b.color}
            map={stoneTex}
            normalMap={stoneNrm}
            normalScale={new THREE.Vector2(0.6, 0.6)}
            roughness={1}
          />
        </mesh>
      ))}

      {ores.map((o, i) => (
        <mesh key={i} position={o.pos} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color={o.ore.color}
            emissive={o.ore.emissive}
            emissiveIntensity={0.9}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Дерево (цвета по биому) ───────────────────────────────────── */
function Tree({
  position,
  trunk,
  leaves,
}: {
  position: [number, number, number]
  trunk: string
  leaves: [string, string]
}) {
  const [x, y, z] = position
  return (
    <group position={[x, y, z]}>
      <RigidBody type="fixed" colliders={false} position={[0, 1, 0]}>
        <CuboidCollider args={[0.3, 1, 0.3]} />
        <mesh castShadow>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color={trunk} roughness={0.9} />
        </mesh>
      </RigidBody>
      {/* пышная крона из смещённых блоков (менее «топорно») */}
      {[
        [0, 2.5, 0, 1.6, 0],
        [0.9, 2.7, 0.3, 1.0, 1],
        [-0.8, 2.6, -0.4, 1.1, 1],
        [0.3, 2.9, -0.9, 0.9, 0],
        [-0.4, 3.0, 0.8, 0.9, 1],
        [0, 3.4, 0, 1.3, 0],
        [0.5, 3.7, 0.2, 0.8, 1],
        [-0.4, 3.8, -0.2, 0.8, 0],
        [0, 4.2, 0, 0.7, 1],
      ].map(([lx, ly, lz, s, ci], i) => (
        <mesh key={i} castShadow position={[lx, ly, lz]}>
          <boxGeometry args={[s, s, s]} />
          <meshStandardMaterial color={ci ? leaves[0] : leaves[1]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Rock({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color="#70747d" roughness={1} />
      </mesh>
    </RigidBody>
  )
}

export default function World() {
  const trees = useMemo<
    { pos: [number, number, number]; trunk: string; leaves: [string, string] }[]
  >(() => {
    const arr: {
      pos: [number, number, number]
      trunk: string
      leaves: [string, string]
    }[] = []
    for (let i = 0; i < 90; i++) {
      const x = Math.round((hash(i * 3.1, 7.7) - 0.5) * (HALF * 1.9))
      const z = Math.round((hash(11.3, i * 2.9) - 0.5) * (HALF * 1.9))
      if (Math.abs(x) < 3 && Math.abs(z) < 8) continue
      if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) continue
      const biome = biomeAt(x, z)
      if (biome === 'desert') continue // в пустыне деревьев нет (кактусы отдельно)
      // в лесу деревьев больше, в остальных — реже
      const keep = biome === 'forest' ? true : hash(i * 5.1, 1.3) > 0.35
      if (!keep) continue
      const b = BIOMES[biome]
      arr.push({ pos: [x, 0, z], trunk: b.trunk, leaves: b.leaves })
    }
    return arr
  }, [])

  const rocks = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 18; i++) {
      const x = Math.round((hash(i * 5.5, 2.2) - 0.5) * (HALF * 1.8))
      const z = Math.round((hash(3.3, i * 4.1) - 0.5) * (HALF * 1.8))
      if (inAnyWater(x, z) || pitAt(x, z)) continue
      arr.push([x, 0.6, z])
    }
    return arr
  }, [])

  return (
    <group>
      <VoxelFloor />
      <GroundColliders />
      {PITS.map((p, i) => (
        <Quarry key={i} pit={p} />
      ))}
      {trees.map((t, i) => (
        <Tree key={`t${i}`} position={t.pos} trunk={t.trunk} leaves={t.leaves} />
      ))}
      {rocks.map((p, i) => (
        <Rock key={`r${i}`} position={p} />
      ))}
    </group>
  )
}
