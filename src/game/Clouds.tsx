import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HALF } from './playerState'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/**
 * Блочные облака в стиле Minecraft: кластеры плоских белых кубов высоко в небе,
 * медленно дрейфуют по ветру (лёгкая облачность, ясный день).
 */
export default function Clouds() {
  const group = useRef<THREE.Group>(null)

  const clouds = useMemo(() => {
    const r = rng(777)
    const arr: { pos: [number, number, number]; boxes: [number, number, number, number, number, number][] }[] = []
    const N = 16
    for (let i = 0; i < N; i++) {
      const cx = (r() - 0.5) * HALF * 2.4
      const cz = (r() - 0.5) * HALF * 2.4
      const cy = 42 + r() * 10
      // кластер из нескольких плоских блоков
      const boxes: [number, number, number, number, number, number][] = []
      const parts = 4 + Math.floor(r() * 4)
      for (let j = 0; j < parts; j++) {
        const ox = (r() - 0.5) * 14
        const oz = (r() - 0.5) * 10
        const sx = 5 + r() * 7
        const sz = 4 + r() * 6
        boxes.push([ox, 0, oz, sx, 2 + r() * 1.5, sz])
      }
      arr.push({ pos: [cx, cy, cz], boxes })
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    if (!group.current) return
    // медленный дрейф; заворачиваем по X
    group.current.position.x += dt * 0.6
    if (group.current.position.x > HALF * 1.4) group.current.position.x = -HALF * 1.4
  })

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={c.pos}>
          {c.boxes.map((b, j) => (
            <mesh key={j} position={[b[0], b[1], b[2]]}>
              <boxGeometry args={[b[3], b[4], b[5]]} />
              <meshStandardMaterial color="#f4f7fb" roughness={1} transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
