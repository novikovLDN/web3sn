import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  ContactShadows,
  RoundedBox,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ── утилиты ──────────────────────────────────────────────────── */
const smooth = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Тайминг цикла: покой 10c → наклон 1.25c → печать 5c → возврат 1.25c
const IDLE = 10
const LEAN = 1.25
const TYPE = 5
const RET = 1.25
const CYCLE = IDLE + LEAN + TYPE + RET

/** Возвращает прогресс наклона 0..1 и активность печати 0/1 по времени */
function phaseAt(t: number) {
  const p = t % CYCLE
  if (p < IDLE) return { lean: 0, typing: 0 }
  if (p < IDLE + LEAN) return { lean: smooth((p - IDLE) / LEAN), typing: 0 }
  if (p < IDLE + LEAN + TYPE) return { lean: 1, typing: 1 }
  return { lean: 1 - smooth((p - IDLE - LEAN - TYPE) / RET), typing: 0 }
}

/* ── материалы ────────────────────────────────────────────────── */
const skin = { color: '#c98f6b', roughness: 0.72, metalness: 0 }
const hoodie = { color: '#2b3040', roughness: 0.85, metalness: 0.02 }
const hoodieDark = { color: '#20242f', roughness: 0.9, metalness: 0 }
const pants = { color: '#23272f', roughness: 0.9, metalness: 0 }

