import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { SittingRider } from './Character'
import type { Skin } from './skins'
import { playerState } from './playerState'
import { driving, registerCar, unregisterCar } from './driving'

type Keys = MutableRefObject<Record<string, boolean>>

type Variant = 'roadster' | 'jeep' | 'pickup'

const _q = new THREE.Quaternion()
const _fwd = new THREE.Vector3()

/* Колесо */
function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh castShadow position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.34, 0.34, 0.26, 20]} />
      <meshStandardMaterial color="#141519" roughness={0.7} />
    </mesh>
  )
}

/* Видимая геометрия кузова по типу (все с открытым верхом) */
function Body({ variant, color }: { variant: Variant; color: string }) {
  const glass = '#8fd0ff'
  return (
    <group>
      {variant === 'roadster' && (
        <>
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.5, 3.6]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.55} />
          </mesh>
          {/* капот скошенный спереди */}
          <mesh castShadow position={[0, 0.55, 1.7]}>
            <boxGeometry args={[1.4, 0.34, 0.8]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.55} />
          </mesh>
          {/* лобовое стекло-рамка */}
          <mesh position={[0, 0.95, 0.5]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[1.3, 0.5, 0.04]} />
            <meshStandardMaterial color={glass} transparent opacity={0.4} metalness={0.3} roughness={0.1} />
          </mesh>
        </>
      )}
      {variant === 'jeep' && (
        <>
          <mesh castShadow position={[0, 0.62, 0]}>
            <boxGeometry args={[1.7, 0.8, 3.4]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* дуги безопасности (открытый верх) */}
          {[-0.7, 0.5].map((z, i) => (
            <mesh key={i} position={[0, 1.3, z]}>
              <torusGeometry args={[0.7, 0.05, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#20242c" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
        </>
      )}
      {variant === 'pickup' && (
        <>
          <mesh castShadow position={[0, 0.55, 0.6]}>
            <boxGeometry args={[1.6, 0.66, 2.2]} />
            <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
          </mesh>
          {/* открытый кузов сзади */}
          <mesh castShadow position={[0, 0.5, -1.4]}>
            <boxGeometry args={[1.6, 0.56, 1.6]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.66, -1.4]}>
            <boxGeometry args={[1.4, 0.3, 1.4]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.95, 1.5]} rotation={[-0.45, 0, 0]}>
            <boxGeometry args={[1.4, 0.5, 0.04]} />
            <meshStandardMaterial color={glass} transparent opacity={0.4} metalness={0.3} roughness={0.1} />
          </mesh>
        </>
      )}

      {/* руль */}
      <mesh position={[-0.36, 0.92, 0.35]} rotation={[-0.9, 0, 0]}>
        <torusGeometry args={[0.18, 0.03, 8, 20]} />
        <meshStandardMaterial color="#15171c" roughness={0.5} />
      </mesh>

      {/* фары */}
      {[0.45, -0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 1.85]}>
          <boxGeometry args={[0.24, 0.16, 0.05]} />
          <meshStandardMaterial color="#fff4c2" emissive="#fff0a0" emissiveIntensity={1.3} />
        </mesh>
      ))}
      {/* стопы */}
      {[0.5, -0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.5, -1.85]}>
          <boxGeometry args={[0.2, 0.14, 0.05]} />
          <meshStandardMaterial color="#e02020" emissive="#ff2020" emissiveIntensity={0.7} />
        </mesh>
      ))}

      {/* колёса */}
      <Wheel position={[0.85, 0.34, 1.2]} />
      <Wheel position={[-0.85, 0.34, 1.2]} />
      <Wheel position={[0.85, 0.34, -1.2]} />
      <Wheel position={[-0.85, 0.34, -1.2]} />
    </group>
  )
}

function Car({
  id,
  variant,
  color,
  position,
  keys,
  skin,
  yaw,
}: {
  id: number
  variant: Variant
  color: string
  position: [number, number, number]
  keys: Keys
  skin: Skin
  yaw: MutableRefObject<number>
}) {
  const body = useRef<RapierRigidBody>(null)
  const rider = useRef<THREE.Group>(null)

  useEffect(() => {
    if (body.current) registerCar(id, body.current)
    return () => unregisterCar(id)
  }, [id])

  useFrame(() => {
    const b = body.current
    if (!b) return
    const isDriven = driving.carId === id && playerState.active

    if (rider.current) rider.current.visible = isDriven
    if (!isDriven) return

    // текущий forward из поворота кузова
    const r = b.rotation()
    _q.set(r.x, r.y, r.z, r.w)
    _fwd.set(0, 0, 1).applyQuaternion(_q)
    const vel = b.linvel()
    const speed = vel.x * _fwd.x + vel.z * _fwd.z // проекция скорости на forward

    let throttle = 0
    if (keys.current['KeyW']) throttle += 1
    if (keys.current['KeyS']) throttle -= 1
    const maxV = throttle > 0 ? 16 : 8
    const target = throttle * maxV
    const newSpeed = THREE.MathUtils.lerp(speed, target, 0.05)

    b.setLinvel(
      { x: _fwd.x * newSpeed, y: vel.y, z: _fwd.z * newSpeed },
      true
    )

    // руление зависит от скорости и знака движения
    let steer = 0
    if (keys.current['KeyA']) steer += 1
    if (keys.current['KeyD']) steer -= 1
    const grip = THREE.MathUtils.clamp(Math.abs(newSpeed) / 3, 0, 1)
    const dirSign = newSpeed >= 0 ? 1 : -1
    b.setAngvel({ x: 0, y: steer * 1.8 * grip * dirSign, z: 0 }, true)

    // камера следит за машиной; синхронизируем yaw с курсом машины при езде
    const t = b.translation()
    playerState.position.set(t.x, t.y + 0.6, t.z)
    const heading = Math.atan2(_fwd.x, _fwd.z)
    yaw.current = THREE.MathUtils.lerp(yaw.current, heading, 0.06)
  })

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={position}
      friction={0.8}
      restitution={0.02}
      linearDamping={0.4}
      angularDamping={2}
      density={1.2}
      enabledRotations={[false, true, false]}
    >
      <CuboidCollider args={[0.9, 0.5, 1.9]} position={[0, 0.55, 0]} />
      <Body variant={variant} color={color} />
      {/* водитель (виден только когда за рулём) */}
      <group ref={rider} position={[-0.02, 0.35, -0.25]} visible={false}>
        <SittingRider skin={skin} />
      </group>
    </RigidBody>
  )
}

export default function Cars({
  keys,
  skin,
  yaw,
}: {
  keys: Keys
  skin: Skin
  yaw: MutableRefObject<number>
}) {
  return (
    <group>
      <Car id={1} variant="roadster" color="#c8452f" position={[-6, 1, -4]} keys={keys} skin={skin} yaw={yaw} />
      <Car id={2} variant="jeep" color="#2f6bc8" position={[9, 1, 4]} keys={keys} skin={skin} yaw={yaw} />
      <Car id={3} variant="pickup" color="#2fae7a" position={[4, 1, -12]} keys={keys} skin={skin} yaw={yaw} />
    </group>
  )
}
