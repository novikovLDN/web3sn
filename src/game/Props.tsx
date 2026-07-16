import { useMemo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { inPond } from './playerState'

function hash(x: number, z: number) {
  const s = Math.sin(x * 91.3 + z * 47.1) * 21813.1
  return s - Math.floor(s)
}

/* ── Толкаемый ящик ───────────────────────────────────────────── */
function Crate({
  position,
  color = '#a9713d',
}: {
  position: [number, number, number]
  color?: string
}) {
  return (
    <RigidBody
      colliders="cuboid"
      position={position}
      friction={0.9}
      restitution={0.05}
      density={0.6}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* рёбра-обвязка для детализации */}
      <mesh>
        <boxGeometry args={[1.02, 0.12, 1.02]} />
        <meshStandardMaterial color="#6f4726" roughness={0.8} />
      </mesh>
    </RigidBody>
  )
}

/* ── Толкаемый «транспорт» (блочная машинка) ──────────────────── */
function Car({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <RigidBody
      colliders={false}
      position={position}
      friction={0.7}
      restitution={0.05}
      density={0.5}
    >
      {/* кузов-коллайдер */}
      <CuboidCollider args={[1.1, 0.35, 0.6]} position={[0, 0.55, 0]} />
      {/* корпус */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.7, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* кабина */}
      <mesh castShadow position={[-0.1, 1.05, 0]}>
        <boxGeometry args={[1.1, 0.55, 1.05]} />
        <meshStandardMaterial color="#20242c" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* стёкла */}
      <mesh position={[-0.1, 1.05, 0.53]}>
        <boxGeometry args={[1.0, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#8fd0ff"
          emissive="#6ab0e0"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* фары */}
      <mesh position={[1.11, 0.55, 0.35]}>
        <boxGeometry args={[0.04, 0.16, 0.2]} />
        <meshStandardMaterial color="#fff4c2" emissive="#fff0a0" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[1.11, 0.55, -0.35]}>
        <boxGeometry args={[0.04, 0.16, 0.2]} />
        <meshStandardMaterial color="#fff4c2" emissive="#fff0a0" emissiveIntensity={1.2} />
      </mesh>
      {/* колёса */}
      {[
        [0.7, 0.62],
        [0.7, -0.62],
        [-0.7, 0.62],
        [-0.7, -0.62],
      ].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.28, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.24, 18]} />
          <meshStandardMaterial color="#141519" roughness={0.7} />
        </mesh>
      ))}
    </RigidBody>
  )
}

export default function Props() {
  const crates = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = []
    const palette = ['#a9713d', '#8a5a2f', '#b6873f']
    for (let i = 0; i < 16; i++) {
      const x = Math.round((hash(i * 2.3, 5.1) - 0.5) * 30)
      const z = Math.round((hash(4.7, i * 3.9) - 0.5) * 30)
      if (Math.abs(x) < 2 && Math.abs(z) < 4) continue
      if (inPond(x, z)) continue
      const stack = hash(i, i) > 0.7 ? 1.5 : 0.5
      arr.push({ pos: [x, stack, z], color: palette[i % palette.length] })
    }
    return arr
  }, [])

  return (
    <group>
      {crates.map((c, i) => (
        <Crate key={i} position={c.pos} color={c.color} />
      ))}
      <Car position={[-6, 1, -4]} color="#c8452f" />
      <Car position={[8, 1, 3]} color="#2f6bc8" />
      <Car position={[3, 1, -10]} color="#2fae7a" />
    </group>
  )
}