/* ── персонаж ─────────────────────────────────────────────────── */
function Developer({ reduced }: { reduced: boolean }) {
  const hips = useRef<THREE.Group>(null)
  const chest = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const foreL = useRef<THREE.Group>(null)
  const foreR = useRef<THREE.Group>(null)
  const handL = useRef<THREE.Group>(null)
  const handR = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  const screenLight = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = reduced ? 12 : clock.getElapsedTime()
    const { lean, typing } = phaseAt(t)
    const idle = 1 - lean

    // Покачивание (только в покое), плавный наклон корпуса вперёд
    if (hips.current) {
      hips.current.rotation.x = lean * 0.34
      hips.current.rotation.z = reduced ? 0 : Math.sin(t * 0.9) * 0.05 * idle
      hips.current.position.z = lean * 0.06
    }
    if (chest.current) {
      // лёгкое «дыхание»
      const breathe = reduced ? 0 : Math.sin(t * 1.6) * 0.012
      chest.current.scale.y = 1 + breathe
      chest.current.rotation.x = lean * 0.12
    }
    if (head.current) {
      head.current.rotation.x =
        lean * 0.16 + (typing ? Math.sin(t * 3.1) * 0.03 : 0)
      head.current.rotation.y = reduced ? 0 : Math.sin(t * 0.5) * 0.05 * idle
    }

    // Руки: интерполяция между позой покоя и печатью
    const tapL = typing ? Math.sin(t * 17) * 0.06 : 0
    const tapR = typing ? Math.sin(t * 17 + 1.7) * 0.06 : 0
    if (armL.current) armL.current.rotation.x = lerp(-0.15, -1.02, lean)
    if (armR.current) armR.current.rotation.x = lerp(-0.15, -1.02, lean)
    if (foreL.current) foreL.current.rotation.x = lerp(-0.35, -0.62, lean) + tapL
    if (foreR.current) foreR.current.rotation.x = lerp(-0.35, -0.62, lean) + tapR
    if (handL.current) handL.current.position.y = tapL * 0.15
    if (handR.current) handR.current.position.y = tapR * 0.15

    // Свечение экрана: «дыхание» + мерцание при печати
    const base = 1.5 + Math.sin(t * 2) * 0.35
    const flick = typing ? Math.sin(t * 30) * 0.4 : 0
    if (screenMat.current) screenMat.current.emissiveIntensity = base + flick
    if (screenLight.current) screenLight.current.intensity = 2.2 + flick
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Ноги (статичны) */}
      <group position={[0, 0.5, 0]}>
        {/* бёдра */}
        <mesh position={[0.14, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.34, 8, 20]} />
          <meshStandardMaterial {...pants} />
        </mesh>
        <mesh position={[-0.14, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.34, 8, 20]} />
          <meshStandardMaterial {...pants} />
        </mesh>
        {/* голени */}
        <mesh position={[0.14, -0.28, 0.38]} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 8, 20]} />
          <meshStandardMaterial {...pants} />
        </mesh>
        <mesh position={[-0.14, -0.28, 0.38]} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 8, 20]} />
          <meshStandardMaterial {...pants} />
        </mesh>
        {/* ботинки */}
        <RoundedBox args={[0.16, 0.1, 0.26]} radius={0.04} smoothness={4} position={[0.14, -0.5, 0.5]} castShadow>
          <meshStandardMaterial color="#15181f" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.1, 0.26]} radius={0.04} smoothness={4} position={[-0.14, -0.5, 0.5]} castShadow>
          <meshStandardMaterial color="#15181f" roughness={0.6} />
        </RoundedBox>
      </group>

      {/* Таз-пивот для наклона/качания */}
      <group ref={hips} position={[0, 0.5, 0]}>
        {/* Торс */}
        <group ref={chest} position={[0, 0.02, 0]}>
          <mesh position={[0, 0.26, 0]} castShadow>
            <capsuleGeometry args={[0.19, 0.3, 12, 24]} />
            <meshStandardMaterial {...hoodie} />
          </mesh>
          {/* капюшон-воротник */}
          <mesh position={[0, 0.44, -0.02]} castShadow>
            <torusGeometry args={[0.12, 0.06, 16, 32]} />
            <meshStandardMaterial {...hoodieDark} />
          </mesh>

          {/* Голова */}
          <group ref={head} position={[0, 0.58, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.17, 40, 40]} />
              <meshStandardMaterial {...skin} />
            </mesh>
            {/* волосы/шапочка */}
            <mesh position={[0, 0.06, -0.02]} castShadow>
              <sphereGeometry args={[0.172, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial {...hoodieDark} />
            </mesh>
            {/* наушники */}
            <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.175, 0.018, 12, 40, Math.PI]} />
              <meshStandardMaterial color="#1b1e26" roughness={0.5} metalness={0.3} />
            </mesh>
            <mesh position={[0.17, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 24]} />
              <meshStandardMaterial color="#1b1e26" roughness={0.5} metalness={0.3} />
            </mesh>
            <mesh position={[-0.17, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 24]} />
              <meshStandardMaterial color="#1b1e26" roughness={0.5} metalness={0.3} />
            </mesh>
          </group>

          {/* Левая рука (плечо → предплечье → кисть) */}
          <group ref={armL} position={[-0.22, 0.4, 0.04]}>
            <mesh position={[0, -0.14, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.22, 8, 18]} />
              <meshStandardMaterial {...hoodie} />
            </mesh>
            <group ref={foreL} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.13, 0.02]} rotation={[0.2, 0, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.2, 8, 18]} />
                <meshStandardMaterial {...hoodie} />
              </mesh>
              <group ref={handL} position={[0, -0.27, 0.06]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.065, 20, 20]} />
                  <meshStandardMaterial {...skin} />
                </mesh>
              </group>
            </group>
          </group>

          {/* Правая рука */}
          <group ref={armR} position={[0.22, 0.4, 0.04]}>
            <mesh position={[0, -0.14, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.22, 8, 18]} />
              <meshStandardMaterial {...hoodie} />
            </mesh>
            <group ref={foreR} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.13, 0.02]} rotation={[0.2, 0, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.2, 8, 18]} />
                <meshStandardMaterial {...hoodie} />
              </mesh>
              <group ref={handR} position={[0, -0.27, 0.06]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.065, 20, 20]} />
                  <meshStandardMaterial {...skin} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* MacBook на столе */}
      <group position={[0, 0.79, 0.62]}>
        {/* база-клавиатура */}
        <RoundedBox args={[0.5, 0.02, 0.34]} radius={0.01} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#3a4150" roughness={0.35} metalness={0.85} />
        </RoundedBox>
        {/* трекпад */}
        <mesh position={[0, 0.012, 0.09]}>
          <boxGeometry args={[0.16, 0.001, 0.1]} />
          <meshStandardMaterial color="#2c313c" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* крышка с экраном */}
        <group position={[0, 0.01, -0.17]} rotation={[-1.92, 0, 0]}>
          <RoundedBox args={[0.5, 0.34, 0.014]} radius={0.008} smoothness={4} position={[0, 0.17, 0]} castShadow>
            <meshStandardMaterial color="#2a2f3a" roughness={0.4} metalness={0.85} />
          </RoundedBox>
          {/* светящаяся матрица */}
          <mesh position={[0, 0.17, 0.009]}>
            <planeGeometry args={[0.46, 0.3]} />
            <meshStandardMaterial
              ref={screenMat}
              color="#0a0e14"
              emissive="#7fc8ff"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
          {/* «строки кода» на экране */}
          {[
            { y: 0.25, w: 0.3, c: '#8ad8ff' },
            { y: 0.22, w: 0.2, c: '#c58bff' },
            { y: 0.19, w: 0.26, c: '#ff9d6b' },
            { y: 0.16, w: 0.16, c: '#8ad8ff' },
            { y: 0.13, w: 0.22, c: '#7de0c0' },
            { y: 0.1, w: 0.14, c: '#c58bff' },
          ].map((l, i) => (
            <mesh key={i} position={[-0.23 + l.w / 2 + 0.02, l.y, 0.0102]}>
              <planeGeometry args={[l.w, 0.012]} />
              <meshStandardMaterial color={l.c} emissive={l.c} emissiveIntensity={2} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Свет от экрана на персонажа */}
      <pointLight
        ref={screenLight}
        position={[0, 1.05, 0.5]}
        intensity={2.2}
        distance={2.4}
        color="#8fc8ff"
      />
    </group>
  )
}

