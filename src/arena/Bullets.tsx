import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { store, ARENA_R } from './store'

export default function Bullets() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = store.bullets.length

  useFrame((_, rawDt) => {
    const mesh = ref.current
    if (!mesh) return
    const dt = Math.min(rawDt, 0.05)
    for (let i = 0; i < count; i++) {
      const b = store.bullets[i]
      if (b.active) {
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.z += b.vz * dt
        b.life -= dt
        // столкновение с врагами
        let hit = false
        for (const e of store.enemies) {
          if (!e.active) continue
          const dx = e.x - b.x
          const dz = e.z - b.z
          const dy = 1 - b.y
          if (dx * dx + dz * dz + dy * dy < (e.radius + 0.35) * (e.radius + 0.35)) {
            e.hp -= b.dmg
            store.onBulletHit(b.x, b.y, b.z)
            if (e.hp <= 0) {
              e.active = false
              store.onKill(e.x, e.z, e.type)
            }
            hit = true
            break
          }
        }
        if (hit || b.life <= 0 || Math.hypot(b.x, b.z) > ARENA_R + 2) {
          b.active = false
        }
      }
      if (b.active) {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.setScalar(1)
      } else {
        dummy.position.set(0, -999, 0)
        dummy.scale.setScalar(0.001)
      }
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.16, 10, 10]} />
      <meshStandardMaterial
        color="#ffd28a"
        emissive="#ff9d3a"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </instancedMesh>
  )
}
