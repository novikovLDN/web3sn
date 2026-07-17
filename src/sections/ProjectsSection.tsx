import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { IconSpark, IconCube, IconOrbit } from '../components/TechIcons'

type Slot = {
  number: string
  tag: string
  title: string
  text: string
  bg: string
  fg: string
  accent: string
  icon: ReactNode
}

const SLOTS: Slot[] = [
  {
    number: '01',
    tag: 'В работе',
    title: 'Скоро здесь\nбудет магия',
    text: 'Уже колдуем над первым кейсом. Заглядывайте чуть позже — покажем что-то яркое.',
    bg: '#ef4a23',
    fg: '#0c0b0a',
    accent: '#0c0b0a',
    icon: <IconSpark color="#0c0b0a" />,
  },
  {
    number: '02',
    tag: 'Готовим',
    title: 'Кое-что\nинтересное',
    text: 'Собираем проект по кусочкам, как хороший low-poly мир. Ещё немного терпения :)',
    bg: '#ece7db',
    fg: '#0c0b0a',
    accent: '#ef4a23',
    icon: <IconCube color="#ef4a23" />,
  },
  {
    number: '03',
    tag: 'Загружается',
    title: 'Место для\nвашего кейса',
    text: 'Хотите оказаться здесь? Давайте сделаем проект, которым будем гордиться вместе.',
    bg: '#151311',
    fg: '#ece7db',
    accent: '#ef4a23',
    icon: <IconOrbit color="#ef4a23" />,
  },
]

const RADIUS = 'rounded-[32px] sm:rounded-[44px] md:rounded-[56px]'

function ProjectCard({ slot, index, total }: { slot: Slot; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div
      ref={containerRef}
      className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32"
      style={{ top: `${index * 28}px` }}
    >
      <motion.div
        style={{ scale, background: slot.bg, color: slot.fg }}
        className={`w-full ${RADIUS} overflow-hidden p-6 sm:p-8 md:p-12`}
      >
        {/* Верхняя строка */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <span className="font-bold leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}>
            {slot.number}
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-widest"
            style={{ border: `1.5px solid ${slot.accent}`, color: slot.accent }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-soft-pulse"
                style={{ background: slot.accent }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: slot.accent }} />
            </span>
            {slot.tag}
          </span>
        </div>

        {/* Контент: иконка + текст */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 shrink-0">{slot.icon}</div>
          <div className="flex-1">
            <h3
              className="font-bold uppercase leading-[0.95] tracking-tight whitespace-pre-line mb-4"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
            >
              {slot.title}
            </h3>
            <p
              className="font-light max-w-xl"
              style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)', opacity: 0.8 }}
            >
              {slot.text}
            </p>
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
      <FadeIn
        as="span"
        delay={0}
        y={20}
        className="accent-text block text-center font-medium uppercase tracking-[0.3em] text-xs sm:text-sm mb-4"
      >
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
        {SLOTS.map((slot, i) => (
          <ProjectCard key={slot.number} slot={slot} index={i} total={SLOTS.length} />
        ))}
      </div>
    </section>
  )
}
