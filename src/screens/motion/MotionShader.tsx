// src/screens/motion/MotionShader.tsx
// Ленивый чанк: r3f-холст героя. Импортируется только через lazy().
//
// ── КОНТРАКТ `pointer` (важно для Task 4) ──────────────────────────────────
// `pointer.current` — это ЖИВОЕ состояние указателя, а не «ref существует».
//   • `{ x, y }` в NDC (-1…1) — указатель активен, бугор под курсором нарастает;
//   • `null`                   — указатель НЕактивен, сила бугра лерпится назад к 0.
// Владелец рефа ОБЯЗАН выставлять `pointer.current = null`:
//   • на `pointerleave` / `mouseleave` контейнера героя;
//   • на устройствах с `(pointer: coarse)` — то есть вообще никогда не назначать
//     объект, либо сбрасывать его после тача.
// Без этого сброса затухание не наступит: раньше здесь стояло `pointer.current ? 1 : 0`,
// и бугор залипал навсегда, потому что сам объект рефа всегда истинный.
// ───────────────────────────────────────────────────────────────────────────
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  wrapEffect,
} from '@react-three/postprocessing'
import { BlendFunction, Effect, type ChromaticAberrationEffect } from 'postprocessing'
import * as THREE from 'three'
import { C } from './palette'

/** Радиус базовой сферы. Совпадает с args[0] у icosahedronGeometry. */
const R = 1.5
/**
 * Детализация икосаэдра. A/B: 24 неотличим от 48, 16 заметно фасетится.
 * 28 — с запасом над порогом различимости; снижение с 48 компенсирует
 * стоимость двух дополнительных зондов шума на вершину (см. displace()).
 */
const DETAIL = 28

const VERT = /* glsl */ `
uniform float uTime;
uniform float uPointer;     // сила искажения под курсором, 0…1 (лерпится в JS)
uniform vec3  uPointerDir;  // направление на курсор В ОБЪЕКТНОМ пространстве меша
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

// ЕДИНСТВЕННОЕ определение смещения. И основная позиция, и оба зонда для
// пересчёта нормали зовут именно её — иначе выражения расходятся при правках.
// dir — единичное направление из центра (для икосаэдра это и есть normal).
float displace(vec3 dir){
  // Слой 1+4: дыхание формы, две частоты шума в противофазе — силуэт не повторяется
  float n1 = snoise(dir * 1.4 + uTime * 0.18);
  float n2 = snoise(dir * 3.1 - uTime * 0.11);
  float d  = n1 * 0.30 + n2 * 0.12;
  // Слой 9: локальное усиление под курсором.
  // uPointerDir уже в объектном пространстве, поэтому бугор едет за курсором,
  // когда меш поворачивается (раньше сравнивали экранный вектор с object-space).
  d += uPointer * 0.35 * smoothstep(1.1, 0.0, distance(dir, uPointerDir));
  return d;
}

void main(){
  vec3 nrm = normalize(normal);

  // Касательный базис вокруг нормали — два зонда смещения по нему.
  vec3 up = abs(nrm.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(nrm, up));
  vec3 t2 = cross(nrm, t1);
  const float EPS = 0.02;
  vec3 dA = normalize(nrm + t1 * EPS);
  vec3 dB = normalize(nrm + t2 * EPS);

  float d0 = displace(nrm);
  float r  = length(position);
  vec3 P0 = nrm * (r + d0);
  vec3 PA = dA  * (r + displace(dA));
  vec3 PB = dB  * (r + displace(dB));

  // Нормаль ПОСЛЕ смещения: без этого шейдинг не видит бугров и форма
  // читается как плоский двухтоновый градиент.
  vec3 dispNormal = normalize(cross(PA - P0, PB - P0));

  vNormal = normalize(normalMatrix * dispNormal);
  vec4 mv = modelViewMatrix * vec4(P0, 1.0);
  vViewPos = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
uniform vec3 uBody;   // тёмный петроль — тело формы
uniform vec3 uGlass;  // sea glass — ТОЛЬКО ободок и блики
varying vec3 vNormal;
varying vec3 vViewPos;

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewPos);

  // Слой 2: тональная лепка тела. Держим её в тёмном конце — прежний
  // smoothstep(-1,1,n.y) по view-space нормали сажал фронтальную поверхность
  // ровно в 0.5 между двумя цветами и давал mid-teal #4f7d83.
  float ramp = smoothstep(-0.25, 0.95, n.y);
  vec3 col = uBody * (0.55 + 0.75 * ramp);

  // Слой 3: френелевский ободок — объём без источников света.
  // seaGlass живёт только здесь, поэтому и читается как ободок, а не как тело.
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.4);
  col += uGlass * fres * 1.35;

  gl_FragColor = vec4(col, 1.0);
}
`

