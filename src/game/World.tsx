import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import {
  HALF,
  SEA_Z,
  POND,
  POND_CX,
  POND_CZ,
  pitAt,
  inSea,
  inPond,
  inAnyWater,
  isBeach,
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
    const path = new THREE.Color('#8a8577')
    const tmp = new THREE.Color()
    const STEP = 0.75 // мелкие блоки — детальнее текстуры, но не слишком тяжело
    for (let x = -HALF; x < HALF; x += STEP) {
      for (let z = -HALF; z < HALF; z += STEP) {
        const cx = x + STEP / 2
        const cz = z + STEP / 2
        if (pitAt(cx, cz)) continue // дно ям строится отдельно
        if (inSea(cx, cz)) continue // глубокое море — дно отдельным слоем
        if (inPond(cx, cz)) continue // озеро с углублением — дно отдельно
        let c: THREE.Color
        if (isBeach(cx, cz)) {
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

  const STEP = 0.75

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
        if (inSea(cx, cz)) continue // море — дно ниже (отдельный коллайдер)
        if (inPond(cx, cz)) continue // озеро — дно ниже
        arr.push([cx, cz, S])
      }
    }
    return arr
  }, [])

  const pondHW = (POND.x1 - POND.x0) / 2
  const pondHD = (POND.z1 - POND.z0) / 2

  return (
    <RigidBody type="fixed" colliders={false} friction={1}>
      {cells.map(([cx, cz, s], i) => (
        // толстая плита (верх на y=0) + небольшое перекрытие швов, чтобы не проваливаться
        <CuboidCollider key={i} args={[s / 2 + 0.05, 1.5, s / 2 + 0.05]} position={[cx, -1.5, cz]} />
      ))}
      {/* Пляжный склон — плавный вход в море (без резкого обрыва) */}
      <CuboidCollider
        args={[HALF, 0.4, 6.2]}
        position={[0, -1.5, SEA_Z + 6]}
        rotation={[0.245, 0, 0]}
      />
      {/* глубокое дно моря (верх на -3) */}
      <CuboidCollider
        args={[HALF, 3, (HALF - SEA_Z - 12) / 2 + 0.2]}
        position={[0, -6, (SEA_Z + 12 + HALF) / 2]}
      />
      {/* дно озера (верх на -depth) */}
      <CuboidCollider
        args={[pondHW + 0.1, 2, pondHD + 0.1]}
        position={[POND_CX, -POND.depth - 2, POND_CZ]}
      />
      {/* границы мира */}
      <CuboidCollider args={[HALF, 6, 0.5]} position={[0, 6, -HALF]} />
      <CuboidCollider args={[HALF, 6, 0.5]} position={[0, 6, HALF]} />
      <CuboidCollider args={[0.5, 6, HALF]} position={[-HALF, 6, 0]} />
      <CuboidCollider args={[0.5, 6, HALF]} position={[HALF, 6, 0]} />
    </RigidBody>
  )
}

/* ── Рудный валун на поверхности (вместо ям) ──────────────────── */
const ORE = [
  { color: '#ffcf3a', emissive: '#ffb000' },
  { color: '#b9a58a', emissive: '#6a5a44' },
  { color: '#6fe0ff', emissive: '#2aa8d0' },
  { color: '#c07fe6', emissive: '#7a2ad0' },
]

function OreRock({ position, seed }: { position: [number, number, number]; seed: number }) {
  const stoneTex = useMemo(() => makeBlockNoise(16, 0.22), [])
  const stoneNrm = useMemo(() => makeBlockNormal(16, 1.6), [])
  const chunks = useMemo(() => {
    const arr: { p: [number, number, number]; s: number }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        p: [
          (hash(seed + i, 1) - 0.5) * 2.4,
          0.4 + hash(seed, i) * 1.2,
          (hash(1, seed + i) - 0.5) * 2.4,
        ],
        s: 0.9 + hash(seed + i, seed) * 1.1,
      })
    }
    return arr
  }, [seed])
  const veins = useMemo(() => {
    const arr: { p: [number, number, number]; ore: (typeof ORE)[number] }[] = []
    for (let i = 0; i < 4; i++) {
      arr.push({
        p: [
          (hash(seed * 2 + i, 3) - 0.5) * 2.2,
          0.5 + hash(seed, i * 2) * 1.4,
          (hash(3, seed * 2 + i) - 0.5) * 2.2,
        ],
        ore: ORE[Math.floor(hash(i, seed) * ORE.length)],
      })
    }
    return arr
  }, [seed])

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[2.6, 1.4, 2.6]} />
          <meshStandardMaterial
            color="#6a6d75"
            map={stoneTex}
            normalMap={stoneNrm}
            normalScale={new THREE.Vector2(0.6, 0.6)}
            roughness={1}
          />
        </mesh>
      </RigidBody>
      {chunks.map((c, i) => (
        <mesh key={i} castShadow position={c.p}>
          <boxGeometry args={[c.s, c.s, c.s]} />
          <meshStandardMaterial color="#5c5f68" map={stoneTex} roughness={1} />
        </mesh>
      ))}
      {veins.map((v, i) => (
        <mesh key={i} castShadow position={v.p}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={v.ore.color}
            emissive={v.ore.emissive}
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
      if (inAnyWater(x, z)) continue
      arr.push([x, 0.6, z])
    }
    return arr
  }, [])

  // рудные валуны на поверхности (замена ям)
  const oreRocks = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 10; i++) {
      const x = Math.round((hash(i * 7.7, 9.1) - 0.5) * (HALF * 1.7))
      const z = Math.round((hash(6.2, i * 8.3) - 0.5) * (HALF * 1.7))
      if (inAnyWater(x, z)) continue
      if (Math.abs(x) < 5 && Math.abs(z) < 8) continue // не на старте
      arr.push([x, 0, z])
    }
    return arr
  }, [])

  return (
    <group>
      <VoxelFloor />
      <GroundColliders />
      {trees.map((t, i) => (
        <Tree key={`t${i}`} position={t.pos} trunk={t.trunk} leaves={t.leaves} />
      ))}
      {rocks.map((p, i) => (
        <Rock key={`r${i}`} position={p} />
      ))}
      {oreRocks.map((p, i) => (
        <OreRock key={`o${i}`} position={p} seed={i * 13 + 3} />
      ))}
    </group>
  )
}
