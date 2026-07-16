export type Biome = 'plains' | 'forest' | 'desert' | 'snow' | 'rocky'

function vhash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise2(x: number, z: number) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const tl = vhash(xi, zi)
  const tr = vhash(xi + 1, zi)
  const bl = vhash(xi, zi + 1)
  const br = vhash(xi + 1, zi + 1)
  const u = xf * xf * (3 - 2 * xf)
  const v = zf * zf * (3 - 2 * zf)
  return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v
}
export function fbm(x: number, z: number) {
  return noise2(x, z) * 0.6 + noise2(x * 2 + 5, z * 2 + 5) * 0.3 + noise2(x * 4, z * 4) * 0.1
}

/** Биом по координатам — крупные плавные зоны (низкочастотный шум). */
export function biomeAt(x: number, z: number): Biome {
  const f = 0.018
  const n = fbm(x * f + 10, z * f + 10)
  const m = fbm(x * f - 20, z * f - 20)
  if (n < 0.36) return 'desert'
  if (n > 0.66) return 'snow'
  if (m > 0.62) return 'forest'
  if (m < 0.36) return 'rocky'
  return 'plains'
}

export type BiomePalette = {
  ground: [string, string]
  dirt: string
  grassTop: string
  grassBase: string
  trunk: string
  leaves: [string, string]
  grassDensity: number // 0..1 — сколько травы
  decor: 'flowers' | 'cactus' | 'snow' | 'rock' | 'bush'
}

export const BIOMES: Record<Biome, BiomePalette> = {
  plains: {
    ground: ['#4a7c3a', '#3f6d32'],
    dirt: '#6b4c34',
    grassTop: '#7dc257',
    grassBase: '#3c6b2f',
    trunk: '#5b3b23',
    leaves: ['#3f7a34', '#4a8c3c'],
    grassDensity: 1,
    decor: 'flowers',
  },
  forest: {
    ground: ['#3a6630', '#325a29'],
    dirt: '#5a4028',
    grassTop: '#6bab46',
    grassBase: '#2f5a26',
    trunk: '#4a3018',
    leaves: ['#2f6a2a', '#3a7a32'],
    grassDensity: 1,
    decor: 'bush',
  },
  desert: {
    ground: ['#d9c88f', '#cebd82'],
    dirt: '#b89a5e',
    grassTop: '#cbbd7a',
    grassBase: '#b0a066',
    trunk: '#9a7a44',
    leaves: ['#5a8a3a', '#6a9a44'],
    grassDensity: 0.12,
    decor: 'cactus',
  },
  snow: {
    ground: ['#e9eef2', '#dce5eb'],
    dirt: '#c4cfd6',
    grassTop: '#d6e4ec',
    grassBase: '#b6c6d0',
    trunk: '#4a3a2a',
    leaves: ['#eef4f7', '#dfe9ef'],
    grassDensity: 0.25,
    decor: 'snow',
  },
  rocky: {
    ground: ['#7c7f87', '#6c6f78'],
    dirt: '#5f5a52',
    grassTop: '#8a9a6a',
    grassBase: '#6a7a4a',
    trunk: '#55483a',
    leaves: ['#466a37', '#537a42'],
    grassDensity: 0.5,
    decor: 'rock',
  },
}
