/**
 * Экран услуги — Моушн-дизайн.
 *
 * ВИЗУАЛЬНАЯ НИША: АППАРАТНАЯ
 * ───────────────────────────
 * Температуры остальных экранов заняты: терминальный зелёный (Разработка),
 * тёплая глина (3D), почти-белая швейцарская бумага с ультрамарином
 * (Веб-дизайн), средний серый циклорама-фон (Брендинг), тёмная тёплая
 * (главная). Моушну остаётся глубокая петроль — и для него это не остаток,
 * а родная среда: цвет затемнённой аппаратной, где свет идёт от экрана,
 * а не от окна. Единственный тёплый акцент — ember — работает как лампа
 * записи: он появляется только там, где что-то происходит прямо сейчас.
 *
 * ЧТО ЗДЕСЬ ДОКАЗЫВАЕТ КОМПЕТЕНЦИЮ
 * ────────────────────────────────
 * Показать «красивую анимацию» может кто угодно, и это ничего не доказывает:
 * зритель видит результат и не видит решения. Поэтому экран показывает не
 * результаты, а инструменты, которыми результат получается, — и каждый из
 * них можно взять в руки:
 *   01 шкала длительностей — шесть ступеней, запущенных одновременно;
 *   02 кривые — полный набор, на котором построено движение этого сайта;
 *   03 дуэль таймингов — одна карточка, две раскладки по времени;
 *   04 потолок ритма — где stagger перестаёт быть ритмом и становится лагом;
 *   05 разбор перехода — таймлайн, который можно остановить в любой точке;
 *   06 бюджет кадра — откуда берётся правило «только transform и opacity»;
 *   07 экспозиционный лист — ремесло в его исходной, докомпьютерной форме.
 *
 * Ни одной цифры о человеке: ни клиентов, ни наград, ни результатов. Все
 * числа на экране либо взяты из src/design/motion.ts, либо считаются здесь
 * же и проверяются на месте. Все композиции помечены как демонстрационные.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Анимируются только transform и opacity. Осознанное исключение одно —
 * clip-path в маске заголовка героя и ступенчатые вайпы экспозиционного
 * листа: там обрезка и есть содержание кадра, а не способ его подвинуть.
 * Скраб таймлайна (раздел 05) не запускает анимаций вовсе — значения
 * считаются решателем cubic-bezier из позиции ползунка. Кривые и
 * длительности — только из design/motion.ts.
 */

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useVelocity } from 'framer-motion'
import { C, MOTION_VARS, DISPLAY, MONO, T } from './motion/palette'
import { cssEase, stagger as staggerScale } from '../design/motion'
import { useMotionFonts } from './motion/useMotionFonts'
import {
  Reveal,
  SectionHead,
  WordReveal,
  Kinetic,
  Magnetic,
  usePrefersReducedMotion,
} from './motion/primitives'
import MotionHero from './motion/MotionHero'
import DopeSheet from './motion/DopeSheet'
import EasingLab from './motion/EasingLab'
import TimingDuel from './motion/TimingDuel'
import StaggerLab from './motion/StaggerLab'
import LayerBreakdown from './motion/LayerBreakdown'
import FrameBudget from './motion/FrameBudget'
import { scrollToTarget } from '../lib/scroll'

/** Вертикальный ритм секции — из токенов, чтобы воздух был один на весь сайт. */
const sectionPad = { paddingBlock: 'var(--section-y)' } as const

