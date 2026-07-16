import { useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import { playerState, WATER_LEVEL, inAnyWater } from './playerState'
import { driving, carRegistry } from './driving'
import { Character } from './Character'
import type { Skin } from './skins'
import type { SplashHandle } from './Water'

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
  skin,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
  splash: MutableRefObject<SplashHandle | null>
  skin: Skin
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

  const updateCamera = (dt: number) => {
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

    if (grounded && keys.current['Space'] && vy < 3) vy = 9

    if (inWater) {
      if (!wasInWater.current && cur.y < -1.2) {
        splash.current?.burst(pos.x, pos.z, Math.min(2, Math.abs(cur.y) / 5))
      }
      const depth = THREE.MathUtils.clamp(WATER_LEVEL - feetY, 0, 1.4)
      vy += depth * 34 * dt
      vy *= 0.9
      vx *= 0.55
      vz *= 0.55
      if (keys.current['Space']) vy = 5.5
    }
    if (submerged && moving && Math.random() < 0.25) {
      splash.current?.burst(pos.x, pos.z, 0.5)
    }
    wasInWater.current = inWater

    b.setLinvel({ x: vx, y: vy, z: vz }, true)

    // Поворот модели по движению
    if (model.current && moving) {
      const target = Math.atan2(vx, vz)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 0.2)
    }

    // Ходьба
    if (moving && grounded) walkPhase.current += dt * speed * 1.6
    const swing = moving ? Math.sin(walkPhase.current) * 0.6 : 0
    const swing2 = moving ? Math.cos(walkPhase.current) * 0.6 : 0
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = -swing
    if (armL.current) armL.current.rotation.x = -swing2 * 0.7
    if (armR.current) armR.current.rotation.x = swing2 * 0.7

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
    >
      <CapsuleCollider args={[0.6, 0.4]} />
      <group ref={model}>
        <Character skin={skin} legL={legL} legR={legR} armL={armL} armR={armR} />
      </group>
    </RigidBody>
  )
}
