import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import World from './World'
import Player from './Player'
import Props from './Props'
import Cars from './Cars'
import Grass from './Grass'
import Vegetation from './Vegetation'
import Water, { type SplashHandle } from './Water'
import Dust, { type DustHandle } from './Dust'
import Boat from './Boat'
import Clouds from './Clouds'
import Structures from './Structures'
import Animals from './Animals'
import { SEA_Z, HALF, playerState } from './playerState'
import { SKINS } from './skins'

type Phase = 'select' | 'ready' | 'playing' | 'paused'

/* ── Клавиатура ───────────────────────────────────────────────── */
function useKeyboard() {
  const keys = useRef<Record<string, boolean>>({})
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (
        (e.code === 'Space' || e.code.startsWith('Arrow')) &&
        document.pointerLockElement
      )
        e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])
  return keys
}

/* ── Debug-камера (для скриншотов разработки, ?debuggame=1) ────── */
function DebugCam() {
  const { camera } = useThree()
  useFrame(() => {
    const q = new URLSearchParams(location.search)
    const tx = +(q.get('cx') ?? 0)
    const tz = +(q.get('cz') ?? 0)
    const ty = +(q.get('cy') ?? 1)
    const r = +(q.get('r') ?? 46)
    const h = +(q.get('h') ?? 30)
    const ang = +(q.get('ang') ?? 0.7)
    camera.position.set(tx + Math.sin(ang) * r, h, tz + Math.cos(ang) * r)
    camera.lookAt(tx, ty, tz)
  })
  return null
}

/* ── Мышь → камера + отслеживание захвата ─────────────────────── */
function LookControls({
  yaw,
  pitch,
  onLockChange,
}: {
  yaw: React.MutableRefObject<number>
  pitch: React.MutableRefObject<number>
  onLockChange: (v: boolean) => void
}) {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      yaw.current -= e.movementX * 0.0022
      pitch.current = Math.max(
        -0.15,
        Math.min(1.1, pitch.current + e.movementY * 0.0022)
      )
    }
    const onLock = () => onLockChange(document.pointerLockElement === canvas)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('pointerlockchange', onLock)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerlockchange', onLock)
    }
  }, [gl, yaw, pitch, onLockChange])
  return null
}

