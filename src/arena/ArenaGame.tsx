import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import Arena from './Arena'
import Hero, { type HeroStats } from './Hero'
import Enemies from './Enemies'
import Bullets from './Bullets'
import { store, ARENA_R, type EnemyType } from './store'
import Dust, { type DustHandle } from '../game/Dust'
import { SKINS } from '../game/skins'

type Phase = 'menu' | 'playing' | 'waveclear' | 'over'

const KILL_POINTS: Record<EnemyType, number> = { grunt: 10, runner: 15, brute: 40 }
const KILL_COLOR: Record<EnemyType, string> = {
  grunt: '#e05cc8',
  runner: '#ff8a3a',
  brute: '#a06ae0',
}

type Upgrade = { id: string; title: string; desc: string; apply: (s: HeroStats) => void }
const ALL_UPGRADES: Upgrade[] = [
  { id: 'dmg', title: 'Урон +1', desc: 'Сильнее выстрелы', apply: (s) => (s.damage += 1) },
  { id: 'rof', title: 'Скорострельность', desc: 'Быстрее стрельба', apply: (s) => (s.fireInterval = Math.max(0.06, s.fireInterval * 0.78)) },
  { id: 'spd', title: 'Скорость', desc: 'Быстрее бег', apply: (s) => (s.speed += 1) },
]

/* ── Клавиатура + мышь ─────────────────────────────────────────── */
function useInput() {
  const keys = useRef<Record<string, boolean>>({})
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'Space' && document.pointerLockElement) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false)
    const md = (e: MouseEvent) => {
      if (e.button === 0) keys.current['Mouse0'] = true
    }
    const mu = (e: MouseEvent) => {
      if (e.button === 0) keys.current['Mouse0'] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('mousedown', md)
    window.addEventListener('mouseup', mu)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('mousedown', md)
      window.removeEventListener('mouseup', mu)
    }
  }, [])
  return keys
}

/* ── Менеджер волн (в канвасе) ─────────────────────────────────── */
function WaveManager({
  phase,
  wave,
  onCleared,
}: {
  phase: Phase
  wave: number
  onCleared: () => void
}) {
  const queue = useRef<EnemyType[]>([])
  const timer = useRef(0)
  const started = useRef(false)

  useEffect(() => {
    if (phase === 'playing') {
      // построить состав волны
      const q: EnemyType[] = []
      const grunts = 4 + wave * 2
      const runners = wave >= 2 ? Math.floor(wave * 1.5) : 0
      const brutes = wave >= 3 ? wave - 2 : 0
      for (let i = 0; i < grunts; i++) q.push('grunt')
      for (let i = 0; i < runners; i++) q.push('runner')
      for (let i = 0; i < brutes; i++) q.push('brute')
      // перемешать (детерминированно неважно)
      for (let i = q.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[q[i], q[j]] = [q[j], q[i]]
      }
      queue.current = q
      timer.current = 0
      started.current = true
    } else {
      started.current = false
    }
  }, [phase, wave])

  useFrame((_, rawDt) => {
    if (phase !== 'playing' || !started.current) return
    const dt = Math.min(rawDt, 0.05)
    // спавн по одному с интервалом
    if (queue.current.length > 0) {
      timer.current -= dt
      if (timer.current <= 0) {
        const type = queue.current.shift()!
        const a = Math.random() * Math.PI * 2
        const r = ARENA_R - 3
        store.spawnEnemy(type, Math.cos(a) * r, Math.sin(a) * r)
        timer.current = 0.55
      }
    } else if (store.aliveEnemies() === 0) {
      started.current = false
      onCleared()
    }
  })
  return null
}

