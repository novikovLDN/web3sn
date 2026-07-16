import * as THREE from 'three'

/**
 * Разделяемое состояние игрока без ре-рендеров: позиция и признак «в воде».
 * Пишет Player каждый кадр, читают трава/вода в своих useFrame.
 */
export const playerState = {
  position: new THREE.Vector3(0, 3, 6),
  velocityY: 0,
  inWater: false,
}

// Уровень воды и геометрия пруда (в мировых координатах)
export const WATER = {
  level: 0.35, // высота поверхности воды
  cx: 12, // центр пруда X
  cz: -12, // центр пруда Z
  rx: 8, // полуразмер по X
  rz: 7, // полуразмер по Z
}

/** true, если точка (x,z) внутри эллипса пруда */
export function inPond(x: number, z: number) {
  const dx = (x - WATER.cx) / WATER.rx
  const dz = (z - WATER.cz) / WATER.rz
  return dx * dx + dz * dz < 1
}
