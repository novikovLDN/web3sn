import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD, PAL } from './config'
import { terrainHeight, terrainSlope, isWater, POND, rng } from './heightmap'
import { world } from './state'

type Gem = { x: number; y: number; z: number; color: string; collected: boolean }

/** Парящие кристаллы: подбираются при приближении игрока, растят счёт. */
export default function Collectibles() {
  const gems = useMemo<Gem[]>(() => {
    const R = WORLD / 2 - 8
    const rand = rng(4242)
    const list: Gem[] = []
    for (let i = 0; i < 6000 && list.length < 24; i++) {
      const x = (rand() * 2 - 1) * R
      const z = (rand() * 2 - 1) * R
      const y = terrainHeight(x, z)
      if (y < 0.8 || y > 16) continue
      if (isWater(x, z)) continue
      if (terrainSlope(x, z) > 0.5) continue
      if (Math.hypot(x - POND.x, z - POND.z) < POND.r + 2) continue
      list.push({ x, y: y + 1.1, z, color: PAL.gem[Math.floor(rand() * PAL.gem.length)], collected: false })
    }
    world.totalGems = list.length
    return list
  }, [])

  return (
    <group>
      {gems.map((g, i) => (
        <GemMesh key={i} gem={g} />
      ))}
    </group>
  )
}

function GemMesh({ gem }: { gem: Gem }) {
  const grp = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  const collectedT = useRef(0)

  useFrame((state, dt) => {
    const g = grp.current
    if (!g) return
    if (gem.collected) {
      // анимация исчезновения после подбора
      collectedT.current += dt
      const s = Math.max(0, 1 - collectedT.current * 3)
      g.scale.setScalar(s)
      g.position.y = gem.y + collectedT.current * 2
      if (s <= 0) g.visible = false
      return
    }
    const t = state.clock.elapsedTime + phase.current
    g.position.y = gem.y + Math.sin(t * 2) * 0.18
    g.rotation.y = t * 1.2
    if (inner.current) inner.current.rotation.x = t * 1.6
    if (light.current) light.current.intensity = 1.6 + Math.sin(t * 4) * 0.5

    // подбор по близости
    const p = world.player
    const d = Math.hypot(p.x - gem.x, p.z - gem.z, p.y - gem.y)
    if (d < 1.6 && world.active) {
      gem.collected = true
      world.collectGem()
    }
  })

  return (
    <group ref={grp} position={[gem.x, gem.y, gem.z]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={gem.color}
          emissive={gem.color}
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#ffffff" emissive={gem.color} emissiveIntensity={1.5} />
      </mesh>
      <pointLight ref={light} color={gem.color} intensity={1.6} distance={5} />
    </group>
  )
}
