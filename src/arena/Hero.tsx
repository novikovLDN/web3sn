import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { Character } from '../game/Character'
import type { Skin } from '../game/skins'
import { store, ARENA_R } from './store'

type Keys = MutableRefObject<Record<string, boolean>>
export type HeroStats = { damage: number; fireInterval: number; speed: number }

const G = 26
const JUMP = 9
const SPAWN = new THREE.Vector3(0, 3, 0)

function lerpAngle(a: number, b: number, t: number) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

export default function Hero({
  keys,
  yaw,
  pitch,
  skin,
  stats,
  onMuzzle,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
  skin: Skin
  stats: MutableRefObject<HeroStats>
  onMuzzle: (x: number, y: number, z: number) => void
}) {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group | null>(null)
  const armL = useRef<THREE.Group | null>(null)
  const legL = useRef<THREE.Group | null>(null)
  const legR = useRef<THREE.Group | null>(null)
  const { world } = useRapier()
  const { camera } = useThree()

  const controller = useRef<KinematicCharacterController | null>(null)
  const vy = useRef(0)
  const grounded = useRef(false)
  const walkPhase = useRef(0)
  const fireCd = useRef(0)
  const recoil = useRef(0)
  const camPos = useRef(new THREE.Vector3(0, 6, 12))
  const tmp = useRef(new THREE.Vector3())

  useEffect(() => {
    const c = world.createCharacterController(0.08)
    c.enableAutostep(0.6, 0.25, true)
    c.enableSnapToGround(0.5)
    c.setApplyImpulsesToDynamicBodies(true)
    c.setSlideEnabled(true)
    controller.current = c
    return () => {
      try {
        world.removeCharacterController(c)
      } catch {
        /* noop */
      }
    }
  }, [world])

  useFrame((_, rawDt) => {
    const b = body.current
    const c = controller.current
    if (!b || !c) return
    const dt = Math.min(rawDt, 0.05)
    const p = store.player

    // камера всегда следует
    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    const cp = Math.cos(pitch.current)
    tmp.current.set(p.x - sin * 8 * cp, p.y + 2.6 + Math.sin(pitch.current) * 8, p.z - cos * 8 * cp)
    camPos.current.lerp(tmp.current, 1 - Math.pow(0.0015, dt))
    camera.position.copy(camPos.current)
    camera.lookAt(p.x, p.y + 1.2, p.z)

    if (!store.active || !store.playerAlive) return

    const pos = b.translation()
    const wasGrounded = grounded.current

    // движение
    let fwd = 0
    let str = 0
    if (keys.current['KeyW']) fwd += 1
    if (keys.current['KeyS']) fwd -= 1
    if (keys.current['KeyD']) str += 1
    if (keys.current['KeyA']) str -= 1
    const moving = fwd !== 0 || str !== 0
    let dirX = 0
    let dirZ = 0
    if (moving) {
      dirX = sin * fwd - cos * str
      dirZ = cos * fwd + sin * str
      const len = Math.hypot(dirX, dirZ) || 1
      dirX /= len
      dirZ /= len
    }

    if (wasGrounded && vy.current <= 0) vy.current = -1
    else vy.current -= G * dt
    if (wasGrounded && keys.current['Space']) vy.current = JUMP

    const sp = stats.current.speed
    const desired = { x: dirX * sp * dt, y: vy.current * dt, z: dirZ * sp * dt }
    const collider = b.collider(0)
    c.computeColliderMovement(collider, desired)
    const mv = c.computedMovement()
    grounded.current = c.computedGrounded()
    if (grounded.current && vy.current < 0) vy.current = 0

    let nx = pos.x + mv.x
    let nz = pos.z + mv.z
    // страховочный кламп по арене
    const rr = Math.hypot(nx, nz)
    if (rr > ARENA_R - 1) {
      const k = (ARENA_R - 1) / rr
      nx *= k
      nz *= k
    }
    b.setNextKinematicTranslation({ x: nx, y: pos.y + mv.y, z: nz })
    p.set(nx, pos.y + mv.y, nz)
    store.playerYaw = yaw.current

    if (pos.y < -20) {
      b.setNextKinematicTranslation({ x: 0, y: SPAWN.y, z: 0 })
      vy.current = 0
    }

    // ── Стрельба ──
    fireCd.current -= dt
    if (keys.current['Mouse0'] && fireCd.current <= 0) {
      fireCd.current = stats.current.fireInterval
      recoil.current = 1
      const cpp = Math.cos(pitch.current)
      const dx = sin * cpp
      const dy = Math.sin(pitch.current) * 0.5
      const dz = cos * cpp
      const l = Math.hypot(dx, dy, dz) || 1
      const mx = nx + (dx / l) * 0.8
      const my = pos.y + 1.4
      const mz = nz + (dz / l) * 0.8
      store.fireBullet(mx, my, mz, dx / l, dy / l, dz / l, stats.current.damage)
      onMuzzle(mx, my, mz)
      // поворот к направлению выстрела
      if (model.current) model.current.rotation.y = lerpAngle(model.current.rotation.y, Math.atan2(dx, dz), 0.5)
    }
    recoil.current = Math.max(0, recoil.current - dt * 4)

    // поворот модели по движению (если не стреляем)
    if (model.current && moving && !keys.current['Mouse0']) {
      model.current.rotation.y = lerpAngle(model.current.rotation.y, Math.atan2(dirX, dirZ), 0.2)
    }
    // анимация
    if (moving && grounded.current) walkPhase.current += dt * sp * 1.7
    const swingB = moving && grounded.current ? 0.6 : 0
    const s1 = Math.sin(walkPhase.current) * swingB
    const s2 = Math.cos(walkPhase.current) * swingB
    const k = 0.3
    if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, s1, k)
    if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, -s1, k)
    // правая рука вытянута вперёд (стрелок), с отдачей
    const aimArm = -1.3 + recoil.current * 0.5
    if (armR.current) armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, aimArm, 0.3)
    if (armL.current) armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, -s2 * 0.6, k)
  })

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[0, SPAWN.y, 0]}>
      <CapsuleCollider args={[0.6, 0.4]} />
      <group ref={model}>
        <Character skin={skin} legL={legL} legR={legR} armL={armL} armR={armR} />
      </group>
    </RigidBody>
  )
}
