import * as THREE from 'three'

/**
 * Процедурная пиксельная текстура-«шум» (в стиле Minecraft): рисуем на canvas
 * лёгкую попиксельную вариацию яркости, NearestFilter — блочный вид.
 * Умножается на instanceColor, поэтому даёт детализацию любому цвету блока.
 */
export function makeBlockNoise(size = 16, contrast = 0.16): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    // детерминированный шум
    const n = Math.sin(i * 12.9898) * 43758.5453
    const r = n - Math.floor(n)
    const v = Math.round(255 * (1 - contrast + r * contrast * 2))
    img.data[i * 4] = v
    img.data[i * 4 + 1] = v
    img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  // лёгкая обводка блока (рамка чуть темнее) — читаемые грани
  ctx.strokeStyle = 'rgba(0,0,0,0.14)'
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1)

  const tex = new THREE.CanvasTexture(c)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestMipmapNearestFilter
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}