/* ────────────────────────── Слой 15: СТАТИЧНОЕ зерно ────────────────────────
 * У postprocessing@6 NoiseEffect зашит как `rand(uv*(1.0+time))` — time там
 * безусловный, статического режима нет, а `premultiply` управляет смешиванием,
 * а не временем. Поэтому собственный Effect: хеш ТОЛЬКО от uv и resolution,
 * ни одного временнóго члена — кадр в кадр байт в байт одинаковый.
 * ------------------------------------------------------------------------- */
const GRAIN_FRAG = /* glsl */ `
// Hash without Sine (Dave Hoskins), детерминированный, без time.
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
  // resolution постоянна в пределах размера холста => зерно привязано к пикселю.
  float g = hash12(floor(uv * resolution));
  outputColor = vec4(vec3(g), inputColor.a);
}
`

class StaticGrainEffect extends Effect {
  constructor({ blendFunction = BlendFunction.SOFT_LIGHT }: { blendFunction?: BlendFunction } = {}) {
    super('StaticGrainEffect', GRAIN_FRAG, { blendFunction })
  }
}

const StaticGrain = wrapEffect(StaticGrainEffect, {
  blendFunction: BlendFunction.SOFT_LIGHT,
  opacity: 0.12,
})

/* ───────────────────── Слой 11: хроматическая аберрация ─────────────────────
 * RADIAL_MODULATION умножает сдвиг на d = clamp(distance(uv,.5)*2 - offset, 0).
 * В углу d = sqrt(2) - modulationOffset, то есть номинал ДОмодуляции надо
 * делить на этот множитель, иначе углы улетают за заявленный потолок 3px.
 * ------------------------------------------------------------------------- */
const CA_MODULATION_OFFSET = 0.3
/** Максимум d по кадру — в углу. */
const CA_CORNER_GAIN = Math.SQRT2 - CA_MODULATION_OFFSET
/** Целевой сдвиг В УГЛУ, px: покой → пик скорости скролла. Потолок 3px. */
const CA_CORNER_PX_REST = 1.5
const CA_CORNER_PX_PEAK = 3.0

/* ── Кадронезависимый лерп ───────────────────────────────────────────────
 * Голый `a += (b-a)*k` привязан к частоте кадров: на 120 Гц он сходится
 * вдвое быстрее, чем на 60 Гц, и «ощущение» отклика различается между
 * ноутбуком и ProMotion-дисплеем. Экспоненциальное сглаживание убирает эту
 * зависимость: доля = 1 - e^(-λ·dt), где λ подобрана так, чтобы при dt=1/60
 * доля равнялась прежнему коэффициенту (λ = -ln(1-k)·60).
 * ---------------------------------------------------------------------- */
const rate = (k60: number) => -Math.log(1 - k60) * 60
/** λ для прежних 0.05 (сила бугра) и 0.06 (обе оси доворота, наезд камеры). */
const LAMBDA_STRENGTH = rate(0.05)
const LAMBDA_ROT = rate(0.06)
const LAMBDA_CAM = rate(0.05)
/** dt клампится: после фонового таба приходит огромный dt, и без клампа
 *  значение прыгает к цели одним кадром. */
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * Math.min(dt, 0.1))

