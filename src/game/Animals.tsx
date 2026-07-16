import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HALF, inAnyWater, pitAt, inSea } from './playerState'

type Kind = 'sheep' | 'cow' | 'chicken'

function Leg({
  refCb,
  position,
  size,
  color,
}: {
  refCb: (g: THREE.Group | null) => void
  position: [number, number, number]
  size: [number, number, number]
  color: string
}) {
  return (
    <group ref={refCb} position={position}>
      <mesh castShadow position={[0, -size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Animal({ kind, start }: { kind: Kind; start: [number, number] }) {
  const root = useRef<THREE.Group>(null)
  const legs = useRef<(THREE.Group | null)[]>([])
  const st = useRef({
    x: start[0],
    z: start[1],
    heading: Math.random() * Math.PI * 2,
    timer: 0,
    moving: true,
    phase: 0,
    speed: kind === 'chicken' ? 1.4 : 1.0,
  })

  useFrame((_, dt) => {
    const s = st.current
    s.timer -= dt
    if (s.timer <= 0) {
      s.heading += (Math.random() - 0.5) * 1.6
      s.timer = 1.5 + Math.random() * 3
      s.moving = Math.random() > 0.25
    }
    if (s.moving) {
      const nx = s.x + Math.sin(s.heading) * s.speed * dt
      const nz = s.z + Math.cos(s.heading) * s.speed * dt
      if (
        inAnyWater(nx, nz) ||
        inSea(nx, nz) ||
        pitAt(nx, nz) ||
        Math.abs(nx) > HALF - 3 ||
        Math.abs(nz) > HALF - 3
      ) {
        s.heading += 2.4
      } else {
        s.x = nx
        s.z = nz
      }
      s.phase += dt * 7
    }
    if (root.current) {
      root.current.position.set(s.x, 0, s.z)
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        s.heading,
        0.1
      )
      // лёгкое подпрыгивание курицы
      if (kind === 'chicken')
        root.current.position.y = s.moving ? Math.abs(Math.sin(s.phase)) * 0.08 : 0
    }
    const sw = s.moving ? Math.sin(s.phase) * 0.5 : 0
    legs.current.forEach((l, i) => {
      if (l) l.rotation.x = i % 2 ? sw : -sw
    })
  })

  const setLeg = (i: number) => (g: THREE.Group | null) => {
    legs.current[i] = g
  }

  if (kind === 'chicken') {
    return (
      <group ref={root} position={[start[0], 0, start[1]]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.3, 0.35, 0.45]} />
          <meshStandardMaterial color="#f2f2f2" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0.2]}>
          <boxGeometry args={[0.22, 0.26, 0.24]} />
          <meshStandardMaterial color="#f6f6f6" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.78, 0.36]}>
          <boxGeometry args={[0.08, 0.08, 0.12]} />
          <meshStandardMaterial color="#e8a23a" />
        </mesh>
        <mesh position={[0, 0.9, 0.18]}>
          <boxGeometry args={[0.1, 0.12, 0.04]} />
          <meshStandardMaterial color="#d64030" />
        </mesh>
        <Leg refCb={setLeg(0)} position={[0.09, 0.32, 0]} size={[0.05, 0.32, 0.05]} color="#e8a23a" />
        <Leg refCb={setLeg(1)} position={[-0.09, 0.32, 0]} size={[0.05, 0.32, 0.05]} color="#e8a23a" />
      </group>
    )
  }

  const body = kind === 'cow' ? '#5b4636' : '#eef0f0'
  const head = kind === 'cow' ? '#3f3228' : '#e6e6e6'
  const legc = kind === 'cow' ? '#2f2620' : '#cfcfcf'
  return (
    <group ref={root} position={[start[0], 0, start[1]]}>
      {/* тело */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[0.7, 0.7, 1.2]} />
        <meshStandardMaterial color={body} roughness={0.95} />
      </mesh>
      {/* голова */}
      <mesh castShadow position={[0, 1.0, 0.75]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={head} roughness={0.9} />
      </mesh>
      {kind === 'cow' && (
        <>
          <mesh position={[0.16, 1.28, 0.75]}>
            <boxGeometry args={[0.08, 0.16, 0.08]} />
            <meshStandardMaterial color="#e8e2d0" />
          </mesh>
          <mesh position={[-0.16, 1.28, 0.75]}>
            <boxGeometry args={[0.08, 0.16, 0.08]} />
            <meshStandardMaterial color="#e8e2d0" />
          </mesh>
        </>
      )}
      {/* глаза */}
      <mesh position={[0.14, 1.05, 1.0]}>
        <boxGeometry args={[0.07, 0.07, 0.02]} />
        <meshStandardMaterial color="#15110d" />
      </mesh>
      <mesh position={[-0.14, 1.05, 1.0]}>
        <boxGeometry args={[0.07, 0.07, 0.02]} />
        <meshStandardMaterial color="#15110d" />
      </mesh>
      {/* ноги */}
      <Leg refCb={setLeg(0)} position={[0.24, 0.5, 0.4]} size={[0.16, 0.55, 0.16]} color={legc} />
      <Leg refCb={setLeg(1)} position={[-0.24, 0.5, 0.4]} size={[0.16, 0.55, 0.16]} color={legc} />
      <Leg refCb={setLeg(2)} position={[0.24, 0.5, -0.4]} size={[0.16, 0.55, 0.16]} color={legc} />
      <Leg refCb={setLeg(3)} position={[-0.24, 0.5, -0.4]} size={[0.16, 0.55, 0.16]} color={legc} />
    </group>
  )
}

export default function Animals() {
  const animals = useMemo(() => {
    const arr: { kind: Kind; start: [number, number] }[] = []
    const kinds: Kind[] = ['sheep', 'sheep', 'sheep', 'cow', 'chicken', 'chicken']
    let seed = 909
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    let placed = 0
    let tries = 0
    while (placed < 22 && tries < 400) {
      tries++
      const x = (rnd() - 0.5) * HALF * 1.7
      const z = (rnd() - 0.5) * HALF * 1.7
      if (inAnyWater(x, z) || inSea(x, z) || pitAt(x, z)) continue
      arr.push({ kind: kinds[Math.floor(rnd() * kinds.length)], start: [x, z] })
      placed++
    }
    return arr
  }, [])

  return (
    <group>
      {animals.map((a, i) => (
        <Animal key={i} kind={a.kind} start={a.start} />
      ))}
    </group>
  )
}
