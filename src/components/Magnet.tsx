import { useRef, useEffect, type CSSProperties, type ReactNode } from 'react'

type MagnetProps = {
  children: ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
  style?: CSSProperties
}

/**
 * Магнитный ховер. Позиция считается в rAF и пишется прямо в transform через ref —
 * без setState на каждое движение мыши, поэтому анимация идёт на композиторе
 * максимально плавно (упирается только в частоту дисплея).
 */
export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0, active: false })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const apply = () => {
      const { x, y, active } = target.current
      el.style.transition = active ? activeTransition : inactiveTransition
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      rafId.current = null
    }

    const schedule = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(apply)
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy

      const within =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding

      if (within) {
        target.current = { x: dx / strength, y: dy / strength, active: true }
      } else if (target.current.active) {
        target.current = { x: 0, y: 0, active: false }
      } else {
        return
      }
      schedule()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
    }
  }, [padding, strength, activeTransition, inactiveTransition])

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, willChange: 'transform', transform: 'translate3d(0,0,0)' }}
    >
      {children}
    </div>
  )
}
