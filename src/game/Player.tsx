import { useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import { playerState, WATER_LEVEL, inAnyWater, groundInfo } from './playerState'
import { driving, carRegistry } from './driving'
import { Character } from './Character'
import type { Skin } from './skins'
import type { SplashHandle } from './Water'
import type { DustHandle } from './Dust'

type Keys = MutableRefObject<Record<string, boolean>>

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
  const legL = useRef<THREE.Group | null>(null)
  const legR = useRef<THREE.Group | null>(null)
  const armL = useRef<THREE.Group | null>(null)
  const armR = useRef<THREE.Group | null>(null)
  const { rapier, world } = useRapier()
  const { camera } = useThree()

  const walkPhase = useRef(0)
  const camPos = useRef(new THREE.Vector3(0, 5, 10))
  const tmp = useRef(new THREE.Vector3())
  const wasInWater = useRef(false)
  const prevF = useRef(false)
  // приземление
  const airborne = useRef(false)
  const maxAirY = useRef(0)
  const crouch = useRef(0) // 0..1 текущая глубина приседа
  const bodyRef = useRef<THREE.Group | null>(null)

  const updateCamera = (dt: number) => {
    if (debug) return // в debug-режиме камерой управляет DebugCam
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
    camPos.current.lerp(tmp.current, 1 - Math.pow(0.001, dt))
    camera.position.copy(camPos.current)
    camera.lookAt(p.x, p.y + 1.4, p.z)
  }

  useFrame((_, dt) => {
    const b = body.current
    if (!b) return

    // Вход/выход из машины по F (только в активной игре)
    const fDown = !!keys.current['KeyF']
    if (playerState.active && fDown && !prevF.current) {
      if (driving.carId == null) {
        const pp = b.translation()
        let best: { id: number; d: number } | null = null
        for (const c of carRegistry) {
          const t = c.body.translation()
          const d = Math.hypot(t.x - pp.x, t.z - pp.z)
          if (d < 4 && (!best || d < best.d)) best = { id: c.id, d }
        }
        if (best) {
          driving.carId = best.id
          b.setEnabled(false)
          if (model.current) model.current.visible = false
        }
      } else {
        const c = carRegistry.find((c) => c.id === driving.carId)
        driving.carId = null
        b.setEnabled(true)
        if (c) {
          const t = c.body.translation()
          b.setTranslation({ x: t.x + 2.4, y: 3, z: t.z }, true)
        }
        b.setLinvel({ x: 0, y: 0, z: 0 }, true)
        if (model.current) model.current.visible = true
      }
    }
    prevF.current = fDown

    // За рулём: тело выключено, камеру ведёт машина (playerState.position)
    if (driving.carId != null) {
      updateCamera(dt)
      return
    }

    // Пауза/не активна: только камера
    if (!playerState.active) {
      updateCamera(dt)
      return
    }

    const pos = b.translation()

    // На земле? — луч вниз
    const ray = new rapier.Ray(
      { x: pos.x, y: pos.y, z: pos.z },
      { x: 0, y: -1, z: 0 }
    )
    const hit = world.castRay(ray, 1.4, true, undefined, undefined, undefined, b)
    const grounded = !!hit && hit.timeOfImpact <= 1.12

    // Ввод в осях камеры
    let fwd = 0
    let str = 0
    if (keys.current['KeyW']) fwd += 1
    if (keys.current['KeyS']) fwd -= 1
    if (keys.current['KeyD']) str += 1
    if (keys.current['KeyA']) str -= 1
    const moving = fwd !== 0 || str !== 0
    const speed = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 8.5 : 5

    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    let vx = 0
    let vz = 0
    if (moving) {
      vx = sin * fwd - cos * str
      vz = cos * fwd + sin * str
      const len = Math.hypot(vx, vz) || 1
      vx = (vx / len) * speed
      vz = (vz / len) * speed
    }

    const cur = b.linvel()
    let vy = cur.y

    // Вода
    const feetY = pos.y - 1.0
    const region = inAnyWater(pos.x, pos.z)
    const inWater = region && feetY < WATER_LEVEL
    const submerged = region && pos.y < WATER_LEVEL
    playerState.inWater = inWater

    if (inWater) {
      // всплеск при входе
      if (!wasInWater.current && cur.y < -1.2) {
        splash.current?.burst(pos.x, pos.z, Math.min(2, Math.abs(cur.y) / 5))
      }
      // сопротивление воды + медленное погружение (можно утонуть)
      vx *= 0.55
      vz *= 0.55
      vy = cur.y * 0.82 - 5 * dt
      // всплыть / держаться на плаву — Пробел
      if (keys.current['Space']) vy = 4.8
    } else if (grounded && keys.current['Space'] && vy < 3) {
      vy = 9
    }
    if (submerged && moving && Math.random() < 0.25) {
      splash.current?.burst(pos.x, pos.z, 0.5)
    }
    wasInWater.current = inWater

    // Плавный разгон/торможение по горизонтали (не рывками)
    const accel = grounded ? 1 - Math.pow(0.0006, dt) : 1 - Math.pow(0.06, dt)
    const smx = THREE.MathUtils.lerp(cur.x, vx, accel)
    const smz = THREE.MathUtils.lerp(cur.z, vz, accel)
    b.setLinvel({ x: smx, y: vy, z: smz }, true)

    // ── Приземление: присед при падении > 2 блоков + пыль ─────
    if (!grounded) {
      airborne.current = true
      if (pos.y > maxAirY.current) maxAirY.current = pos.y
    } else if (airborne.current) {
      airborne.current = false
      const fall = maxAirY.current - pos.y
      if (fall > 2 && !inWater) {
        crouch.current = Math.min(1, 0.4 + (fall - 2) / 5)
        const g = groundInfo(pos.x, pos.z)
        if (g.type !== 'water') {
          dust.current?.burst(pos.x, feetY, pos.z, g.color, Math.min(1.6, fall / 3))
        }
      }
      maxAirY.current = pos.y
    }
    if (grounded) maxAirY.current = pos.y
    // затухание приседа
    crouch.current = Math.max(0, crouch.current - dt * 3.2)
    const cr = crouch.current * crouch.current * (3 - 2 * crouch.current) // smooth

    // Поворот модели по движению
    if (model.current && moving) {
      const target = Math.atan2(vx, vz)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 0.22)
    }

    // Ходьба + покачивание корпуса
    if (moving && grounded) walkPhase.current += dt * speed * 1.7
    const run = speed > 6 ? 1.15 : 1
    const swing = moving && grounded ? Math.sin(walkPhase.current) * 0.62 * run : 0
    const swing2 = moving && grounded ? Math.cos(walkPhase.current) * 0.62 * run : 0
    const airLegs = airborne.current ? 0.5 : 0 // подтянуть ноги в прыжке
    const k = 0.3 // сглаживание конечностей
    if (legL.current)
      legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, swing + cr * 0.6 + airLegs, k)
    if (legR.current)
      legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, -swing + cr * 0.6 + airLegs, k)
    if (armL.current)
      armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, -swing2 * 0.75 - cr * 0.3, k)
    if (armR.current)
      armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, swing2 * 0.75 - cr * 0.3, k)

    // покачивание при ходьбе / дыхание в покое / присед / плавание
    if (bodyRef.current) {
      const clock = walkPhase.current
      const idleBreath = !moving && grounded ? Math.sin(performance.now() * 0.002) * 0.02 : 0
      const bob = moving && grounded ? Math.abs(Math.sin(clock)) * 0.06 : idleBreath
      const lean = moving && speed > 6 ? 0.08 : 0
      const swim = submerged && !grounded ? 1.1 : 0 // горизонтальная поза в воде
      bodyRef.current.position.y = THREE.MathUtils.lerp(
        bodyRef.current.position.y,
        bob - cr * 0.4,
        0.35
      )
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyRef.current.rotation.x,
        lean + swim,
        0.12
      )
    }

    // Общая позиция для камеры/травы/воды
    playerState.position.set(pos.x, pos.y, pos.z)
    playerState.velocityY = cur.y

    // Респавн
    if (pos.y < -12) {
      b.setTranslation({ x: 0, y: 3, z: 6 }, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }

    updateCamera(dt)
  })

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[0, 3, 6]}
      enabledRotations={[false, false, false]}
      mass={1}
      friction={0.6}
      linearDamping={0.6}
      canSleep={false}
      ccd
    >
      <CapsuleCollider args={[0.6, 0.4]} />
      <group ref={model}>
        <group ref={bodyRef}>
          <Character skin={skin} legL={legL} legR={legR} armL={armL} armR={armR} />
        </group>
      </group>
    </RigidBody>
  )
}
