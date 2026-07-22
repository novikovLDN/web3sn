import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../design/primitives'
import { cssEase, duration, ease, prefersReducedMotion, stagger } from '../design/motion'

/**
 * Экран услуги 05 — Веб-дизайн.
 *
 * ПОЧЕМУ ТАК ВЫГЛЯДИТ
 * ───────────────────
 * Остальные экраны заняли свои температуры: «Разработка» — тёмный терминальный
 * зелёный, «3D» — тёплая студийная глина, «Моушн» — глубокая петроль,
 * «Брендинг» — бумага с переключаемой палитрой. Свободной осталась ровно та
 * ниша, которая для веб-дизайна и является родной: швейцарская редакционная
 * школа — почти белый лист, чёрные чернила, один холодный акцент (ультрамарин)
 * и жёсткая колоночная сетка. Это не «ещё одна светлая тема»: ультрамарин
 * холодный, тогда как весь остальной сайт тёплый, и разница читается мгновенно.
 * Гротеск Archivo + IBM Plex Mono для технических подписей — набор, которым
 * реально размечают макеты, а не декоративная пара.
 *
 * ПОЧЕМУ ТАКОЕ СОДЕРЖАНИЕ
 * ───────────────────────
 * Веб-дизайн невозможно доказать словами «чисто и конверсионно» — это может
 * написать кто угодно. Поэтому экран не рассказывает, а даёт потрогать
 * четыре вещи, из которых профессия и состоит:
 *   1. сетка и бейзлайн — включаются поверх всей страницы, как направляющие
 *      в макете, и видно, что страница по ним действительно построена;
 *   2. типографическая шкала — живые база и коэффициент, с трекингом и
 *      интерлиньяжем, которые меняются вместе с кеглем (пренебрежение этой
 *      зависимостью — главный признак любительского набора);
 *   3. иерархия — один и тот же текст в слабой и сильной вёрстке под шторкой;
 *   4. адаптив и состояния компонента — то, что заказчик обычно не видит,
 *      пока оно не сломается.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Анимируются только transform и opacity. Шторка «до/после» сделана не на
 * clip-path и не на width, а парой scaleX(p) / scaleX(1/p) с общим
 * transform-origin: left — классическая компенсация масштаба, которая режет
 * слой чистым композитингом. Адаптивная витрина не анимирует ширину: рамка
 * получает точную ширину устройства мгновенно, а вписывается в экран
 * через transform: scale — размер меняется без единого пересчёта layout.
 *
 * Кривые и длительности — только из design/motion.ts.
 */

/* ── Локальная палитра ────────────────────────────────────────────
   Живёт CSS-переменными на корне экрана: ниже по дереву цвет берётся
   только через var(), чтобы палитру можно было поменять в одном месте. */
const SCREEN_VARS = {
  '--wd-paper': '#f4f3ef',
  '--wd-paper-2': '#eceae4',
  '--wd-ink': '#111110',
  '--wd-ink-60': 'rgba(17,17,16,0.6)',
  '--wd-ink-40': 'rgba(17,17,16,0.4)',
  '--wd-rule': 'rgba(17,17,16,0.14)',
  '--wd-rule-soft': 'rgba(17,17,16,0.07)',
  '--wd-accent': '#1f36ff',
  '--wd-accent-08': 'rgba(31,54,255,0.08)',
  '--wd-accent-16': 'rgba(31,54,255,0.16)',
  '--wd-sans': "'Archivo', 'MTS Wide', system-ui, sans-serif",
  '--wd-mono': "'IBM Plex Mono', ui-monospace, Menlo, monospace",
} as unknown as CSSProperties

