import type Lenis from 'lenis'

// Синглтон текущего инстанса Lenis (регистрируется в useSmoothScroll).
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/**
 * Мгновенный переход (без анимации) — например при открытии/закрытии экрана.
 *
 * `resize` нужен, когда цель находится в дереве, которое только что
 * смонтировалось (возврат с экрана услуги на главную): Lenis кэширует
 * габариты документа и без пересчёта либо клампит переход к устаревшему
 * пределу, либо не находит только что появившийся якорь `#price`.
 */
export function jumpToTarget(target: string | number, opts?: { resize?: boolean }) {
  if (lenis) {
    if (opts?.resize) lenis.resize()
    lenis.scrollTo(target as string, { immediate: true })
  } else if (typeof target === 'number') {
    window.scrollTo(0, target)
  } else {
    document.querySelector(target)?.scrollIntoView()
  }
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
