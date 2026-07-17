// ─────────────────────────────────────────────────────────────
//  Рельеф острова. Высота и физика берутся из ОДНОЙ функции h(x,z),
//  поэтому визуальный меш и heightfield-коллайдер совпадают точно.
//  Многооктавный value-noise + маска острова + горный хребет + пруд.
// ─────────────────────────────────────────────────────────────
import { WORLD, SEA_LEVEL } from './config'

/** Пруд-впадина (пресная вода на суше). */
export const POND = { x: -22, z: 18, r: 11, depth: 3.6 }

function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function vnoise(x: number, z: number) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const u = xf * xf * (3 - 2 * xf)
  const v = zf * zf * (3 - 2 * zf)
  const tl = hash(xi, zi)
  const tr = hash(xi + 1, zi)
  const bl = hash(xi, zi + 1)
  const br = hash(xi + 1, zi + 1)
  return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v
}
function fbm(x: number, z: number, oct = 5) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  let norm = 0
  for (let i = 0; i < oct; i++) {
    sum += vnoise(x * freq + i * 13.7, z * freq + i * 7.3) * amp
    norm += amp
    amp *= 0.5
    freq *= 2.02
  }
  return sum / norm
}
function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Высота рельефа в мировой точке (x,z). Море там, где h < SEA_LEVEL. */
export function terrainHeight(x: number, z: number): number {
  const R = WORLD / 2
  const r = Math.hypot(x, z)
  const t = r / R // 0 в центре .. 1 у края

  // Купол суши: 1 внутри 0.52R, плавно к 0 к 0.98R (широкий пологий пляж).
  const dome = 1 - smoothstep(0.52, 0.98, t)

  // Пологий рельеф: крупные волны холмов + средние + мелкая шероховатость.
  // Амплитуда заметно меньше базовой высоты, чтобы суша не проваливалась под воду.
  const big = fbm(x * 0.014 + 4, z * 0.014 + 9, 4)
  const mid = fbm(x * 0.045 + 20, z * 0.045 + 3, 3)
  const fine = fbm(x * 0.14, z * 0.14, 2)
  const relief = (big - 0.5) * 5 + (mid - 0.5) * 1.8 + (fine - 0.5) * 0.5

  // Пологая центральная возвышенность.
  const peak = (1 - smoothstep(0.0, 0.5, t)) * 6

  // Базовая высота суши над морем; за кромкой уходит в глубину.
  let y = (4.5 + peak + relief) * dome - (1 - dome) * 11

  // Пруд-впадина на суше.
  const pd = Math.hypot(x - POND.x, z - POND.z)
  const pond = -smoothstep(POND.r, POND.r * 0.15, pd) * POND.depth
  y += pond * dome

  return y
}

/** Приблизительная нормаль рельефа (для наклона травы, размещения объектов). */
export function terrainSlope(x: number, z: number): number {
  const e = 0.6
  const hx = terrainHeight(x + e, z) - terrainHeight(x - e, z)
  const hz = terrainHeight(x, z + e) - terrainHeight(x, z - e)
  // 0 = ровно, 1 = отвесно
  return Math.min(1, Math.hypot(hx, hz) / (2 * e))
}

/** true, если точка под водой (море вокруг или пруд). */
export function isWater(x: number, z: number): boolean {
  return terrainHeight(x, z) < SEA_LEVEL - 0.05
}

/** Детерминированный ГПСЧ для расстановки объектов (стабильно между сборками). */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