function Blob({ pointer, velocity }: { pointer: React.RefObject<{ x: number; y: number }>; velocity: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const strength = useRef(0)
  const invQuat = useMemo(() => new THREE.Quaternion(), [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: 0 },
      uPointerDir: { value: new THREE.Vector3(0, 0, 1) },
      // Тело — тёмный петроль: abyss, подтянутый к petrol. deepOcean/seaGlass
      // в паре давали слишком светлую середину (см. Слой 2).
      uBody: { value: new THREE.Color(C.abyss).lerp(new THREE.Color(C.petrol), 0.9) },
      uGlass: { value: new THREE.Color(C.seaGlass) },
    }),
    []
  )

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    uniforms.uTime.value = state.clock.elapsedTime

    // См. КОНТРАКТ `pointer` в шапке файла: null === указателя нет.
    const p = pointer.current
    const active = p != null
    const px = p?.x ?? 0
    const py = p?.y ?? 0

    // Слой 6: инерционное доворачивание за курсором (0.06 @60Гц, dt-нормализовано)
    const kRot = damp(LAMBDA_ROT, dt)
    m.rotation.y += ((px * 0.6) - m.rotation.y) * kRot
    m.rotation.x += ((-py * 0.4) - m.rotation.x) * kRot
    // Слой 13: быстрый скролл подкручивает форму
    m.rotation.z += dt * (0.06 + Math.min(Math.abs(velocity.current ?? 0) / 3000, 0.5))

    // Экранное направление на курсор → объектное пространство меша, иначе
    // бугор отвязывается от курсора, как только форма повернётся.
    m.getWorldQuaternion(invQuat).invert()
    uniforms.uPointerDir.value.set(px, py, 1).normalize().applyQuaternion(invQuat)

    strength.current += ((active ? 1 : 0) - strength.current) * damp(LAMBDA_STRENGTH, dt)
    uniforms.uPointer.value = strength.current
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[R, DETAIL]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

/** Позиция камеры по Z в покое (scrollY === 0). Кадрирование героя. */
const CAM_REST_Z = 5.6

function Rig() {
  useFrame((state, dt) => {
    // Слой 10: камера отъезжает при выходе из героя
    const target = CAM_REST_Z + Math.min((window.scrollY / window.innerHeight) * 3.5, 4)
    state.camera.position.z += (target - state.camera.position.z) * damp(LAMBDA_CAM, dt)
  })
  return null
}

function Aberration({ velocity }: { velocity: React.RefObject<number> }) {
  const ref = useRef<ChromaticAberrationEffect | null>(null)
  useFrame(() => {
    if (!ref.current) return
    const v = Math.min(Math.abs(velocity.current ?? 0) / 4000, 1)
    const cornerPx = CA_CORNER_PX_REST + v * (CA_CORNER_PX_PEAK - CA_CORNER_PX_REST)
    // Делим на угловое усиление: после RADIAL_MODULATION в углу получится ровно cornerPx.
    const off = cornerPx / CA_CORNER_GAIN / window.innerWidth
    ref.current.offset.set(off, off)
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
      modulationOffset={CA_MODULATION_OFFSET}
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
        {/* Слой 5: порог поднят — на 0.35 блум размывал тело и тянул его в светлое */}
        <Bloom intensity={0.6} luminanceThreshold={0.62} luminanceSmoothing={0.9} mipmapBlur />
        <Aberration velocity={velocity} />
        {/* Слой 16: мягко — углы должны сливаться с #071316, а не уходить в #000000 */}
        <Vignette eskil={false} offset={0.9} darkness={0.16} />
        {/* Слой 15: зерно статичное, см. StaticGrainEffect */}
        <StaticGrain />
      </EffectComposer>
    </Canvas>
  )
}
