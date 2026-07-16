import * as THREE from 'three'

export const ARENA_R = 34 // радиус арены

export type EnemyType = 'grunt' | 'runner' | 'brute'

export type Enemy = {
  active: boolean
  type: EnemyType
  x: number
  z: number
  hp: number
  maxHp: number
  speed: number
  damage: number
  radius: number
  hitCd: number // кулдаун урона игроку
  phase: number // для анимации
  spawn: number // 0..1 анимация появления
}

export type Bullet = {
  active: boolean
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  dmg: number
}

// Пул врагов партиционирован по типам (визуал слота фиксирован)
const GRUNT_N = 48
const RUNNER_N = 24
const BRUTE_N = 12
const ENEMY_POOL = GRUNT_N + RUNNER_N + BRUTE_N
const BULLET_POOL = 120

export function slotType(i: number): EnemyType {
  if (i < GRUNT_N) return 'grunt'
  if (i < GRUNT_N + RUNNER_N) return 'runner'
  return 'brute'
}
function typeRange(t: EnemyType): [number, number] {
  if (t === 'grunt') return [0, GRUNT_N]
  if (t === 'runner') return [GRUNT_N, GRUNT_N + RUNNER_N]
  return [GRUNT_N + RUNNER_N, ENEMY_POOL]
}

export type ArenaStore = {
  player: THREE.Vector3
  playerYaw: number
  playerAlive: boolean
  active: boolean // управление активно (фаза игры)
  enemies: Enemy[]
  bullets: Bullet[]
  // колбэки, назначаются ArenaGame
  onKill: (x: number, z: number, type: EnemyType) => void
  onPlayerHit: (dmg: number) => void
  onBulletHit: (x: number, y: number, z: number) => void
  spawnEnemy: (type: EnemyType, x: number, z: number) => void
  fireBullet: (
    x: number,
    y: number,
    z: number,
    dx: number,
    dy: number,
    dz: number,
    dmg: number
  ) => void
  aliveEnemies: () => number
  reset: () => void
}

function makeEnemies(): Enemy[] {
  return Array.from({ length: ENEMY_POOL }, (_, i) => ({
    active: false,
    type: slotType(i),
    x: 0,
    z: 0,
    hp: 0,
    maxHp: 0,
    speed: 0,
    damage: 0,
    radius: 0.6,
    hitCd: 0,
    phase: 0,
    spawn: 0,
  }))
}
function makeBullets(): Bullet[] {
  return Array.from({ length: BULLET_POOL }, () => ({
    active: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
    dmg: 1,
  }))
}

const ENEMY_STATS: Record<
  EnemyType,
  { hp: number; speed: number; damage: number; radius: number }
> = {
  grunt: { hp: 3, speed: 2.4, damage: 8, radius: 0.6 },
  runner: { hp: 2, speed: 4.2, damage: 6, radius: 0.5 },
  brute: { hp: 9, speed: 1.6, damage: 20, radius: 1.05 },
}

export const store: ArenaStore = {
  player: new THREE.Vector3(0, 1, 0),
  playerYaw: 0,
  playerAlive: true,
  active: false,
  enemies: makeEnemies(),
  bullets: makeBullets(),
  onKill: () => {},
  onPlayerHit: () => {},
  onBulletHit: () => {},
  spawnEnemy: (type, x, z) => {
    const [lo, hi] = typeRange(type)
    let e: Enemy | undefined
    for (let i = lo; i < hi; i++) {
      if (!store.enemies[i].active) {
        e = store.enemies[i]
        break
      }
    }
    if (!e) return
    const s = ENEMY_STATS[type]
    e.active = true
    e.type = type
    e.x = x
    e.z = z
    e.hp = s.hp
    e.maxHp = s.hp
    e.speed = s.speed
    e.damage = s.damage
    e.radius = s.radius
    e.hitCd = 0
    e.phase = Math.random() * Math.PI * 2
    e.spawn = 0
  },
  fireBullet: (x, y, z, dx, dy, dz, dmg) => {
    const b = store.bullets.find((n) => !n.active)
    if (!b) return
    const sp = 46
    b.active = true
    b.x = x
    b.y = y
    b.z = z
    b.vx = dx * sp
    b.vy = dy * sp
    b.vz = dz * sp
    b.life = 1.6
    b.dmg = dmg
  },
  aliveEnemies: () => store.enemies.reduce((n, e) => n + (e.active ? 1 : 0), 0),
  reset: () => {
    store.enemies.forEach((e) => (e.active = false))
    store.bullets.forEach((b) => (b.active = false))
    store.player.set(0, 1, 0)
    store.playerAlive = true
  },
}
