import { useRef, useState, type MutableRefObject } from 'react'

type Keys = MutableRefObject<Record<string, boolean>>

/**
 * Сенсорное управление для мобильных/планшетов:
 * левый джойстик — движение (WASD), правая область — камера, кнопки — прыжок/бег/F.
 */
export default function TouchControls({
  keys,
  yaw,
  pitch,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
}) {
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const joyId = useRef<number | null>(null)
  const joyCenter = useRef({ x: 0, y: 0 })
  const lookId = useRef<number | null>(null)
  const lookLast = useRef({ x: 0, y: 0 })

  const clearMoveKeys = () => {
    keys.current['KeyW'] = false
    keys.current['KeyS'] = false
    keys.current['KeyA'] = false
    keys.current['KeyD'] = false
  }

  const setMove = (dx: number, dy: number) => {
    const R = 55
    const nx = Math.max(-1, Math.min(1, dx / R))
    const ny = Math.max(-1, Math.min(1, dy / R))
    setKnob({ x: nx * R, y: ny * R })
    clearMoveKeys()
    if (ny < -0.35) keys.current['KeyW'] = true
    if (ny > 0.35) keys.current['KeyS'] = true
    if (nx > 0.35) keys.current['KeyD'] = true
    if (nx < -0.35) keys.current['KeyA'] = true
  }

  // ── Джойстик ──
  const onJoyStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    joyId.current = t.identifier
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    joyCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    setMove(t.clientX - joyCenter.current.x, t.clientY - joyCenter.current.y)
  }
  const onJoyMove = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === joyId.current) {
        setMove(t.clientX - joyCenter.current.x, t.clientY - joyCenter.current.y)
      }
    }
  }
  const onJoyEnd = () => {
    joyId.current = null
    setKnob({ x: 0, y: 0 })
    clearMoveKeys()
  }

  // ── Камера (правая область) ──
  const onLookStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    lookId.current = t.identifier
    lookLast.current = { x: t.clientX, y: t.clientY }
  }
  const onLookMove = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === lookId.current) {
        const dx = t.clientX - lookLast.current.x
        const dy = t.clientY - lookLast.current.y
        lookLast.current = { x: t.clientX, y: t.clientY }
        yaw.current -= dx * 0.006
        pitch.current = Math.max(-0.15, Math.min(1.1, pitch.current + dy * 0.006))
      }
    }
  }
  const onLookEnd = () => {
    lookId.current = null
  }

  const hold = (code: string) => ({
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
    <div className="absolute inset-0 z-20 touch-none select-none" style={{ touchAction: 'none' }}>
      {/* правая область — камера */}
      <div
        className="absolute right-0 top-0 bottom-0 left-1/2"
        onTouchStart={onLookStart}
        onTouchMove={onLookMove}
        onTouchEnd={onLookEnd}
        onTouchCancel={onLookEnd}
      />

      {/* джойстик слева снизу */}
      <div
        className="absolute left-6 bottom-6 w-32 h-32 rounded-full border-2 border-white/25 bg-white/5 backdrop-blur-sm"
        onTouchStart={onJoyStart}
        onTouchMove={onJoyMove}
        onTouchEnd={onJoyEnd}
        onTouchCancel={onJoyEnd}
      >
        <div
          className="absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 rounded-full bg-white/40"
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
      </div>

      {/* кнопки справа снизу */}
      <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3">
        <div className="flex gap-3">
          <button
            {...hold('KeyF')}
            className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/10 text-white text-sm font-medium"
          >
            F
          </button>
          <button
            {...hold('ShiftLeft')}
            className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/10 text-white text-xs font-medium"
          >
            БЕГ
          </button>
        </div>
        <button
          {...hold('Space')}
          className="w-20 h-20 rounded-full border-2 border-white/40 bg-white/15 text-white text-xs font-medium"
        >
          ПРЫЖОК
        </button>
      </div>
    </div>
  )
}
