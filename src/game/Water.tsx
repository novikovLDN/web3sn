import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WATER_LEVEL, POND, SEA_Z, HALF } from './playerState'

/* Параметризуемая волновая поверхность */
function WaterPatch({
  center,
  size,
  amp = 0.09,
  deep = '#0e4d6b',
  shallow = '#3ba7c4',
  segments = 96,
  radial = true,
}: {
  center: [number, number, number]
  size: [number, number]
  amp?: number
  deep?: string
  shallow?: string
  segments?: number
  radial?: boolean
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      uDeep: { value: new THREE.Color(deep) },
      uShallow: { value: new THREE.Color(shallow) },
      uFoam: { value: new THREE.Color('#dff4ff') },
      uRadial: { value: radial ? 1 : 0 },
    }),
    [amp, deep, shallow, radial]
  )

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={center}>
      <planeGeometry args={[size[0], size[1], segments, segments]} />
      <shaderMaterial
        ref={matRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uAmp;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w =
              sin(p.x * 0.5 + uTime * 1.5) * uAmp +
              sin(p.y * 0.7 + uTime * 1.1) * uAmp * 0.8 +
              sin((p.x + p.y) * 0.35 + uTime * 2.0) * uAmp * 0.6;
            p.z += w;
            vWave = w / uAmp;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          uniform vec3 uFoam;
          uniform float uRadial;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            float edge = 1.0;
            if (uRadial > 0.5) {
              vec2 c = vUv - 0.5;
              edge = smoothstep(0.5, 0.34, length(c));
            }
            float depth = smoothstep(-1.0, 1.2, vWave);
            vec3 col = mix(uDeep, uShallow, depth);
            float foam = smoothstep(1.0, 1.4, vWave);
            col = mix(col, uFoam, foam * 0.6);
            gl_FragColor = vec4(col, edge * 0.85);
          }
        `}
      />
    </mesh>
  )
}

/* Брызги: пул частиц */
const MAX = 90
export type SplashHandle = { burst: (x: number, z: number, power: number) => void }

function Splash({ apiRef }: { apiRef: React.MutableRefObject<SplashHandle | null> }) {
  const ref = useRef<THREE.Points>(null)
  const state = useRef(
    Array.from({ length: MAX }, () => ({
      life: 0,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
    }))
  )
  const positions = useMemo(() => new Float32Array(MAX * 3).fill(9999), [])

  apiRef.current = {
    burst: (x, z, power) => {
      let spawned = 0
      const n = Math.floor(14 + power * 16)
      for (const p of state.current) {
        if (p.life > 0) continue
        const a = Math.random() * Math.PI * 2
        const sp = 1.2 + Math.random() * 3 * power
        p.life = 0.5 + Math.random() * 0.5
        p.x = x + (Math.random() - 0.5) * 0.8
        p.y = WATER_LEVEL + 0.1
        p.z = z + (Math.random() - 0.5) * 0.8
        p.vx = Math.cos(a) * sp * 0.6
        p.vz = Math.sin(a) * sp * 0.6
        p.vy = 3 + Math.random() * 3 * power
        if (++spawned >= n) break
      }
    },
  }

  useFrame((_, dt) => {
    const pts = ref.current
    if (!pts) return
    let any = false
    state.current.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= dt
        p.vy -= 9.5 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt
        if (p.y < WATER_LEVEL) p.life = 0
        any = true
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = p.z
      } else {
        positions[i * 3] = 9999
        positions[i * 3 + 1] = 9999
        positions[i * 3 + 2] = 9999
      }
    })
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.needsUpdate = true
    pts.visible = any
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={MAX} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color="#eaf8ff"
        transparent
        opacity={0.92}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function Water({
  apiRef,
}: {
  apiRef: React.MutableRefObject<SplashHandle | null>
}) {
  const seaDepth = HALF - SEA_Z
  return (
    <group>
      {/* Пруд */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[POND.cx, -0.9, POND.cz]} receiveShadow>
        <planeGeometry args={[POND.rx * 2, POND.rz * 2]} />
        <meshStandardMaterial color="#18465a" roughness={1} />
      </mesh>
      <WaterPatch center={[POND.cx, WATER_LEVEL, POND.cz]} size={[POND.rx * 2, POND.rz * 2]} radial />

      {/* Море */}
      <WaterPatch
        center={[0, WATER_LEVEL, SEA_Z + seaDepth / 2]}
        size={[HALF * 2, seaDepth]}
        amp={0.14}
        deep="#0a3d5c"
        shallow="#2f8fb8"
        segments={140}
        radial={false}
      />

      <Splash apiRef={apiRef} />
    </group>
  )
}
