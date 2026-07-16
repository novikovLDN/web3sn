import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playerState, inAnyWater, isBeach, pitAt, HALF } from './playerState'

const COUNT = 16000
const AREA = HALF * 1.9 // травинки по всей суше

/**
 * Поле травы: инстансированные лопасти, колышутся ветром и прогибаются
 * от близости игрока (bend в вершинном шейдере по uniform uPlayer).
 */
export default function Grass() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  // позиции травинок (детерминированно, вне пруда и вне старта)
  const { offsets, count } = useMemo(() => {
    const arr: number[] = []
    let seed = 1234.5
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < COUNT; i++) {
      const x = (rnd() - 0.5) * AREA
      const z = (rnd() - 0.5) * AREA
      if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) continue
      const h = 0.35 + rnd() * 0.4
      arr.push(x, z, h)
    }
    return { offsets: new Float32Array(arr), count: arr.length / 3 }
  }, [])

  const geom = useMemo(() => {
    // узкая лопасть травы (треугольная полоска)
    const g = new THREE.PlaneGeometry(0.09, 1, 1, 4)
    g.translate(0, 0.5, 0) // основание в 0
    const inst = new THREE.InstancedBufferGeometry()
    inst.index = g.index
    inst.attributes.position = g.attributes.position
    inst.attributes.uv = g.attributes.uv
    const off = new THREE.InstancedBufferAttribute(offsets, 3)
    inst.setAttribute('iOffset', off)
    inst.instanceCount = count
    return inst
  }, [offsets, count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPlayer: { value: new THREE.Vector3(0, 0, 6) },
      uBase: { value: new THREE.Color('#3c6b2f') },
      uTip: { value: new THREE.Color('#7dc257') },
    }),
    []
  )

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt
      matRef.current.uniforms.uPlayer.value.copy(playerState.position)
    }
  })

  return (
    <mesh ref={meshRef} geometry={geom} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        vertexShader={`
          uniform float uTime;
          uniform vec3 uPlayer;
          attribute vec3 iOffset;
          varying float vH;
          void main() {
            float bladeH = iOffset.z;
            vec3 base = vec3(iOffset.x, 0.0, iOffset.y);
            float h = position.y;           // 0..1 вдоль лопасти
            vH = h;

            // ветер
            float wind = sin(uTime * 1.5 + base.x * 0.5 + base.z * 0.5) * 0.18
                       + sin(uTime * 2.7 + base.x) * 0.06;

            vec3 world = base + vec3(position.x, position.y * bladeH, 0.0);

            // прогиб от игрока: чем ближе, тем сильнее клонит от него
            vec2 toP = world.xz - uPlayer.xz;
            float d = length(toP);
            float bend = smoothstep(2.2, 0.0, d);          // радиус влияния 2.2
            vec2 dir = d > 0.001 ? toP / d : vec2(0.0);

            float sway = wind * h;
            world.x += sway;
            world.z += sway * 0.4;
            // приминаем по направлению от игрока + опускаем верхушку
            world.xz += dir * bend * h * 0.9;
            world.y -= bend * h * bladeH * 0.7;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uBase;
          uniform vec3 uTip;
          varying float vH;
          void main() {
            vec3 col = mix(uBase, uTip, vH);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  )
}
