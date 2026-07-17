import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import Terrain from './Terrain'
import Ocean from './Ocean'
import Vegetation from './Vegetation'
import Structures from './Structures'
import Collectibles from './Collectibles'
import Player from './Player'
import Particles, { type ParticleHandle } from './Particles'
import TouchControls from './TouchControls'
import { world } from './state'
import { PAL, SUN_POS, SEA_LEVEL, TUNE } from './config'
import { QUALITY } from './quality'

type Phase = 'menu' | 'playing' | 'paused'

/** Отладочный облёт острова сверху (URL ?over) — для проверки сцены. */
function OverCam() {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.1
    camera.position.set(Math.sin(t) * 95, 70, Math.cos(t) * 95)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function useInput() {
  const keys = useRef<Record<string, boolean>>({})
  useEffect(() => {
    const d = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'Space' && document.pointerLockElement) e.preventDefault()
    }
    const u = (e: KeyboardEvent) => (keys.current[e.code] = false)
    window.addEventListener('keydown', d)
    window.addEventListener('keyup', u)
    return () => {
      window.removeEventListener('keydown', d)
      window.removeEventListener('keyup', u)
    }
  }, [])
  return keys
}

/** HUD: счётчик кристаллов, подписан на состояние мира. */
function Hud() {
  const [, force] = useState(0)
  useEffect(() => world.subscribe(() => force((n) => n + 1)), [])
  return (
    <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur px-4 py-2">
      <span className="text-[#4af0d0] text-lg">◆</span>
      <span className="text-white font-bold tabular-nums">
        {world.score}
        <span className="text-white/50 font-normal"> / {world.totalGems}</span>
      </span>
    </div>
  )
}

