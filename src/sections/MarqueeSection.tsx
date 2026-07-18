import { useEffect, useRef } from 'react'
import StaticIcon from '../components/StaticIcon'
import { CARD_THEMES, type CardTheme, type IconName } from '../data/projects'

type TileData = { word: string; icon: IconName; theme: CardTheme }

// Уникальные плитки-заглушки (пока нет реальных превью).
const TILES: TileData[] = [
  { word: '3D-моделинг', icon: 'cube', theme: 'dark' },
  { word: 'Рендер', icon: 'gyro', theme: 'orange' },
  { word: 'Motion', icon: 'orbit', theme: 'cream' },
  { word: 'Брендинг', icon: 'spark', theme: 'dark' },
  { word: 'Веб-дизайн', icon: 'chip', theme: 'orange' },
  { word: 'Анимация', icon: 'orbit', theme: 'cream' },
  { word: 'Концепт', icon: 'spark', theme: 'dark' },
  { word: 'Текстуры', icon: 'cube', theme: 'orange' },
  { word: 'Свет и кадр', icon: 'gyro', theme: 'cream' },
  { word: 'VFX', icon: 'chip', theme: 'dark' },
  { word: 'Гейм-арт', icon: 'orbit', theme: 'orange' },
  { word: 'Композитинг', icon: 'spark', theme: 'cream' },
]

const ROW_ONE = TILES.slice(0, 6)
const ROW_TWO = TILES.slice(6)
const triple = <T,>(a: T[]) => [...a, ...a, ...a]

function Tile({ tile }: { tile: TileData }) {
  const t = CARD_THEMES[tile.theme]
  return (
    <div
      className="rounded-2xl shrink-0 p-6 flex flex-col justify-between select-none"
      style={{ width: 420, height: 270, background: t.bg, color: t.fg }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest"
          style={{ border: `1.5px solid ${t.accent}`, color: t.accent }}
        >
          <span className="inline-flex rounded-full h-1.5 w-1.5" style={{ background: t.accent }} />
          Скоро
        </span>
        <div className="w-12 h-12" style={{ opacity: 0.9 }}>
          <StaticIcon name={tile.icon} color={t.accent} />
        </div>
      </div>
      <h3 className="font-bold uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)' }}>
        {tile.word}
      </h3>
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  const targetOffset = useRef(0)
  const currentOffset = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const computeTarget = () => {
      const section = sectionRef.current
      if (!section) return
      targetOffset.current = (window.scrollY - section.offsetTop + window.innerHeight) * 0.3
      startLoop()
    }

    const render = () => {
      const diff = targetOffset.current - currentOffset.current
      currentOffset.current += diff * 0.12
      const off = currentOffset.current - 200
      if (row1Ref.current) row1Ref.current.style.transform = `translate3d(${off}px,0,0)`
      if (row2Ref.current) row2Ref.current.style.transform = `translate3d(${-off}px,0,0)`
      if (Math.abs(diff) > 0.3) {
        rafId.current = requestAnimationFrame(render)
      } else {
        rafId.current = null
      }
    }

    const startLoop = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(render)
    }

    computeTarget()
    window.addEventListener('scroll', computeTarget, { passive: true })
    window.addEventListener('resize', computeTarget, { passive: true })
    return () => {
      window.removeEventListener('scroll', computeTarget)
      window.removeEventListener('resize', computeTarget)
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0c0b0a] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex gap-3" style={{ willChange: 'transform', transform: 'translate3d(-200px,0,0)' }}>
          {triple(ROW_ONE).map((tile, i) => (
            <Tile key={`r1-${i}`} tile={tile} />
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3" style={{ willChange: 'transform', transform: 'translate3d(200px,0,0)' }}>
          {triple(ROW_TWO).map((tile, i) => (
            <Tile key={`r2-${i}`} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  )
}
