import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WATER } from './playerState'

/* Волновая поверхность воды на кастомном шейдере (gerstner-подобные волны) */
function WaterSurface() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color('#0e4d6b') },
      uColorShallow: { value: new THREE.Color('#3ba7c4') },
      uFoam: { value: new THREE.Color('#dff4ff') },
    }),
    []
  )

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt
  })

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[WATER.cx, WATER.level, WATER.cz]}
    >
      <planeGeometry args={[WATER.rx * 2, WATER.rz * 2, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w =
              sin(p.x * 0.7 + uTime * 1.6) * 0.09 +
              sin(p.y * 0.9 + uTime * 1.2) * 0.07 +
              sin((p.x + p.y) * 0.5 + uTime * 2.1) * 0.05;
            p.z += w;
            vWave = w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorDeep;
          uniform vec3 uColorShallow;
          uniform vec3 uFoam;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            // радиальное затухание к краям пруда (мягкая кромка)
            vec2 c = vUv - 0.5;
            float edge = smoothstep(0.5, 0.34, length(c));
            float depth = smoothstep(-0.1, 0.15, vWave);
            vec3 col = mix(uColorDeep, uColorShallow, depth);
            // пена на гребнях
            float foam = smoothstep(0.11, 0.15, vWave);
            col = mix(col, uFoam, foam * 0.6);
            float alpha = edge * 0.86;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  )
}

/* Брызги: пул частиц, вылетают при всплеске */
const MAX = 60
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

  const positions = useMemo(() => new Float32Array(MAX * 3), [])

  apiRef.current = {
    burst: (x, z, power) => {
      let spawned = 0
      for (const p of state.current) {
        if (p.life > 0) continue
        const a = Math.random() * Math.PI * 2
        const sp = 1.5 + Math.random() * 2.5 * power
        p.life = 0.6 + Math.random() * 0.4
        p.x = x + (Math.random() - 0.5) * 0.6
        p.y = WATER.level
        p.z = z + (Math.random() - 0.5) * 0.6
        p.vx = Math.cos(a) * sp * 0.5
        p.vz = Math.sin(a) * sp * 0.5
        p.vy = 2.5 + Math.random() * 2.5 * power
        if (++spawned >= 22) break
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
        p.vy -= 9 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt
        if (p.y < WATER.level) p.life = 0
        any = true
      }
      positions[i * 3] = p.life > 0 ? p.x : 9999
      positions[i * 3 + 1] = p.life > 0 ? p.y : 9999
      positions[i * 3 + 2] = p.life > 0 ? p.z : 9999
    })
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.array = positions
    attr.needsUpdate = true
    pts.visible = any
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#e8f7ff"
        transparent
        opacity={0.9}
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
  return (
    <group>
      {/* дно пруда */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[WATER.cx, -0.9, WATER.cz]}
        receiveShadow
      >
        <planeGeometry args={[WATER.rx * 2, WATER.rz * 2]} />
        <meshStandardMaterial color="#18465a" roughness={1} />
      </mesh>
      <WaterSurface />
      <Splash apiRef={apiRef} />
    </group>
  )
}
