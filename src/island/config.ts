// ─────────────────────────────────────────────────────────────
//  Остров — единая конфигурация мира: размеры, палитра, тюнинг.
//  Всё, что задаёт «характер» игры, живёт здесь, чтобы легко крутить.
// ─────────────────────────────────────────────────────────────

/** Размер стороны острова (мировые единицы). */
export const WORLD = 120
/** Уровень моря. Плотность рельефа задаётся адаптивно в quality.ts. */
export const SEA_LEVEL = 0

/** Новая, тщательно подобранная палитра (тёплый тропический остров). */
export const PAL = {
  // рельеф
  sandDeep: '#c9a86a',
  sand: '#e6d3a3',
  grassLow: '#5aa04a',
  grass: '#3f8a3a',
  grassHigh: '#356b34',
  rock: '#8a8378',
  rockDark: '#6b655c',
  snow: '#eef3f6',
  mud: '#6d5636',

  // вода
  waterDeep: '#0a3f52',
  waterShallow: '#1f9cae',
  waterFoam: '#dff5f7',

  // атмосфера
  skyTop: '#8fc7f0',
  sun: '#fff2cf',
  fog: '#cfe6f0',
  ambientSky: '#cfe0f2',
  ambientGround: '#5c6a4a',

  // объекты
  trunk: '#6b4a2c',
  trunkDark: '#553a22',
  leaf: '#2f7d3a',
  leaf2: '#3f9a48',
  leafAutumn: '#c8862e',
  flower: ['#ff6b8a', '#ffd23f', '#7c6bff', '#ff9f43', '#ff5ccb'],
  gem: ['#4af0d0', '#8a6bff', '#ff5ccb', '#ffd23f'],
  wood: '#7a5433',
  woodDark: '#5c3f26',
  roof: '#b24a3a',
  stone: '#9a948a',
} as const

/** Физика и «ощущение» персонажа — гладкое, отзывчивое, PS5-ish. */
export const TUNE = {
  gravity: 26,
  walkSpeed: 6,
  runSpeed: 10.5,
  accel: 14, // как быстро набирает скорость (плавный разгон)
  decel: 18, // как быстро тормозит (плавная остановка)
  jump: 11,
  coyoteTime: 0.12, // окно прыжка после схода с края
  jumpBuffer: 0.12, // буфер нажатия прыжка до приземления
  turnLerp: 0.2, // плавность поворота модели
  swimSpeed: 4.2,
  buoyancy: 5,
  camDist: 8.5,
  camHeight: 3.2,
  camLerp: 6, // экспоненциальное сглаживание камеры (больше = резче)
  mouseSens: 0.0022,
} as const

/** Позиция солнца (используется и для света, и для неба). */
export const SUN_POS: [number, number, number] = [70, 60, 40]
