import { useMemo } from 'react'
import * as THREE from 'three'
import { WORLD, PAL } from './config'
import { terrainHeight, terrainSlope, isWater, POND, rng } from './heightmap'
import { QUALITY } from './quality'

/**
 * Вся статичная растительность одним модулем на InstancedMesh —
 * тысячи объектов почти без затрат на кадр.
 */
export default function Vegetation() {
  const meshes = useMemo(() => buildVegetation(), [])
  return (
    <group>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </group>
  )
}

/** Пригодна ли точка для растительности (суша, не слишком круто, не у воды). */
function plantable(x: number, z: number, minY: number, maxY: number, maxSlope: number) {
  const y = terrainHeight(x, z)
  if (y < minY || y > maxY) return null
  if (isWater(x, z)) return null
  // не сажаем в пруд и у самой кромки
  const pd = Math.hypot(x - POND.x, z - POND.z)
  if (pd < POND.r + 1.5) return null
  if (terrainSlope(x, z) > maxSlope) return null
  return y
}

function buildVegetation(): THREE.Object3D[] {
  const out: THREE.Object3D[] = []
  const R = WORLD / 2 - 4
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const scl = new THREE.Vector3()
  const pos = new THREE.Vector3()

  // ── Деревья (ствол + крона в 3 яруса) ──
  const rand = rng(1337)
  const trees: { x: number; y: number; z: number; s: number; rot: number; autumn: boolean }[] = []
  for (let i = 0; i < 2600; i++) {
    const x = (rand() * 2 - 1) * R
    const z = (rand() * 2 - 1) * R
    const y = plantable(x, z, 1.2, 15, 0.5)
    if (y == null) continue
    if (trees.length >= QUALITY.trees) break
    trees.push({ x, y, z, s: 0.8 + rand() * 0.9, rot: rand() * Math.PI * 2, autumn: rand() > 0.82 })
  }

  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 1.6, 6)
  trunkGeo.translate(0, 0.8, 0)
  const trunkMat = new THREE.MeshStandardMaterial({ color: PAL.trunk, roughness: 0.9 })
  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length)
  trunkMesh.castShadow = true
  trunkMesh.receiveShadow = true

  // три яруса кроны на одном инстансе-меше каждый
  const canopyGeos = [
    new THREE.IcosahedronGeometry(1.15, 0),
    new THREE.IcosahedronGeometry(0.95, 0),
    new THREE.IcosahedronGeometry(0.7, 0),
  ]
  const canopyMeshes = canopyGeos.map((g) => {
    const mesh = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ roughness: 0.8, flatShading: true }), trees.length)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  })
  const canopyOffsets = [1.9, 2.7, 3.3]
  const canopyColor = new THREE.Color()

  trees.forEach((t, i) => {
    q.setFromAxisAngle(up, t.rot)
    scl.set(t.s, t.s, t.s)
    pos.set(t.x, t.y, t.z)
    m4.compose(pos, q, scl)
    trunkMesh.setMatrixAt(i, m4)
    const base = t.autumn ? PAL.leafAutumn : rand() > 0.5 ? PAL.leaf : PAL.leaf2
    canopyMeshes.forEach((cm, li) => {
      pos.set(t.x, t.y + canopyOffsets[li] * t.s, t.z)
      scl.set(t.s, t.s * 0.9, t.s)
      m4.compose(pos, q, scl)
      cm.setMatrixAt(i, m4)
      canopyColor.set(base).offsetHSL(0, 0, (li - 1) * 0.03)
      cm.setColorAt(i, canopyColor)
    })
  })
  canopyMeshes.forEach((cm) => {
    if (cm.instanceColor) cm.instanceColor.needsUpdate = true
  })
  out.push(trunkMesh, ...canopyMeshes)

  // ── Камни / валуны ──
  const rr = rng(777)
  const rocks: { x: number; y: number; z: number; s: number; rot: number }[] = []
  for (let i = 0; i < 2200; i++) {
    const x = (rr() * 2 - 1) * R
    const z = (rr() * 2 - 1) * R
    const y = plantable(x, z, -0.3, 20, 0.9)
    if (y == null) continue
    if (rocks.length >= QUALITY.rocks) break
    rocks.push({ x, y: y - 0.15, z, s: 0.4 + rr() * 1.4, rot: rr() * Math.PI * 2 })
  }
  const rockGeo = new THREE.DodecahedronGeometry(0.6, 0)
  const rockMesh = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ color: PAL.rock, roughness: 1, flatShading: true }), rocks.length)
  rockMesh.castShadow = true
  rockMesh.receiveShadow = true
  rocks.forEach((rk, i) => {
    q.setFromEuler(new THREE.Euler(rr() * 0.5, rk.rot, rr() * 0.5))
    scl.set(rk.s, rk.s * 0.7, rk.s)
    pos.set(rk.x, rk.y, rk.z)
    m4.compose(pos, q, scl)
    rockMesh.setMatrixAt(i, m4)
  })
  out.push(rockMesh)

  // ── Трава (кустики-«ёлочки») ──
  const gr = rng(2024)
  const grassMatrices: THREE.Matrix4[] = []
  const grassColors: THREE.Color[] = []
  const gc = new THREE.Color()
  for (let i = 0; i < 26000; i++) {
    const x = (gr() * 2 - 1) * R
    const z = (gr() * 2 - 1) * R
    const y = plantable(x, z, 0.8, 12, 0.55)
    if (y == null) continue
    if (grassMatrices.length >= QUALITY.grass) break
    q.setFromAxisAngle(up, gr() * Math.PI * 2)
    const s = 0.5 + gr() * 0.7
    scl.set(s, s * (0.8 + gr() * 0.8), s)
    pos.set(x, y, z)
    const mm = new THREE.Matrix4().compose(pos, q, scl)
    grassMatrices.push(mm)
    gc.set(gr() > 0.5 ? PAL.grassLow : PAL.grass).offsetHSL(0, 0, (gr() - 0.5) * 0.1)
    grassColors.push(gc.clone())
  }
  const bladeGeo = new THREE.ConeGeometry(0.12, 0.5, 4)
  bladeGeo.translate(0, 0.25, 0)
  const grassMesh = new THREE.InstancedMesh(bladeGeo, new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), grassMatrices.length)
  grassMesh.receiveShadow = true
  grassMatrices.forEach((mm, i) => {
    grassMesh.setMatrixAt(i, mm)
    grassMesh.setColorAt(i, grassColors[i])
  })
  if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true
  out.push(grassMesh)

  // ── Цветы (стебель + бутон) ──
  const fr = rng(99)
  const flowers: { x: number; y: number; z: number; c: number }[] = []
  for (let i = 0; i < 9000; i++) {
    const x = (fr() * 2 - 1) * R
    const z = (fr() * 2 - 1) * R
    const y = plantable(x, z, 0.9, 8, 0.4)
    if (y == null) continue
    if (flowers.length >= QUALITY.flowers) break
    flowers.push({ x, y, z, c: Math.floor(fr() * PAL.flower.length) })
  }
  const budGeo = new THREE.SphereGeometry(0.09, 8, 8)
  budGeo.translate(0, 0.35, 0)
  const budMesh = new THREE.InstancedMesh(budGeo, new THREE.MeshStandardMaterial({ roughness: 0.5, vertexColors: false }), flowers.length)
  const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.35, 4)
  stemGeo.translate(0, 0.175, 0)
  const stemMesh = new THREE.InstancedMesh(stemGeo, new THREE.MeshStandardMaterial({ color: '#3f7a33', roughness: 0.8 }), flowers.length)
  const fc = new THREE.Color()
  flowers.forEach((f, i) => {
    pos.set(f.x, f.y, f.z)
    m4.compose(pos, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
    budMesh.setMatrixAt(i, m4)
    stemMesh.setMatrixAt(i, m4)
    fc.set(PAL.flower[f.c])
    budMesh.setColorAt(i, fc)
  })
  if (budMesh.instanceColor) budMesh.instanceColor.needsUpdate = true
  out.push(stemMesh, budMesh)

  return out
}
