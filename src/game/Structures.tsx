import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

/* ── Дом (стены с дверным проёмом, крыша-пирамида, окно) ───────── */
function House({
  position,
  rotation = 0,
  wall = '#c8b48a',
  roof = '#8a3b2f',
}: {
  position: [number, number, number]
  rotation?: number
  wall?: string
  roof?: string
}) {
  const W = 6
  const H = 3.2
  const T = 0.3
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RigidBody type="fixed" colliders={false} friction={1}>
        {/* задняя стена */}
        <CuboidCollider args={[W / 2, H / 2, T / 2]} position={[0, H / 2, -W / 2]} />
        {/* боковые */}
        <CuboidCollider args={[T / 2, H / 2, W / 2]} position={[-W / 2, H / 2, 0]} />
        <CuboidCollider args={[T / 2, H / 2, W / 2]} position={[W / 2, H / 2, 0]} />
        {/* передняя — два сегмента, дверной проём по центру */}
        <CuboidCollider args={[1.75, H / 2, T / 2]} position={[-2.15, H / 2, W / 2]} />
        <CuboidCollider args={[1.75, H / 2, T / 2]} position={[2.15, H / 2, W / 2]} />
        <CuboidCollider args={[1.4, 0.4, T / 2]} position={[0, H - 0.4, W / 2]} />
      </RigidBody>

      {/* визуал стен */}
      <mesh castShadow receiveShadow position={[0, H / 2, -W / 2]}>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color={wall} roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[T, H, W]} />
        <meshStandardMaterial color={wall} roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[T, H, W]} />
        <meshStandardMaterial color={wall} roughness={0.85} />
      </mesh>
      {[-2.15, 2.15].map((x, i) => (
        <mesh key={i} castShadow receiveShadow position={[x, H / 2, W / 2]}>
          <boxGeometry args={[3.5, H, T]} />
          <meshStandardMaterial color={wall} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, H - 0.4, W / 2]}>
        <boxGeometry args={[2.8, 0.8, T]} />
        <meshStandardMaterial color={wall} roughness={0.85} />
      </mesh>
      {/* окна */}
      {[-W / 2, W / 2].map((x, i) => (
        <mesh key={i} position={[x, H * 0.6, 1.2]}>
          <boxGeometry args={[T + 0.02, 1, 1]} />
          <meshStandardMaterial color="#bfe4ff" emissive="#6ab0e0" emissiveIntensity={0.3} roughness={0.2} />
        </mesh>
      ))}
      {/* крыша-пирамида */}
      <mesh castShadow position={[0, H + 1.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[W * 0.82, 2.4, 4]} />
        <meshStandardMaterial color={roof} roughness={0.8} flatShading />
      </mesh>
      {/* пол */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[W - T, 0.12, W - T]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ── Мельница с вращающимися лопастями ────────────────────────── */
function Windmill({ position }: { position: [number, number, number] }) {
  const blades = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z += dt * 0.7
  })
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false} friction={1}>
        <CuboidCollider args={[1.6, 4, 1.6]} position={[0, 4, 0]} />
      </RigidBody>
      {/* башня (конус-усечёнка через цилиндр) */}
      <mesh castShadow position={[0, 4, 0]}>
        <cylinderGeometry args={[1.4, 2.0, 8, 8]} />
        <meshStandardMaterial color="#b8ae98" roughness={0.9} />
      </mesh>
      {/* крыша */}
      <mesh castShadow position={[0, 8.6, 0]} rotation={[0, Math.PI / 8, 0]}>
        <coneGeometry args={[1.9, 1.8, 8]} />
        <meshStandardMaterial color="#6a3b2a" roughness={0.85} flatShading />
      </mesh>
      {/* лопасти */}
      <group ref={blades} position={[0, 6.5, 2.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.5, 10]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0.1]}>
            <boxGeometry args={[0.5, 5, 0.15]} />
            <meshStandardMaterial color="#e6ddc8" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ── Колодец ──────────────────────────────────────────────────── */
function Well({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1, 0.6, 1]} position={[0, 0.6, 0]} />
      </RigidBody>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1, 1, 1.2, 16]} />
        <meshStandardMaterial color="#7c7f87" roughness={1} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
        <meshStandardMaterial color="#2f6a8a" roughness={0.3} metalness={0.2} />
      </mesh>
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} castShadow position={[x, 1.9, 0]}>
          <boxGeometry args={[0.16, 2.4, 0.16]} />
          <meshStandardMaterial color="#5b3b23" />
        </mesh>
      ))}
      <mesh castShadow position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.9, 4]} />
        <meshStandardMaterial color="#6a3b2a" flatShading />
      </mesh>
    </group>
  )
}

/* ── Фонарь ───────────────────────────────────────────────────── */
function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
        <meshStandardMaterial color="#22242a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[0.35, 0.4, 0.35]} />
        <meshStandardMaterial color="#fff3c0" emissive="#ffd873" emissiveIntensity={1.6} />
      </mesh>
      <pointLight position={[0, 3.3, 0]} intensity={0.6} distance={7} color="#ffd98a" />
    </group>
  )
}

export default function Structures() {
  return (
    <group>
      <House position={[-40, 0, 20]} rotation={0.2} wall="#c8b48a" roof="#8a3b2f" />
      <House position={[-28, 0, 26]} rotation={-0.5} wall="#b6c0c8" roof="#3a5a7a" />
      <House position={[-46, 0, 34]} rotation={0.4} wall="#cdb98e" roof="#6a3b2a" />
      <House position={[-30, 0, 40]} rotation={-0.2} wall="#c0a878" roof="#7a5a2a" />
      <House position={[-54, 0, 24]} rotation={0.8} wall="#b8ae98" roof="#8a3b2f" />

      <Windmill position={[-62, 0, 40]} />
      <Well position={[-38, 0, 30]} />

      <Lamp position={[-34, 0, 24]} />
      <Lamp position={[-44, 0, 28]} />
      <Lamp position={[-40, 0, 36]} />
    </group>
  )
}
