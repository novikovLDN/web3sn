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
          varying vec3 vNormal;
          float wave(float x, float z, float t) {
            return sin(x * 0.6 + t * 1.4) * 0.45
                 + sin(z * 0.8 + t * 1.1) * 0.30
                 + sin((x + z) * 0.9 - t * 1.7) * 0.18
                 + sin(x * 1.9 - t * 2.4) * 0.10;
          }
          void main() {
            vUv = uv;
            vec3 p = position;
            float t = uTime;
            float h = wave(p.x, p.y, t);
            p.z += h * uAmp;
            // нормаль из производных волны (мелкая рябь ловит свет)
            float e = 0.25;
            float hx = wave(p.x + e, p.y, t) - wave(p.x - e, p.y, t);
            float hz = wave(p.x, p.y + e, t) - wave(p.x, p.y - e, t);
            vNormal = normalize(vec3(-hx * uAmp, 2.0 * e, -hz * uAmp));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          uniform float uRadial;
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            float edge = 1.0;
            if (uRadial > 0.5) {
              vec2 c = vUv - 0.5;
              edge = smoothstep(0.5, 0.36, length(c));
            }
            vec3 N = normalize(vNormal);
            vec3 L = normalize(vec3(0.5, 0.9, 0.35));
            vec3 V = vec3(0.0, 1.0, 0.0);
            float diff = clamp(dot(N, L), 0.0, 1.0);
            float fres = pow(1.0 - clamp(N.y, 0.0, 1.0), 3.0);
            vec3 col = mix(uDeep, uShallow, diff * 0.55 + 0.2);
            col = mix(col, uShallow * 1.25, fres * 0.5);
            // блик солнца
            float spec = pow(clamp(dot(reflect(-L, N), V), 0.0, 1.0), 48.0);
            col += vec3(spec) * 0.7;
            gl_FragColor = vec4(col, edge * 0.9);
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
