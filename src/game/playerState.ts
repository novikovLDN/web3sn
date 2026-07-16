import * as THREE from 'three'

/**
 * Разделяемое состояние игрока без ре-рендеров: позиция и признак «в воде».
 * Пишет Player каждый кадр, читают трава/вода в своих useFrame.
 */
export const playerState = {
  position: new THREE.Vector3(0, 3, 6),
  velocityY: 0,
  inWater: false,
  active: false, // управление активно только в фазе игры
}

export const HALF = 50 // мир 100×100 (в 4 раза больше прежнего)
export const WATER_LEVEL = 0.4

// Пруд (озеро) в глубине суши
export const POND = { cx: 16, cz: -16, rx: 9, rz: 8 }

// Море — вся северная кромка карты
export const SEA_Z = 30 // берег: вода при z > SEA_Z
export const BEACH_Z = 24 // песок между сушей и морем

// Карьеры (ямы) с рудой — квадратные, выровнены по сетке 10
export type Pit = {
  x0: number
  x1: number
  z0: number
  z1: number
  depth: number
}
export const PITS: Pit[] = [
  { x0: -30, x1: -20, z0: 2, z1: 12, depth: 4 },
  { x0: 20, x1: 30, z0: -10, z1: 0, depth: 5 },
  { x0: -8, x1: 2, z0: -34, z1: -24, depth: 6 },
]

export function inPond(x: number, z: number) {
  const dx = (x - POND.cx) / POND.rx
  const dz = (z - POND.cz) / POND.rz
  return dx * dx + dz * dz < 1
}

export function inSea(_x: number, z: number) {
  return z > SEA_Z
}

export function inAnyWater(x: number, z: number) {
  return inPond(x, z) || inSea(x, z)
}

export function isBeach(_x: number, z: number) {
  return z > BEACH_Z && z <= SEA_Z
}

export function pitAt(x: number, z: number): Pit | null {
  for (const p of PITS) {
    if (x > p.x0 && x < p.x1 && z > p.z0 && z < p.z1) return p
  }
  return null
}
