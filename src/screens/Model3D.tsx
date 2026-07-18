import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/** Объёмный «слепок» — органично морфящийся объект с премиальным светом. */
function Sculpt() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.28
    ref.current.rotation.x += dt * 0.08
  })
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.9}>
      <group ref={ref}>
        {/* основной объём */}
        <mesh castShadow>
          <icosahedronGeometry args={[1.35, 14]} />
          <MeshDistortMaterial color="#3f79b0" distort={0.34} speed={1.6} metalness={0.7} roughness={0.18} />
        </mesh>
        {/* каркас поверх — «сетка модели» */}
        <mesh scale={1.03}>
          <icosahedronGeometry args={[1.35, 3]} />
          <meshBasicMaterial wireframe color="#7fd4ff" transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  )
}

export default function Model3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.15
      }}
    >
      <ambientLight intensity={0.35} color="#9fc4e0" />
      {/* ключевой свет */}
      <directionalLight position={[4, 5, 4]} intensity={2.6} color="#ffffff" />
      {/* контровой акцент */}
      <directionalLight position={[-4, -2, -3]} intensity={2.2} color="#ef4a23" />
      {/* заполняющий холодный */}
      <directionalLight position={[-5, 3, 2]} intensity={1.4} color="#4cc2ff" />
      <Sculpt />
    </Canvas>
  )
}
