import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playerState, inAnyWater, isBeach, pitAt, HALF } from './playerState'
import { biomeAt, BIOMES } from './biomes'

const COUNT = 22000
const AREA = HALF * 1.9

/**
 * Поле травы: инстансированные лопасти. Цвет и плотность зависят от биома,
 * колышутся ветром и прогибаются от близости игрока.
 */
export default function Grass() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const { offsets, base, tip, count } = useMemo(() => {
    const off: number[] = []
    const bs: number[] = []
    const tp: number[] = []
    const cB = new THREE.Color()
    const cT = new THREE.Color()
    let seed = 1234.5
    const rnd = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < COUNT; i++) {
      const x = (rnd() - 0.5) * AREA
      const z = (rnd() - 0.5) * AREA
      if (inAnyWater(x, z) || isBeach(x, z) || pitAt(x, z)) continue
      const pal = BIOMES[biomeAt(x, z)]
      if (rnd() > pal.grassDensity) continue
      const h = 0.35 + rnd() * 0.4
      off.push(x, z, h)
      cB.set(pal.grassBase)
      cT.set(pal.grassTop)
      bs.push(cB.r, cB.g, cB.b)
      tp.push(cT.r, cT.g, cT.b)
    }
    return {
      offsets: new Float32Array(off),
      base: new Float32Array(bs),
      tip: new Float32Array(tp),
      count: off.length / 3,
    }
  }, [])

  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.09, 1, 1, 4)
    g.translate(0, 0.5, 0)
    const inst = new THREE.InstancedBufferGeometry()
    inst.index = g.index
    inst.attributes.position = g.attributes.position
    inst.attributes.uv = g.attributes.uv
    inst.setAttribute('iOffset', new THREE.InstancedBufferAttribute(offsets, 3))
    inst.setAttribute('iBase', new THREE.InstancedBufferAttribute(base, 3))
    inst.setAttribute('iTip', new THREE.InstancedBufferAttribute(tip, 3))
    inst.instanceCount = count
    return inst
  }, [offsets, base, tip, count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPlayer: { value: new THREE.Vector3(0, 0, 6) },
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
          attribute vec3 iBase;
          attribute vec3 iTip;
          varying float vH;
          varying vec3 vBase;
          varying vec3 vTip;
          void main() {
            float bladeH = iOffset.z;
            vec3 base = vec3(iOffset.x, 0.0, iOffset.y);
            float h = position.y;
            vH = h; vBase = iBase; vTip = iTip;
            float wind = sin(uTime * 1.5 + base.x * 0.5 + base.z * 0.5) * 0.18
                       + sin(uTime * 2.7 + base.x) * 0.06;
            vec3 world = base + vec3(position.x, position.y * bladeH, 0.0);
            vec2 toP = world.xz - uPlayer.xz;
            float dd = length(toP);
            float bend = smoothstep(2.2, 0.0, dd);
            vec2 dir = dd > 0.001 ? toP / dd : vec2(0.0);
            float sway = wind * h;
            world.x += sway;
            world.z += sway * 0.4;
            world.xz += dir * bend * h * 0.9;
            world.y -= bend * h * bladeH * 0.7;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
          }
        `}
        fragmentShader={`
          varying float vH;
          varying vec3 vBase;
          varying vec3 vTip;
          void main() {
            gl_FragColor = vec4(mix(vBase, vTip, vH), 1.0);
          }
        `}
      />
    </mesh>
  )
}
