import { useMemo } from 'react'
import { RigidBody } from '@react-three/rapier'
import { inAnyWater, pitAt } from './playerState'

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
      <mesh>
        <boxGeometry args={[1.02, 0.12, 1.02]} />
        <meshStandardMaterial color="#6f4726" roughness={0.8} />
      </mesh>
    </RigidBody>
  )
}

export default function Props() {
  const crates = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = []
    const palette = ['#a9713d', '#8a5a2f', '#b6873f']
    for (let i = 0; i < 22; i++) {
      const x = Math.round((hash(i * 2.3, 5.1) - 0.5) * 44)
      const z = Math.round((hash(4.7, i * 3.9) - 0.5) * 44)
      if (Math.abs(x) < 2 && Math.abs(z) < 4) continue
      if (inAnyWater(x, z) || pitAt(x, z)) continue
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
    </group>
  )
}
