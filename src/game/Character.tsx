import { type MutableRefObject } from 'react'
import * as THREE from 'three'
import type { Skin } from './skins'

type Ref = MutableRefObject<THREE.Group | null>

function Head({ skin }: { skin: Skin }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.68, 0.68, 0.66]} />
        <meshStandardMaterial color={skin.skin} roughness={0.8} />
      </mesh>
      {/* волосы сверху */}
      <mesh position={[0, 0.26, -0.02]}>
        <boxGeometry args={[0.74, 0.26, 0.72]} />
        <meshStandardMaterial color={skin.hair} roughness={0.95} />
      </mesh>
      {/* женские длинные волосы сзади */}
      {skin.female && (
        <>
          <mesh position={[0, -0.05, -0.36]}>
            <boxGeometry args={[0.6, 0.7, 0.14]} />
            <meshStandardMaterial color={skin.hair} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.15, 0.36]}>
            <boxGeometry args={[0.72, 0.28, 0.06]} />
            <meshStandardMaterial color={skin.hair} roughness={0.95} />
          </mesh>
        </>
      )}
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
  )
}

/* ── Стоящий персонаж (руки/ноги на рефах для анимации ходьбы) ─── */
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
  const torsoW = skin.female ? 0.64 : 0.72
  return (
    <group position={[0, -1, 0]}>
      {/* Ноги */}
      {[legL, legR].map((r, idx) => (
        <group key={idx} ref={r} position={[idx === 0 ? -0.19 : 0.19, 0.9, 0]}>
          <mesh castShadow position={[0, -0.45, 0]}>
            <boxGeometry args={[0.32, 0.9, 0.34]} />
            <meshStandardMaterial color={skin.pants} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.94, 0.02]}>
            <boxGeometry args={[0.34, 0.14, 0.4]} />
            <meshStandardMaterial color={skin.shoes} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Торс */}
      <mesh castShadow position={[0, 1.32, 0]}>
        <boxGeometry args={[torsoW, 0.9, 0.42]} />
        <meshStandardMaterial color={skin.shirt} roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.32, 0.22]}>
        <boxGeometry args={[torsoW, 0.24, 0.02]} />
        <meshStandardMaterial
          color={skin.shirt2}
          emissive={skin.shirt2}
          emissiveIntensity={0.35}
          roughness={0.6}
        />
      </mesh>

      {/* Руки */}
      {[armL, armR].map((r, idx) => (
        <group key={idx} ref={r} position={[idx === 0 ? -0.46 : 0.46, 1.72, 0]}>
          <mesh castShadow position={[0, -0.42, 0]}>
            <boxGeometry args={[0.22, 0.9, 0.28]} />
            <meshStandardMaterial color={skin.shirt} roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, -0.94, 0]}>
            <boxGeometry args={[0.2, 0.22, 0.26]} />
            <meshStandardMaterial color={skin.skin} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Шея */}
      <mesh position={[0, 1.86, 0]}>
        <boxGeometry args={[0.3, 0.14, 0.3]} />
        <meshStandardMaterial color={skin.skin} roughness={0.8} />
      </mesh>

      <group position={[0, 2.28, 0]}>
        <Head skin={skin} />
      </group>
    </group>
  )
}

/* ── Сидящий персонаж (водитель в машине), фиксированная поза ──── */
export function SittingRider({ skin }: { skin: Skin }) {
  const torsoW = skin.female ? 0.6 : 0.66
  return (
    <group>
      {/* бёдра горизонтально вперёд */}
      {[-0.17, 0.17].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.5, 0.28]}>
          <boxGeometry args={[0.3, 0.28, 0.66]} />
          <meshStandardMaterial color={skin.pants} roughness={0.9} />
        </mesh>
      ))}
      {/* голени вниз */}
      {[-0.17, 0.17].map((x, i) => (
        <group key={i}>
          <mesh castShadow position={[x, 0.2, 0.6]}>
            <boxGeometry args={[0.28, 0.55, 0.28]} />
            <meshStandardMaterial color={skin.pants} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[x, -0.02, 0.72]}>
            <boxGeometry args={[0.3, 0.14, 0.4]} />
            <meshStandardMaterial color={skin.shoes} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* торс */}
      <mesh castShadow position={[0, 0.9, 0.02]}>
        <boxGeometry args={[torsoW, 0.72, 0.4]} />
        <meshStandardMaterial color={skin.shirt} roughness={0.75} />
      </mesh>

      {/* руки вперёд к рулю */}
      {[-0.36, 0.36].map((x, i) => (
        <group key={i} position={[x, 1.05, 0.1]} rotation={[-1.1, 0, 0]}>
          <mesh castShadow position={[0, -0.32, 0]}>
            <boxGeometry args={[0.2, 0.7, 0.24]} />
            <meshStandardMaterial color={skin.shirt} roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, -0.72, 0]}>
            <boxGeometry args={[0.18, 0.2, 0.22]} />
            <meshStandardMaterial color={skin.skin} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* шея */}
      <mesh position={[0, 1.32, 0.02]}>
        <boxGeometry args={[0.28, 0.14, 0.28]} />
        <meshStandardMaterial color={skin.skin} roughness={0.8} />
      </mesh>

      {/* голова */}
      <group position={[0, 1.5, 0.02]}>
        <Head skin={skin} />
      </group>
    </group>
  )
}
