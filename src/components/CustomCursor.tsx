import { useEffect, useRef } from 'react'
import { bgLuminance } from '../lib/color'

const INK = '#0c0b0a'
const ACCENT = '#ef4a23'

/**
 * Кастомный курсор: плавно следующий кружок, цвет которого подстраивается под
 * фон (оранжевый на тёмном, тёмный на светлом). Увеличивается над кликабельным,
 * при клике — плавная волна. Активен только на устройствах с точным указателем.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!root || !dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')

    const target = { x: innerWidth / 2, y: innerHeight / 2 }
    const pos = { ...target }
    let color = ACCENT
    let baseSize = 14
    let visible = false
    let raf = 0
    let lastDetect = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        pos.x = target.x
        pos.y = target.y
        root.style.opacity = '1'
      }
      // определение фона/интерактива — не чаще ~раз в 90мс (производительность)
      const now = performance.now()
      if (now - lastDetect > 90) {
        lastDetect = now
        const el = document.elementFromPoint(e.clientX, e.clientY)
        const interactive = !!el?.closest('a, button, input, textarea, label, [role="button"]')
        color = bgLuminance(el) > 140 ? INK : ACCENT
        baseSize = interactive ? 36 : 14
        dot.style.width = `${baseSize}px`
        dot.style.height = `${baseSize}px`
        dot.style.background = color
        dot.style.opacity = interactive ? '0.5' : '1'
        ring.style.borderColor = color
      }
    }
    const onLeave = () => {
      visible = false
      root.style.opacity = '0'
    }
    const onDown = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(0.7)'
      ring.style.width = `${baseSize + 8}px`
      ring.style.height = `${baseSize + 8}px`
      ring.style.animation = 'none'
      // рефлоу, чтобы перезапустить анимацию
      void ring.offsetWidth
      ring.style.animation = 'cursor-ripple 0.55s ease-out'
    }
    const onUp = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.3
      pos.y += (target.y - pos.y) * 0.3
      root.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div ref={rootRef} className="cursor-root" style={{ opacity: 0, transition: 'opacity 0.25s ease' }}>
      <div ref={dotRef} className="cursor-dot" style={{ width: 14, height: 14, background: ACCENT }} />
      <div ref={ringRef} className="cursor-ring" style={{ width: 22, height: 22, borderColor: ACCENT }} />
    </div>
  )
}
