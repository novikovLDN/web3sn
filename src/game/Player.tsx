import { useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import { playerState, WATER, inPond } from './playerState'
import type { SplashHandle } from './Water'

type Keys = MutableRefObject<Record<string, boolean>>

function lerpAngle(a: number, b: number, t: number) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

/* ── Блочный персонаж (Minecraft-ish, но детализированный) ─────── */
function Character({
  legL,
  legR,
  armL,
  armR,
}: {
  legL: MutableRefObject<THREE.Group | null>
  legR: MutableRefObject<THREE.Group | null>
  armL: MutableRefObject<THREE.Group | null>
  armR: MutableRefObject<THREE.Group | null>
}) {
  const skin = '#d3a17a'
  const shirt = '#7621b0'
  const shirt2 = '#b600a8'
  const pants = '#26303f'
  return (
    <group position={[0, -1, 0]}>
      {/* Ноги (пивот у бедра для качания) */}
      <group ref={legL} position={[-0.19, 0.9, 0]}>
        <mesh castShadow position={[0, -0.45, 0]}>
          <boxGeometry args={[0.32, 0.9, 0.34]} />
          <meshStandardMaterial color={pants} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, -0.94, 0.02]}>
          <boxGeometry args={[0.34, 0.14, 0.4]} />
          <meshStandardMaterial color="#161a20" roughness={0.7} />
        </mesh>
      </group>
      <group ref={legR} position={[0.19, 0.9, 0]}>
        <mesh castShadow position={[0, -0.45, 0]}>
          <boxGeometry args={[0.32, 0.9, 0.34]} />
          <meshStandardMaterial color={pants} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, -0.94, 0.02]}>
          <boxGeometry args={[0.34, 0.14, 0.4]} />
          <meshStandardMaterial color="#161a20" roughness={0.7} />
        </mesh>
      </group>

      {/* Торс */}
      <mesh castShadow position={[0, 1.32, 0]}>
        <boxGeometry args={[0.72, 0.9, 0.42]} />
        <meshStandardMaterial color={shirt} roughness={0.75} />
      </mesh>
      {/* акцентная полоса на груди */}
      <mesh position={[0, 1.32, 0.22]}>
        <boxGeometry args={[0.72, 0.24, 0.02]} />
        <meshStandardMaterial
          color={shirt2}
          emissive={shirt2}
          emissiveIntensity={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Руки (пивот у плеча) */}
      <group ref={armL} position={[-0.46, 1.72, 0]}>
        <mesh castShadow position={[0, -0.42, 0]}>
          <boxGeometry args={[0.22, 0.9, 0.28]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, -0.94, 0]}>
          <boxGeometry args={[0.2, 0.22, 0.26]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
      </group>
      <group ref={armR} position={[0.46, 1.72, 0]}>
        <mesh castShadow position={[0, -0.42, 0]}>
          <boxGeometry args={[0.22, 0.9, 0.28]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, -0.94, 0]}>
          <boxGeometry args={[0.2, 0.22, 0.26]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
      </group>

      {/* Шея */}
      <mesh position={[0, 1.86, 0]}>
        <boxGeometry args={[0.3, 0.14, 0.3]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>

      {/* Голова */}
      <group position={[0, 2.28, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.68, 0.68, 0.66]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
        {/* волосы */}
        <mesh position={[0, 0.26, -0.02]}>
          <boxGeometry args={[0.72, 0.24, 0.7]} />
          <meshStandardMaterial color="#241a12" roughness={0.9} />
        </mesh>
        {/* глаза */}
        <mesh position={[-0.15, 0.02, 0.34]}>
          <boxGeometry args={[0.1, 0.12, 0.02]} />
          <meshStandardMaterial color="#15110d" />
        </mesh>
        <mesh position={[0.15, 0.02, 0.34]}>
          <boxGeometry args={[0.1, 0.12, 0.02]} />
          <meshStandardMaterial color="#15110d" />
        </mesh>
      </group>
    </group>
  )
}

export default function Player({
  keys,
  yaw,
  pitch,
  splash,
}: {
  keys: Keys
  yaw: MutableRefObject<number>
  pitch: MutableRefObject<number>
  splash: MutableRefObject<SplashHandle | null>
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

  useFrame((_, dt) => {
    const b = body.current
    if (!b) return
    const pos = b.translation()

    // Проверка «на земле» лучом вниз
    const ray = new rapier.Ray(
      { x: pos.x, y: pos.y, z: pos.z },
      { x: 0, y: -1, z: 0 }
    )
    const hit = world.castRay(ray, 1.4, true, undefined, undefined, undefined, b)
    const grounded = !!hit && hit.timeOfImpact <= 1.12

    // Ввод в локальных осях камеры
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
    // Вперёд камеры = (sin, cos); вправо = (cos, -sin)
    let vx = 0
    let vz = 0
    if (moving) {
      vx = sin * fwd + cos * str
      vz = cos * fwd - sin * str
      const len = Math.hypot(vx, vz) || 1
      vx = (vx / len) * speed
      vz = (vz / len) * speed
    }

    const cur = b.linvel()
    let vy = cur.y

    // ── Вода: плавучесть, брызги, замедление ──────────────────
    const feetY = pos.y - 1.0
    const inWater = inPond(pos.x, pos.z) && feetY < WATER.level
    const submerged = inPond(pos.x, pos.z) && pos.y < WATER.level
    playerState.inWater = inWater

    if (grounded && keys.current['Space'] && vy < 3) vy = 8.2

    if (inWater) {
      // всплеск при входе (по вертикальной скорости)
      if (!wasInWater.current && cur.y < -1.5) {
        splash.current?.burst(pos.x, pos.z, Math.min(2, Math.abs(cur.y) / 5))
      }
      // выталкивание + сопротивление воды
      const depth = THREE.MathUtils.clamp(WATER.level - feetY, 0, 1)
      vy += depth * 30 * dt // архимедова сила
      vy *= 0.9 // демпфирование
      vx *= 0.55
      vz *= 0.55
      // «выпрыгнуть» из воды пробелом
      if (keys.current['Space']) vy = 5.5
    }
    wasInWater.current = inWater

    b.setLinvel({ x: vx, y: vy, z: vz }, true)

    // мелкие брызги при плавании
    if (submerged && Math.random() < 0.2) {
      splash.current?.burst(pos.x, pos.z, 0.4)
    }

    // Поворот модели по направлению движения
    if (model.current && moving) {
      const target = Math.atan2(vx, vz)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 0.2)
    }

    // Анимация ходьбы
    if (moving && grounded) walkPhase.current += dt * speed * 1.6
    const swing = moving ? Math.sin(walkPhase.current) * 0.6 : 0
    const swing2 = moving ? Math.cos(walkPhase.current) * 0.6 : 0
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = -swing
    if (armL.current) armL.current.rotation.x = -swing2 * 0.7
    if (armR.current) armR.current.rotation.x = swing2 * 0.7

    // Камера от 3-го лица (орбита за спиной)
    const dist = 7
    const cp = Math.cos(pitch.current)
    const desiredX = pos.x - sin * dist * cp
    const desiredZ = pos.z - cos * dist * cp
    const desiredY = pos.y + 2.2 + Math.sin(pitch.current) * dist
    tmp.current.set(desiredX, desiredY, desiredZ)
    camPos.current.lerp(tmp.current, 1 - Math.pow(0.001, dt))
    camera.position.copy(camPos.current)
    camera.lookAt(pos.x, pos.y + 1.4, pos.z)

    // Разделяемая позиция для травы/воды
    playerState.position.set(pos.x, pos.y, pos.z)
    playerState.velocityY = cur.y

    // Респавн, если вдруг провалился
    if (pos.y < -10) {
      b.setTranslation({ x: 0, y: 3, z: 6 }, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
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
        <Character legL={legL} legR={legR} armL={armL} armR={armR} />
      </group>
    </RigidBody>
  )
}
