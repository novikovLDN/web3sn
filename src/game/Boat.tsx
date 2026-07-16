import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { WATER_LEVEL } from './playerState'

/**
 * Кораблик на море. Кинематическое тело — мягко покачивается на волнах
 * (позиция/наклон обновляются каждый кадр), по палубе можно ходить.
 */
export default function Boat({
  position,
}: {
  position: [number, number, number]
}) {
  const body = useRef<RapierRigidBody>(null)
  const [bx, , bz] = position

  useFrame(({ clock }) => {
    const b = body.current
    if (!b) return
    const t = clock.getElapsedTime()
    const y = WATER_LEVEL + Math.sin(t * 1.1) * 0.12
    b.setNextKinematicTranslation({ x: bx, y, z: bz })
    const rot = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(Math.sin(t * 0.9) * 0.04, 0, Math.cos(t * 1.3) * 0.05)
    )
    b.setNextKinematicRotation(rot)
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[bx, WATER_LEVEL, bz]}
    >
      {/* палуба-коллайдер (по ней можно ходить) */}
      <CuboidCollider args={[1.5, 0.25, 3]} position={[0, 0.35, 0]} />
      {/* борта */}
      <CuboidCollider args={[0.15, 0.4, 3]} position={[1.5, 0.6, 0]} />
      <CuboidCollider args={[0.15, 0.4, 3]} position={[-1.5, 0.6, 0]} />
      <CuboidCollider args={[1.5, 0.4, 0.15]} position={[0, 0.6, -3]} />

      {/* корпус */}
      <mesh castShadow receiveShadow position={[0, 0, 0.3]}>
        <boxGeometry args={[3, 0.9, 6]} />
        <meshStandardMaterial color="#7a4b28" roughness={0.85} />
      </mesh>
      {/* нос (сужение) */}
      <mesh castShadow position={[0, 0, 3.4]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.1, 0.9, 1.2]} />
        <meshStandardMaterial color="#6e4324" roughness={0.85} />
      </mesh>
      {/* палуба */}
      <mesh receiveShadow position={[0, 0.5, 0.3]}>
        <boxGeometry args={[2.8, 0.1, 5.6]} />
        <meshStandardMaterial color="#a9773f" roughness={0.8} />
      </mesh>
      {/* каюта */}
      <mesh castShadow position={[0, 0.95, -1.6]}>
        <boxGeometry args={[1.8, 0.9, 1.6]} />
        <meshStandardMaterial color="#8a5a30" roughness={0.8} />
      </mesh>
      {/* мачта */}
      <mesh castShadow position={[0, 2.4, 0.6]}>
        <cylinderGeometry args={[0.09, 0.11, 4.4, 12]} />
        <meshStandardMaterial color="#5b3b23" roughness={0.9} />
      </mesh>
      {/* парус */}
      <mesh position={[0, 2.7, 0.62]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.4, 3, 8, 8]} />
        <meshStandardMaterial color="#e8e2d0" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* флаг */}
      <mesh position={[0, 4.5, 0.6]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial color="#c8452f" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  )
}