/* ── окружение сцены (стол, кресло, реквизит) ─────────────────── */
function Room() {
  return (
    <group>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0e0f13" roughness={0.95} metalness={0} />
      </mesh>

      {/* Стол */}
      <group position={[0, 0.76, 0.66]}>
        <RoundedBox args={[1.7, 0.05, 0.78]} radius={0.02} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#191b22" roughness={0.5} metalness={0.4} />
        </RoundedBox>
        {[
          [-0.8, -0.32],
          [0.8, -0.32],
          [-0.8, 0.32],
          [0.8, 0.32],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.4, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.76, 16]} />
            <meshStandardMaterial color="#101116" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Кресло */}
      <group position={[0, 0, -0.05]}>
        {/* сиденье */}
        <RoundedBox args={[0.56, 0.1, 0.5]} radius={0.06} smoothness={4} position={[0, 0.45, 0.12]} castShadow>
          <meshStandardMaterial color="#191c24" roughness={0.7} metalness={0.1} />
        </RoundedBox>
        {/* спинка */}
        <RoundedBox args={[0.54, 0.7, 0.1]} radius={0.06} smoothness={4} position={[0, 0.85, -0.14]} rotation={[0.12, 0, 0]} castShadow>
          <meshStandardMaterial color="#1c2028" roughness={0.7} metalness={0.1} />
        </RoundedBox>
        {/* стойка */}
        <mesh position={[0, 0.24, 0.12]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 20]} />
          <meshStandardMaterial color="#0d0e12" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* крестовина */}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.sin(a) * 0.22, 0.05, 0.12 + Math.cos(a) * 0.22]} rotation={[0, -a, 0]} castShadow>
              <boxGeometry args={[0.06, 0.05, 0.28]} />
              <meshStandardMaterial color="#0d0e12" roughness={0.4} metalness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* Кружка (уют) */}
      <group position={[0.62, 0.82, 0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 24]} />
          <meshStandardMaterial color="#c8452f" roughness={0.4} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.03, 0.008, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#c8452f" roughness={0.4} />
        </mesh>
      </group>

      {/* Растение (уют) */}
      <group position={[-0.66, 0.82, 0.58]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.1, 20]} />
          <meshStandardMaterial color="#2b2f3a" roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.sin(a) * 0.03, 0.12, Math.cos(a) * 0.03]} rotation={[0.3, a, 0]} castShadow>
              <capsuleGeometry args={[0.012, 0.14, 6, 10]} />
              <meshStandardMaterial color="#3e6b4a" roughness={0.7} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/* ── камера с лёгким параллаксом ──────────────────────────────── */
function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame(({ clock, camera, pointer }) => {
    const t = reduced ? 0 : clock.getElapsedTime()
    const targetX = 2.9 + Math.sin(t * 0.18) * 0.25 + pointer.x * 0.35
    const targetY = 1.55 + pointer.y * 0.2
    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.position.z = 3.1
    camera.lookAt(0, 1.0, 0.3)
  })
  return null
}

/* ── корневой компонент ───────────────────────────────────────── */
export default function Workspace3D() {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [2.9, 1.55, 3.1], fov: 38, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <color attach="background" args={['#0b0c10']} />
      <fog attach="fog" args={['#0b0c10', 6, 14]} />

      {/* Освещение */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
      </directionalLight>
      {/* тёплый контровой (лампа) */}
      <spotLight position={[-3, 4, 1]} angle={0.6} penumbra={0.8} intensity={1.4} color="#ffca80" />

      <Developer reduced={reduced} />
      <Room />

      <ContactShadows position={[0, 0.01, 0.3]} opacity={0.55} scale={6} blur={2.4} far={4} resolution={1024} color="#000000" />

      {/* Студийное окружение для отражений (без внешних файлов) */}
      <Environment resolution={256}>
        <Lightformer intensity={1.2} form="rect" position={[0, 4, 2]} scale={[6, 3, 1]} color="#aecbff" />
        <Lightformer intensity={0.7} form="rect" position={[-4, 2, 2]} scale={[3, 3, 1]} color="#ffd7a8" />
        <Lightformer intensity={0.9} form="ring" position={[3, 2, -2]} scale={[2, 2, 1]} color="#8fc8ff" />
      </Environment>

      <CameraRig reduced={reduced} />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.3} radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}