/* ══════════════════════════════════════════════════════════════════
   01 · ШКАЛА ДЛИТЕЛЬНОСТЕЙ
   Заменила блок выдуманных счётчиков «140+ проектов / 8 лет». Здесь нет
   ни одной цифры, которую нельзя проверить: это буквально duration из
   src/design/motion.ts. Шесть фишек стартуют одновременно и приходят в
   разное время — шкала становится видимой, а не описанной словами.
   ══════════════════════════════════════════════════════════════════ */
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
  const pucks = useRef<(HTMLSpanElement | null)[]>([])

  /**
   * Прогон шкалы. Сброс без перехода → форсированное чтение геометрии →
   * запуск: без чтения браузер схлопнет сброс и старт в один стиль, и
   * ни одна фишка никуда не поедет.
   *
   * Ref вместо state: перерисовывать шесть строк ради запуска CSS-перехода
   * незачем, а состояние здесь живёт в самих элементах.
   */
  const run = () => {
    pucks.current.forEach((el, i) => {
      const lane = el?.parentElement
      if (!el || !lane) return
      const travel = Math.max(0, lane.clientWidth - el.offsetWidth)
      el.style.transition = 'none'
      el.style.transform = 'translate3d(0,0,0)'
      void el.offsetHeight
      el.style.transition = `transform ${DURATIONS[i].ms}ms ${cssEase.standard}`
      el.style.transform = `translate3d(${travel}px,0,0)`
    })
  }

  /* Автопрогон один раз при входе в кадр. IntersectionObserver, а не
     обработчик скролла: обработчик пришлось бы гасить вручную, а этот
     сам себя отключает после первого срабатывания. */
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        run()
        io.disconnect()
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <section id="m-timing" className="px-6 md:px-12" style={sectionPad}>
      <div className="max-w-5xl">
        <SectionHead
          n="01"
          title="Длительность не подбирается на глаз"
          note="Шесть ступеней · одни на весь сайт"
          lead="В проекте с системой движения длительностей ровно столько, сколько ступеней в шкале. Ниже — все шесть, запущенные одновременно с одной точки. Разница между ними и есть то, что зритель читает как «отзывчиво» или как «тяжеловесно»."
        />

        <div ref={ref} className="flex flex-col">
          {DURATIONS.map((d, i) => (
            <div
              key={d.name}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[7rem_1fr_14rem] items-center gap-x-5 gap-y-2 py-5"
              style={{ borderTop: '1px solid var(--m-border)' }}
            >
              <span className="text-[11px] tabular-nums tracking-[0.18em]" style={{ color: 'var(--m-sea)', ...MONO }}>
                {d.ms} МС
              </span>
              {/* Дорожка: фишка едет только на transform */}
              <span className="relative block h-6 col-span-2 md:col-span-1 order-last md:order-none">
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-1/2 h-px"
                  style={{ background: 'var(--m-border)' }}
                />
                <span
                  ref={(el) => {
                    pucks.current[i] = el
                  }}
                  aria-hidden
                  className="absolute left-0 top-1/2 block h-2.5 w-2.5 -translate-y-1/2 rounded-sm"
                  style={{
                    background: i === DURATIONS.length - 1 ? 'var(--m-ember)' : 'var(--m-sea)',
                  }}
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

/* ══════════════════════════════════════════════════════════════════
   08 · ФОРМАТЫ
   Единственный кинематографичный блок экрана: полоса едет по горизонтали,
   пока страница прокручивается по вертикали. Sticky-контейнер обязан
   оставаться без overflow-hidden у предков — иначе прилипание ломается,
   поэтому обрезка живёт на самом липком элементе.
   ══════════════════════════════════════════════════════════════════ */
const FORMATS = [
  { t: 'Explainer', d: 'Продукт объяснён за минуту: сценарий, раскадровка, сборка.', c: 'var(--m-ember)' },
  { t: 'Логотип в движении', d: 'Интро, аутро и стингеры, собранные из логики самого знака.', c: 'var(--m-sea)' },
  { t: 'UI-моушн', d: 'Переходы и микросостояния, отданные разработке спецификацией.', c: '#A8C9C5' },
  { t: 'Соцсети', d: 'Вертикальный формат: ритм рассчитан на просмотр без звука.', c: C.deepOcean },
  { t: '3D-моушн', d: 'Объём, свет и симуляции там, где плоскость уже не справляется.', c: 'var(--m-petrol)' },
  { t: 'Титры и графика', d: 'Ловер-трети, инфографика, субтитры — набор, который держит сетку.', c: '#0B3A40' },
]

function HGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-66%'])
  return (
    <section id="m-formats" ref={ref} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 mb-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="text-[11px] tracking-[0.22em]" style={{ color: 'var(--m-ember)', ...MONO }}>
            08
          </span>
          <h2 className="font-bold uppercase" style={{ color: 'var(--m-chalk)', ...T.h2, ...DISPLAY }}>
            Задача решает формат
          </h2>
          <p className="ml-auto text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--m-dim)', ...MONO }}>
            Шесть направлений
          </p>
        </div>
        <motion.div style={{ x }} className="flex gap-6 px-6 md:px-12">
          {FORMATS.map((f) => (
            <article
              key={f.t}
              className="shrink-0 w-[74vw] md:w-[38vw] h-[54vh] rounded-3xl p-8 md:p-10 flex flex-col justify-between"
              style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)' }}
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

/* ══════════════════════════════════════════════════════════════════
   ЧТО ОСТАЁТСЯ У ЗАКАЗЧИКА
   Раздел, которого чаще всего нет у моушн-подрядчика: отдаётся ролик,
   а спецификация движения остаётся в голове исполнителя. Через полгода
   продукт обрастает переходами, придуманными разработкой на ходу.
   ══════════════════════════════════════════════════════════════════ */
const DELIVERABLES = [
  { t: 'Мастер-файлы', d: 'Проект сборки с разложенными слоями и именованными композициями, а не только просчитанное видео.' },
  { t: 'Экспорты под площадки', d: 'Форматы, кодеки и хронометражи под каждую площадку, включая вертикаль и версию без звука.' },
  { t: 'Спецификация движения', d: 'Таблица переходов: слой, окно на таймлайне, кривая, свойства. То, из чего разработчик собирает переход без угадывания.' },
  { t: 'Кривые и длительности', d: 'Ступени шкалы и набор кривых в виде значений, которые кладутся прямо в код проекта.' },
  { t: 'Lottie и веб-сборка', d: 'Там, где движение живёт в интерфейсе, — лёгкая сборка вместо видео, с проверенным поведением на слабых машинах.' },
  { t: 'Правила движения', d: 'Что анимируется, что не анимируется никогда и что делать при prefers-reduced-motion. Раздел, из-за отсутствия которого продукт и начинает дёргаться.' },
]

/* ── Процесс ─────────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', t: 'Разбор', d: 'Что должно стать понятно зрителю и за какое время. Формат выбирается после ответа, а не до него.' },
  { n: '02', t: 'Сценарий', d: 'Текст и хронометраж по секундам. Дешевле переписать строку, чем пересобрать сцену.' },
  { n: '03', t: 'Раскадровка', d: 'Ключевые кадры и стиль. Здесь фиксируется картинка — дальше правки идут внутри выбранного.' },
  { n: '04', t: 'Аниматик', d: 'Тайминг в чёрновой графике. Ритм проверяется до того, как в него вложена отрисовка.' },
  { n: '05', t: 'Сборка', d: 'Финальная графика, движение, звук. Спецификация пишется параллельно, а не после.' },
]

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
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
        className="fixed top-5 left-5 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] backdrop-blur transition-transform hover:scale-105"
        style={{
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--m-petrol)',
          color: 'var(--m-sea)',
          background: 'rgba(7,19,22,0.6)',
          transitionTimingFunction: cssEase.standard,
          transitionDuration: 'var(--d-fast)',
          ...MONO,
        }}
      >
        ← Услуги
      </button>

      {/* ── ГЕРОЙ ─────────────────────────────────────────────────── */}
      <MotionHero onClose={onClose} />

      {/* ── Инструменты. Полоса наклоняется от скорости прокрутки ── */}
      <motion.div
        className="py-4 border-y"
        style={{ borderColor: 'var(--m-border)', skewX: reduced ? 0 : bandSkew }}
      >
        <Kinetic text="After Effects · Cinema 4D · Blender · Spline · Rive · Lottie" dir="l" color={C.petrol} op={0.9} />
      </motion.div>

      {/* ── ТЕЗИС ─────────────────────────────────────────────────── */}
      <section id="m-statement" className="px-6 md:px-12" style={sectionPad}>
        <WordReveal
          text="Движение — не слой поверх интерфейса. Это то, как продукт объясняет себя: что с чем связано, что только что произошло и куда смотреть дальше."
          className="max-w-[24ch] md:max-w-[20ch] font-bold uppercase"
          style={{ color: 'var(--m-chalk)', ...T.statement, ...DISPLAY }}
        />
        <Reveal delay={0.15} y={16}>
          <p
            className="mt-8 max-w-[54ch] font-light"
            style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
          >
            Дальше — не примеры работ, а инструменты, которыми работа делается.
            Каждый из семи разделов можно взять в руки: переключить, подвигать,
            остановить в любой точке. Все числа здесь либо взяты из системы
            движения этого сайта, либо считаются прямо на странице.
          </p>
        </Reveal>
      </section>

      {/* ── 01…07 · ИНСТРУМЕНТЫ ───────────────────────────────────── */}
      <TimingScale />
      <EasingLab />
      <TimingDuel />
      <StaggerLab />
      <LayerBreakdown />
      <FrameBudget />
      <DopeSheet onJump={(a) => scrollToTarget(a)} />

      {/* ── 08 · ФОРМАТЫ ──────────────────────────────────────────── */}
      <HGallery />

      {/* ── 09 · ЧТО ОСТАЁТСЯ У ЗАКАЗЧИКА ─────────────────────────── */}
      <section id="m-deliverables" className="px-6 md:px-12" style={sectionPad}>
        <div className="max-w-6xl">
          <SectionHead
            n="09"
            title="Ролик заканчивается, система остаётся"
            lead="Отданное видео живёт до первого изменения продукта. Дальше движение либо продолжается по правилам, либо каждый следующий подрядчик придумывает своё. Разница закладывается на этом этапе."
          />
          <div className="grid lg:grid-cols-12 gap-x-8">
            <div className="lg:col-span-8 lg:col-start-5">
              {DELIVERABLES.map((d, i) => (
                <Reveal key={d.t} y={16} delay={i * staggerScale.item}>
                  <div
                    className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-6"
                    style={{ borderBottom: '1px solid var(--m-border)' }}
                  >
                    <span
                      className="text-[11px] tracking-[0.18em] shrink-0"
                      style={{ color: 'var(--m-ember)', minWidth: 36, paddingTop: 4, ...MONO }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3
                        className="font-medium mb-1.5"
                        style={{ color: 'var(--m-chalk)', fontSize: '1.08rem', letterSpacing: '-0.015em' }}
                      >
                        {d.t}
                      </h3>
                      <p className="font-light max-w-[48ch]" style={{ color: 'var(--m-dim)', lineHeight: 1.6 }}>
                        {d.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 · ПРОЦЕСС ──────────────────────────────────────────── */}
      <section id="m-process" className="px-6 md:px-12" style={sectionPad}>
        <div className="max-w-6xl">
          <SectionHead
            n="10"
            title="Тайминг проверяется до отрисовки"
            lead="Аниматик существует именно для этого: ритм проверяется в чёрновой графике, пока переделка стоит час, а не неделю. Порядок этапов здесь не бюрократия, а защита бюджета."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} y={18} delay={i * staggerScale.item}>
                <div style={{ borderTop: '1px solid var(--m-border)', paddingTop: 'var(--s-6)' }}>
                  <span className="text-[11px] tracking-[0.18em]" style={{ color: 'var(--m-ember)', ...MONO }}>
                    {s.n}
                  </span>
                  <h3
                    className="font-bold uppercase mt-4 mb-3"
                    style={{ color: 'var(--m-chalk)', fontSize: '1.35rem', letterSpacing: '-0.02em', lineHeight: 1.1, ...DISPLAY }}
                  >
                    {s.t}
                  </h3>
                  <p className="font-light" style={{ color: 'var(--m-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЗАКРЫВАЮЩЕЕ УТВЕРЖДЕНИЕ ───────────────────────────────── */}
      <section id="m-word" className="px-6 md:px-12 overflow-hidden" style={sectionPad}>
        <div className="max-w-6xl">
          {/* WordReveal рендерит <p>, поэтому строки стоят рядом, а не вложены
              в <h2>: абзац внутри заголовка — невалидная разметка, и браузер
              разорвал бы её сам, сломав раскладку.

              Интерлиньяж 0.95, а не 0.88: «й» в «Тайминг» поднимается выше
              прописной высоты, и на плотном интерлиньяже её срезала бы вторая
              строка. Кириллице нужен больший запас, чем латинице, — типографику
              нельзя настраивать на латинских словах. */}
          <div className="optical-left">
            <WordReveal
              text="Тайминг —"
              className="font-bold uppercase"
              style={{ color: 'var(--m-sea)', fontSize: 'clamp(2.2rem,9vw,7rem)', lineHeight: 0.95, letterSpacing: '-0.04em', ...DISPLAY }}
            />
            <WordReveal
              text="это решение"
              className="font-bold uppercase"
              style={{ color: 'var(--m-chalk)', fontSize: 'clamp(2.2rem,9vw,7rem)', lineHeight: 0.95, letterSpacing: '-0.04em', ...DISPLAY }}
            />
          </div>
          <Reveal delay={0.2} y={16}>
            <p
              className="mt-8 max-w-[52ch] font-light"
              style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
            >
              Одни и те же кадры с разным таймингом — два разных сообщения.
              Поэтому тайминг решается раньше формы, а не подгоняется под неё
              в конце.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ЗАВЕРШЕНИЕ ────────────────────────────────────────────── */}
      <section
        id="m-cta"
        className="px-6 md:px-12 flex flex-col items-start gap-10 relative"
        style={{ ...sectionPad, zIndex: 'var(--z-raised)' }}
      >
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
            style={{ background: 'var(--m-ember)', color: 'var(--m-abyss)', ...MONO }}
          >
            ← Вернуться к услугам
          </Magnetic>
        </Reveal>
      </section>
    </main>
  )
}
