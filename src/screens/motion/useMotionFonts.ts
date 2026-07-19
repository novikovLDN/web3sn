import { useEffect } from 'react'

/** Ленивая подгрузка шрифтов Motion-экрана. Переменные оси: wght, wdth, opsz. */
export function useMotionFonts() {
  useEffect(() => {
    const id = 'motion-fonts-2026'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Geist+Mono:wght@400;500&display=swap'
    document.head.appendChild(l)
  }, [])
}
