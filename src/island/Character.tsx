import { type MutableRefObject } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export type Skin = {
  skin: string
  hair: string
  shirt: string
  shirt2: string
  pants: string
  shoes: string
}

export const HERO_SKIN: Skin = {
  skin: '#e0b48c',
  hair: '#241a12',
  shirt: '#7621b0',
  shirt2: '#ff5ccb',
  pants: '#26303f',
  shoes: '#15181f',
}

type Ref = MutableRefObject<THREE.Group | null>

function Head({ skin }: { skin: Skin }) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={skin.skin} roughness={0.5} />
      </mesh>
      {/* волосы */}
      <mesh position={[0, 0.09, -0.02]}>
        <sphereGeometry args={[0.315, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={skin.hair} roughness={0.9} />
      </mesh>
      {/* нос */}
      <mesh position={[0, -0.02, 0.29]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={skin.skin} roughness={0.5} />
      </mesh>
      {/* глаза */}
      {[-0.11, 0.11].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0.26]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#1a1410" />
        </mesh>
      ))}
    </group>
  )
}

function Limb({
  color,
  handColor,
  len,
  radius,
  hand = true,
}: {
  color: string
  handColor: string
  len: number
  radius: number
  hand?: boolean
}) {
  return (
    <>
      <mesh castShadow position={[0, -len / 2, 0]}>
        <capsuleGeometry args={[radius, len - radius * 2, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {hand && (
        <mesh castShadow position={[0, -len - 0.02, 0]}>
          <sphereGeometry args={[radius + 0.03, 16, 16]} />
          <meshStandardMaterial color={handColor} roughness={0.6} />
        </mesh>
      )}
    </>
  )
}

/** Стоящий/движущийся персонаж с анимируемыми конечностями. */
export function Character({
  skin = HERO_SKIN,
  legL,
  legR,
  armL,
  armR,
}: {
  skin?: Skin
  legL: Ref
  legR: Ref
  armL: Ref
  armR: Ref
}) {
  const torsoW = 0.56
  return (
    <group position={[0, -1, 0]}>
      {/* Ноги */}
      {[legL, legR].map((r, i) => (
        <group key={i} ref={r} position={[i === 0 ? -0.16 : 0.16, 0.92, 0]}>
          <Limb color={skin.pants} handColor={skin.pants} len={0.92} radius={0.13} hand={false} />
          <mesh castShadow position={[0, -0.97, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.13, 0.14, 8, 16]} />
            <meshStandardMaterial color={skin.shoes} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Таз */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial color={skin.pants} roughness={0.75} />
      </mesh>

      {/* Торс */}
      <RoundedBox args={[torsoW, 0.88, 0.37]} radius={0.17} smoothness={4} position={[0, 1.36, 0]} castShadow>
        <meshStandardMaterial color={skin.shirt} roughness={0.6} />
      </RoundedBox>
      {/* неоновая акцентная полоса */}
      <mesh position={[0, 1.3, 0.195]}>
        <boxGeometry args={[torsoW * 0.92, 0.16, 0.02]} />
        <meshStandardMaterial color={skin.shirt2} emissive={skin.shirt2} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {/* воротник */}
      <mesh position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.1, 16]} />
        <meshStandardMaterial color={skin.shirt} roughness={0.6} />
      </mesh>

      {/* Руки */}
      {[armL, armR].map((r, i) => (
        <group key={i} ref={r} position={[i === 0 ? -0.37 : 0.37, 1.74, 0]}>
          <Limb color={skin.shirt} handColor={skin.skin} len={0.82} radius={0.09} />
        </group>
      ))}

      {/* Шея */}
      <mesh position={[0, 1.88, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.16, 16]} />
        <meshStandardMaterial color={skin.skin} roughness={0.6} />
      </mesh>

      <group position={[0, 2.26, 0]}>
        <Head skin={skin} />
      </group>
    </group>
  )
}
