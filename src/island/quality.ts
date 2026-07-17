// Определение «весовой категории» устройства и параметров качества сцены,
// чтобы на слабых/мобильных устройствах игра не зависала.

function detect() {
  if (typeof window === 'undefined') {
    return { mobile: false, low: false }
  }
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const small = window.innerWidth < 768
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory
  const mobile = coarse || small
  const low = mobile || cores <= 4 || (mem !== undefined && mem <= 4)
  return { mobile, low }
}

const d = detect()

export const QUALITY = {
  mobile: d.mobile,
  low: d.low,
  dpr: d.low ? 1 : 1.8,
  shadows: !d.low,
  shadowMap: d.low ? 1024 : 2048,
  postfx: !d.low,
  // плотность рельефа
  seg: d.low ? 150 : 240,
  physSeg: d.low ? 120 : 160,
  // количество объектов
  trees: d.low ? 150 : 340,
  rocks: d.low ? 70 : 160,
  grass: d.low ? 1600 : 5200,
  flowers: d.low ? 280 : 900,
  gems: d.low ? 16 : 24,
} as const
