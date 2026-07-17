import { useRef, type MutableRefObject } from 'react'

type Keys = MutableRefObject<Record<string, boolean>>

/** Виртуальный джойстик (движение) + кнопки прыжка/бега для тач-устройств. */
export default function TouchControls({ keys }: { keys: Keys }) {
  const base = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const active = useRef(false)

  const setDir = (dx: number, dy: number) => {
    const dead = 0.28
    keys.current['KeyW'] = dy < -dead
    keys.current['KeyS'] = dy > dead
    keys.current['KeyA'] = dx < -dead
    keys.current['KeyD'] = dx > dead
    // бег при полном отклонении
    keys.current['ShiftLeft'] = Math.hypot(dx, dy) > 0.85
  }

  const onStart = (e: React.TouchEvent) => {
    active.current = true
    onMove(e)
  }
  const onMove = (e: React.TouchEvent) => {
    if (!active.current || !base.current) return
    const t = e.touches[0]
    const r = base.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let dx = (t.clientX - cx) / (r.width / 2)
    let dy = (t.clientY - cy) / (r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > 1) {
      dx /= len
      dy /= len
    }
    if (knob.current) knob.current.style.transform = `translate(${dx * 34}px, ${dy * 34}px)`
    setDir(dx, dy)
  }
  const onEnd = () => {
    active.current = false
    if (knob.current) knob.current.style.transform = 'translate(0,0)'
    setDir(0, 0)
  }

  const holdKey = (code: string) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault()
      keys.current[code] = true
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault()
      keys.current[code] = false
    },
  })

  return (
    <div className="md:hidden">
      {/* джойстик слева */}
      <div
        ref={base}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        className="absolute left-6 bottom-8 z-30 w-32 h-32 rounded-full border border-white/25 bg-white/5 backdrop-blur touch-none"
      >
        <div
          ref={knob}
          className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full bg-white/25 border border-white/40"
        />
      </div>
      {/* кнопки справа */}
      <button
        {...holdKey('Space')}
        className="absolute right-6 bottom-24 z-30 w-20 h-20 rounded-full border border-white/30 bg-white/10 backdrop-blur text-white font-bold text-sm uppercase tracking-widest touch-none"
      >
        Прыжок
      </button>
      <button
        {...holdKey('ShiftLeft')}
        className="absolute right-28 bottom-10 z-30 w-16 h-16 rounded-full border border-white/25 bg-white/5 backdrop-blur text-white/80 text-xs uppercase touch-none"
      >
        Бег
      </button>
    </div>
  )
}
