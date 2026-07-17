import { type MutableRefObject } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Skin } from './skins'

type Ref = MutableRefObject<THREE.Group | null>

function Head({ skin }: { skin: Skin }) {
  return (
    <group>
      {/* голова — сглаженная */}
      <mesh castShadow>
        <sphereGeometry args={[0.29, 32, 32]} />
        <meshStandardMaterial color={skin.skin} roughness={0.55} />
      </mesh>
      {/* волосы — шапочка */}
      <mesh position={[0, 0.08, -0.02]}>
        <sphereGeometry args={[0.305, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={skin.hair} roughness={0.85} />
      </mesh>
      {skin.female && (
        <mesh position={[0, -0.12, -0.22]}>
          <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
          <meshStandardMaterial color={skin.hair} roughness={0.85} />
        </mesh>
      )}
      {/* глаза */}
      <mesh position={[-0.11, 0.02, 0.25]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[0.11, 0.02, 0.25]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  )
}

function Limb({
  color,
  handColor,
  len = 0.9,
  radius = 0.1,
  hand = true,
}: {
  color: string
  handColor: string
  len?: number
  radius?: number
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

/* ── Стоящий персонаж (гладкий, PS5-ish) ──────────────────────── */
export function Character({
  skin,
  legL,
  legR,
  armL,
  armR,
}: {
  skin: Skin
  legL: Ref
  legR: Ref
  armL: Ref
  armR: Ref
}) {
  const torsoW = skin.female ? 0.5 : 0.56
  return (
    <group position={[0, -1, 0]}>
      {/* Ноги */}
      {[legL, legR].map((r, i) => (
        <group key={i} ref={r} position={[i === 0 ? -0.16 : 0.16, 0.92, 0]}>
          <Limb color={skin.pants} handColor={skin.pants} len={0.92} radius={0.13} hand={false} />
          <mesh castShadow position={[0, -0.95, 0.05]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={skin.shoes} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Таз */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={skin.pants} roughness={0.75} />
      </mesh>

      {/* Торс */}
      <RoundedBox args={[torsoW, 0.86, 0.36]} radius={0.16} smoothness={4} position={[0, 1.35, 0]} castShadow>
        <meshStandardMaterial color={skin.shirt} roughness={0.65} />
      </RoundedBox>
      {/* акцентная полоса */}
      <mesh position={[0, 1.28, 0.19]}>
        <boxGeometry args={[torsoW * 0.9, 0.18, 0.02]} />
        <meshStandardMaterial color={skin.shirt2} emissive={skin.shirt2} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>

      {/* Руки */}
      {[armL, armR].map((r, i) => (
        <group key={i} ref={r} position={[i === 0 ? -0.36 : 0.36, 1.72, 0]}>
          <Limb color={skin.shirt} handColor={skin.skin} len={0.82} radius={0.09} />
        </group>
      ))}

      {/* Шея */}
      <mesh position={[0, 1.86, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.16, 16]} />
        <meshStandardMaterial color={skin.skin} roughness={0.6} />
      </mesh>

      <group position={[0, 2.22, 0]}>
        <Head skin={skin} />
      </group>
    </group>
  )
}

/* ── Сидящий персонаж (водитель) ──────────────────────────────── */
export function SittingRider({ skin }: { skin: Skin }) {
  const torsoW = skin.female ? 0.48 : 0.54
  return (
    <group>
      {/* бёдра вперёд */}
      {[-0.16, 0.16].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.5, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.13, 0.4, 8, 16]} />
          <meshStandardMaterial color={skin.pants} roughness={0.75} />
        </mesh>
      ))}
      {/* голени вниз */}
      {[-0.16, 0.16].map((x, i) => (
        <group key={i}>
          <mesh castShadow position={[x, 0.22, 0.58]}>
            <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
            <meshStandardMaterial color={skin.pants} roughness={0.75} />
          </mesh>
          <mesh castShadow position={[x, -0.02, 0.7]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={skin.shoes} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* торс */}
      <RoundedBox args={[torsoW, 0.7, 0.36]} radius={0.15} smoothness={4} position={[0, 0.9, 0.02]} castShadow>
        <meshStandardMaterial color={skin.shirt} roughness={0.65} />
      </RoundedBox>
      {/* руки к рулю */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.95, 0.28]} rotation={[-1.1, 0, 0]}>
          <capsuleGeometry args={[0.09, 0.5, 8, 16]} />
          <meshStandardMaterial color={skin.shirt} roughness={0.65} />
        </mesh>
      ))}
      {/* шея */}
      <mesh position={[0, 1.3, 0.02]}>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 16]} />
        <meshStandardMaterial color={skin.skin} roughness={0.6} />
      </mesh>
      <group position={[0, 1.6, 0.02]}>
        <Head skin={skin} />
      </group>
    </group>
  )
}