export default function MiniGame() {
  const keys = useKeyboard()
  const yaw = useRef(0)
  const pitch = useRef(0.4)
  const splash = useRef<SplashHandle | null>(null)
  const dust = useRef<DustHandle | null>(null)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)

  const debug =
    typeof location !== 'undefined' &&
    new URLSearchParams(location.search).has('debuggame')
  const [phase, setPhase] = useState<Phase>(debug ? 'playing' : 'select')
  const [skinIndex, setSkinIndex] = useState(0)
  const phaseRef = useRef<Phase>('select')
  phaseRef.current = phase

  // активность управления только в игре
  useEffect(() => {
    playerState.active = phase === 'playing'
  }, [phase])

  const lockPointer = () => canvasEl.current?.requestPointerLock()
  const exitPointer = () => {
    if (document.pointerLockElement) document.exitPointerLock()
  }

  const onLockChange = (locked: boolean) => {
    if (locked) setPhase('playing')
    else if (phaseRef.current === 'playing') setPhase('paused')
  }

  const chooseSkin = (i: number) => {
    setSkinIndex(i)
    setPhase('ready')
  }
  const exitToSite = () => {
    exitPointer()
    setPhase('ready')
  }

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 5, 13], fov: 60, near: 0.1, far: 300 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          canvasEl.current = gl.domElement
        }}
      >
        <Sky sunPosition={[60, 40, 30]} turbidity={4} rayleigh={1.0} mieCoefficient={0.004} />
        <fog attach="fog" args={['#c4d8e8', 130, 300]} />

        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#cfe6ff', '#4a5a3a', 0.6]} />
        <directionalLight
          position={[30, 40, 20]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        >
          <orthographicCamera attach="shadow-camera" args={[-90, 90, 90, -90, 0.1, 220]} />
        </directionalLight>

        <Physics gravity={[0, -22, 0]}>
          <World />
          <Props />
          <Structures />
          <Cars keys={keys} skin={SKINS[skinIndex]} yaw={yaw} />
          <Animals />
          <Boat position={[-14, 0, SEA_Z + (HALF - SEA_Z) / 2]} />
          <Player keys={keys} yaw={yaw} pitch={pitch} splash={splash} dust={dust} skin={SKINS[skinIndex]} debug={debug} />
        </Physics>

        <Grass />
        <Vegetation />
        <Water apiRef={splash} />
        <Dust apiRef={dust} />
        <Clouds />

        {debug && <DebugCam />}
        <LookControls yaw={yaw} pitch={pitch} onLockChange={onLockChange} />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.78} luminanceSmoothing={0.28} radius={0.6} />
          <Vignette eskil={false} offset={0.26} darkness={0.72} />
          <SMAA />
        </EffectComposer>
      </Canvas>

      {/* Прицел */}
      {phase === 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow" />
        </div>
      )}

      {/* HUD */}
      {phase === 'playing' && (
        <div className="absolute top-4 left-4 pointer-events-none text-[#e6ebf2]/85 text-xs uppercase tracking-widest space-y-0.5">
          <p>WASD · Пробел · Shift</p>
          <p>F — сесть / выйти из машины</p>
          <p className="text-[#9aa3af]">Esc — меню</p>
        </div>
      )}

      {/* Выбор персонажа */}
      {phase === 'select' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm px-6">
          <p className="accent-text font-bold uppercase tracking-tight text-3xl sm:text-4xl mb-8">
            Выберите персонажа
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {SKINS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => chooseSkin(i)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[#D7E2EA]/15 bg-white/5 hover:bg-white/10 p-5 transition-colors"
              >
                <span
                  className="w-16 h-16 rounded-xl border-2"
                  style={{ background: s.shirt, borderColor: s.shirt2 }}
                />
                <span className="text-[#e6ebf2] text-sm font-medium">{s.name}</span>
                <span className="text-[#9aa3af] text-xs">
                  {s.female ? 'жен.' : 'муж.'}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[#9aa3af] text-xs uppercase tracking-widest">
            Мир 100×100 · машины · море и кораблик · карьеры с рудой
          </p>
        </div>
      )}

      {/* Старт: клик = играть */}
      {phase === 'ready' && (
        <button
          onClick={lockPointer}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
        >
          <div className="text-center px-6">
            <p className="accent-text font-bold uppercase tracking-tight text-3xl sm:text-4xl mb-4">
              ▶ Кликните, чтобы играть
            </p>
            <div className="text-[#e6ebf2] text-sm sm:text-base font-light space-y-1">
              <p>
                <b className="font-medium">WASD</b> — движение ·{' '}
                <b className="font-medium">Shift</b> — бег ·{' '}
                <b className="font-medium">Пробел</b> — прыжок / плыть
              </p>
              <p>
                <b className="font-medium">F</b> — сесть в машину ·{' '}
                <b className="font-medium">Мышь</b> — камера ·{' '}
                <b className="font-medium">Esc</b> — меню
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Меню-пауза (Esc) */}
      {phase === 'paused' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <p className="accent-text font-bold uppercase tracking-tight text-3xl sm:text-4xl mb-8">
            Пауза
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={lockPointer}
              className="rounded-full py-3 text-white font-medium uppercase tracking-widest text-sm"
              style={{
                background:
                  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                boxShadow: '4px 4px 12px #7721B1 inset',
                outline: '2px solid #FFFFFF',
                outlineOffset: '-3px',
              }}
            >
              Продолжить
            </button>
            <button
              onClick={() => setPhase('select')}
              className="rounded-full py-3 border-2 border-[#D7E2EA]/40 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm hover:bg-white/5 transition-colors"
            >
              Сменить персонажа
            </button>
            <button
              onClick={exitToSite}
              className="rounded-full py-3 border-2 border-[#e0473c]/50 text-[#f0a59d] font-medium uppercase tracking-widest text-sm hover:bg-[#e0473c]/10 transition-colors"
            >
              Выйти из игры
            </button>
          </div>
          <p className="text-[#9aa3af] text-xs uppercase tracking-widest mt-6">
            Esc снова — вернуться в игру нельзя, нажмите «Продолжить»
          </p>
        </div>
      )}
    </div>
  )
}
