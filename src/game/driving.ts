import type { RapierRigidBody } from '@react-three/rapier'

/** Регистр всех машин: id → физическое тело (для поиска ближайшей). */
export const carRegistry: { id: number; body: RapierRigidBody }[] = []

/** Текущее состояние вождения: id машины, за рулём которой игрок (или null). */
export const driving = { carId: null as number | null }

export function registerCar(id: number, body: RapierRigidBody) {
  carRegistry.push({ id, body })
}
export function unregisterCar(id: number) {
  const i = carRegistry.findIndex((c) => c.id === id)
  if (i >= 0) carRegistry.splice(i, 1)
}
