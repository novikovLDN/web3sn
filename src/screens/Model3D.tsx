import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Character } from '../island/Character'

/** Персонаж на поворотном столе — студийный «рендер». */
function Turntable() {
  const g = useRef<THREE.Group>(null)
  const nl = useRef<THREE.Group>(null)
  const nr = useRef<THREE.Group>(null)
  const al = useRef<THREE.Group>(null)
  const ar = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.5
  })
  return (
    <group ref={g}>
      <Character legL={nl} legR={nr} armL={al} armR={ar} />
      {/* пьедестал */}
      <mesh position={[0, -1.18, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.2, 0.22, 56]} />
        <meshStandardMaterial color="#17150f" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function Model3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.35, 6], fov: 34 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      <ambientLight intensity={0.3} color="#d8c8b0" />
      <directionalLight position={[4, 7, 4]} intensity={2.2} color="#fff3e0" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 2, -3]} intensity={1.6} color="#ef4a23" />
      <directionalLight position={[4, 1, -4]} intensity={1.1} color="#c9a882" />

      <group position={[0, -0.15, 0]}>
        <Turntable />
        <ContactShadows position={[0, -1.28, 0]} opacity={0.55} scale={9} blur={2.6} far={4.5} color="#000000" />
      </group>

      {/* Мягкое окружение для отражений (без внешних HDR) */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-4, 1, -2]} scale={[5, 5, 1]} color="#ef4a23" />
        <Lightformer intensity={1.0} position={[4, 1, -2]} scale={[5, 5, 1]} color="#c9a882" />
      </Environment>
    </Canvas>
  )
}
