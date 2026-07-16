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
    const grass = new THREE.Color('#4a7c3a')
    const grass2 = new THREE.Color('#3f6d32')
    const dirt = new THREE.Color('#6b4c34')
    const stone = new THREE.Color('#6d7079')
    const sand = new THREE.Color('#c2b27a')
    const seabed = new THREE.Color('#8a7f52')
    const path = new THREE.Color('#8a8577')
    for (let x = -HALF; x < HALF; x++) {
      for (let z = -HALF; z < HALF; z++) {
        const cx = x + 0.5
        const cz = z + 0.5
        if (pitAt(cx, cz)) continue // дно ям строится отдельно
        let c: THREE.Color
        if (inAnyWater(cx, cz)) {
          c = inSea(cx, cz) ? seabed : sand
        } else if (isBeach(cx, cz)) {
          c = sand
        } else {
          const n = hash(x, z)
          c = n > 0.5 ? grass : grass2
          if (Math.abs(x) < 2 && cz < 22) c = path
          const patch = hash(Math.floor(x / 4), Math.floor(z / 4))
          if (patch > 0.88) c = stone
          else if (patch < 0.07) c = dirt
        }
        const y = -0.5 + (hash(x + 99, z - 99) > 0.95 ? 0.06 : 0)
        items.push({ x: cx, z: cz, y, color: c.clone() })
      }
    }
    return items
  }, [])

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
      <boxGeometry args={[1, 1, 1]} />
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
        <CuboidCollider key={i} args={[s / 2, 0.5, s / 2]} position={[cx, -0.5, cz]} />
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

function Quarry({ pit }: { pit: Pit }) {
  const { x0, x1, z0, z1, depth } = pit
  const w = x1 - x0
  const d = z1 - z0
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2

  // рудные жилы на стенах
  const ores = useMemo(() => {
    const arr: { pos: [number, number, number]; ore: (typeof ORE)[number] }[] = []
    for (let i = 0; i < 22; i++) {
      const side = Math.floor(hash(i, pit.x0) * 4)
      const t = hash(i * 2.1, pit.z0)
      const yy = -0.6 - hash(i, i) * (depth - 1)
      let px = cx
      let pz = cz
      if (side === 0) {
        px = x0 + 0.5
        pz = z0 + t * d
      } else if (side === 1) {
        px = x1 - 0.5
        pz = z0 + t * d
      } else if (side === 2) {
        px = x0 + t * w
        pz = z0 + 0.5
      } else {
        px = x0 + t * w
        pz = z1 - 0.5
      }
      arr.push({ pos: [px, yy, pz], ore: ORE[Math.floor(hash(i, 7) * ORE.length)] })
    }
    return arr
  }, [pit, cx, cz, w, d, depth])

  // ступени для выхода (в углу)
  const steps = useMemo(() => {
    const arr: [number, number, number][] = []
    const n = depth + 1
    for (let s = 0; s < n; s++) {
      arr.push([x0 + 0.6 + s * 0.9, -depth + 0.5 + s, z0 + 0.6])
    }
    return arr
  }, [pit, depth])

  return (
    <group>
      {/* дно + стены ямы */}
      <RigidBody type="fixed" colliders={false} friction={1}>
        <CuboidCollider args={[w / 2, 0.5, d / 2]} position={[cx, -depth - 0.5, cz]} />
        <CuboidCollider args={[0.4, depth / 2, d / 2]} position={[x0, -depth / 2, cz]} />
        <CuboidCollider args={[0.4, depth / 2, d / 2]} position={[x1, -depth / 2, cz]} />
        <CuboidCollider args={[w / 2, depth / 2, 0.4]} position={[cx, -depth / 2, z0]} />
        <CuboidCollider args={[w / 2, depth / 2, 0.4]} position={[cx, -depth / 2, z1]} />
      </RigidBody>

      {/* визуал дна */}
      <mesh position={[cx, -depth, cz]} receiveShadow>
        <boxGeometry args={[w, 1, d]} />
        <meshStandardMaterial color="#4d4f57" roughness={1} />
      </mesh>
      {/* стены-камень (визуал) */}
      {[
        [x0, cz, 0.3, d] as const,
        [x1, cz, 0.3, d] as const,
        [cx, z0, w, 0.3] as const,
        [cx, z1, w, 0.3] as const,
      ].map(([mx, mz, mw, md], i) => (
        <mesh key={i} position={[mx, -depth / 2, mz]} receiveShadow>
          <boxGeometry args={[mw, depth, md]} />
          <meshStandardMaterial color="#5b5e66" roughness={1} />
        </mesh>
      ))}

      {/* руда (светящиеся вкрапления) */}
      {ores.map((o, i) => (
        <mesh key={i} position={o.pos} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={o.ore.color}
            emissive={o.ore.emissive}
            emissiveIntensity={0.8}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      ))}

      {/* ступени выхода */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        {steps.map((s, i) => (
          <mesh key={i} position={s} castShadow receiveShadow>
            <boxGeometry args={[0.9, 1, 1.2]} />
            <meshStandardMaterial color="#6a6d75" roughness={1} />
          </mesh>
        ))}
      </RigidBody>
    </group>
  )
}

/* ── Дерево ───────────────────────────────────────────────────── */
function Tree({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position
  return (
    <group position={[x, y, z]}>
      <RigidBody type="fixed" colliders={false} position={[0, 1, 0]}>
        <CuboidCollider args={[0.3, 1, 0.3]} />
        <mesh castShadow>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#5b3b23" roughness={0.9} />
        </mesh>
      </RigidBody>
      {[
        [0, 2.4, 0, 2.2],
        [0, 3.4, 0, 1.6],
        [0, 4.2, 0, 1.0],
      ].map(([lx, ly, lz, s], i) => (
        <mesh key={i} castShadow position={[lx, ly, lz]}>
          <boxGeometry args={[s, 1, s]} />
          <meshStandardMaterial color={i === 0 ? '#3f7a34' : '#4a8c3c'} roughness={0.9} />
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
  const trees = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 40; i++) {
      const x = Math.round((hash(i * 3.1, 7.7) - 0.5) * (HALF * 1.85))
      const z = Math.round((hash(11.3, i * 2.9) - 0.5) * (HALF * 1.85))
      if (Math.abs(x) < 3 && Math.abs(z) < 8) continue
      if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) continue
      arr.push([x, 0, z])
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
      {trees.map((p, i) => (
        <Tree key={`t${i}`} position={p} />
      ))}
      {rocks.map((p, i) => (
        <Rock key={`r${i}`} position={p} />
      ))}
    </group>
  )
}
