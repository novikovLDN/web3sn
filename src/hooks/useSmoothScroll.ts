import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Плавная инерционная прокрутка всего сайта (чуть медленнее и мягче нативной).
 * Отключается при системной настройке «меньше движения».
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.085, // мягкое сглаживание
      wheelMultiplier: 0.9, // чуть медленнее прокрутка колесом
      touchMultiplier: 1.2,
      smoothWheel: true,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}
