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
import { playerState, WATER_LEVEL, inAnyWater, groundInfo } from './playerState'
import { driving, carRegistry } from './driving'
import { Character } from './Character'
import type { Skin } from './skins'
import type { SplashHandle } from './Water'
import type { DustHandle } from './Dust'

type Keys = MutableRefObject<Record<string, boolean>>

const G = 26 // гравитация
const WALK = 5
const RUN = 8.6
const JUMP = 9.5
const SPAWN = new THREE.Vector3(0, 4, 6)

function lerpAngle(a: number, b: number, t: number) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

export default function Player({
  keys,
  yaw,
  pitch,
  splash,
  dust,
  skin,
  debug = false,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
  splash: MutableRefObject<SplashHandle | null>
  dust: MutableRefObject<DustHandle | null>
  skin: Skin
  debug?: boolean
}) {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<THREE.Group>(null)
  const bodyGrp = useRef<THREE.Group | null>(null)
  const legL = useRef<THREE.Group | null>(null)
  const legR = useRef<THREE.Group | null>(null)
  const armL = useRef<THREE.Group | null>(null)
  const armR = useRef<THREE.Group | null>(null)
  const { world } = useRapier()
  const { camera } = useThree()

  const controller = useRef<KinematicCharacterController | null>(null)
  const vy = useRef(0)
  const grounded = useRef(false)
  const walkPhase = useRef(0)
  const crouch = useRef(0)
  const camPos = useRef(new THREE.Vector3(0, 6, 14))
  const tmp = useRef(new THREE.Vector3())
  const prevF = useRef(false)
  const wasInWater = useRef(false)

  // Создаём kinematic character controller (надёжная физика)
  useEffect(() => {
    const c = world.createCharacterController(0.08)
    c.enableAutostep(0.6, 0.25, true) // сам шагает на уступы до 0.6
    c.enableSnapToGround(0.5) // прилипает к земле (не подпрыгивает)
    c.setApplyImpulsesToDynamicBodies(true) // толкает ящики/машины
    c.setCharacterMass(1)
    c.setSlideEnabled(true)
    c.setMaxSlopeClimbAngle((55 * Math.PI) / 180)
    c.setMinSlopeSlideAngle((45 * Math.PI) / 180)
    controller.current = c
    if (debug) (window as unknown as { __ps: typeof playerState }).__ps = playerState
    return () => {
      try {
        world.removeCharacterController(c)
      } catch {
        /* noop */
      }
    }
  }, [world, debug])

  const updateCamera = (dt: number) => {
    if (debug) return
    const p = playerState.position
    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    const dist = driving.carId != null ? 9 : 7
    const cp = Math.cos(pitch.current)
    tmp.current.set(
      p.x - sin * dist * cp,
      p.y + 2.2 + Math.sin(pitch.current) * dist,
      p.z - cos * dist * cp
    )
    camPos.current.lerp(tmp.current, 1 - Math.pow(0.0015, dt))
    camera.position.copy(camPos.current)
    camera.lookAt(p.x, p.y + 1.4, p.z)
  }

  useFrame((_, rawDt) => {
    const b = body.current
    const c = controller.current
    if (!b || !c) return
    const dt = Math.min(rawDt, 0.05)

    // ── Вход/выход из машины (F) ──
    const fDown = !!keys.current['KeyF']
    if (playerState.active && fDown && !prevF.current) {
      if (driving.carId == null) {
        const pp = b.translation()
        let best: { id: number; d: number } | null = null
        for (const car of carRegistry) {
          const t = car.body.translation()
          const d = Math.hypot(t.x - pp.x, t.z - pp.z)
          if (d < 4.5 && (!best || d < best.d)) best = { id: car.id, d }
        }
        if (best) {
          driving.carId = best.id
          if (model.current) model.current.visible = false
        }
      } else {
        const car = carRegistry.find((c2) => c2.id === driving.carId)
        driving.carId = null
        if (car) {
          const t = car.body.translation()
          b.setNextKinematicTranslation({ x: t.x + 2.6, y: t.y + 2, z: t.z })
        }
        vy.current = 0
        if (model.current) model.current.visible = true
      }
    }
    prevF.current = fDown

    // За рулём — тело «припарковано» далеко, камеру ведёт машина
    if (driving.carId != null) {
      b.setNextKinematicTranslation({ x: 0, y: -80, z: 0 })
      updateCamera(dt)
      return
    }

    // Пауза — только камера
    if (!playerState.active) {
      updateCamera(dt)
      return
    }

    const pos = b.translation()
    const wasGrounded = grounded.current

    // ── Ввод (оси камеры) ──
    let fwd = 0
    let str = 0
    if (keys.current['KeyW']) fwd += 1
    if (keys.current['KeyS']) fwd -= 1
    if (keys.current['KeyD']) str += 1
    if (keys.current['KeyA']) str -= 1
    const moving = fwd !== 0 || str !== 0
    const speed = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? RUN : WALK

    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    let dirX = 0
    let dirZ = 0
    if (moving) {
      dirX = sin * fwd - cos * str
      dirZ = cos * fwd + sin * str
      const len = Math.hypot(dirX, dirZ) || 1
      dirX /= len
      dirZ /= len
    }

    // ── Вода ──
    const feetY = pos.y - 1.0
    const inWater = inAnyWater(pos.x, pos.z) && feetY < WATER_LEVEL
    const submerged = inAnyWater(pos.x, pos.z) && pos.y < WATER_LEVEL
    playerState.inWater = inWater

    let hSpeed = speed
    if (inWater) {
      hSpeed = speed * 0.55
      // всплеск при входе
      if (!wasInWater.current && vy.current < -3) {
        splash.current?.burst(pos.x, pos.z, Math.min(2, Math.abs(vy.current) / 6))
      }
      if (submerged && moving && Math.random() < 0.25) {
        splash.current?.burst(pos.x, pos.z, 0.5)
      }
      // плавучесть: медленно тонет, Пробел — всплыть
      vy.current += (keys.current['Space'] ? 20 : -8) * dt
      vy.current = THREE.MathUtils.clamp(vy.current, -3, 5)
    } else {
      // гравитация
      if (wasGrounded && vy.current <= 0) vy.current = -1
      else vy.current -= G * dt
      if (wasGrounded && keys.current['Space']) vy.current = JUMP
    }
    wasInWater.current = inWater

    // ── Движение через контроллер ──
    const desired = {
      x: dirX * hSpeed * dt,
      y: vy.current * dt,
      z: dirZ * hSpeed * dt,
    }
    const collider = b.collider(0)
    c.computeColliderMovement(collider, desired)
    const mv = c.computedMovement()
    const nowGrounded = c.computedGrounded()

    // приземление: присед + пыль
    if (!wasGrounded && nowGrounded && vy.current < -13 && !inWater) {
      crouch.current = Math.min(1, 0.4 + Math.abs(vy.current) / 30)
      const g = groundInfo(pos.x, pos.z)
      dust.current?.burst(pos.x, feetY, pos.z, g.color, Math.min(1.6, Math.abs(vy.current) / 18))
    }
    grounded.current = nowGrounded
    if (nowGrounded && vy.current < 0) vy.current = 0

    b.setNextKinematicTranslation({
      x: pos.x + mv.x,
      y: pos.y + mv.y,
      z: pos.z + mv.z,
    })

    // общая позиция для камеры/травы/воды
    playerState.position.set(pos.x + mv.x, pos.y + mv.y, pos.z + mv.z)
    playerState.velocityY = vy.current

    // респавн
    if (pos.y < -25) {
      b.setNextKinematicTranslation({ x: SPAWN.x, y: SPAWN.y, z: SPAWN.z })
      vy.current = 0
    }

    // ── Анимация ──
    crouch.current = Math.max(0, crouch.current - dt * 3.2)
    const cr = crouch.current * crouch.current * (3 - 2 * crouch.current)

    if (model.current && moving) {
      const target = Math.atan2(dirX, dirZ)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 0.22)
    }
    if (moving && nowGrounded) walkPhase.current += dt * hSpeed * 1.7
    const air = !nowGrounded && !inWater
    const swingBase = moving && nowGrounded ? 0.62 : 0
    const swing = Math.sin(walkPhase.current) * swingBase
    const swing2 = Math.cos(walkPhase.current) * swingBase
    const k = 0.3
    const airLegs = air ? 0.5 : 0
    if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, swing + cr * 0.6 + airLegs, k)
    if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, -swing + cr * 0.6 + airLegs, k)
    if (armL.current) armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, -swing2 * 0.75 - cr * 0.3, k)
    if (armR.current) armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, swing2 * 0.75 - cr * 0.3, k)
    if (bodyGrp.current) {
      const idleBreath = !moving && nowGrounded ? Math.sin(performance.now() * 0.002) * 0.02 : 0
      const bob = moving && nowGrounded ? Math.abs(Math.sin(walkPhase.current)) * 0.06 : idleBreath
      const swim = submerged && !nowGrounded ? 1.1 : 0
      bodyGrp.current.position.y = THREE.MathUtils.lerp(bodyGrp.current.position.y, bob - cr * 0.4, 0.35)
      bodyGrp.current.rotation.x = THREE.MathUtils.lerp(bodyGrp.current.rotation.x, swim, 0.12)
    }

    updateCamera(dt)
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
    >
      <CapsuleCollider args={[0.6, 0.4]} />
      <group ref={model}>
        <group ref={bodyGrp}>
          <Character skin={skin} legL={legL} legR={legR} armL={armL} armR={armR} />
        </group>
      </group>
    </RigidBody>
  )
}
