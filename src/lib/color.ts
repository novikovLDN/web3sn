/**
 * Воспринимаемая яркость (0..255) фона под элементом: поднимается по DOM,
 * пока не найдёт непрозрачный background-color. Используется, чтобы подобрать
 * контрастный цвет курсора/плеера на светлых и тёмных секциях.
 */
export function bgLuminance(el: Element | null): number {
  let node: Element | null = el
  let hops = 0
  while (node && hops < 12) {
    const c = getComputedStyle(node).backgroundColor
    if (c && c !== 'transparent' && !c.startsWith('rgba(0, 0, 0, 0')) {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (m) {
        const [r, g, b] = m[1].split(',').map((n) => parseFloat(n))
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
    }
    node = node.parentElement
    hops++
  }
  return 0
}