/* ── Шрифты грузим при открытии экрана, а не глобально ───────────── */
function useWebDesignFonts() {
  useEffect(() => {
    const id = 'webdesign-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Мелкие типографические примитивы экрана ─────────────────────── */

const mono: CSSProperties = {
  fontFamily: 'var(--wd-mono)',
  fontSize: '0.6875rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}

function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={{ ...mono, color: 'var(--wd-accent)', ...style }}>{children}</span>
}

/** Заголовок раздела с номером — редакционная нумерация полос. */
function SectionHead({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <header className="mb-10 md:mb-14">
      <Reveal as="div" y={16}>
        <div
          className="flex items-baseline gap-4 pb-4"
          style={{ borderBottom: '1px solid var(--wd-rule)' }}
        >
          <span style={{ ...mono, color: 'var(--wd-accent)' }}>{n}</span>
          <h2
            className="font-semibold tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(1.7rem,4.5vw,3.2rem)', letterSpacing: '-0.03em' }}
          >
            {title}
          </h2>
        </div>
      </Reveal>
      {lead && (
        <Reveal as="p" y={14} delay={0.06}>
          <span
            className="block mt-5 max-w-[52ch] font-light"
            style={{ color: 'var(--wd-ink-60)', fontSize: 'clamp(0.95rem,1.6vw,1.15rem)', lineHeight: 1.6 }}
          >
            {lead}
          </span>
        </Reveal>
      )}
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════
   1. НАПРАВЛЯЮЩИЕ
   Оверлей поверх всей страницы: 12 колонок + бейзлайн 8px.
   Смысл в том, что его можно включить в любой момент и увидеть — вся
   страница действительно села на эту сетку. Показывается через opacity,
   слой существует всегда, поэтому включение не стоит ни одного layout.
   ══════════════════════════════════════════════════════════════════ */
function GridOverlay({ on }: { on: boolean }) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 'var(--z-sticky)',
        opacity: on ? 1 : 0,
        transition: `opacity var(--d-fast) ${cssEase.standard}`,
        // Бейзлайн-ритм 8px — тот же шаг, что у пространственной шкалы проекта.
        backgroundImage:
          'repeating-linear-gradient(to bottom, var(--wd-rule-soft) 0 1px, transparent 1px 8px)',
      }}
    >
      <div className="h-full mx-auto grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 px-6 md:px-12" style={{ maxWidth: 1440 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={i >= 4 ? 'hidden md:block' : ''}
            style={{ background: 'var(--wd-accent-08)' }}
          />
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   2. ТИПОГРАФИЧЕСКАЯ ШКАЛА
   База и коэффициент — живые. Вместе с кеглем пересчитываются трекинг
   и интерлиньяж: обратная зависимость, без которой шкала не работает.
   Ползунки меняют кегль без transition — это смена состояния, а не
   анимация, и потому не нарушает правило «только transform/opacity».
   ══════════════════════════════════════════════════════════════════ */
const RATIOS = [
  { v: 1.125, name: 'Мажорная секунда' },
  { v: 1.2, name: 'Малая терция' },
  { v: 1.25, name: 'Большая терция' },
  { v: 1.333, name: 'Кварта' },
  { v: 1.5, name: 'Квинта' },
]

const STEPS = [
  { k: -1, label: 'Подпись', sample: 'Мелкий текст интерфейса' },
  { k: 0, label: 'Текст', sample: 'Основной текст страницы' },
  { k: 1, label: 'Лид', sample: 'Вводный абзац' },
  { k: 2, label: 'Заголовок 3', sample: 'Подраздел' },
  { k: 3, label: 'Заголовок 2', sample: 'Раздел' },
  { k: 4, label: 'Заголовок 1', sample: 'Обложка' },
]

function TypeScale() {
  const [base, setBase] = useState(17)
  const [ri, setRi] = useState(2)
  const ratio = RATIOS[ri].v

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
      {/* Панель управления */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="p-6 rounded-2xl"
          style={{ background: 'var(--wd-paper-2)', border: '1px solid var(--wd-rule)' }}
        >
          <label className="block mb-6">
            <span className="flex items-baseline justify-between mb-3">
              <span style={mono}>База</span>
              <span style={{ ...mono, color: 'var(--wd-accent)' }}>{base}px</span>
            </span>
            <input
              type="range"
              min={13}
              max={22}
              step={1}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--wd-accent)' }}
              aria-label="Базовый кегль"
            />
          </label>

          <span style={mono} className="block mb-3">
            Коэффициент
          </span>
          <div className="flex flex-col gap-1.5">
            {RATIOS.map((r, i) => {
              const active = i === ri
              return (
                <button
                  key={r.v}
                  onClick={() => setRi(i)}
                  aria-pressed={active}
                  className="flex items-baseline justify-between rounded-lg px-3 py-2 text-left"
                  style={{
                    border: `1px solid ${active ? 'var(--wd-accent)' : 'var(--wd-rule)'}`,
                    background: active ? 'var(--wd-accent-08)' : 'transparent',
                    color: 'var(--wd-ink)',
                    transition: `background-color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}`,
                  }}
                >
                  <span className="text-[0.8rem]">{r.name}</span>
                  <span style={{ ...mono, letterSpacing: '0.06em', color: active ? 'var(--wd-accent)' : 'var(--wd-ink-40)' }}>
                    {r.v}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-6 text-[0.8rem] font-light" style={{ color: 'var(--wd-ink-60)', lineHeight: 1.55 }}>
            Трекинг и интерлиньяж считаются от кегля: чем крупнее набор, тем
            плотнее буквы и строки. Ступени фиксированы — произвольных размеров
            в макете не появляется.
          </p>
        </div>
      </div>

      {/* Ступени */}
      <div style={{ borderTop: '1px solid var(--wd-rule)' }}>
        {STEPS.map((s) => {
          const px = base * Math.pow(ratio, s.k)
          // t: 0 у мелкой ступени → 1 у самой крупной.
          const t = (s.k + 1) / (STEPS.length - 1)
          const tracking = -0.005 - t * 0.04
          const lh = 1.62 - t * 0.66
          return (
            <div
              key={s.k}
              className="py-5 md:py-6"
              style={{ borderBottom: '1px solid var(--wd-rule-soft)' }}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                <span style={{ ...mono, color: 'var(--wd-ink-40)' }}>{s.label}</span>
                <span style={{ ...mono, color: 'var(--wd-accent)', letterSpacing: '0.06em' }}>
                  {px.toFixed(1)}px
                </span>
                <span style={{ ...mono, color: 'var(--wd-ink-40)', letterSpacing: '0.06em' }}>
                  трекинг {tracking.toFixed(3)}em · интерлиньяж {lh.toFixed(2)}
                </span>
              </div>
              {/* Крупные ступени намеренно уходят за правый край — это честный
                  масштаб, а не подогнанный под контейнер. */}
              <div className="overflow-hidden">
                <span
                  className="block whitespace-nowrap font-semibold"
                  style={{
                    fontSize: px,
                    letterSpacing: `${tracking}em`,
                    lineHeight: lh,
                  }}
                >
                  {s.sample}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   3. ИЕРАРХИЯ: ДО / ПОСЛЕ
   Один текст, две вёрстки. Шторка на паре scaleX — см. шапку файла.
   ══════════════════════════════════════════════════════════════════ */

const DEMO = {
  kicker: 'Открытый набор',
  title: 'Интенсив по цифровой графике',
  text: 'Шесть занятий, разбор работ и финальный проект. Формат — онлайн, записи остаются.',
  cta: 'Записаться',
  meta: 'Старт 12 октября · 6 занятий',
}

/** Слабая вёрстка: всё по центру, четыре кегля без системы, три акцента. */
function WeakLayout() {
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center text-center px-5 gap-2"
      style={{ background: '#ffffff' }}
    >
      <p style={{ fontSize: 15, color: '#c0392b', fontWeight: 700 }}>{DEMO.kicker.toUpperCase()}</p>
      <p style={{ fontSize: 21, color: '#2c3e50', fontWeight: 700, lineHeight: 1.35 }}>{DEMO.title}</p>
      <p style={{ fontSize: 14, color: '#7f8c8d', lineHeight: 1.35, maxWidth: 320 }}>{DEMO.text}</p>
      <p style={{ fontSize: 13, color: '#27ae60', fontWeight: 600 }}>{DEMO.meta}</p>
      <span
        style={{
          fontSize: 14,
          color: '#2c3e50',
          border: '1px solid #bdc3c7',
          borderRadius: 4,
          padding: '6px 14px',
          marginTop: 4,
        }}
      >
        {DEMO.cta}
      </span>
    </div>
  )
}

/** Сильная вёрстка: левый край, одна шкала, один акцент, воздух. */
function StrongLayout() {
  return (
    <div
      className="h-full w-full flex flex-col justify-center px-6 md:px-12"
      style={{ background: 'var(--wd-paper)' }}
    >
      <span style={{ ...mono, color: 'var(--wd-accent)' }}>{DEMO.kicker}</span>
      <p
        className="mt-4 font-semibold"
        style={{ fontSize: 'clamp(1.5rem,3.6vw,2.6rem)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
      >
        {DEMO.title}
      </p>
      <p
        className="mt-4 max-w-[36ch] font-light"
        style={{ color: 'var(--wd-ink-60)', fontSize: 'clamp(0.9rem,1.5vw,1.05rem)', lineHeight: 1.6 }}
      >
        {DEMO.text}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <span
          className="inline-flex items-center rounded-full px-6 py-3 font-medium"
          style={{ background: 'var(--wd-accent)', color: 'var(--wd-paper)', fontSize: 14 }}
        >
          {DEMO.cta}
        </span>
        <span style={{ ...mono, color: 'var(--wd-ink-40)' }}>{DEMO.meta}</span>
      </div>
    </div>
  )
}

function Compare() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0.55)
  const [w, setW] = useState(1)

  // Позиция ручки нужна в пикселях: translateX в процентах отсчитывается от
  // самого элемента, а не от контейнера, поэтому меряем ширину напрямую.
  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width))
    ro.observe(el)
    setW(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const apply = useCallback((clientX: number) => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    // Нижняя граница не 0: при p=0 обратный масштаб 1/p обращается в бесконечность.
    setP(Math.min(1, Math.max(0.02, (clientX - r.left) / r.width)))
  }, [])

  return (
    <div>
      <div
        ref={boxRef}
        className="relative w-full rounded-2xl touch-none select-none overflow-hidden"
        style={{
          height: 'clamp(300px,44vh,420px)',
          border: '1px solid var(--wd-rule)',
          cursor: 'ew-resize',
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          apply(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) apply(e.clientX)
        }}
      >
        {/* Нижний слой — «после» целиком, верхний обрезается шторкой. */}
        <div className="absolute inset-0">
          <WeakLayout />
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `scaleX(${p})`, transformOrigin: 'left' }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: `scaleX(${1 / p})`, transformOrigin: 'left' }}
          >
            <StrongLayout />
          </div>
        </div>

        {/* Ручка */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Граница сравнения вёрстки"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setP((v) => Math.max(0.02, v - 0.04))
            if (e.key === 'ArrowRight') setP((v) => Math.min(1, v + 0.04))
          }}
          className="absolute top-0 bottom-0 left-0 w-px"
          style={{ background: 'var(--wd-accent)', transform: `translateX(${p * w}px)` }}
        >
          <span
            className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              marginLeft: -22,
              marginTop: -22,
              background: 'var(--wd-accent)',
              color: 'var(--wd-paper)',
              fontSize: 13,
              boxShadow: '0 6px 20px -6px rgba(31,54,255,0.6)',
            }}
          >
            ⇄
          </span>
        </div>

        <span className="absolute left-4 bottom-3" style={{ ...mono, color: 'var(--wd-ink-40)' }}>
          После
        </span>
        <span className="absolute right-4 bottom-3" style={{ ...mono, color: 'rgba(0,0,0,0.35)' }}>
          До
        </span>
      </div>

      <p className="mt-4 text-[0.8rem] font-light" style={{ color: 'var(--wd-ink-60)' }}>
        Демонстрационный макет. Слева и справа один и тот же текст — меняется
        только вёрстка: выравнивание, шкала, количество акцентов и воздух.
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   4. АДАПТИВ
   Один блок в трёх ширинах. Рамка всегда рендерится в точных пикселях
   устройства и вписывается в экран через transform: scale — так на
   телефоне видно настоящее поведение десктопной раскладки, а не её
   сплющенную имитацию.
   ══════════════════════════════════════════════════════════════════ */
const DEVICES = [
  { id: 'sm', label: 'Телефон', w: 360, h: 560 },
  { id: 'md', label: 'Планшет', w: 768, h: 420 },
  { id: 'lg', label: 'Десктоп', w: 1200, h: 380 },
] as const

const CARDS = [
  { t: 'Аудит', d: 'Что мешает странице продавать.' },
  { t: 'Прототип', d: 'Структура и сценарий до отрисовки.' },
  { t: 'Дизайн', d: 'Сетка, типографика, состояния.' },
]

/** Содержимое витрины: раскладка зависит от выбранной ширины, а не от медиазапросов. */
function ResponsiveBlock({ w }: { w: number }) {
  const cols = w >= 1000 ? 3 : w >= 700 ? 2 : 1
  const stacked = w < 700
  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'var(--wd-paper)' }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--wd-rule)' }}
      >
        <span className="font-semibold tracking-tight" style={{ fontSize: 17 }}>
          NOVIKOV<span style={{ color: 'var(--wd-accent)' }}>.</span>
        </span>
        {stacked ? (
          <span className="flex flex-col gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 18, height: 1.5, background: 'var(--wd-ink)' }} />
            ))}
          </span>
        ) : (
          <span className="flex gap-6" style={{ ...mono, color: 'var(--wd-ink-60)' }}>
            <span>Услуги</span>
            <span>Работы</span>
            <span>Контакты</span>
          </span>
        )}
      </div>

      <div
        className="flex-1 px-5 py-6 flex flex-col justify-center gap-5"
        style={stacked ? undefined : { paddingInline: 32 }}
      >
        <div className={stacked ? '' : 'flex items-end justify-between gap-8'}>
          <p
            className="font-semibold"
            style={{
              fontSize: stacked ? 26 : cols === 3 ? 42 : 32,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              maxWidth: stacked ? '100%' : '16ch',
            }}
          >
            Страница, которая объясняет себя
          </p>
          <span
            className="inline-flex shrink-0 items-center rounded-full px-5 py-2.5 font-medium"
            style={{
              background: 'var(--wd-accent)',
              color: 'var(--wd-paper)',
              fontSize: 13,
              marginTop: stacked ? 16 : 0,
            }}
          >
            Обсудить
          </span>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {CARDS.map((c) => (
            <div
              key={c.t}
              className="rounded-xl p-4"
              style={{ border: '1px solid var(--wd-rule)', background: 'var(--wd-paper-2)' }}
            >
              <p className="font-medium mb-1" style={{ fontSize: 14 }}>
                {c.t}
              </p>
              <p className="font-light" style={{ fontSize: 12.5, color: 'var(--wd-ink-60)', lineHeight: 1.5 }}>
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResponsiveShowcase() {
  const [di, setDi] = useState(2)
  const stageRef = useRef<HTMLDivElement>(null)
  const [avail, setAvail] = useState(1200)
  const dev = DEVICES[di]

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setAvail(el.getBoundingClientRect().width))
    ro.observe(el)
    setAvail(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const scale = Math.min(1, avail / dev.w)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {DEVICES.map((d, i) => {
          const active = i === di
          return (
            <button
              key={d.id}
              onClick={() => setDi(i)}
              aria-pressed={active}
              className="rounded-full px-4 py-2 text-[0.85rem]"
              style={{
                border: `1px solid ${active ? 'var(--wd-accent)' : 'var(--wd-rule)'}`,
                background: active ? 'var(--wd-accent-08)' : 'transparent',
                color: active ? 'var(--wd-accent)' : 'var(--wd-ink-60)',
                transition: `background-color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, color var(--d-fast) ${cssEase.standard}`,
              }}
            >
              {d.label} · {d.w}
            </button>
          )
        })}
      </div>

      {/*
        overflow-hidden здесь обязателен, и вот почему.

        transform: scale уменьшает изображение элемента, но НЕ его бокс в
        потоке: рамка шириной 1200px после scale(0.3) выглядит на 360px,
        а места занимает по-прежнему 1200. По вертикали это уже было
        скомпенсировано высотой обёртки, по горизонтали — нет, и на 390px
        витрина выпихивала документ за край экрана.

        Отсечение на обёртке гасит переполнение, не трогая саму витрину.
        Sticky внутри нет — иначе overflow сломал бы его.
      */}
      <div ref={stageRef} className="w-full overflow-hidden">
        {/* Высота сцены — уже отмасштабированная, чтобы под рамкой не оставалось дыры. */}
        <div style={{ height: dev.h * scale }}>
          <motion.div
            key={dev.id}
            initial={prefersReducedMotion() ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.entrance }}
            className="rounded-2xl overflow-hidden mx-auto"
            style={{
              width: dev.w,
              height: dev.h,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              border: '1px solid var(--wd-rule)',
              boxShadow: '0 30px 60px -40px rgba(17,17,16,0.5)',
            }}
          >
            <ResponsiveBlock w={dev.w} />
          </motion.div>
        </div>
      </div>

      <p className="mt-5 text-[0.8rem] font-light" style={{ color: 'var(--wd-ink-60)' }}>
        Масштаб {Math.round(scale * 100)}%. Меняется не только ширина: навигация
        сворачивается, число колонок падает с трёх до одной, кегль заголовка
        уходит на ступень ниже. Адаптив — это решение о приоритетах на
        каждой ширине.
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   5. СОСТОЯНИЯ КОМПОНЕНТА
   То, что чаще всего забывают отдать в разработку. Спека, а не картинка.
   ══════════════════════════════════════════════════════════════════ */
const BUTTON_STATES: { label: string; note: string; style: CSSProperties }[] = [
  {
    label: 'Обычное',
    note: 'Базовый вид',
    style: { background: 'var(--wd-accent)', color: 'var(--wd-paper)' },
  },
  {
    label: 'Наведение',
    note: 'Курсор над целью',
    style: { background: '#1730d6', color: 'var(--wd-paper)' },
  },
  {
    label: 'Фокус',
    note: 'Навигация с клавиатуры',
    style: { background: 'var(--wd-accent)', color: 'var(--wd-paper)', outline: '2px solid var(--wd-ink)', outlineOffset: 3 },
  },
  {
    label: 'Нажатие',
    note: 'Момент клика',
    style: { background: '#1226ad', color: 'var(--wd-paper)', transform: 'scale(0.97)' },
  },
  {
    label: 'Ожидание',
    note: 'Запрос отправлен',
    style: { background: 'var(--wd-accent-16)', color: 'var(--wd-accent)' },
  },
  {
    label: 'Недоступно',
    note: 'Условие не выполнено',
    style: { background: 'var(--wd-paper-2)', color: 'var(--wd-ink-40)', border: '1px solid var(--wd-rule)' },
  },
]

function States() {
  return (
    <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--wd-rule)', border: '1px solid var(--wd-rule)', borderRadius: 18, overflow: 'hidden' }}>
      {BUTTON_STATES.map((s, i) => (
        <Reveal key={s.label} y={16} delay={i * stagger.item}>
          <div
            className="flex flex-col justify-between gap-6 p-6 h-full"
            style={{ background: 'var(--wd-paper)' }}
          >
            <div className="flex items-baseline justify-between">
              <span style={{ ...mono, color: 'var(--wd-ink-40)' }}>{s.label}</span>
              <span style={{ ...mono, color: 'var(--wd-accent)', letterSpacing: '0.06em' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <span
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-medium self-start"
              style={{ fontSize: 14, ...s.style }}
            >
              Отправить
            </span>
            <span className="font-light text-[0.82rem]" style={{ color: 'var(--wd-ink-60)' }}>
              {s.note}
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   6. ЧТО ВХОДИТ
   ══════════════════════════════════════════════════════════════════ */
const DELIVERABLES = [
  { t: 'Структура', d: 'Карта страниц и сценарий: что человек должен понять и сделать на каждом экране.' },
  { t: 'Сетка', d: 'Колонки, отступы и бейзлайн, по которым собирается любая новая страница.' },
  { t: 'Типографика', d: 'Шкала кеглей с трекингом и интерлиньяжем, правила набора текста.' },
  { t: 'Компоненты', d: 'Кнопки, поля, карточки — с проработкой всех состояний.' },
  { t: 'Адаптив', d: 'Раскладки под телефон, планшет и десктоп с разными приоритетами.' },
  { t: 'Передача', d: 'Макет, из которого разработчик собирает страницу без вопросов.' },
]

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function WebDesignScreen({ onClose }: { onClose: () => void }) {
  useWebDesignFonts()
  const [grid, setGrid] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // G — как переключение направляющих в макетном редакторе.
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey) {
        const el = document.activeElement
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
        setGrid((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const reduce = prefersReducedMotion()

  return (
    <main
      data-screen="webdesign"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        background: 'var(--wd-paper)',
        color: 'var(--wd-ink)',
        fontFamily: 'var(--wd-sans)',
      }}
    >
      <GridOverlay on={grid} />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur"
        style={{
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--wd-rule)',
          color: 'var(--wd-ink)',
          background: 'rgba(244,243,239,0.82)',
        }}
      >
        ← Назад
      </button>

      {/* Переключатель направляющих — фирменный жест экрана */}
      <button
        onClick={() => setGrid((v) => !v)}
        aria-pressed={grid}
        className="fixed top-5 right-5 flex items-center gap-2.5 rounded-full px-4 py-2 backdrop-blur"
        style={{
          ...mono,
          zIndex: 'var(--z-nav)',
          border: `1px solid ${grid ? 'var(--wd-accent)' : 'var(--wd-rule)'}`,
          color: grid ? 'var(--wd-accent)' : 'var(--wd-ink-60)',
          background: grid ? 'rgba(31,54,255,0.08)' : 'rgba(244,243,239,0.82)',
          transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
        }}
      >
        <span
          aria-hidden
          className="inline-block"
          style={{
            width: 12,
            height: 12,
            border: '1px solid currentColor',
            // Внутренние линии значка повторяют то, что включает кнопка.
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
        Сетка
      </button>

      {/* ── ГЕРОЙ ──────────────────────────────────────────────────
          Раскладка героя сама по себе аргумент: колоночная сетка,
          подпись в первой колонке, заголовок с оптической компенсацией
          левого края. */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-16 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <div className="grid md:grid-cols-12 gap-x-6 gap-y-10 items-end">
          <div className="md:col-span-3">
            <Reveal y={14}>
              <Eyebrow>Услуга 05</Eyebrow>
              <p className="mt-4 font-light text-[0.9rem]" style={{ color: 'var(--wd-ink-60)', lineHeight: 1.6 }}>
                Сетка, типографика, иерархия и состояния. Ниже — не описание,
                а сами инструменты: их можно включить и подвигать.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slower, ease: ease.entrance }}
              className="font-semibold optical-left"
              style={{
                fontSize: 'clamp(3rem,12vw,10.5rem)',
                letterSpacing: '-0.05em',
                // 0.95, а не 0.86: в «дизайн» краткая над «й» поднимается выше
                // прописной высоты, и на плотном интерлиньяже её срезала
                // строка «Веб-». Кириллица требует больше воздуха сверху,
                // чем латиница, — типографику нельзя настраивать на «NOVIKOV».
                lineHeight: 0.95,
              }}
            >
              Веб-<br />дизайн
            </motion.h1>
          </div>
        </div>

        <div
          className="mt-14 md:mt-20 grid md:grid-cols-12 gap-x-6 gap-y-6 pt-6"
          style={{ borderTop: '1px solid var(--wd-rule)' }}
        >
          <Reveal y={16} delay={0.1} className="md:col-span-6">
            <p
              className="font-light max-w-[46ch]"
              style={{ fontSize: 'clamp(1.05rem,2vw,1.45rem)', lineHeight: 1.5, letterSpacing: '-0.01em' }}
            >
              Хороший интерфейс не замечают. Замечают, что нужное нашлось
              с первого взгляда, а форма отправилась без сомнений.
            </p>
          </Reveal>
          <Reveal y={16} delay={0.18} className="md:col-span-3 md:col-start-9">
            <p className="font-light text-[0.9rem]" style={{ color: 'var(--wd-ink-60)', lineHeight: 1.6 }}>
              Нажмите{' '}
              <span
                className="inline-flex items-center justify-center rounded"
                style={{ ...mono, letterSpacing: 0, minWidth: 22, padding: '2px 5px', border: '1px solid var(--wd-rule)', color: 'var(--wd-ink)' }}
              >
                G
              </span>{' '}
              — страница покажет направляющие, по которым построена.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ТИПОГРАФИКА ────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <SectionHead
          n="01"
          title="Типографическая шкала"
          lead="Размеры в макете не выбираются на глаз. Берётся база и коэффициент — дальше ступени считаются, и в проекте физически не может появиться «ещё один размер, чуть побольше»."
        />
        <TypeScale />
      </section>

      {/* ── ИЕРАРХИЯ ───────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <SectionHead
          n="02"
          title="Иерархия решает"
          lead="Потяните шторку. Содержание не изменилось ни на слово — изменилось то, в каком порядке глаз его читает."
        />
        <Compare />
      </section>

      {/* ── АДАПТИВ ────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <SectionHead
          n="03"
          title="Один блок, три ширины"
          lead="Переключите ширину. Блок не масштабируется — он пересобирается: меняются приоритеты, а не пропорции."
        />
        <ResponsiveShowcase />
      </section>

      {/* ── СОСТОЯНИЯ ──────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <SectionHead
          n="04"
          title="Компонент — это все его состояния"
          lead="Кнопка в макете нарисована один раз, а в жизни живёт в шести видах. Если их не описать, разработчик придумает их сам."
        />
        <States />
      </section>

      {/* ── ЧТО ВХОДИТ ─────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 md:py-28 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <SectionHead n="05" title="Что вы получаете" />
        <div className="grid md:grid-cols-12 gap-x-6">
          <div className="md:col-span-8 md:col-start-5">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.t} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-6"
                  style={{ borderBottom: '1px solid var(--wd-rule-soft)' }}
                >
                  <span style={{ ...mono, color: 'var(--wd-accent)', minWidth: 34 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium mb-1.5" style={{ fontSize: '1.05rem', letterSpacing: '-0.015em' }}>
                      {d.t}
                    </h3>
                    <p className="font-light max-w-[46ch]" style={{ color: 'var(--wd-ink-60)', lineHeight: 1.6 }}>
                      {d.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ФИНАЛ ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32 mx-auto w-full" style={{ maxWidth: 1440 }}>
        <div className="grid md:grid-cols-12 gap-x-6 gap-y-10 items-end">
          <div className="md:col-span-8">
            <Reveal y={22}>
              <h2
                className="font-semibold optical-left"
                style={{ fontSize: 'clamp(2rem,7vw,5rem)', letterSpacing: '-0.045em', lineHeight: 0.94 }}
              >
                Соберём страницу,
                <br />
                которая работает
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Reveal y={18} delay={0.1}>
              <button
                onClick={onClose}
                className="rounded-full px-9 py-4 font-medium"
                style={{
                  background: 'var(--wd-accent)',
                  color: 'var(--wd-paper)',
                  fontSize: 14,
                  letterSpacing: '0.02em',
                  boxShadow: '0 10px 30px -10px rgba(31,54,255,0.55)',
                  transition: `transform var(--d-fast) ${cssEase.standard}`,
                }}
                onMouseEnter={(e) => {
                  if (!reduce) e.currentTarget.style.transform = 'scale(1.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ← Вернуться к услугам
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
