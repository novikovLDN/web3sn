import type Lenis from 'lenis'

// Синглтон текущего инстанса Lenis (регистрируется в useSmoothScroll).
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Плавно прокручивает к цели: id-селектор ('#about'), элементу или числу (px).
 * На десктопе — через Lenis (мягко, стильно), иначе — нативно.
 */
export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target as string, { duration: 1.4, easing: easeOutCubic })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
