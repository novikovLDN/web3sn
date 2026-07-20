/**
 * Motion — полноэкранная страница услуги.
 *
 * Экран должен доказывать компетенцию, а не иллюстрировать её. Поэтому три
 * его главных блока — не картинки, а работающие инструменты: шкала
 * длительностей, лаборатория кривых и экспозиционный лист. Все три показывают
 * ту самую систему, по которой сделан весь сайт.
 *
 * Что было убрано при пересборке и почему:
 *  • Счётчики «140+ проектов / 8 лет / 24-7 на связи» — цифры, которые нечем
 *    подтвердить. Одна непроверяемая цифра обесценивает все соседние.
 *  • Портал из колец и второе крупное слово на скролле — 500vh прокрутки,
 *    не сообщавшей ничего. Пространство здесь работает лучше плотности.
 *  • Сетка «Что я анимирую» дублировала горизонтальную галерею форматов
 *    почти дословно. Осталась галерея — у неё своя раскладка.
 */

import { useCallback, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, useVelocity } from 'framer-motion'
import { C, MOTION_VARS, DISPLAY, MONO, T } from './motion/palette'
import { cssEase, duration, ease, stagger as staggerScale, inView as inViewCfg } from '../design/motion'
import { useMotionFonts } from './motion/useMotionFonts'
import { Reveal, WordReveal, Kinetic, Magnetic, usePrefersReducedMotion } from './motion/primitives'
import MotionHero from './motion/MotionHero'
import DopeSheet from './motion/DopeSheet'
import EasingLab from './motion/EasingLab'
import { scrollToTarget } from '../lib/scroll'

/* ── Общий ритм появления блоков ─────────────────────────────────
   Шаг и кривая — из системы, не подобраны на глаз. */
const staggerParent = { hidden: {}, show: { transition: { staggerChildren: staggerScale.item } } }
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.entrance } },
}

/** Вертикальный ритм секции — из токенов, чтобы воздух был один на весь сайт. */
const sectionPad = { paddingBlock: 'var(--section-y)' } as const

function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 mb-12 md:mb-16">
      <Reveal>
        <h2 className="font-bold uppercase" style={{ color: 'var(--m-chalk)', ...T.h2, ...DISPLAY }}>
          {title}
        </h2>
      </Reveal>
      {note && (
        <Reveal delay={0.08} y={12}>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--m-dim)', ...MONO }}>
            {note}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ── Шкала длительностей ──────────────────────────────────────────
   Заменила блок выдуманных счётчиков. Здесь нет ни одной цифры, которую
   нельзя проверить: это буквально duration из src/design/motion.ts.
   Шесть фишек стартуют одновременно и приходят в разное время — шкала
   становится видимой, а не описанной словами. */
const DURATIONS = [
  { ms: 120, name: 'instant', use: 'Смена состояния, подсветка' },
  { ms: 240, name: 'fast', use: 'Наведение, фокус, мелкий сдвиг' },
  { ms: 400, name: 'base', use: 'Переход состояния' },
  { ms: 650, name: 'slow', use: 'Появление блока контента' },
  { ms: 950, name: 'slower', use: 'Разворот секции' },
  { ms: 1400, name: 'cinematic', use: 'Переход между экранами' },
] as const

function TimingScale() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.35 })
  const pucks = useRef<(HTMLSpanElement | null)[]>([])

  /** Сброс без перехода → форсированный reflow → общий старт. */
  const run = useCallback(() => {
    pucks.current.forEach((el, i) => {
      const lane = el?.parentElement
      if (!el || !lane) return
      const travel = Math.max(0, lane.clientWidth - el.offsetWidth)
      el.style.transition = 'none'
      el.style.transform = 'translate3d(0,0,0)'
      // Без этого чтения браузер схлопнет сброс и запуск в один стиль.
      void el.offsetHeight
      el.style.transition = `transform ${DURATIONS[i].ms}ms ${cssEase.standard}`
      el.style.transform = `translate3d(${travel}px,0,0)`
    })
  }, [])

  useEffect(() => {
    if (visible && !reduced) run()
  }, [visible, reduced, run])

  return (
    <section id="m-timing" className="px-6 md:px-12" style={sectionPad}>
      <div className="max-w-5xl">
        <SectionHead title="Шкала длительностей" note="Шесть ступеней · одни на весь сайт" />

        <Reveal className="max-w-[52ch] mb-12" y={16}>
          <p className="font-light" style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.6 }}>
            Длительность здесь не подбирается под каждую анимацию. Ступеней шесть,
            они кратны, и они общие для всех экранов. Ниже — все шесть, запущенные
            одновременно.
          </p>
        </Reveal>

        <div ref={ref} className="flex flex-col">
          {DURATIONS.map((d, i) => (
            <div
              key={d.name}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[7rem_1fr_14rem] items-center gap-x-5 gap-y-2 py-5"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <span className="text-[11px] tabular-nums tracking-[0.18em]" style={{ color: 'var(--m-sea)', ...MONO }}>
                {d.ms} МС
              </span>
              {/* Дорожка: фишка едет только на transform */}
              <span className="relative block h-6 col-span-2 md:col-span-1 order-last md:order-none">
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-1/2 h-px"
                  style={{ background: C.border }}
                />
                <span
                  ref={(el) => {
                    pucks.current[i] = el
                  }}
                  aria-hidden
                  className="absolute left-0 top-1/2 block h-2.5 w-2.5 -translate-y-1/2 rounded-sm"
                  style={{ background: i === DURATIONS.length - 1 ? C.ember : C.seaGlass }}
                />
              </span>
              <span className="text-xs md:text-right font-light" style={{ color: 'var(--m-dim)' }}>
                {d.use}
              </span>
            </div>
          ))}
        </div>

        {!reduced && (
          <button
            type="button"
            onClick={run}
            className="mt-8 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60"
            style={{ color: 'var(--m-ember)', ...MONO }}
          >
            ▶ Прогнать шкалу
          </button>
        )}
      </div>
    </section>
  )
}

