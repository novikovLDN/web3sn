import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX = 160
export type DustHandle = {
  burst: (x: number, y: number, z: number, color: string, power: number) => void
}

/**
 * Пул частиц пыли/крошки. Цвет задаётся при вызове burst (по типу поверхности).
 * Используется при приземлении, ударах и т.п.
 */
export default function Dust({
  apiRef,
}: {
  apiRef: React.MutableRefObject<DustHandle | null>
}) {
  const ref = useRef<THREE.Points>(null)
  const state = useRef(
    Array.from({ length: MAX }, () => ({
      life: 0,
      max: 1,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
    }))
  )
  const positions = useMemo(() => new Float32Array(MAX * 3).fill(9999), [])
  const colors = useMemo(() => new Float32Array(MAX * 3).fill(1), [])
  const _c = useMemo(() => new THREE.Color(), [])

  apiRef.current = {
    burst: (x, y, z, color, power) => {
      _c.set(color)
      const n = Math.floor(10 + power * 22)
      let spawned = 0
      for (let i = 0; i < MAX; i++) {
        const p = state.current[i]
        if (p.life > 0) continue
        const a = Math.random() * Math.PI * 2
        const sp = 0.8 + Math.random() * 2.4 * power
        p.max = 0.5 + Math.random() * 0.5
        p.life = p.max
        p.x = x + (Math.random() - 0.5) * 0.5
        p.y = y + 0.05
        p.z = z + (Math.random() - 0.5) * 0.5
        p.vx = Math.cos(a) * sp
        p.vz = Math.sin(a) * sp
        p.vy = 1 + Math.random() * 2.2 * power
        colors[i * 3] = _c.r
        colors[i * 3 + 1] = _c.g
        colors[i * 3 + 2] = _c.b
        if (++spawned >= n) break
      }
    },
  }

  useFrame((_, dt) => {
    const pts = ref.current
    if (!pts) return
    let any = false
    for (let i = 0; i < MAX; i++) {
      const p = state.current[i]
      if (p.life > 0) {
        p.life -= dt
        p.vy -= 8 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt
        if (p.y < 0.02) {
          p.y = 0.02
          p.vy = 0
          p.vx *= 0.6
          p.vz *= 0.6
        }
        any = true
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = p.z
      } else {
        positions[i * 3] = 9999
        positions[i * 3 + 1] = 9999
        positions[i * 3 + 2] = 9999
      }
    }
    ;(pts.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    pts.visible = any
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={MAX} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={MAX} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
