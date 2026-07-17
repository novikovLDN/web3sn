import { useEffect, useRef } from 'react'

const INK = '#0c0b0a'
const ACCENT = '#ef4a23'

/** Возвращает воспринимаемую яркость фона под элементом (0..255). */
function bgLuminance(el: Element | null): number {
  let node: Element | null = el
  while (node) {
    const c = getComputedStyle(node).backgroundColor
    if (c && c !== 'transparent' && !c.startsWith('rgba(0, 0, 0, 0')) {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (m) {
        const [r, g, b] = m[1].split(',').map((n) => parseFloat(n))
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
    }
    node = node.parentElement
  }
  return 0 // по умолчанию считаем тёмным
}

/**
 * Кастомный курсор: плавно следующий кружок. Цвет зависит от фона под ним
 * (тёмный фон → оранжевый, светлый → почти-чёрный). Увеличивается над
 * интерактивными элементами. Активен только на устройствах с точным указателем.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const dot = dotRef.current
    if (!dot) return

    document.documentElement.classList.add('has-custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let color = ACCENT
    let size = 14
    let visible = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        pos.x = target.x
        pos.y = target.y
        dot.style.opacity = '1'
      }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const interactive = !!el?.closest('a, button, input, textarea, label, [role="button"]')
      size = interactive ? 34 : 14
      const lum = bgLuminance(el)
      color = lum > 140 ? INK : ACCENT
      // если наведён на интерактив — заливка, иначе кольцо
      dot.style.width = `${size}px`
      dot.style.height = `${size}px`
      if (interactive) {
        dot.style.background = color
        dot.style.border = 'none'
        dot.style.opacity = '0.55'
      } else {
        dot.style.background = color
        dot.style.border = 'none'
        dot.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
    }
    const onDown = () => (dot.style.transform += ' scale(0.8)')

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.28
      pos.y += (target.y - pos.y) * 0.28
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('mousedown', onDown)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mousedown', onDown)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" style={{ width: 14, height: 14, background: ACCENT, opacity: 0 }} />
}
