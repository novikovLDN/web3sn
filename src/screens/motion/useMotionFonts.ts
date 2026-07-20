import { useEffect } from 'react'

/**
 * Ленивая подгрузка гарнитур экрана — при открытии, а не глобально.
 *
 * Geist и Geist Mono: у обоих подтверждены subsets cyrillic и cyrillic-ext
 * (проверка по fonts.google.com/metadata/fonts/). Прежний Bricolage Grotesque
 * кириллицы не имел вовсе — обоснование замены в palette.ts.
 *
 * Веса берём ровно те, что используются на экране (400/500/600 у sans,
 * 400/500 у mono): лишние начертания — это лишние килобайты на первом кадре.
 */
export function useMotionFonts() {
  useEffect(() => {
    const id = 'motion-fonts-geist'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap'
    document.head.appendChild(l)
  }, [])
}
