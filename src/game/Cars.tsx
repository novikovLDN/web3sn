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

/* Колесо с диском */
function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 22]} />
        <meshStandardMaterial color="#16171c" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 18]} />
        <meshStandardMaterial color="#9aa0ab" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

const WHEELS: [number, number, number][] = [
  [0.9, 0.42, 1.25],
  [-0.9, 0.42, 1.25],
  [0.9, 0.42, -1.25],
  [-0.9, 0.42, -1.25],
]

/* Видимая геометрия кузова по типу (выше, детальнее, открытый верх) */
function Body({ variant, color }: { variant: Variant; color: string }) {
  const dark = '#1c1f26'
  return (
    <group>
      {/* общая ходовая-платформа */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.7, 0.4, 3.7]} />
        <meshStandardMaterial color={dark} roughness={0.6} metalness={0.4} />
      </mesh>

      {variant === 'roadster' && (
        <>
          {/* низкий спортивный корпус */}
          <mesh castShadow position={[0, 0.85, -0.2]}>
            <boxGeometry args={[1.7, 0.5, 3.0]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* капот */}
          <mesh castShadow position={[0, 0.82, 1.5]}>
            <boxGeometry args={[1.6, 0.34, 1.0]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* задний гребень */}
          <mesh castShadow position={[0, 1.05, -1.4]}>
            <boxGeometry args={[1.7, 0.34, 0.5]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* лобовое стекло-рамка */}
          <mesh position={[0, 1.35, 0.55]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[1.5, 0.5, 0.05]} />
            <meshStandardMaterial color="#bfe4ff" transparent opacity={0.45} metalness={0.3} roughness={0.1} />
          </mesh>
        </>
      )}

      {variant === 'jeep' && (
        <>
          {/* высокий кузов */}
          <mesh castShadow position={[0, 1.0, 0]}>
            <boxGeometry args={[1.8, 0.9, 3.3]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* капот-морда */}
          <mesh castShadow position={[0, 0.95, 1.55]}>
            <boxGeometry args={[1.8, 0.7, 0.6]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* дуги безопасности */}
          {[-0.7, 0.6].map((z, i) => (
            <mesh key={i} position={[0, 1.75, z]}>
              <torusGeometry args={[0.8, 0.06, 8, 20, Math.PI]} />
              <meshStandardMaterial color="#20242c" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
          {/* багажник на крыше-дугах */}
          <mesh position={[0, 1.85, -0.05]}>
            <boxGeometry args={[1.5, 0.06, 1.4]} />
            <meshStandardMaterial color="#2a2e36" metalness={0.5} roughness={0.4} />
          </mesh>
        </>
      )}

      {variant === 'pickup' && (
        <>
          {/* кабина спереди */}
          <mesh castShadow position={[0, 1.05, 0.75]}>
            <boxGeometry args={[1.75, 0.95, 1.6]} />
            <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
          </mesh>
          {/* морда */}
          <mesh castShadow position={[0, 0.85, 1.75]}>
            <boxGeometry args={[1.75, 0.55, 0.5]} />
            <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
          </mesh>
          {/* открытый грузовой кузов */}
          <mesh castShadow position={[0, 0.9, -1.15]}>
            <boxGeometry args={[1.75, 0.7, 1.9]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.05, -1.15]}>
            <boxGeometry args={[1.5, 0.3, 1.6]} />
            <meshStandardMaterial color="#15171c" roughness={0.9} />
          </mesh>
          {/* стекло кабины */}
          <mesh position={[0, 1.5, 1.35]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[1.6, 0.55, 0.05]} />
            <meshStandardMaterial color="#bfe4ff" transparent opacity={0.45} metalness={0.3} roughness={0.1} />
          </mesh>
        </>
      )}

      {/* сиденья (видно в открытом верхе) */}
      {[-0.42, 0.42].map((x, i) => (
        <group key={i} position={[x, 0.75, -0.15]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.16, 0.55]} />
            <meshStandardMaterial color="#26282f" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.32, -0.28]}>
            <boxGeometry args={[0.5, 0.6, 0.14]} />
            <meshStandardMaterial color="#26282f" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* руль */}
      <mesh position={[-0.42, 1.15, 0.35]} rotation={[-0.9, 0, 0]}>
        <torusGeometry args={[0.2, 0.035, 8, 20]} />
        <meshStandardMaterial color="#15171c" roughness={0.5} />
      </mesh>

      {/* фары */}
      {[0.55, -0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.7, 1.9]}>
          <boxGeometry args={[0.28, 0.2, 0.06]} />
          <meshStandardMaterial color="#fff4c2" emissive="#fff0a0" emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* стопы */}
      {[0.55, -0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.7, -1.9]}>
          <boxGeometry args={[0.24, 0.16, 0.06]} />
          <meshStandardMaterial color="#e02020" emissive="#ff2020" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {WHEELS.map((p, i) => (
        <Wheel key={i} position={p} />
      ))}
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
      <CuboidCollider args={[0.95, 0.7, 2.0]} position={[0, 0.7, 0]} />
      <Body variant={variant} color={color} />
      {/* водитель (виден только когда за рулём) */}
      <group ref={rider} position={[-0.42, 0.62, -0.1]} visible={false}>
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