export default function ArenaGame() {
  const keys = useInput()
  const yaw = useRef(0)
  const pitch = useRef(0.35)
  const dust = useRef<DustHandle | null>(null)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('menu')
  const [health, setHealth] = useState(100)
  const [maxHealth, setMaxHealth] = useState(100)
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [upgrades, setUpgrades] = useState<Upgrade[]>([])
  const phaseRef = useRef<Phase>('menu')
  phaseRef.current = phase

  const stats = useRef<HeroStats>({ damage: 1, fireInterval: 0.16, speed: 6 })

  // активность игры
  useEffect(() => {
    store.active = phase === 'playing'
    store.playerAlive = phase !== 'over'
  }, [phase])

  // debug-хук для автотестов
  useEffect(() => {
    ;(window as unknown as { __arena: typeof store }).__arena = store
  }, [])

  // колбэки стора
  useEffect(() => {
    store.onKill = (x, z, type) => {
      dust.current?.burst(x, 0.9, z, KILL_COLOR[type], 1.5)
      setScore((s) => s + KILL_POINTS[type])
    }
    store.onBulletHit = (x, y, z) => dust.current?.burst(x, y, z, '#ffcf6a', 0.4)
    store.onPlayerHit = (dmg) => {
      setHealth((h) => {
        const nh = h - dmg
        if (nh <= 0 && phaseRef.current === 'playing') {
          store.playerAlive = false
          store.active = false
          setPhase('over')
        }
        return Math.max(0, nh)
      })
    }
  }, [])

  const lockPointer = () => {
    try {
      const r = canvasEl.current?.requestPointerLock() as unknown as
        | Promise<void>
        | undefined
      if (r && typeof r.catch === 'function') r.catch(() => {})
    } catch {
      /* pointer lock недоступен — не критично */
    }
  }
  const toggleFullscreen = () => {
    const el = rootRef.current
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  // мышь → камера
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      yaw.current -= e.movementX * 0.0022
      pitch.current = Math.max(-0.2, Math.min(0.9, pitch.current + e.movementY * 0.0022))
    }
    const onLock = () => {
      // потеря захвата во время игры = пауза (меню)
      if (!document.pointerLockElement && phaseRef.current === 'playing') {
        // остаёмся в игре, просто ничего — но лучше не ставить паузу, чтобы не мешать
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('pointerlockchange', onLock)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerlockchange', onLock)
    }
  }, [])

  const startGame = () => {
    store.reset()
    stats.current = { damage: 1, fireInterval: 0.16, speed: 6 }
    setHealth(100)
    setMaxHealth(100)
    setWave(1)
    setScore(0)
    setPhase('playing')
    lockPointer()
  }

  const onWaveCleared = () => {
    // выбрать 3 апгрейда
    const pool = [...ALL_UPGRADES]
    const hpUp: Upgrade = {
      id: 'hp',
      title: 'Здоровье +30',
      desc: 'Больше и полное HP',
      apply: () => {},
    }
    const choices = [pool[0], pool[1], pool[2], hpUp].sort(() => Math.random() - 0.5).slice(0, 3)
    setUpgrades(choices)
    setPhase('waveclear')
    if (document.pointerLockElement) document.exitPointerLock()
  }

  const chooseUpgrade = (u: Upgrade) => {
    if (u.id === 'hp') {
      setMaxHealth((m) => {
        const nm = m + 30
        setHealth(nm)
        return nm
      })
    } else {
      u.apply(stats.current)
    }
    setWave((w) => w + 1)
    setPhase('playing')
    lockPointer()
  }

  const hpPct = Math.max(0, Math.min(100, (health / maxHealth) * 100))

  return (
    <div ref={rootRef} className="relative w-full h-full select-none bg-[#07080b]">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 8, 12], fov: 55, near: 0.1, far: 200 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          canvasEl.current = gl.domElement
        }}
      >
        <color attach="background" args={['#07080b']} />
        <fog attach="fog" args={['#07080b', 40, 90]} />
        <ambientLight intensity={0.35} color="#8090b0" />
        <hemisphereLight args={['#6a7ab0', '#201028', 0.5]} />
        <directionalLight
          position={[20, 40, 15]}
          intensity={1.6}
          color="#eaf0ff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        >
          <orthographicCamera attach="shadow-camera" args={[-40, 40, 40, -40, 0.1, 100]} />
        </directionalLight>
        <pointLight position={[0, 12, 0]} intensity={0.8} distance={70} color="#b600a8" />

        <Physics gravity={[0, -26, 0]}>
          <Arena />
          <Hero
            keys={keys}
            yaw={yaw}
            pitch={pitch}
            skin={SKINS[0]}
            stats={stats}
            onMuzzle={(x, y, z) => dust.current?.burst(x, y, z, '#ffd28a', 0.25)}
          />
        </Physics>

        <Enemies />
        <Bullets />
        <Dust apiRef={dust} />
        <WaveManager phase={phase} wave={wave} onCleared={onWaveCleared} />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.3} radius={0.7} />
          <Vignette eskil={false} offset={0.3} darkness={0.7} />
          <SMAA />
        </EffectComposer>
      </Canvas>

      {/* Кнопка полного экрана */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-white/80 flex items-center justify-center"
        aria-label="Полный экран"
      >
        ⛶
      </button>

      {/* HUD */}
      {(phase === 'playing' || phase === 'waveclear') && (
        <>
          {/* прицел */}
          {phase === 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 rounded-full border-2 border-white/70" />
              <div className="absolute w-1 h-1 rounded-full bg-white" />
            </div>
          )}
          {/* верхняя панель */}
          <div className="absolute top-4 left-4 right-16 z-20 pointer-events-none flex items-start justify-between">
            <div className="w-56">
              <div className="text-[#e6ebf2] text-xs uppercase tracking-widest mb-1">
                HP {Math.ceil(health)}/{maxHealth}
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/15">
                <div
                  className="h-full rounded-full transition-[width] duration-150"
                  style={{
                    width: `${hpPct}%`,
                    background: hpPct > 30 ? 'linear-gradient(90deg,#b600a8,#be4c00)' : '#e0473c',
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="accent-text font-bold text-2xl leading-none">ВОЛНА {wave}</div>
              <div className="text-[#c3cbd6] text-sm mt-1">Счёт: {score}</div>
              <div className="text-[#9aa3af] text-xs">Врагов: {store.aliveEnemies()}</div>
            </div>
          </div>
        </>
      )}

      {/* Меню старт */}
      {phase === 'menu' && (
        <button
          onClick={startGame}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm px-6"
        >
          <p className="accent-text font-bold uppercase tracking-tight text-4xl sm:text-5xl mb-3">
            Арена
          </p>
          <p className="text-[#c3cbd6] mb-8 max-w-md text-center">
            Отбивайтесь от волн врагов. WASD — движение, мышь — прицел, ЛКМ —
            огонь, Пробел — прыжок.
          </p>
          <span
            className="rounded-full px-10 py-4 text-white font-medium uppercase tracking-widest"
            style={{
              background: 'linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)',
              boxShadow: '4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            ▶ Играть
          </span>
        </button>
      )}

      {/* Экран апгрейда между волнами */}
      {phase === 'waveclear' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <p className="accent-text font-bold uppercase tracking-tight text-3xl sm:text-4xl mb-2">
            Волна {wave} пройдена
          </p>
          <p className="text-[#9aa3af] uppercase tracking-widest text-xs mb-8">
            Выберите улучшение
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {upgrades.map((u) => (
              <button
                key={u.id}
                onClick={() => chooseUpgrade(u)}
                className="rounded-2xl border border-[#D7E2EA]/15 bg-white/5 hover:bg-white/10 p-6 text-center transition-colors"
              >
                <div className="text-[#e6ebf2] font-medium text-lg mb-1">{u.title}</div>
                <div className="text-[#9aa3af] text-sm">{u.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Экран поражения */}
      {phase === 'over' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <p className="font-bold uppercase tracking-tight text-4xl sm:text-5xl mb-2 text-[#e0473c]">
            Поражение
          </p>
          <p className="text-[#e6ebf2] mb-1">Волна {wave} · Счёт {score}</p>
          <p className="text-[#9aa3af] mb-8 text-sm">Враги прорвались</p>
          <button
            onClick={startGame}
            className="rounded-full px-10 py-4 text-white font-medium uppercase tracking-widest"
            style={{
              background: 'linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)',
              boxShadow: '4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            Заново
          </button>
        </div>
      )}
    </div>
  )
}
