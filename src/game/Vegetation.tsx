import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { HALF, inAnyWater, isBeach, pitAt, inPond, inSea, SEA_Z, POND_CX, POND_CZ } from './playerState'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/* Инстансированное поле мелких объектов (цветы/камыш) */
function Field({
  count,
  seed,
  size,
  colorFor,
  place,
  filter,
}: {
  count: number
  seed: number
  size: [number, number, number]
  colorFor: (r: () => number) => THREE.Color
  place: (r: () => number) => [number, number, number] | null
  filter?: (x: number, z: number) => boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const items = useMemo(() => {
    const r = rng(seed)
    const arr: { p: [number, number, number]; c: THREE.Color; rot: number }[] = []
    for (let i = 0; i < count; i++) {
      const p = place(r)
      if (!p) continue
      if (filter && !filter(p[0], p[2])) continue
      arr.push({ p, c: colorFor(r), rot: r() * Math.PI })
    }
    return arr
  }, [count, seed])

  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const d = new THREE.Object3D()
    items.forEach((it, i) => {
      d.position.set(...it.p)
      d.rotation.y = it.rot
      d.updateMatrix()
      m.setMatrixAt(i, d.matrix)
      m.setColorAt(i, it.c)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [items])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined as never, undefined as never, Math.max(items.length, 1)]}
      castShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial roughness={0.85} />
    </instancedMesh>
  )
}

/* Куст (несколько блоков листвы) */
function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[
        [0, 0.4, 0, 1.1],
        [0.4, 0.7, 0.2, 0.8],
        [-0.3, 0.65, -0.2, 0.7],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[s, s, s]} />
          <meshStandardMaterial color={i % 2 ? '#3f7a34' : '#4d8f3e'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default function Vegetation() {
  const flowerColors = [
    '#e0473c',
    '#f0c04a',
    '#e8e8ee',
    '#c07fe6',
    '#e88fb0',
  ].map((c) => new THREE.Color(c))

  const landPlace = (r: () => number): [number, number, number] | null => {
    const x = (r() - 0.5) * HALF * 1.9
    const z = (r() - 0.5) * HALF * 1.9
    if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) return null
    return [x, 0.15, z]
  }

  // камыш у кромки воды
  const reedPlace = (r: () => number): [number, number, number] | null => {
    const near = r()
    let x: number
    let z: number
    if (near < 0.5) {
      // берег моря
      x = (r() - 0.5) * HALF * 1.9
      z = SEA_Z - r() * 3
    } else {
      // берег озера
      const a = r() * Math.PI * 2
      x = POND_CX + Math.cos(a) * (11 + r() * 2)
      z = POND_CZ + Math.sin(a) * (11 + r() * 2)
    }
    if (inSea(x, z) || inPond(x, z) || pitAt(x, z)) return null
    return [x, 0.5, z]
  }

  const bushes = useMemo<[number, number, number][]>(() => {
    const r = rng(4242)
    const arr: [number, number, number][] = []
    for (let i = 0; i < 30; i++) {
      const x = (r() - 0.5) * HALF * 1.85
      const z = (r() - 0.5) * HALF * 1.85
      if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) continue
      arr.push([x, 0, z])
    }
    return arr
  }, [])

  return (
    <group>
      {/* Цветы */}
      <Field
        count={900}
        seed={1717}
        size={[0.18, 0.3, 0.18]}
        place={landPlace}
        colorFor={(r) => flowerColors[Math.floor(r() * flowerColors.length)]}
      />
      {/* Камыш у воды */}
      <Field
        count={500}
        seed={9931}
        size={[0.09, 1.1, 0.09]}
        place={reedPlace}
        colorFor={() => new THREE.Color('#5f7d3a')}
      />
      {/* Кусты */}
      {bushes.map((p, i) => (
        <Bush key={i} position={p} />
      ))}
    </group>
  )
}
