import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { store, ARENA_R, type EnemyType } from './store'

const COLORS: Record<EnemyType, { body: string; core: string; emissive: string }> = {
  grunt: { body: '#2a1030', core: '#b600a8', emissive: '#b600a8' },
  runner: { body: '#301a10', core: '#ff6a1a', emissive: '#be4c00' },
  brute: { body: '#1c1030', core: '#8a3ad0', emissive: '#7621b0' },
}

function EnemyMesh({
  refCb,
  type,
}: {
  refCb: (g: THREE.Group | null) => void
  type: EnemyType
}) {
  const c = COLORS[type]
  const big = type === 'brute'
  const s = big ? 1.5 : type === 'runner' ? 0.85 : 1
  return (
    <group ref={refCb} visible={false}>
      {/* тело */}
      <mesh castShadow position={[0, 0.7 * s, 0]}>
        <boxGeometry args={[0.9 * s, 1.1 * s, 0.9 * s]} />
        <meshStandardMaterial color={c.body} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* светящееся ядро */}
      <mesh position={[0, 0.75 * s, 0.32 * s]}>
        <boxGeometry args={[0.42 * s, 0.42 * s, 0.14]} />
        <meshStandardMaterial color={c.core} emissive={c.emissive} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* глаза */}
      <mesh position={[0.2 * s, 1.05 * s, 0.4 * s]}>
        <boxGeometry args={[0.12 * s, 0.12 * s, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.2 * s, 1.05 * s, 0.4 * s]}>
        <boxGeometry args={[0.12 * s, 0.12 * s, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* ножки-выступы */}
      <mesh position={[0.28 * s, 0.12 * s, 0]}>
        <boxGeometry args={[0.22 * s, 0.24 * s, 0.6 * s]} />
        <meshStandardMaterial color={c.body} roughness={0.6} />
      </mesh>
      <mesh position={[-0.28 * s, 0.12 * s, 0]}>
        <boxGeometry args={[0.22 * s, 0.24 * s, 0.6 * s]} />
        <meshStandardMaterial color={c.body} roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function Enemies() {
  const refs = useRef<(THREE.Group | null)[]>([])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const p = store.player
    for (let i = 0; i < store.enemies.length; i++) {
      const e = store.enemies[i]
      const g = refs.current[i]
      if (!g) continue
      if (!e.active) {
        if (g.visible) g.visible = false
        continue
      }
      if (!g.visible) g.visible = true

      e.spawn = Math.min(1, e.spawn + dt * 2.5)
      e.phase += dt * (e.speed * 1.6)
      e.hitCd -= dt

      // движение к игроку
      let dx = p.x - e.x
      let dz = p.z - e.z
      const d = Math.hypot(dx, dz) || 1
      dx /= d
      dz /= d
      const stopDist = e.radius + 0.7
      if (d > stopDist && store.playerAlive) {
        e.x += dx * e.speed * dt
        e.z += dz * e.speed * dt
      } else if (store.playerAlive && e.hitCd <= 0) {
        store.onPlayerHit(e.damage)
        e.hitCd = 0.8
      }
      // кламп по арене
      const rr = Math.hypot(e.x, e.z)
      if (rr > ARENA_R - 1.2) {
        const k = (ARENA_R - 1.2) / rr
        e.x *= k
        e.z *= k
      }

      // отрисовка
      const bob = Math.abs(Math.sin(e.phase)) * 0.12
      g.position.set(e.x, bob + (1 - e.spawn) * 4, e.z)
      g.rotation.y = Math.atan2(dx, dz)
      const sc = e.spawn
      g.scale.setScalar(sc)
    }
  })

  return (
    <group>
      {store.enemies.map((e, i) => (
        <EnemyMesh
          key={i}
          type={e.type}
          refCb={(g) => {
            refs.current[i] = g
          }}
        />
      ))}
    </group>
  )
}