/* ── Горизонтальная галерея форматов ────────────────────────────
   Единственный «кинематографичный» блок экрана: полоса едет по горизонтали,
   пока страница прокручивается по вертикали. Sticky-контейнер обязан
   оставаться без overflow-hidden у предков — иначе прилипание ломается,
   поэтому обрезка живёт на самом липком элементе. */
const FORMATS = [
  { t: 'Explainer', d: 'Продукт объяснён за минуту: сценарий, раскадровка, сборка.', c: C.ember },
  { t: 'Логотип в движении', d: 'Интро, аутро и стингеры, собранные из логики самого знака.', c: C.seaGlass },
  { t: 'UI-моушн', d: 'Переходы и микросостояния, отданные разработке спецификацией.', c: '#A8C9C5' },
  { t: 'Соцсети', d: 'Вертикальный формат: ритм рассчитан на просмотр без звука.', c: C.deepOcean },
  { t: '3D-моушн', d: 'Объём, свет и симуляции там, где плоскость уже не справляется.', c: C.petrol },
  { t: 'Титры и графика', d: 'Ловер-трети, инфографика, субтитры — набор, который держит сетку.', c: '#0B3A40' },
]

function HGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-66%'])
  return (
    <section id="m-formats" ref={ref} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className="font-bold uppercase" style={{ color: 'var(--m-chalk)', ...T.h2, ...DISPLAY }}>
            Форматы
          </h2>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--m-dim)', ...MONO }}>
            Шесть направлений
          </p>
        </div>
        <motion.div style={{ x }} className="flex gap-6 px-6 md:px-12">
          {FORMATS.map((f) => (
            <article
              key={f.t}
              className="shrink-0 w-[74vw] md:w-[38vw] h-[54vh] rounded-3xl p-8 md:p-10 flex flex-col justify-between"
              style={{ background: C.panel, border: `1px solid ${C.border}` }}
            >
              <span className="block w-14 h-14 rounded-2xl" style={{ background: f.c }} />
              <div>
                <h3 className="font-bold uppercase mb-3" style={{ color: 'var(--m-chalk)', ...T.h3, ...DISPLAY }}>
                  {f.t}
                </h3>
                <p className="font-light max-w-[34ch]" style={{ color: 'var(--m-dim)', lineHeight: 1.6 }}>
                  {f.d}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Крупное слово на прокрутке ────────────────────────────────── */
function BigScrollWord() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.78, 1.02, 0.78])
  const opacity = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0, 1, 1, 0])
  return (
    <section
      id="m-word"
      ref={ref}
      className="px-6 md:px-12 overflow-hidden flex items-center justify-center"
      style={sectionPad}
    >
      <motion.h2
        style={reduced ? undefined : { scale, opacity }}
        className="text-center font-bold uppercase"
        >
        <span className="block" style={{ color: 'var(--m-sea)', fontSize: 'clamp(2.2rem,9vw,7rem)', lineHeight: 0.92, letterSpacing: '-0.04em', ...DISPLAY }}>
          Тайминг —
        </span>
        <span className="block" style={{ color: 'var(--m-chalk)', fontSize: 'clamp(2.2rem,9vw,7rem)', lineHeight: 0.92, letterSpacing: '-0.04em', ...DISPLAY }}>
          это решение
        </span>
      </motion.h2>
    </section>
  )
}

