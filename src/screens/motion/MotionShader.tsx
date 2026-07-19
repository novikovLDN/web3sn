// src/screens/motion/MotionShader.tsx
// Ленивый чанк: r3f-холст героя. Импортируется только через lazy().
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction, type ChromaticAberrationEffect } from 'postprocessing'
import * as THREE from 'three'
import { C } from './palette'

const VERT = /* glsl */ `
uniform float uTime;
uniform float uPointer;   // сила искажения под курсором
uniform vec3  uPointerPos;
varying vec3  vNormal;
varying vec3  vViewPos;

// 3D-симплекс-шум (Ashima, сокращённый)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 Cc = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, Cc.yyy));
  vec3 x0 = v - i + dot(i, Cc.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + Cc.xxx;
  vec3 x2 = x0 - i2 + Cc.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main(){
  vNormal = normalize(normalMatrix * normal);
  // Слой 1+4: дыхание формы, две частоты шума в противофазе — силуэт не повторяется
  float n1 = snoise(normal * 1.4 + uTime * 0.18);
  float n2 = snoise(normal * 3.1 - uTime * 0.11);
  float disp = n1 * 0.30 + n2 * 0.12;
  // Слой 9: локальное усиление под курсором
  float d = distance(normalize(position), normalize(uPointerPos));
  disp += uPointer * 0.35 * smoothstep(1.1, 0.0, d);
  vec3 pos = position + normal * disp;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uGlass;
varying vec3 vNormal;
varying vec3 vViewPos;

void main(){
  vec3 n = normalize(vNormal);
  // Слой 2: градиент вдоль нормали
  float ramp = smoothstep(-1.0, 1.0, n.y);
  vec3 col = mix(uDeep, uGlass, ramp);
  // Слой 3: френелевский ободок — объём без источников света
  float fres = pow(1.0 - max(dot(n, normalize(vViewPos)), 0.0), 2.6);
  col += uGlass * fres * 0.85;
  gl_FragColor = vec4(col, 1.0);
}
`

function Blob({ pointer, velocity }: { pointer: React.RefObject<{ x: number; y: number }>; velocity: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const strength = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: 0 },
      uPointerPos: { value: new THREE.Vector3(0, 0, 1) },
      uDeep: { value: new THREE.Color(C.deepOcean) },
      uGlass: { value: new THREE.Color(C.seaGlass) },
    }),
    []
  )

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    uniforms.uTime.value = state.clock.elapsedTime

    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    // Слой 6: инерционное доворачивание за курсором, lerp 0.06
    m.rotation.y += ((px * 0.6) - m.rotation.y) * 0.06
    m.rotation.x += ((-py * 0.4) - m.rotation.x) * 0.06
    // Слой 13: быстрый скролл подкручивает форму
    m.rotation.z += dt * (0.06 + Math.min(Math.abs(velocity.current ?? 0) / 3000, 0.5))

    uniforms.uPointerPos.value.set(px, py, 1).normalize()
    strength.current += ((pointer.current ? 1 : 0) - strength.current) * 0.05
    uniforms.uPointer.value = strength.current
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 48]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

function Rig() {
  useFrame((state) => {
    // Слой 10: камера отъезжает при выходе из героя
    const target = 4.2 + Math.min((window.scrollY / window.innerHeight) * 3.5, 4)
    state.camera.position.z += (target - state.camera.position.z) * 0.05
  })
  return null
}

function Aberration({ velocity }: { velocity: React.RefObject<number> }) {
  const ref = useRef<ChromaticAberrationEffect | null>(null)
  useFrame(() => {
    if (!ref.current) return
    // Слой 11: 1.5px в покое → максимум 3px на скорости скролла. Порог не превышаем.
    const v = Math.min(Math.abs(velocity.current ?? 0) / 4000, 1)
    const px = (1.5 + v * 1.5) / window.innerWidth
    ref.current.offset.set(px, px)
  })
  return (
    <ChromaticAberration
      // @react-three/postprocessing@2's wrapEffect() types RefAttributes<T> with T
      // being the *constructor* (typeof ChromaticAberrationEffect) instead of
      // InstanceType<T>, so the JSX `ref` prop cannot accept a real instance ref.
      // Bridge it with a callback ref so `ref.current` stays correctly typed as
      // ChromaticAberrationEffect everywhere else in this file.
      ref={(instance) => {
        ref.current = instance as unknown as ChromaticAberrationEffect | null
      }}
      blendFunction={BlendFunction.NORMAL}
      radialModulation
      modulationOffset={0.3}
    />
  )
}

export default function MotionShader({
  pointer,
  velocity,
  onReady,
}: {
  pointer: React.RefObject<{ x: number; y: number }>
  velocity: React.RefObject<number>
  onReady: () => void
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(C.abyss)
        onReady()
      }}
    >
      <Blob pointer={pointer} velocity={velocity} />
      <Rig />
      <EffectComposer>
        {/* Слой 5 */}
        <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
        <Aberration velocity={velocity} />
        {/* Слой 16 */}
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
        {/* Слой 15: зерно СТАТИЧНОЕ — premultiply без анимации времени */}
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      </EffectComposer>
    </Canvas>
  )
}
