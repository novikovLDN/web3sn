import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'

const HALF = 25 // мир 50×50

/* Псевдослучайный детерминированный шум по координатам блока */
function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/* ── Инстансированный воксельный пол ──────────────────────────── */
function VoxelFloor() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => {
    const items: { x: number; z: number; color: THREE.Color }[] = []
    const grass = new THREE.Color('#4a7c3a')
    const grass2 = new THREE.Color('#3f6d32')
    const dirt = new THREE.Color('#6b4c34')
    const stone = new THREE.Color('#6d7079')
    const sand = new THREE.Color('#c2b27a')
    const path = new THREE.Color('#8a8577')
    for (let x = -HALF; x < HALF; x++) {
      for (let z = -HALF; z < HALF; z++) {
        const n = hash(x, z)
        let c = n > 0.5 ? grass : grass2
        // тропа по центру
        if (Math.abs(x) < 2 && z > -HALF + 2) c = path
        // пятна земли/камня/песка для детализации
        const patch = hash(Math.floor(x / 4), Math.floor(z / 4))
        if (patch > 0.86) c = stone
        else if (patch < 0.08) c = dirt
        else if (patch > 0.8) c = sand
        items.push({ x, z, color: c.clone() })
      }
    }
    return items
  }, [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    data.forEach((it, i) => {
      const y = -0.5 + (hash(it.x + 99, it.z - 99) > 0.94 ? 0.06 : 0)
      dummy.position.set(it.x + 0.5, y, it.z + 0.5)
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
      <meshStandardMaterial roughness={0.95} metalness={0} />
    </instancedMesh>
  )
}

/* ── Дерево (ствол + крона) ───────────────────────────────────── */
function Tree({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position
  return (
    <group position={[x, y, z]}>
      {/* ствол — статичное препятствие с коллайдером */}
      <RigidBody type="fixed" colliders={false} position={[0, 1, 0]}>
        <CuboidCollider args={[0.3, 1, 0.3]} />
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#5b3b23" roughness={0.9} />
        </mesh>
      </RigidBody>
      {/* крона */}
      {[
        [0, 2.4, 0, 2.2],
        [0, 3.4, 0, 1.6],
        [0, 4.2, 0, 1.0],
      ].map(([lx, ly, lz, s], i) => (
        <mesh key={i} castShadow position={[lx, ly, lz]}>
          <boxGeometry args={[s, 1, s]} />
          <meshStandardMaterial
            color={i === 0 ? '#3f7a34' : '#4a8c3c'}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Скала (статичный блок-препятствие) ───────────────────────── */
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
  // расстановка деревьев/скал (детерминированная)
  const trees = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 14; i++) {
      const a = hash(i * 3.1, 7.7)
      const b = hash(11.3, i * 2.9)
      const x = Math.round((a - 0.5) * 44)
      const z = Math.round((b - 0.5) * 44)
      if (Math.abs(x) < 3 && Math.abs(z) < 8) continue // не на старте
      arr.push([x, 0, z])
    }
    return arr
  }, [])

  const rocks = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 8; i++) {
      const x = Math.round((hash(i * 5.5, 2.2) - 0.5) * 42)
      const z = Math.round((hash(3.3, i * 4.1) - 0.5) * 42)
      arr.push([x, 0.6, z])
    }
    return arr
  }, [])

  return (
    <group>
      <VoxelFloor />

      {/* Земля-коллайдер + невидимые стены по границе */}
      <RigidBody type="fixed" colliders={false} friction={1}>
        <CuboidCollider args={[HALF, 0.5, HALF]} position={[0, -0.5, 0]} />
        <CuboidCollider args={[HALF, 4, 0.5]} position={[0, 4, -HALF]} />
        <CuboidCollider args={[HALF, 4, 0.5]} position={[0, 4, HALF]} />
        <CuboidCollider args={[0.5, 4, HALF]} position={[-HALF, 4, 0]} />
        <CuboidCollider args={[0.5, 4, HALF]} position={[HALF, 4, 0]} />
      </RigidBody>

      {trees.map((p, i) => (
        <Tree key={`t${i}`} position={p} />
      ))}
      {rocks.map((p, i) => (
        <Rock key={`r${i}`} position={p} />
      ))}
    </group>
  )
}