const PRINCIPLES = [
  {
    n: '01',
    t: 'Тайминг',
    d: 'Одни и те же кадры с разным таймингом — два разных сообщения. Тайминг решается раньше формы.',
  },
  {
    n: '02',
    t: 'Функция',
    d: 'Движение отвечает на вопрос пользователя: что изменилось и куда смотреть. Нет вопроса — нет анимации.',
  },
  {
    n: '03',
    t: 'Система',
    d: 'Кривые и длительности задаются один раз на проект. Разный визуал при одном почерке движения читается как качество.',
  },
]

export default function MotionScreen({ onClose }: { onClose: () => void }) {
  useMotionFonts()
  const reduced = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  const scrollVel = useVelocity(scrollY)
  // Полоса наклоняется от скорости прокрутки: скорость становится видимой.
  const bandSkew = useTransform(scrollVel, [-2500, 0, 2500], [-5, 0, 5], { clamp: true })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main
      data-screen="motion"
      className="animate-screen-in relative font-sans"
      style={{ ...MOTION_VARS, background: 'var(--m-abyss)', color: 'var(--m-chalk)' }}
    >
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(55% 45% at 50% 15%, rgba(31,92,99,0.20), transparent 70%), radial-gradient(45% 40% at 85% 85%, rgba(226,114,91,0.06), transparent 70%)',
        }}
      />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] backdrop-blur transition-transform hover:scale-105"
        style={{
          border: `1px solid ${C.petrol}`,
          color: 'var(--m-sea)',
          background: 'rgba(7,19,22,0.6)',
          transitionTimingFunction: cssEase.standard,
          transitionDuration: 'var(--d-fast)',
          ...MONO,
        }}
      >
        ← Услуги
      </button>

      {/* 1 · Герой */}
      <MotionHero onClose={onClose} />

      {/* 2 · Инструменты. Полоса наклоняется от скорости прокрутки */}
      <motion.div className="py-4 border-y" style={{ borderColor: C.border, skewX: reduced ? 0 : bandSkew }}>
        <Kinetic text="After Effects · Cinema 4D · Blender · Spline · Rive · Lottie" dir="l" color={C.petrol} op={0.9} />
      </motion.div>

      {/* 3 · Заявление */}
      <section id="m-statement" className="px-6 md:px-12" style={sectionPad}>
        <WordReveal
          text="Движение — не слой поверх интерфейса. Это то, как продукт объясняет себя: что с чем связано, что только что произошло и куда смотреть дальше."
          className="max-w-[24ch] md:max-w-[20ch] font-bold uppercase"
          style={{ color: 'var(--m-chalk)', ...T.statement, ...DISPLAY }}
        />
      </section>

      {/* 4 · Шкала длительностей — заменила выдуманную статистику */}
      <TimingScale />

      {/* 5 · Лаборатория кривых */}
      <EasingLab />

      {/* 6 · Принципы */}
      <section id="m-principles" className="px-6 md:px-12" style={sectionPad}>
        <SectionHead title="Принципы" />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewCfg}
          className="grid md:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl"
        >
          {PRINCIPLES.map((p) => (
            <motion.div key={p.n} variants={rise}>
              <span
                className="block font-bold tabular-nums"
                style={{ fontSize: 'clamp(2.6rem,6vw,4.5rem)', lineHeight: 1, letterSpacing: '-0.04em', color: C.petrol, ...DISPLAY }}
              >
                {p.n}
              </span>
              <h3 className="font-bold uppercase mt-4 mb-3" style={{ color: 'var(--m-chalk)', ...T.h3, ...DISPLAY }}>
                {p.t}
              </h3>
              <p className="font-light max-w-[34ch]" style={{ color: 'var(--m-dim)', lineHeight: 1.6 }}>
                {p.d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7 · Экспозиционный лист — навигация по разделам экрана */}
      <DopeSheet onJump={(a) => scrollToTarget(a)} />

      {/* 8 · Форматы */}
      <HGallery />

      {/* 9 · Крупное слово */}
      <BigScrollWord />

      {/* 10 · Завершение */}
      <section id="m-cta" className="px-6 md:px-12 flex flex-col items-start gap-10 relative z-10" style={sectionPad}>
        <Reveal>
          <h2 className="font-bold uppercase max-w-[16ch]" style={{ color: 'var(--m-chalk)', ...T.h2, ...DISPLAY }}>
            Расскажите, что должно двигаться
          </h2>
        </Reveal>
        <Reveal delay={0.1} y={16} className="max-w-[46ch]">
          <p className="font-light" style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.6 }}>
            Опишите задачу и срок. Отвечу в течение суток — либо с предложением,
            либо с честным «это не ко мне».
          </p>
        </Reveal>
        <Reveal delay={0.18} y={16}>
          <Magnetic
            onClick={onClose}
            className="rounded-full px-9 py-4 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ background: C.ember, color: C.abyss, ...MONO }}
          >
            ← Вернуться к услугам
          </Magnetic>
        </Reveal>
      </section>
    </main>
  )
}
