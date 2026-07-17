import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { IconSpark, IconCube, IconOrbit, IconChip, IconGyro } from '../components/TechIcons'
import { PROJECTS, type ProjectCard as CardData, type CardTheme, type IconName } from '../data/projects'

/* Пресеты тем оформления карточки. */
const THEMES: Record<CardTheme, { bg: string; fg: string; accent: string }> = {
  orange: { bg: '#ef4a23', fg: '#0c0b0a', accent: '#0c0b0a' },
  cream: { bg: '#ece7db', fg: '#0c0b0a', accent: '#ef4a23' },
  dark: { bg: '#151311', fg: '#ece7db', accent: '#ef4a23' },
}

const ICONS: Record<IconName, typeof IconSpark> = {
  spark: IconSpark,
  cube: IconCube,
  orbit: IconOrbit,
  chip: IconChip,
  gyro: IconGyro,
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
  const Icon = card.icon ? ICONS[card.icon] : IconSpark

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
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full animate-soft-pulse" style={{ background: theme.accent }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: theme.accent }} />
            </span>
            {card.tag}
          </span>
        </div>

        {/* Тело: слева текст, справа скриншот или анимированная иконка */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
          <div className="flex-1 order-2 md:order-1">
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

          <div className="order-1 md:order-2 md:w-[46%] flex items-center justify-center">
            {card.image ? (
              <img
                src={card.image}
                alt={card.title.replace('\n', ' ')}
                loading="lazy"
                className="w-full h-[26vh] md:h-[38vh] object-cover rounded-2xl md:rounded-3xl"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52">
                <Icon color={theme.accent} />
              </div>
            )}
          </div>
        </div>
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
