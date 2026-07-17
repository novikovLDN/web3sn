import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { PROJECTS, type ProjectCard as CardData, type CardTheme, type IconName } from '../data/projects'

/* Пресеты тем оформления карточки. */
const THEMES: Record<CardTheme, { bg: string; fg: string; accent: string }> = {
  orange: { bg: '#ef4a23', fg: '#0c0b0a', accent: '#0c0b0a' },
  cream: { bg: '#ece7db', fg: '#0c0b0a', accent: '#ef4a23' },
  dark: { bg: '#151311', fg: '#ece7db', accent: '#ef4a23' },
}

/* ── Простые статичные иконки (как в исходной версии) ───────────── */
function StaticIcon({ name, color }: { name: IconName; color: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-full h-full',
  }
  switch (name) {
    case 'cube':
      return (
        <svg {...common}>
          <path d="M24 4 44 14v20L24 44 4 34V14z" />
          <path d="M24 4v20M24 24 4 14M24 24l20-10M24 24v20" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="6" fill={color} stroke="none" />
          <ellipse cx="24" cy="24" rx="20" ry="9" />
          <ellipse cx="24" cy="24" rx="20" ry="9" transform="rotate(60 24 24)" />
        </svg>
      )
    case 'chip':
      return (
        <svg {...common}>
          <rect x="16" y="16" width="16" height="16" rx="2" />
          <path d="M20 16v-6M28 16v-6M20 38v-6M28 38v-6M16 20h-6M16 28h-6M38 20h-6M38 28h-6" />
        </svg>
      )
    case 'gyro':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="4" fill={color} stroke="none" />
          <circle cx="24" cy="24" r="18" />
          <ellipse cx="24" cy="24" rx="18" ry="8" />
          <ellipse cx="24" cy="24" rx="8" ry="18" />
        </svg>
      )
    case 'spark':
    default:
      return (
        <svg {...common}>
          <path d="M24 4v14M24 30v14M4 24h14M30 24h14" />
          <path d="M12 12l8 8M28 28l8 8M36 12l-8 8M20 28l-8 8" opacity="0.5" />
        </svg>
      )
  }
}

const RADIUS = 'rounded-[32px] sm:rounded-[44px] md:rounded-[56px]'

function ProjectCard({ card, index, total }: { card: CardData; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  const theme = THEMES[card.theme]

  const text: ReactNode = (
    <div className="flex-1">
      <h3
        className="font-bold uppercase leading-[0.95] tracking-tight whitespace-pre-line mb-4"
        style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
      >
        {card.title}
      </h3>
      <p className="font-light max-w-xl" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.3rem)', opacity: 0.82 }}>
        {card.text}
      </p>
      {card.link && (
        <a
          href={card.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-6 font-medium uppercase tracking-widest text-sm"
          style={{ color: theme.accent }}
        >
          Смотреть проект →
        </a>
      )}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
      style={{ top: `${index * 28}px` }}
    >
      <motion.div
        style={{ scale, background: theme.bg, color: theme.fg }}
        className={`w-full ${RADIUS} overflow-hidden p-6 sm:p-8 md:p-12`}
      >
        {/* Верхняя строка: номер + статус */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <span className="font-bold leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}>
            {card.number}
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-widest"
            style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
          >
            <span className="inline-flex rounded-full h-2 w-2" style={{ background: theme.accent }} />
            {card.tag}
          </span>
        </div>

        {/* Тело: скриншот (если есть) или статичная иконка слева + текст */}
        {card.image ? (
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            {text}
            <div className="md:w-[46%]">
              <img
                src={card.image}
                alt={card.title.replace('\n', ' ')}
                loading="lazy"
                className="w-full h-[26vh] md:h-[38vh] object-cover rounded-2xl md:rounded-3xl"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 shrink-0">
              <StaticIcon name={card.icon ?? 'spark'} color={theme.accent} />
            </div>
            {text}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 bg-[var(--ink)] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20"
    >
      <FadeIn as="span" delay={0} y={20} className="accent-text block text-center font-medium uppercase tracking-[0.3em] text-xs sm:text-sm mb-4">
        Портфолио
      </FadeIn>
      <FadeIn
        as="h2"
        delay={0.06}
        y={40}
        className="hero-heading font-bold uppercase leading-none tracking-tight text-center mb-8 sm:mb-12"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Проекты
      </FadeIn>

      <div className="max-w-6xl mx-auto">
        {PROJECTS.map((card, i) => (
          <ProjectCard key={card.number + i} card={card} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  )
}
