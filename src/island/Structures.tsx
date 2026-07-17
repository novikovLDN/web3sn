import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { PAL } from './config'
import { terrainHeight } from './heightmap'

/** Деревянная хижина с крышей, окном и дверью. */
function Cabin({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  const y = terrainHeight(x, z)
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      {/* сваи, чтобы стоять ровно на склоне */}
      {[[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]].map(([px, pz], i) => (
        <mesh key={i} position={[px, 0.3, pz]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.2, 6]} />
          <meshStandardMaterial color={PAL.woodDark} roughness={0.9} />
        </mesh>
      ))}
      {/* пол */}
      <RoundedBox args={[3.8, 0.25, 3.8]} radius={0.05} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={PAL.wood} roughness={0.85} />
      </RoundedBox>
      {/* стены */}
      <RoundedBox args={[3.6, 2, 3.6]} radius={0.06} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#c79a5b" roughness={0.8} />
      </RoundedBox>
      {/* дверь */}
      <mesh position={[0, 1.7, 1.82]}>
        <boxGeometry args={[0.8, 1.4, 0.06]} />
        <meshStandardMaterial color={PAL.woodDark} roughness={0.7} />
      </mesh>
      {/* окно (светится) */}
      <mesh position={[1.2, 2.2, 1.82]}>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffb545" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      {/* крыша (две скатные плоскости) */}
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.1, 1.5, 4]} />
        <meshStandardMaterial color={PAL.roof} roughness={0.75} />
      </mesh>
      {/* труба */}
      <mesh position={[1, 4.1, 0.8]} castShadow>
        <boxGeometry args={[0.4, 0.9, 0.4]} />
        <meshStandardMaterial color="#7a5a4a" roughness={0.9} />
      </mesh>
    </group>
  )
}

/** Причал, уходящий в море. */
function Dock({ x, z, rot = 0, length = 10 }: { x: number; z: number; rot?: number; length?: number }) {
  const planks = Math.floor(length)
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {Array.from({ length: planks }).map((_, i) => (
        <group key={i} position={[0, 0, i * 1]}>
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.16, 0.9]} />
            <meshStandardMaterial color={i % 2 ? PAL.wood : PAL.woodDark} roughness={0.85} />
          </mesh>
          {i % 2 === 0 &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.95, -0.6, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.12, 1.6, 6]} />
                <meshStandardMaterial color={PAL.woodDark} roughness={0.9} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  )
}

/** Костёр с мерцающим светом. */
function Campfire({ x, z }: { x: number; z: number }) {
  const y = terrainHeight(x, z)
  const light = useRef<THREE.PointLight>(null)
  const flame = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const f = 1 + Math.sin(t * 12) * 0.15 + Math.sin(t * 7.3) * 0.1
    if (light.current) light.current.intensity = 6 * f
    if (flame.current) {
      flame.current.scale.setScalar(f)
      flame.current.rotation.y = t * 2
    }
  })
  return (
    <group position={[x, y, z]}>
      {/* камни по кругу */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7]} castShadow>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color={PAL.rockDark} roughness={1} flatShading />
          </mesh>
        )
      })}
      {/* поленья */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, (i / 3) * Math.PI]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 6]} />
          <meshStandardMaterial color={PAL.woodDark} roughness={0.9} />
        </mesh>
      ))}
      {/* пламя */}
      <mesh ref={flame} position={[0, 0.55, 0]}>
        <coneGeometry args={[0.28, 0.9, 8]} />
        <meshStandardMaterial color="#ff7a1a" emissive="#ff5500" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={light} position={[0, 1, 0]} color="#ff8a3a" intensity={6} distance={14} castShadow />
    </group>
  )
}

/** Фонарный столб со светящейся лампой. */
function Lamp({ x, z }: { x: number; z: number }) {
  const y = terrainHeight(x, z)
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.8, 8]} />
        <meshStandardMaterial color="#2b2b30" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fff0c0" emissive="#ffcf6a" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 2.9, 0]} color="#ffd98a" intensity={3} distance={10} />
    </group>
  )
}

export default function Structures() {
  const lamps = useMemo(
    () => [
      [6, -12],
      [-4, -16],
      [14, 2],
    ],
    []
  )
  return (
    <group>
      <Cabin x={8} z={-18} rot={-0.5} />
      <Dock x={0} z={26} rot={0} length={12} />
      <Campfire x={4} z={-10} />
      {lamps.map(([x, z], i) => (
        <Lamp key={i} x={x} z={z} />
      ))}
    </group>
  )
}
