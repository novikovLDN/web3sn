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

/* Кольцо дальних гор на горизонте (декор, за границей мира) */
function Mountains() {
  const items = useMemo(() => {
    const r = rng(321)
    const arr: {
      pos: [number, number, number]
      h: number
      base: number
      rot: number
      snow: boolean
    }[] = []
    const N = 40
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + (r() - 0.5) * 0.1
      const rad = HALF * 1.35 + r() * HALF * 0.5
      const h = 22 + r() * 40
      arr.push({
        pos: [Math.sin(a) * rad, -2, Math.cos(a) * rad],
        h,
        base: h * (0.7 + r() * 0.5),
        rot: r() * Math.PI,
        snow: h > 40,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {items.map((m, i) => (
        <group key={i} position={m.pos} rotation={[0, m.rot, 0]}>
          <mesh>
            <coneGeometry args={[m.base, m.h, 4]} />
            <meshStandardMaterial color="#6a7280" roughness={1} flatShading fog />
          </mesh>
          {m.snow && (
            <mesh position={[0, m.h * 0.28, 0]}>
              <coneGeometry args={[m.base * 0.45, m.h * 0.42, 4]} />
              <meshStandardMaterial color="#e8eef2" roughness={1} flatShading fog />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

/* Птица (V-образные крылья, машут) */
function Bird({
  center,
  radius,
  height,
  speed,
  phase,
}: {
  center: [number, number]
  radius: number
  height: number
  speed: number
  phase: number
}) {
  const root = useRef<THREE.Group>(null)
  const wl = useRef<THREE.Mesh>(null)
  const wr = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    if (root.current) {
      root.current.position.set(
        center[0] + Math.sin(t) * radius,
        height + Math.sin(t * 2) * 1.5,
        center[1] + Math.cos(t) * radius
      )
      root.current.rotation.y = -t + Math.PI / 2
    }
    const flap = Math.sin(clock.getElapsedTime() * 9 + phase) * 0.5
    if (wl.current) wl.current.rotation.z = 0.3 + flap
    if (wr.current) wr.current.rotation.z = -0.3 - flap
  })
  return (
    <group ref={root}>
      <mesh ref={wl} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.06, 0.4]} />
        <meshStandardMaterial color="#2b2f36" fog />
      </mesh>
      <mesh ref={wr} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.06, 0.4]} />
        <meshStandardMaterial color="#2b2f36" fog />
      </mesh>
    </group>
  )
}

function Birds() {
  const flock = useMemo(() => {
    const r = rng(88)
    return Array.from({ length: 10 }, () => ({
      center: [(r() - 0.5) * HALF, (r() - 0.5) * HALF] as [number, number],
      radius: 10 + r() * 20,
      height: 32 + r() * 14,
      speed: 0.15 + r() * 0.2,
      phase: r() * Math.PI * 2,
    }))
  }, [])
  return (
    <group>
      {flock.map((b, i) => (
        <Bird key={i} {...b} />
      ))}
    </group>
  )
}

export default function Atmosphere() {
  return (
    <group>
      <Mountains />
      <Birds />
    </group>
  )
}
