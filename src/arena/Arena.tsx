import { useMemo } from 'react'
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier'
import { ARENA_R } from './store'

/* Неоновая круговая арена в стиле сайта (тёмный фон + фирменный градиент) */
export default function Arena() {
  // сегменты стены по кругу
  const wallSegs = useMemo(() => {
    const N = 48
    const arr: { x: number; z: number; rot: number }[] = []
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      arr.push({ x: Math.cos(a) * ARENA_R, z: Math.sin(a) * ARENA_R, rot: -a })
    }
    return arr
  }, [])

  // укрытия-колонны
  const pillars = useMemo(() => {
    const arr: [number, number][] = []
    const ring = [12, 22]
    ring.forEach((r, ri) => {
      const N = ri === 0 ? 4 : 6
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + ri * 0.5
        arr.push([Math.cos(a) * r, Math.sin(a) * r])
      }
    })
    return arr
  }, [])

  const segW = (2 * Math.PI * ARENA_R) / 48 + 0.6

  return (
    <group>
      {/* Пол */}
      <RigidBody type="fixed" colliders={false} friction={1}>
        <CylinderCollider args={[0.5, ARENA_R + 2]} position={[0, -0.5, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[ARENA_R + 2, 64]} />
          <meshStandardMaterial color="#0f1117" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* неоновое кольцо-разметка */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[ARENA_R - 0.6, ARENA_R - 0.2, 64]} />
          <meshStandardMaterial color="#b600a8" emissive="#b600a8" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[10.6, 11, 48]} />
          <meshStandardMaterial color="#7621b0" emissive="#7621b0" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[2.6, 40]} />
          <meshStandardMaterial color="#1a1030" emissive="#3a0f4a" emissiveIntensity={0.6} />
        </mesh>
      </RigidBody>

      {/* Стены */}
      <RigidBody type="fixed" colliders={false}>
        {wallSegs.map((s, i) => (
          <CuboidCollider key={i} args={[segW / 2, 2.5, 0.5]} position={[s.x, 2.5, s.z]} rotation={[0, s.rot, 0]} />
        ))}
      </RigidBody>
      {wallSegs.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.rot, 0]}>
          <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
            <boxGeometry args={[segW, 4.4, 0.9]} />
            <meshStandardMaterial color="#14161d" roughness={0.6} metalness={0.5} />
          </mesh>
          <mesh position={[0, 4.3, 0.35]}>
            <boxGeometry args={[segW, 0.14, 0.06]} />
            <meshStandardMaterial color="#be4c00" emissive="#be4c00" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Колонны-укрытия */}
      {pillars.map(([x, z], i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={[x, 0, z]}>
          <CuboidCollider args={[0.7, 2, 0.7]} position={[0, 2, 0]} />
          <mesh castShadow position={[0, 2, 0]}>
            <boxGeometry args={[1.4, 4, 1.4]} />
            <meshStandardMaterial color="#181b23" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, 4.05, 0]}>
            <boxGeometry args={[1.5, 0.12, 1.5]} />
            <meshStandardMaterial color="#b600a8" emissive="#b600a8" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}
