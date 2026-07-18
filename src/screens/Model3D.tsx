import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { Character } from '../island/Character'

// Авто-подхват своей 3D-модели из src/models (просто положите туда .glb).
const modelFiles = import.meta.glob('../models/*.{glb,gltf}', { eager: true, query: '?url', import: 'default' })
const MODEL_URL = (Object.entries(modelFiles).sort(([a], [b]) => a.localeCompare(b))[0]?.[1] as string | undefined)

/** Пользовательская модель: центрируется, масштабируется, играет анимацию или крутится. */
function UserModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const { actions } = useAnimations(animations, group)

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = 2.8 / maxDim
    return { scale: s, offset: center.multiplyScalar(-s) }
  }, [cloned])

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.reset().play())
  }, [actions])

  useFrame((_, dt) => {
    if (group.current && animations.length === 0) group.current.rotation.y += dt * 0.5
  })

  return (
    <group ref={group}>
      <group scale={scale} position={[offset.x, offset.y, offset.z]}>
        <primitive object={cloned} />
      </group>
    </group>
  )
}

/** Персонаж-заглушка на поворотном столе (пока нет своей модели). */
function CharacterTurntable() {
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
        {MODEL_URL ? <UserModel url={MODEL_URL} /> : <CharacterTurntable />}
        <ContactShadows position={[0, -1.28, 0]} opacity={0.55} scale={9} blur={2.6} far={4.5} color="#000000" />
      </group>

      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-4, 1, -2]} scale={[5, 5, 1]} color="#ef4a23" />
        <Lightformer intensity={1.0} position={[4, 1, -2]} scale={[5, 5, 1]} color="#c9a882" />
      </Environment>
    </Canvas>
  )
}
