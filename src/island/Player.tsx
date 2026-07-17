import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier, type RapierRigidBody } from '@react-three/rapier'
import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { Character } from './Character'
import { world } from './state'
import { terrainHeight, isWater } from './heightmap'
import { SEA_LEVEL, TUNE } from './config'

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
  controlCam = true,
  onSplash,
  onLand,
  onStep,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
  controlCam?: boolean
  onSplash?: (x: number, z: number, power: number) => void
  onLand?: (x: number, y: number, z: number, power: number) => void
  onStep?: (x: number, y: number, z: number) => void
}) {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<THREE.Group>(null)
  const bodyGrp = useRef<THREE.Group | null>(null)
  const legL = useRef<THREE.Group | null>(null)
  const legR = useRef<THREE.Group | null>(null)
  const armL = useRef<THREE.Group | null>(null)
  const armR = useRef<THREE.Group | null>(null)
  const { world: rapier } = useRapier()
  const { camera } = useThree()

  const ctrl = useRef<KinematicCharacterController | null>(null)
  const vy = useRef(0)
  const velX = useRef(0) // сглаженная горизонтальная скорость (разгон/торможение)
  const velZ = useRef(0)
  const grounded = useRef(false)
  const coyote = useRef(0)
  const jumpBuf = useRef(0)
  const walkPhase = useRef(0)
  const land = useRef(0)
  const wasInWater = useRef(false)
  const stepPhase = useRef(0)
  const camPos = useRef(new THREE.Vector3(0, 8, 14))
  const tmp = useRef(new THREE.Vector3())

  const START: [number, number, number] = [0, terrainHeight(0, 42) + 2, 42]

  useEffect(() => {
    const c = rapier.createCharacterController(0.08)
    c.enableAutostep(0.6, 0.28, true)
    c.enableSnapToGround(0.7)
    c.setApplyImpulsesToDynamicBodies(true)
    c.setSlideEnabled(true)
    c.setMaxSlopeClimbAngle((55 * Math.PI) / 180)
    c.setMinSlopeSlideAngle((46 * Math.PI) / 180)
    ctrl.current = c
    return () => {
      try {
        rapier.removeCharacterController(c)
      } catch {
        /* noop */
      }
    }
  }, [rapier])

  useFrame((_, rawDt) => {
    const b = body.current
    const c = ctrl.current
    if (!b || !c) return
    const dt = Math.min(rawDt, 0.05)

    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)

    // ── Камера (экспоненциальное сглаживание, orbit вокруг игрока) ──
    const p = world.player
    if (controlCam) {
      const cp = Math.cos(pitch.current)
      const dist = TUNE.camDist
      tmp.current.set(
        p.x - sin * dist * cp,
        p.y + TUNE.camHeight + Math.sin(pitch.current) * dist,
        p.z - cos * dist * cp
      )
      const camA = 1 - Math.exp(-TUNE.camLerp * dt)
      camPos.current.lerp(tmp.current, camA)
      camera.position.copy(camPos.current)
      camera.lookAt(p.x, p.y + 1.1, p.z)
    }

    if (!world.active) return

    const pos = b.translation()
    const wasG = grounded.current

    // ── Ввод направления (относительно камеры) ──
    let fwd = 0
    let str = 0
    if (keys.current['KeyW'] || keys.current['ArrowUp']) fwd += 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) fwd -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) str += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) str -= 1
    const moving = fwd !== 0 || str !== 0
    const running = keys.current['ShiftLeft'] || keys.current['ShiftRight']
    world.running = running && moving
    const targetSpeed = running ? TUNE.runSpeed : TUNE.walkSpeed

    let dirX = 0
    let dirZ = 0
    if (moving) {
      dirX = sin * fwd - cos * str
      dirZ = cos * fwd + sin * str
      const l = Math.hypot(dirX, dirZ) || 1
      dirX /= l
      dirZ /= l
    }

    // ── Вода ──
    const groundY = terrainHeight(pos.x, pos.z)
    const inWater = isWater(pos.x, pos.z) && pos.y - 1 < SEA_LEVEL
    const submerged = inWater && pos.y < SEA_LEVEL - 0.3
    world.inWater = inWater

    const spd = inWater ? TUNE.swimSpeed : targetSpeed
    // Плавный разгон/торможение горизонтальной скорости.
    const wantX = dirX * spd
    const wantZ = dirZ * spd
    const rate = moving ? TUNE.accel : TUNE.decel
    const a = 1 - Math.exp(-rate * dt)
    velX.current += (wantX - velX.current) * a
    velZ.current += (wantZ - velZ.current) * a

    // ── Вертикаль: прыжок / гравитация / плавучесть ──
    coyote.current = wasG ? TUNE.coyoteTime : Math.max(0, coyote.current - dt)
    if (keys.current['Space']) jumpBuf.current = TUNE.jumpBuffer
    else jumpBuf.current = Math.max(0, jumpBuf.current - dt)

    if (inWater) {
      if (!wasInWater.current && vy.current < -3) {
        onSplash?.(pos.x, pos.z, Math.min(2, Math.abs(vy.current) / 6))
      }
      vy.current += (keys.current['Space'] ? TUNE.buoyancy * 4 : -TUNE.buoyancy) * dt
      vy.current = THREE.MathUtils.clamp(vy.current, -3, 5)
    } else {
      if (wasG && vy.current <= 0) vy.current = -1
      else vy.current -= TUNE.gravity * dt
      if (jumpBuf.current > 0 && coyote.current > 0) {
        vy.current = TUNE.jump
        coyote.current = 0
        jumpBuf.current = 0
      }
    }
    wasInWater.current = inWater

    // ── Применяем движение через kinematic character controller ──
    const desired = { x: velX.current * dt, y: vy.current * dt, z: velZ.current * dt }
    const collider = b.collider(0)
    c.computeColliderMovement(collider, desired)
    const mv = c.computedMovement()
    const nowG = c.computedGrounded()

    if (!wasG && nowG && vy.current < -11 && !inWater) {
      const power = Math.min(1.6, Math.abs(vy.current) / 16)
      land.current = Math.min(1, 0.4 + power)
      onLand?.(pos.x, pos.y - 1, pos.z, power)
    }
    grounded.current = nowG
    if (nowG && vy.current < 0) vy.current = 0

    const nx = pos.x + mv.x
    const ny = pos.y + mv.y
    const nz = pos.z + mv.z
    b.setNextKinematicTranslation({ x: nx, y: ny, z: nz })
    world.player.set(nx, ny, nz)
    world.playerYaw = yaw.current

    // Респавн при проваливании.
    if (ny < groundY - 6 || ny < -30) {
      b.setNextKinematicTranslation({ x: START[0], y: terrainHeight(START[0], START[2]) + 3, z: START[2] })
      vy.current = 0
      velX.current = 0
      velZ.current = 0
    }

    // ── Анимация ──
    const hSpeed = Math.hypot(velX.current, velZ.current)
    const gait = hSpeed / TUNE.runSpeed
    land.current = Math.max(0, land.current - dt * 3)
    const lc = land.current * land.current * (3 - 2 * land.current)
    const air = !nowG && !inWater

    if (model.current && moving) {
      model.current.rotation.y = lerpAngle(model.current.rotation.y, Math.atan2(dirX, dirZ), TUNE.turnLerp)
    }
    if (nowG && hSpeed > 0.5) {
      const prev = walkPhase.current
      walkPhase.current += dt * (2.4 + gait * 6)
      // шаги (для пыли) — на нижней точке цикла
      stepPhase.current += dt * (2.4 + gait * 6)
      if (Math.floor(prev / Math.PI) !== Math.floor(walkPhase.current / Math.PI)) {
        onStep?.(nx, ny - 1, nz)
      }
    }
    const sw = nowG && hSpeed > 0.5 ? Math.sin(walkPhase.current) * (0.35 + gait * 0.4) : 0
    const sw2 = nowG && hSpeed > 0.5 ? Math.cos(walkPhase.current) * (0.35 + gait * 0.4) : 0
    const k = 0.28
    const airPose = air ? (vy.current > 0 ? 0.5 : 0.9) : 0
    const swim = submerged && air ? 1.2 : 0

    if (legL.current) legL.current.rotation.x = THREE.MathUtils.lerp(legL.current.rotation.x, sw + airPose + lc * 0.7, k)
    if (legR.current) legR.current.rotation.x = THREE.MathUtils.lerp(legR.current.rotation.x, -sw + airPose * 0.5 + lc * 0.7, k)
    if (armL.current) armL.current.rotation.x = THREE.MathUtils.lerp(armL.current.rotation.x, air ? -2.2 : -sw2 * 0.8, k)
    if (armR.current) armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, lc > 0.3 ? 0.4 : air ? -2.2 : sw2 * 0.8, k)
    if (bodyGrp.current) {
      const bob = nowG && hSpeed > 0.5 ? Math.abs(Math.sin(walkPhase.current)) * 0.06 : 0
      bodyGrp.current.position.y = THREE.MathUtils.lerp(bodyGrp.current.position.y, bob - lc * 0.5, 0.35)
      bodyGrp.current.rotation.x = THREE.MathUtils.lerp(bodyGrp.current.rotation.x, swim + lc * 0.3, 0.15)
    }
  })

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={START}>
      <CapsuleCollider args={[0.6, 0.4]} />
      <group ref={model}>
        <group ref={bodyGrp}>
          <Character legL={legL} legR={legR} armL={armL} armR={armR} />
        </group>
      </group>
    </RigidBody>
  )
}
