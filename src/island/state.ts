// Лёгкое разделяемое состояние мира без внешних зависимостей.
// Меняется каждый кадр из игрового цикла; UI подписывается через subscribe.
import * as THREE from 'three'

type Listener = () => void

class WorldState {
  player = new THREE.Vector3(0, 8, 0)
  playerYaw = 0
  active = false
  inWater = false
  running = false
  score = 0
  totalGems = 0

  private listeners = new Set<Listener>()

  /** Подписка на изменения счётчиков/флагов (для React-HUD). */
  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
  emit() {
    this.listeners.forEach((l) => l())
  }
  collectGem() {
    this.score += 1
    this.emit()
  }
  reset() {
    this.score = 0
    this.emit()
  }
}

export const world = new WorldState()