export default function Game({ onExit }: { onExit?: () => void }) {
  const keys = useInput()
  const yaw = useRef(Math.PI) // старт лицом к острову (игрок на южном пляже)
  const pitch = useRef(0.32)
  const particles = useRef<ParticleHandle | null>(null)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const params = useMemo(
    () => (typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams()),
    []
  )
  const over = params.has('over')
  const noOcean = params.has('noocean')
  const [phase, setPhase] = useState<Phase>('menu')
  const phaseRef = useRef<Phase>('menu')
  phaseRef.current = phase
  useEffect(() => {
    world.active = phase === 'playing'
  }, [phase])

  const lockPointer = () => {
    try {
      const r = canvasEl.current?.requestPointerLock() as unknown as Promise<void> | undefined
      if (r && typeof r.catch === 'function') r.catch(() => {})
    } catch {
      /* noop */
    }
  }
  const toggleFullscreen = () => {
    const el = rootRef.current
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }
  const startPlay = () => {
    setPhase('playing')
    lockPointer()
  }
  const openPause = () => {
    setPhase('paused')
    try {
      document.exitPointerLock?.()
    } catch {
      /* noop */
    }
  }
  const exitGame = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.()
    } catch {
      /* noop */
    }
    onExit?.()
  }

  // ESC / потеря захвата курсора → пауза (курсор снова доступен).
  useEffect(() => {
    const onLockChange = () => {
      if (!document.pointerLockElement && phaseRef.current === 'playing') {
        setPhase('paused')
      }
    }
    document.addEventListener('pointerlockchange', onLockChange)
    return () => document.removeEventListener('pointerlockchange', onLockChange)
  }, [])

  // Мышь (desktop, pointer lock).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      yaw.current -= e.movementX * TUNE.mouseSens
      pitch.current = Math.max(-0.15, Math.min(0.95, pitch.current + e.movementY * TUNE.mouseSens))
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  // Тач-обзор: перетаскивание правой половины экрана вращает камеру.
  useEffect(() => {
    let lx = 0
    let ly = 0
    let tracking = false
    const isLook = (t: Touch) => t.clientX > window.innerWidth / 2
    const start = (e: TouchEvent) => {
      const t = Array.from(e.touches).find(isLook)
      if (!t) return
      tracking = true
      lx = t.clientX
      ly = t.clientY
    }
    const move = (e: TouchEvent) => {
      if (!tracking) return
      const t = Array.from(e.touches).find(isLook)
      if (!t) return
      yaw.current -= (t.clientX - lx) * 0.006
      pitch.current = Math.max(-0.15, Math.min(0.95, pitch.current + (t.clientY - ly) * 0.006))
      lx = t.clientX
      ly = t.clientY
    }
    const end = () => (tracking = false)
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', end)
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
    }
  }, [])

  const started = useMemo(() => phase === 'playing', [phase])

  // Пауза рендера, когда canvas вне экрана — иначе WebGL молотит впустую (тормоза).
  const [onScreen, setOnScreen] = useState(true)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver((e) => setOnScreen(e[0].isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="relative w-full h-full select-none bg-[#0b1016]">
      <Canvas
        shadows={QUALITY.shadows}
        frameloop={onScreen ? 'always' : 'never'}
        dpr={[1, QUALITY.dpr]}
        gl={{ antialias: !QUALITY.low, powerPreference: 'high-performance' }}
        camera={{ position: [0, 12, 18], fov: 52, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.12
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          canvasEl.current = gl.domElement
        }}
      >
        <Sky sunPosition={SUN_POS} turbidity={3} rayleigh={0.6} mieCoefficient={0.003} mieDirectionalG={0.9} />
        <fog attach="fog" args={[PAL.fog, 120, 300]} />
        <ambientLight intensity={0.38} color={PAL.ambientSky} />
        <hemisphereLight args={[PAL.ambientSky, PAL.ambientGround, 0.75]} />
        <directionalLight
          position={SUN_POS}
          intensity={2.7}
          color={PAL.sun}
          castShadow={QUALITY.shadows}
          shadow-mapSize={[QUALITY.shadowMap, QUALITY.shadowMap]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.04}
        >
          <orthographicCamera attach="shadow-camera" args={[-70, 70, 70, -70, 0.1, 220]} />
        </directionalLight>

        <Physics gravity={[0, -TUNE.gravity, 0]} timeStep="vary">
          <Terrain />
          <Player
            keys={keys}
            yaw={yaw}
            pitch={pitch}
            controlCam={!over}
            onSplash={(x, z, p) => particles.current?.burst(x, SEA_LEVEL + 0.1, z, PAL.waterFoam, p)}
            onLand={(x, y, z, p) => particles.current?.burst(x, y, z, '#cbb98a', p)}
            onStep={(x, y, z) => particles.current?.burst(x, y, z, '#cbb98a', 0.25)}
          />
        </Physics>

        {over && <OverCam />}
        {!noOcean && <Ocean />}
        <Vegetation />
        <Structures />
        <Collectibles />
        <Particles apiRef={particles} />

        {QUALITY.postfx && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.75} luminanceSmoothing={0.3} radius={0.7} />
            <Vignette eskil={false} offset={0.32} darkness={0.55} />
            <SMAA />
          </EffectComposer>
        )}
      </Canvas>

      <Hud />

      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {phase === 'playing' && (
          <button
            onClick={openPause}
            aria-label="Меню (Esc)"
            className="w-10 h-10 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-white/80 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          </button>
        )}
        <button
          onClick={toggleFullscreen}
          aria-label="Полный экран"
          className="w-10 h-10 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-white/80 flex items-center justify-center"
        >
          ⛶
        </button>
      </div>

      {started && <TouchControls keys={keys} />}

      {phase === 'menu' && (
        <button
          onClick={startPlay}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px]"
        >
          <p className="accent-text font-bold uppercase tracking-tight text-4xl sm:text-6xl mb-3">Остров</p>
          <p className="text-[#c3cbd6] mb-8 max-w-md text-center px-6">
            WASD — движение, мышь — камера, Shift — бег, Пробел — прыжок / всплыть.
            Соберите все кристаллы, исследуйте холмы и поплавайте в море.
          </p>
          <span
            className="rounded-full px-10 py-4 font-medium uppercase tracking-widest"
            style={{
              background: 'var(--accent)',
              color: 'var(--ink)',
              boxShadow: '0px 6px 20px -6px rgba(239,74,35,0.6)',
            }}
          >
            ▶ Играть
          </span>
        </button>
      )}

      {phase === 'paused' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[3px]">
          <p className="accent-text font-bold uppercase tracking-tight text-4xl sm:text-5xl mb-2">Пауза</p>
          <p className="text-[#c3cbd6] mb-8 text-sm uppercase tracking-widest">
            Собрано кристаллов: {world.score} / {world.totalGems}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startPlay}
              className="rounded-full px-8 py-3.5 font-medium uppercase tracking-widest"
              style={{ background: 'var(--accent)', color: 'var(--ink)', boxShadow: '0px 6px 20px -6px rgba(239,74,35,0.6)' }}
            >
              ▶ Продолжить
            </button>
            <button
              onClick={exitGame}
              className="rounded-full px-8 py-3.5 font-medium uppercase tracking-widest border border-white/25 text-white/85 hover:bg-white/10 transition-colors"
            >
              Выход
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
