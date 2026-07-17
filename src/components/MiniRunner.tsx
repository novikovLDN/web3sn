import { useEffect, useRef, useState } from 'react'

/**
 * Маленький человечек, который плавно (spring, apple-ish) бежит за системным
 * курсором «по пятам». При резком движении курсора получает «пинок» —
 * импульс в сторону движения, потом догоняет снова. Системный курсор остаётся.
 * Активен только на устройствах с точным указателем.
 */
export default function MiniRunner() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const charRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const wrap = wrapRef.current
    const char = charRef.current
    if (!wrap || !char) return

    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const prevCursor = { ...cursor }
    let cursorVX = 0
    let cursorVY = 0
    const pos = { x: cursor.x, y: cursor.y + 40 }
    const vel = { x: 0, y: 0 }
    let facing = 1
    let running = false
    let raf = 0
    let last = performance.now()
    let visible = false

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
      if (!visible) {
        visible = true
        wrap.style.opacity = '1'
        pos.x = cursor.x
        pos.y = cursor.y + 30
      }
    }
    const onLeave = () => {
      visible = false
      wrap.style.opacity = '0'
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now

      // скорость курсора (для «пинка» и анимации)
      cursorVX = (cursor.x - prevCursor.x) / (dt || 0.016)
      cursorVY = (cursor.y - prevCursor.y) / (dt || 0.016)
      prevCursor.x = cursor.x
      prevCursor.y = cursor.y

      // цель — чуть позади курсора по направлению его движения («по пятам»)
      const cs = Math.hypot(cursorVX, cursorVY)
      const trail = Math.min(cs * 0.03, 46)
      const dirx = cs > 1 ? cursorVX / cs : 0
      const diry = cs > 1 ? cursorVY / cs : 0
      const targetX = cursor.x - dirx * trail
      const targetY = cursor.y - diry * trail + 6

      // spring к цели
      const k = 90 // жёсткость
      const damp = 0.86 // затухание
      vel.x += (targetX - pos.x) * k * dt
      vel.y += (targetY - pos.y) * k * dt
      vel.x *= damp
      vel.y *= damp

      // «пинок»: если курсор быстро налетает на человечка — импульс
      const dx = cursor.x - pos.x
      const dy = cursor.y - pos.y
      const dist = Math.hypot(dx, dy)
      if (dist < 34 && cs > 900) {
        vel.x += dirx * cs * 0.35
        vel.y += diry * cs * 0.35 - 120 // немного подбрасывает
      }

      pos.x += vel.x * dt
      pos.y += vel.y * dt

      const speed = Math.hypot(vel.x, vel.y)
      if (speed > 30) facing = vel.x >= 0 ? 1 : -1
      const shouldRun = speed > 40
      if (shouldRun !== running) {
        running = shouldRun
        char.classList.toggle('runner-run', running)
      }
      const lean = Math.max(-18, Math.min(18, vel.x * 0.02))

      wrap.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)`
      char.style.transform = `scaleX(${facing}) rotate(${facing * lean}deg)`

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={wrapRef} className="mini-runner" style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>
      <div ref={charRef} style={{ transformOrigin: 'center bottom', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))' }}>
        <svg width="26" height="34" viewBox="0 0 26 34" fill="#ef4a23" stroke="#ece7db" strokeWidth="0.9" strokeLinejoin="round">
          {/* задняя рука/нога */}
          <rect className="runner-limb arm-b" x="11.5" y="12" width="2.2" height="8" rx="1.1" opacity="0.85" />
          <rect className="runner-limb leg-b" x="11.4" y="20" width="2.6" height="10" rx="1.3" opacity="0.85" />
          {/* туловище */}
          <rect x="10.5" y="11" width="5" height="10" rx="2.4" />
          {/* передняя нога/рука */}
          <rect className="runner-limb leg-a" x="12" y="20" width="2.6" height="10" rx="1.3" />
          <rect className="runner-limb arm-a" x="12.3" y="12" width="2.2" height="8" rx="1.1" />
          {/* голова */}
          <circle cx="13" cy="6" r="4.2" />
        </svg>
      </div>
    </div>
  )
}
