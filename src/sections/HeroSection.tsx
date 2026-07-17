import { useEffect, useRef } from 'react'
import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import StaticIcon from '../components/StaticIcon'
import type { IconName } from '../data/projects'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'О себе', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

// Позиции иконок (доля от ширины/высоты героя) — по бокам, вне текста.
const FLOATERS: { x: number; y: number; icon: IconName; size: number }[] = [
  { x: 0.11, y: 0.3, icon: 'cube', size: 88 },
  { x: 0.89, y: 0.26, icon: 'orbit', size: 100 },
  { x: 0.17, y: 0.75, icon: 'spark', size: 76 },
  { x: 0.85, y: 0.78, icon: 'chip', size: 90 },
  { x: 0.06, y: 0.55, icon: 'gyro', size: 64 },
  { x: 0.95, y: 0.6, icon: 'spark', size: 70 },
]

/**
 * Левитирующие иконки по бокам. Плавно колышутся; отталкиваются от курсора
 * (можно «расталкивать» мышью), а через 2 секунды бездействия мягко
 * возвращаются на место.
 */
function FloatingIcons() {
  const wrap = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const state = FLOATERS.map((_, i) => ({
      home: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      phase: i * 1.7,
      lastPush: -9999,
    }))
    let rect = el.getBoundingClientRect()
    const cursor = { x: -9999, y: -9999 }

    const setHome = (t: number) => {
      FLOATERS.forEach((c, i) => {
        const s = state[i]
        s.home.x = c.x * rect.width + Math.sin(t * 0.0007 + s.phase) * 18
        s.home.y = c.y * rect.height + Math.cos(t * 0.0006 + s.phase) * 22
      })
    }

    setHome(0)
    state.forEach((s) => {
      s.pos.x = s.home.x
      s.pos.y = s.home.y
    })

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
    }
    const onGeom = () => (rect = el.getBoundingClientRect())

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      rect = el.getBoundingClientRect()
      setHome(now)
      state.forEach((s, i) => {
        const node = nodes.current[i]
        if (!node) return
        if (reduce) {
          s.pos.x = s.home.x
          s.pos.y = s.home.y
        } else {
          const dx = s.pos.x - cursor.x
          const dy = s.pos.y - cursor.y
          const dist = Math.hypot(dx, dy)
          const R = 150
          if (dist < R && dist > 0.01) {
            const f = ((R - dist) / R) * 900
            s.vel.x += (dx / dist) * f * dt
            s.vel.y += (dy / dist) * f * dt
            s.lastPush = now
          }
          // слабая тяга домой пока «толкают», сильная — через 2с покоя
          const k = now - s.lastPush > 2000 ? 7 : 1.6
          s.vel.x += (s.home.x - s.pos.x) * k * dt
          s.vel.y += (s.home.y - s.pos.y) * k * dt
          s.vel.x *= 0.9
          s.vel.y *= 0.9
          s.pos.x += s.vel.x * dt
          s.pos.y += s.vel.y * dt
        }
        node.style.transform = `translate(${s.pos.x}px, ${s.pos.y}px) translate(-50%, -50%)`
      })
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onGeom)
    window.addEventListener('scroll', onGeom, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onGeom)
      window.removeEventListener('scroll', onGeom)
    }
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0 z-0 pointer-events-none">
      {FLOATERS.map((c, i) => (
        <div
          key={i}
          ref={(node) => {
            nodes.current[i] = node
          }}
          className="absolute top-0 left-0"
          style={{ width: c.size, height: c.size, opacity: 0.92 }}
        >
          {/* внутренний слой — заметная idle-анимация (вращение + пульс) */}
          <div className="w-full h-full animate-icon-idle" style={{ animationDelay: `${i * 0.6}s` }}>
            <StaticIcon name={c.icon} color="#ef4a23" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Навбар */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[var(--cream)] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-colors duration-200 hover:text-[var(--accent)]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      {/* Левитирующие иконки по бокам */}
      <FloatingIcons />

      {/* Центрированный заголовок */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none">
        <FadeIn
          as="span"
          delay={0.1}
          y={20}
          className="accent-text font-medium uppercase tracking-[0.35em] text-xs sm:text-sm md:text-lg mb-2 md:mb-4"
        >
          3D-креатор · Motion · Брендинг
        </FadeIn>
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading font-bold uppercase tracking-tighter leading-[0.82] text-center whitespace-nowrap text-[19vw] sm:text-[17vw] md:text-[15vw]"
        >
          NOVIKOV<span className="text-[var(--accent)]">.</span>
        </FadeIn>
      </div>

      {/* Нижняя строка */}
      <div className="relative z-20 flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="text-[var(--cream)] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          Создаю яркие и запоминающиеся 3D-проекты
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
