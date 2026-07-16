import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import * as THREE from 'three'
import World from './World'
import Player from './Player'
import Props from './Props'
import Grass from './Grass'
import Vegetation from './Vegetation'
import Water, { type SplashHandle } from './Water'
import Boat from './Boat'
import { SEA_Z, HALF } from './playerState'

/* ── Клавиатура (через ref, без ре-рендеров) ──────────────────── */
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

/* ── Pointer-lock + мышь → поворот камеры ─────────────────────── */
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

    const onClick = () => {
      if (!document.pointerLockElement) canvas.requestPointerLock()
    }
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      yaw.current -= e.movementX * 0.0022
      pitch.current = Math.max(
        -0.15,
        Math.min(1.1, pitch.current + e.movementY * 0.0022)
      )
    }
    const onLock = () => onLockChange(document.pointerLockElement === canvas)

    canvas.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('pointerlockchange', onLock)
    return () => {
      canvas.removeEventListener('click', onClick)
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
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const enterGame = () => canvasEl.current?.requestPointerLock()

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 5, 13], fov: 60, near: 0.1, far: 300 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          canvasEl.current = gl.domElement
        }}
      >
        <Sky sunPosition={[60, 40, 30]} turbidity={5} rayleigh={1.1} mieCoefficient={0.005} />
        <fog attach="fog" args={['#bcd4e6', 70, 150]} />

        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#cfe6ff', '#4a5a3a', 0.6]} />
        <directionalLight
          position={[30, 40, 20]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-60, 60, 60, -60, 0.1, 180]}
          />
        </directionalLight>

        <Physics gravity={[0, -22, 0]}>
          <World />
          <Props />
          <Boat position={[-14, 0, SEA_Z + (HALF - SEA_Z) / 2]} />
          <Player keys={keys} yaw={yaw} pitch={pitch} splash={splash} />
        </Physics>

        {/* Трава, растительность и вода — визуальные слои */}
        <Grass />
        <Vegetation />
        <Water apiRef={splash} />

        <LookControls yaw={yaw} pitch={pitch} onLockChange={setPlaying} />
      </Canvas>

      {/* Прицел по центру */}
      {playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow" />
        </div>
      )}

      {/* Оверлей-подсказка (клик = вход в игру / захват мыши) */}
      {!playing && (
        <button
          onClick={enterGame}
          className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] cursor-pointer"
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
                <b className="font-medium">Мышь</b> — камера ·{' '}
                <b className="font-medium">Esc</b> — выход (мышь освобождается)
              </p>
              <p className="text-[#9aa3af] mt-2">
                Мир 100×100 · море и кораблик · озеро · карьеры с рудой ·
                толкайте ящики и машинки
              </p>
            </div>
          </div>
        </button>
      )}

      {/* HUD при игре */}
      {playing && (
        <div className="absolute top-4 left-4 pointer-events-none text-[#e6ebf2]/80 text-xs uppercase tracking-widest space-y-0.5">
          <p>WASD · Пробел · Shift</p>
          <p className="text-[#9aa3af]">Esc — выход</p>
        </div>
      )}
    </div>
  )
}
