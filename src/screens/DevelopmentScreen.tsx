/**
 * Экран услуги — Разработка.
 *
 * ТЕЗИС
 * ─────
 * Разработку в портфолио дизайнера обычно показывают антуражем: тёмный
 * терминал, печатающийся код, логотипы фреймворков. Это доказывает ровно
 * одно — что человек видел терминал. Экран построен на обратном допущении:
 * инженерную компетенцию нельзя рассказать, её можно только дать проверить.
 * Поэтому здесь нет ни одного «скриншота работы» и ни одной цифры результата.
 * Здесь пять инструментов, каждый из которых считает или показывает что-то
 * прямо в браузере посетителя: бюджет кадра меряется на его машине, контраст
 * палитры этого же экрана считается по формуле WCAG на этой же странице,
 * порядок фокуса он проходит клавишей Tab сам.
 *
 * ВИЗУАЛЬНАЯ НИША
 * ───────────────
 * Температуры остальных экранов заняты: швейцарская бумага с ультрамарином
 * (Веб-дизайн), средний серый (Брендинг), петроль (Моушн), тёплая глина (3D),
 * тёмная тёплая (главная). Терминальный зелёный на почти-чёрном остаётся
 * за этим экраном — и здесь он не декорация, а функция: это единственная
 * среда, где инструмент показывают на приборной панели, а результат — на
 * светлой сцене рядом. Отсюда две поверхности экрана: тёмная панель
 * (инструмент, моноширинный голос) и светлая сцена (продукт, тот вид, в
 * котором его увидит пользователь). Разделение поверхностей и есть смысл
 * профессии: слева то, что пишут, справа то, что от этого происходит.
 *
 * Гарнитуры: JetBrains Mono — технический голос и заголовки (в терминальной
 * нише моноширинный заголовок честнее декоративного дисплея), Inter Tight —
 * проза. Пиксельная гарнитура прежней версии убрана: она читалась как игра,
 * а услуга продаётся как инженерная.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Анимируются только transform и opacity — на экране, который сам объясняет
 * почему, нарушить это правило было бы прямым противоречием. Все заливки и
 * индикаторы — scaleX/scaleY на отдельном слое, все оверлеи существуют всегда
 * и гасятся прозрачностью. Единственный rAF-цикл (измеритель кадра) гейтится
 * IntersectionObserver и не вызывает getBoundingClientRect. Пульс скелетона —
 * CSS-анимация, остановленная за кадром через useOffscreenPause.
 *
 * Кривые и длительности — только из design/motion.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { Reveal, useOffscreenPause } from '../design/primitives'
import { cssEase, duration, ease, stagger, prefersReducedMotion } from '../design/motion'

/* ── Палитра экрана ──────────────────────────────────────────────────
   Две поверхности, а не одна: тёмная панель — инструмент, светлая сцена —
   продукт. Зелёный работает как системный голос среды (подписи, статусы,
   разметка), оранжевый — как единственный цвет продукта и цвет тревоги.
   Разделение ролей строгое: зелёный никогда не красит демо-компонент,
   оранжевый никогда не красит служебную подпись. */
const SCREEN_VARS = {
  '--dv-bg': '#04070a',
  '--dv-panel': '#090f14',
  '--dv-panel-2': '#0e161d',
  '--dv-line': 'rgba(74, 222, 128, 0.16)',
  '--dv-line-soft': 'rgba(74, 222, 128, 0.07)',
  '--dv-green': '#4ade80',
  '--dv-green-dim': '#2f9e5f',
  '--dv-green-bright': '#a7f3c9',
  '--dv-wash': 'rgba(74, 222, 128, 0.1)',
  '--dv-cream': '#ece7db',
  '--dv-cream-70': 'rgba(236, 231, 219, 0.7)',
  '--dv-cream-45': 'rgba(236, 231, 219, 0.45)',
  '--dv-accent': '#ef4a23',
  '--dv-accent-wash': 'rgba(239, 74, 35, 0.14)',
  /* Светлая сцена: на ней живёт всё, что увидит конечный пользователь. */
  '--dv-stage': '#f2f1ec',
  '--dv-stage-2': '#e7e5dd',
  '--dv-stage-ink': '#14120f',
  '--dv-stage-ink-60': 'rgba(20, 18, 15, 0.6)',
  '--dv-stage-line': 'rgba(20, 18, 15, 0.13)',
  '--dv-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
  '--dv-sans': "'Inter Tight', 'MTS Wide', system-ui, sans-serif",
} as unknown as CSSProperties

/* Те же значения хексами — их считает калькулятор контраста в разделе 04.
   Дублирование намеренное: из var() цвет обратно не достать, а показывать
   контраст «на глаз посчитанный заранее» на этом экране нельзя. */
const HEX = {
  panel: '#090f14',
  green: '#4ade80',
  greenDim: '#2f9e5f',
  greenBright: '#a7f3c9',
  cream: '#ece7db',
  accent: '#ef4a23',
  stage: '#f2f1ec',
  stageInk: '#14120f',
}

/* ── Локальные кейфреймы экрана ──────────────────────────────────────
   Живут здесь, а не в глобальном css: они нужны только двум демо этого
   экрана. Обе анимации трогают исключительно opacity и transform, а при
   prefers-reduced-motion выключаются полностью — состояние остаётся
   читаемым, движение исчезает. Останов за кадром обеспечивает
   useOffscreenPause: контейнеры помечены его ref. */
const LOCAL_KEYFRAMES = `
@keyframes dv-skeleton { 0%, 100% { opacity: 1 } 50% { opacity: 0.42 } }
@keyframes dv-spin { to { transform: rotate(360deg) } }
[data-screen='development'] .dv-skeleton { animation: dv-skeleton 1.4s ease-in-out infinite }
[data-screen='development'] .dv-spin { animation: dv-spin 0.9s linear infinite }
@media (prefers-reduced-motion: reduce) {
  [data-screen='development'] .dv-skeleton,
  [data-screen='development'] .dv-spin { animation: none }
}
`

/* ── Шрифты грузим при открытии экрана, а не глобально ───────────── */
function useDevFonts() {
  useEffect(() => {
    const id = 'development-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter+Tight:wght@300;400;500;600&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Технический голос экрана ────────────────────────────────────── */
const mono: CSSProperties = {
  fontFamily: 'var(--dv-mono)',
  fontSize: '0.6875rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: 500,
}

const code: CSSProperties = {
  fontFamily: 'var(--dv-mono)',
  fontSize: '0.8rem',
  lineHeight: 1.7,
  letterSpacing: 0,
}

function SectionHead({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <header style={{ marginBottom: 'var(--s-12)' }}>
      <Reveal y={16}>
        <div
          className="flex items-baseline gap-4 sm:gap-5 pb-4"
          style={{ borderBottom: '1px solid var(--dv-line)' }}
        >
          <span style={{ ...mono, color: 'var(--dv-accent)' }}>{n}</span>
          <h2
            style={{
              fontFamily: 'var(--dv-mono)',
              fontWeight: 700,
              fontSize: 'clamp(1.45rem, 4.2vw, 3rem)',
              letterSpacing: '-0.035em',
              // 1.12, а не плотнее: у моноширинной кириллицы «й» и «ё»
              // выходят выше прописной высоты, и на двух строках заголовка
              // верхняя строка срезала бы диакритику.
              lineHeight: 1.12,
              color: 'var(--dv-cream)',
            }}
          >
            {title}
          </h2>
        </div>
      </Reveal>
      {lead && (
        <Reveal y={14} delay={0.06}>
          <p
            className="font-light"
            style={{
              marginTop: 'var(--s-6)',
              maxWidth: '58ch',
              color: 'var(--dv-cream-70)',
              fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
              lineHeight: 1.62,
              letterSpacing: '-0.005em',
            }}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </header>
  )
}

/** Тёмная приборная панель. */
function Panel({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--dv-panel)',
        border: '1px solid var(--dv-line)',
        borderRadius: 'var(--r-lg)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Светлая сцена: поверхность, на которой продукт выглядит как продукт. */
function Stage({
  children,
  className,
  style,
  label,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  label?: string
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--dv-stage)',
        color: 'var(--dv-stage-ink)',
        borderRadius: 'var(--r-lg)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {label && (
        <span
          className="absolute left-4 top-3"
          style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

/** Переключатель-сегмент. Активность показана цветом и рамкой — не размером. */
function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { id: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div>
      <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>{label}</span>
      <div className="flex flex-wrap gap-2" style={{ marginTop: 'var(--s-3)' }}>
        {options.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className="rounded-md px-3 py-1.5"
              style={{
                fontFamily: 'var(--dv-mono)',
                fontSize: '0.75rem',
                border: `1px solid ${active ? 'var(--dv-green)' : 'var(--dv-line)'}`,
                background: active ? 'var(--dv-wash)' : 'transparent',
                color: active ? 'var(--dv-green-bright)' : 'var(--dv-cream-45)',
                transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   01 · БЮДЖЕТ КАДРА
   Главный инструмент экрана. Он отвечает на вопрос, который заказчик
   обычно слышит в виде отговорки «так плавнее»: почему анимируют только
   transform и opacity. Ответ не в мнении, а в конвейере браузера —
   свойство определяет, сколько стадий придётся пройти заново.
   Плюс единственная цифра на экране, которую нельзя выдумать: время
   кадра меряется прямо в браузере посетителя.
   ══════════════════════════════════════════════════════════════════ */

type StageId = 'style' | 'layout' | 'paint' | 'composite'

const PIPELINE: { id: StageId; label: string; what: string }[] = [
  { id: 'style', label: 'Стили', what: 'Пересчитать, какие правила применились к элементу.' },
  { id: 'layout', label: 'Геометрия', what: 'Пересчитать положение и размер — своё и всех соседей.' },
  { id: 'paint', label: 'Отрисовка', what: 'Заново залить пиксели слоя: фоны, текст, тени.' },
  { id: 'composite', label: 'Композитинг', what: 'Сложить готовые слои на GPU. Дешевле всего.' },
]

const PROPS: { id: string; css: string; stages: StageId[]; verdict: string; note: string }[] = [
  {
    id: 'transform',
    css: 'transform: translate / scale / rotate',
    stages: ['style', 'composite'],
    verdict: 'Можно анимировать',
    note: 'Слой уже растрирован. Браузер перекладывает готовую текстуру, не трогая ни геометрию, ни пиксели.',
  },
  {
    id: 'opacity',
    css: 'opacity',
    stages: ['style', 'composite'],
    verdict: 'Можно анимировать',
    note: 'Прозрачность применяется к слою целиком на этапе сложения. Содержимое слоя не меняется.',
  },
  {
    id: 'filter',
    css: 'filter: blur()',
    stages: ['style', 'composite'],
    verdict: 'С осторожностью',
    note: 'Считается на GPU, но заново каждый кадр и по площади слоя. Дороже transform, дешевле отрисовки.',
  },
  {
    id: 'color',
    css: 'background-color / color',
    stages: ['style', 'paint', 'composite'],
    verdict: 'Не анимировать',
    note: 'Геометрию не трогает, но слой приходится перерисовывать целиком на каждом кадре перехода.',
  },
  {
    id: 'shadow',
    css: 'box-shadow',
    stages: ['style', 'paint', 'composite'],
    verdict: 'Не анимировать',
    note: 'Перерисовка с размытием — самая дорогая заливка из перечисленных. Подъём карточки делается прозрачностью готового слоя с тенью.',
  },
  {
    id: 'size',
    css: 'width / height',
    stages: ['style', 'layout', 'paint', 'composite'],
    verdict: 'Не анимировать',
    note: 'Изменилась геометрия — пересчитывается всё, что зависит от неё ниже по документу. Заливка делается через scaleX отдельного слоя.',
  },
  {
    id: 'offset',
    css: 'top / left / margin',
    stages: ['style', 'layout', 'paint', 'composite'],
    verdict: 'Не анимировать',
    note: 'То же самое, но обычно ещё и на длинной странице: сдвиг одного элемента переставляет поток за собой.',
  },
]

/**
 * Измеритель кадра.
 *
 * Цикл rAF запускается только пока блок в кадре — постоянный измеритель
 * сам стал бы той фоновой работой, о которой рассказывает раздел.
 * getBoundingClientRect внутри цикла нет: единственная работа за кадр —
 * вычитание двух чисел. В состояние пишем пять раз в секунду, а не
 * шестьдесят: перерисовка React на каждый кадр исказила бы сам замер.
 */
function useFrameMeter() {
  const ref = useRef<HTMLDivElement>(null)
  const [ms, setMs] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let running = false
    let last = 0
    let lastPush = 0
    let acc: number[] = []

    const tick = (now: number) => {
      if (last) {
        const d = now - last
        // Отбрасываем провалы при уходе во вкладку: это не кадр, а пауза.
        if (d < 200) acc.push(d)
        if (acc.length > 90) acc.shift()
      }
      last = now
      if (now - lastPush > 200 && acc.length > 8) {
        lastPush = now
        // Медиана, а не среднее: один выброс не должен красить весь замер.
        const sorted = [...acc].sort((a, b) => a - b)
        setMs(sorted[Math.floor(sorted.length / 2)])
      }
      if (running) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return
      running = entry.isIntersecting
      if (running) {
        last = 0
        lastPush = 0
        acc = []
        raf = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(raf)
      }
    })
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, ms }
}

function FrameBudget() {
  const [pi, setPi] = useState(0)
  const p = PROPS[pi]
  const { ref, ms } = useFrameMeter()

  // Шкала измерителя — до 33.4мс (два пропущенных кадра при 60Гц).
  const fill = ms === null ? 0 : Math.min(1, ms / 33.4)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8 items-start">
      {/* Выбор свойства */}
      <Panel className="lg:sticky lg:top-24" style={{ padding: 'var(--s-6)' }}>
        <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Что анимируем</span>
        <div className="flex flex-col gap-1.5" style={{ marginTop: 'var(--s-4)' }}>
          {PROPS.map((item, i) => {
            const active = i === pi
            const heavy = item.stages.includes('layout') || item.stages.includes('paint')
            return (
              <button
                key={item.id}
                onClick={() => setPi(i)}
                aria-pressed={active}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-left"
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontSize: '0.72rem',
                  border: `1px solid ${active ? (heavy ? 'var(--dv-accent)' : 'var(--dv-green)') : 'var(--dv-line)'}`,
                  background: active ? (heavy ? 'var(--dv-accent-wash)' : 'var(--dv-wash)') : 'transparent',
                  color: active ? 'var(--dv-cream)' : 'var(--dv-cream-45)',
                  transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
                }}
              >
                <span className="truncate">{item.css}</span>
                <span
                  aria-hidden
                  style={{ color: heavy ? 'var(--dv-accent)' : 'var(--dv-green)', letterSpacing: '0.1em' }}
                >
                  {item.stages.length}/4
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Конвейер и измеритель */}
      <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <span style={{ ...code, color: 'var(--dv-green-bright)' }}>{p.css}</span>
            <span
              style={{
                ...mono,
                color: p.stages.length > 2 ? 'var(--dv-accent)' : 'var(--dv-green)',
              }}
            >
              {p.verdict}
            </span>
          </div>

          <div className="flex flex-col" style={{ marginTop: 'var(--s-6)', gap: 'var(--s-3)' }}>
            {PIPELINE.map((s) => {
              const on = p.stages.includes(s.id)
              const alarm = on && (s.id === 'layout' || s.id === 'paint')
              return (
                <div key={s.id} className="grid gap-x-4 gap-y-1 sm:grid-cols-[112px_minmax(0,1fr)] items-start">
                  <span
                    style={{
                      ...mono,
                      color: on ? (alarm ? 'var(--dv-accent)' : 'var(--dv-green)') : 'rgba(236,231,219,0.22)',
                      transition: `color var(--d-fast) ${cssEase.standard}`,
                      paddingTop: 6,
                    }}
                  >
                    {s.label}
                  </span>
                  <div>
                    {/* Дорожка стадии. Заливка — scaleX отдельного слоя:
                        анимировать здесь ширину значило бы проиллюстрировать
                        ровно ту ошибку, о которой раздел и рассказывает. */}
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 6, borderRadius: 3, background: 'var(--dv-line-soft)' }}
                    >
                      <div
                        aria-hidden
                        className="absolute inset-0 origin-left"
                        style={{
                          background: alarm ? 'var(--dv-accent)' : 'var(--dv-green)',
                          transform: `scaleX(${on ? 1 : 0})`,
                          transition: `transform var(--d-base) ${cssEase.standard}`,
                        }}
                      />
                    </div>
                    <p
                      className="font-light"
                      style={{
                        marginTop: 6,
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        color: on ? 'var(--dv-cream-70)' : 'rgba(236,231,219,0.28)',
                        transition: `color var(--d-fast) ${cssEase.standard}`,
                      }}
                    >
                      {s.what}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <p
            className="font-light"
            style={{
              marginTop: 'var(--s-6)',
              paddingTop: 'var(--s-4)',
              borderTop: '1px solid var(--dv-line-soft)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: 'var(--dv-cream-70)',
              maxWidth: '62ch',
            }}
          >
            {p.note}
          </p>
        </Panel>

        {/* Измеритель. Единственная цифра на экране, которую невозможно
            приписать себе: её считает браузер посетителя. */}
        <Panel style={{ padding: 'var(--s-6)' }}>
          <div ref={ref}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>
                Кадр в вашем браузере сейчас
              </span>
              <span
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
                  letterSpacing: '-0.03em',
                  color: ms !== null && ms > 17.5 ? 'var(--dv-accent)' : 'var(--dv-green)',
                }}
              >
                {ms === null ? '—' : `${ms.toFixed(1)} мс`}
              </span>
            </div>

            <div
              className="relative overflow-hidden"
              style={{ height: 10, borderRadius: 5, background: 'var(--dv-line-soft)', marginTop: 'var(--s-4)' }}
            >
              <div
                aria-hidden
                className="absolute inset-0 origin-left"
                style={{
                  background: ms !== null && ms > 17.5 ? 'var(--dv-accent)' : 'var(--dv-green)',
                  transform: `scaleX(${fill})`,
                  transition: `transform var(--d-fast) ${cssEase.standard}`,
                }}
              />
              {/* Отметки бюджета: 120 Гц и 60 Гц на шкале до 33.4мс. */}
              {[
                { at: 8.3 / 33.4, t: '8.3' },
                { at: 16.7 / 33.4, t: '16.7' },
              ].map((m) => (
                <span
                  key={m.t}
                  aria-hidden
                  className="absolute top-0 bottom-0"
                  style={{ left: `${m.at * 100}%`, width: 1, background: 'rgba(236,231,219,0.5)' }}
                />
              ))}
            </div>

            <div className="flex justify-between" style={{ marginTop: 6 }}>
              <span style={{ ...mono, color: 'var(--dv-cream-45)', fontSize: '0.625rem' }}>0</span>
              <span style={{ ...mono, color: 'var(--dv-cream-45)', fontSize: '0.625rem' }}>
                8.3 · 120 Гц
              </span>
              <span style={{ ...mono, color: 'var(--dv-cream-45)', fontSize: '0.625rem' }}>
                16.7 · 60 Гц
              </span>
              <span style={{ ...mono, color: 'var(--dv-cream-45)', fontSize: '0.625rem' }}>33.4</span>
            </div>

            <p
              className="font-light"
              style={{
                marginTop: 'var(--s-4)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: 'var(--dv-cream-70)',
                maxWidth: '62ch',
              }}
            >
              Медиана времени кадра, измеренная на этой странице. Всё, что
              успевает уложиться в отметку, экран покажет плавно; всё, что не
              успевает, пользователь увидит как рывок. Бюджет делится не между
              «красивым» и «некрасивым», а между стадиями конвейера выше.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   02 · КОД → РЕЗУЛЬТАТ
   Слева параметры компонента, посередине исходник, который из них
   получается, справа то, что этот исходник рендерит. Смысл в связке:
   компонент в продакшене — это не картинка, а тип с ограниченным
   набором допустимых значений. Именно поэтому в макете не может
   появиться «кнопка чуть другого размера».
   ══════════════════════════════════════════════════════════════════ */

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
type BtnState = 'default' | 'loading' | 'disabled'

const SIZE_SPEC: Record<Size, { fs: number; px: number; py: number; gap: number }> = {
  sm: { fs: 13, px: 16, py: 8, gap: 6 },
  md: { fs: 15, px: 22, py: 12, gap: 8 },
  lg: { fs: 17, px: 30, py: 16, gap: 10 },
}

/** Демонстрационная кнопка. Все её виды заданы типом, а не рисунком. */
function DemoButton({
  variant,
  size,
  state,
  icon,
  full,
}: {
  variant: Variant
  size: Size
  state: BtnState
  icon: boolean
  full: boolean
}) {
  const s = SIZE_SPEC[size]
  const disabled = state === 'disabled'
  const loading = state === 'loading'

  const skin: CSSProperties =
    variant === 'solid'
      ? { background: 'var(--dv-accent)', color: '#fff', border: '1px solid transparent' }
      : variant === 'outline'
        ? { background: 'transparent', color: 'var(--dv-accent)', border: '1px solid var(--dv-accent)' }
        : { background: 'transparent', color: 'var(--dv-accent)', border: '1px solid transparent' }

  return (
    <span
      role="button"
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className="inline-flex items-center justify-center rounded-full font-medium"
      style={{
        ...skin,
        fontFamily: 'var(--dv-sans)',
        fontSize: s.fs,
        paddingInline: s.px,
        paddingBlock: s.py,
        gap: s.gap,
        width: full ? '100%' : undefined,
        // Недоступное состояние — это не «полупрозрачное», а отдельный вид:
        // приглушённая заливка и курсор, объясняющий, что клика не будет.
        opacity: disabled ? 0.42 : 1,
        cursor: disabled ? 'not-allowed' : loading ? 'progress' : 'pointer',
      }}
    >
      {loading && (
        <span
          aria-hidden
          className="dv-spin inline-block shrink-0"
          style={{
            width: s.fs,
            height: s.fs,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            opacity: 0.9,
          }}
        />
      )}
      {loading ? 'Отправляю' : 'Отправить'}
      {icon && !loading && (
        <svg
          aria-hidden
          width={s.fs}
          height={s.fs}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </span>
  )
}

/**
 * Подсветка кода.
 *
 * Не парсер: разбор ограниченной грамматики, которую сам же экран и
 * порождает. Полноценная подсветка здесь была бы килобайтами зависимости
 * ради шести токенов — цена, которую в продакшене не платят.
 */
const TOKEN_RE = /("[^"]*")|(\{[^}]*\})|(\/\/[^\n]*)|(<\/?[A-Za-z][\w.]*)|(\/?>)|([A-Za-z][\w]*)(?==)/g

function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index))
    const [full, str, expr, comment, tag, punct, attr] = m
    const color = str
      ? 'var(--dv-green-bright)'
      : expr
        ? 'var(--dv-accent)'
        : comment
          ? 'rgba(236,231,219,0.32)'
          : tag
            ? 'var(--dv-cream)'
            : punct
              ? 'var(--dv-cream-45)'
              : attr
                ? 'var(--dv-green)'
                : 'inherit'
    out.push(
      <span key={key++} style={{ color }}>
        {full}
      </span>
    )
    last = m.index + full.length
  }
  if (last < src.length) out.push(src.slice(last))
  return out
}

const BUTTON_TYPE = `type ButtonProps = {
  variant: 'solid' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
}`

function CodeToResult() {
  const [variant, setVariant] = useState<Variant>('solid')
  const [size, setSize] = useState<Size>('md')
  const [state, setState] = useState<BtnState>('default')
  const [icon, setIcon] = useState(true)
  const [full, setFull] = useState(false)
  // Спиннер состояния loading — бесконечная CSS-анимация; за кадром её
  // останавливает тот же хук, что и марки на остальном сайте.
  const idleRef = useOffscreenPause<HTMLDivElement>()

  const lines = [
    '<Button',
    `  variant="${variant}"`,
    `  size="${size}"`,
    state === 'loading' ? '  loading' : null,
    state === 'disabled' ? '  disabled' : null,
    full ? '  fullWidth' : null,
    icon ? '  icon={<ArrowRight />}' : null,
    '>',
    '  Отправить',
    '</Button>',
  ].filter(Boolean) as string[]

  const src = lines.join('\n')

  return (
    <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
      {/* Параметры */}
      <Panel style={{ padding: 'var(--s-6)' }}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Segmented
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { id: 'solid', label: 'solid' },
              { id: 'outline', label: 'outline' },
              { id: 'ghost', label: 'ghost' },
            ]}
          />
          <Segmented
            label="size"
            value={size}
            onChange={setSize}
            options={[
              { id: 'sm', label: 'sm' },
              { id: 'md', label: 'md' },
              { id: 'lg', label: 'lg' },
            ]}
          />
          <Segmented
            label="state"
            value={state}
            onChange={setState}
            options={[
              { id: 'default', label: 'default' },
              { id: 'loading', label: 'loading' },
              { id: 'disabled', label: 'disabled' },
            ]}
          />
          <div>
            <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>флаги</span>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 'var(--s-3)' }}>
              {[
                { on: icon, set: () => setIcon((v) => !v), l: 'icon' },
                { on: full, set: () => setFull((v) => !v), l: 'fullWidth' },
              ].map((f) => (
                <button
                  key={f.l}
                  onClick={f.set}
                  aria-pressed={f.on}
                  className="rounded-md px-3 py-1.5"
                  style={{
                    fontFamily: 'var(--dv-mono)',
                    fontSize: '0.75rem',
                    border: `1px solid ${f.on ? 'var(--dv-green)' : 'var(--dv-line)'}`,
                    background: f.on ? 'var(--dv-wash)' : 'transparent',
                    color: f.on ? 'var(--dv-green-bright)' : 'var(--dv-cream-45)',
                    transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
                  }}
                >
                  {f.on ? '✓ ' : ''}
                  {f.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Исходник */}
        <Panel className="flex flex-col" style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Что написано</span>
          {/* overflow-x на самом блоке кода: длинная строка не должна
              растягивать страницу на 390px. */}
          <pre
            className="overflow-x-auto"
            style={{ ...code, marginTop: 'var(--s-4)', color: 'var(--dv-cream-70)' }}
          >
            {highlight(src)}
          </pre>

          <span
            style={{
              ...mono,
              color: 'var(--dv-cream-45)',
              marginTop: 'var(--s-6)',
              paddingTop: 'var(--s-4)',
              borderTop: '1px solid var(--dv-line-soft)',
              display: 'block',
            }}
          >
            Что это ограничивает
          </span>
          <pre
            className="overflow-x-auto"
            style={{ ...code, marginTop: 'var(--s-4)', color: 'var(--dv-cream-70)', fontSize: '0.75rem' }}
          >
            {highlight(BUTTON_TYPE)}
          </pre>
          <p
            className="font-light"
            style={{ marginTop: 'var(--s-4)', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
          >
            Тип не даёт собрать кнопку, которой нет в системе. Четвёртый размер
            или «почти такой же» вариант не пройдут сборку — их физически
            некуда передать.
          </p>
        </Panel>

        {/* Результат */}
        <Stage
          className="flex items-center justify-center"
          label="Результат"
          style={{ minHeight: 260, padding: 'var(--s-8)' }}
        >
          <div ref={idleRef} style={{ width: full ? '100%' : 'auto', maxWidth: 380 }}>
            <DemoButton variant={variant} size={size} state={state} icon={icon} full={full} />
          </div>
        </Stage>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   03 · СОСТОЯНИЯ ДАННЫХ
   Готовое состояние рисуют все. Проект ломается на трёх остальных:
   пока данные едут, когда их нет и когда запрос упал. Это не дизайнерская
   придирка, а прямая стоимость поддержки: каждое неописанное состояние
   разработчик придумывает сам, и в каждом проекте по-своему.
   ══════════════════════════════════════════════════════════════════ */

type DataState = 'loading' | 'empty' | 'error' | 'ready'

const DATA_STATES: { id: DataState; label: string; note: string }[] = [
  { id: 'loading', label: 'Загрузка', note: 'Скелет повторяет будущую раскладку, поэтому при появлении данных ничего не подпрыгивает. Спиннер по центру пустого экрана этого не умеет.' },
  { id: 'empty', label: 'Пусто', note: 'Пустой список — это не ошибка, а первый экран нового пользователя. Он обязан объяснять, что делать дальше.' },
  { id: 'error', label: 'Ошибка', note: 'Человеку — что произошло и что нажать. Рядом технический код, с которым в поддержку обращаются не «у меня не работает».' },
  { id: 'ready', label: 'Готово', note: 'Единственное состояние, которое обычно и попадает в макет.' },
]

const ROWS = [
  { t: 'Главная страница', s: 'Опубликована' },
  { t: 'Каталог', s: 'На проверке' },
  { t: 'Форма заявки', s: 'В работе' },
]

function DataStateDemo() {
  const [st, setSt] = useState<DataState>('loading')
  // Пульс скелетона — бесконечная CSS-анимация. Сама она за кадром не
  // остановится, поэтому контейнер помечается хуком проекта.
  const idleRef = useOffscreenPause<HTMLDivElement>()
  const current = DATA_STATES.find((d) => d.id === st) as (typeof DATA_STATES)[number]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start">
      <Stage style={{ minHeight: 320, padding: 'var(--s-8)', paddingTop: 'var(--s-12)' }} label="Список проектов">
        <div ref={idleRef} className="w-full">
          {st === 'loading' && (
            <div className="flex flex-col" style={{ gap: 12 }} aria-hidden>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="dv-skeleton"
                  style={{
                    height: 56,
                    borderRadius: 'var(--r-md)',
                    background: 'var(--dv-stage-2)',
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          )}

          {st === 'empty' && (
            <div className="flex flex-col items-center text-center" style={{ gap: 14, paddingBlock: 'var(--s-6)' }}>
              <span
                aria-hidden
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--r-md)',
                  border: '1.5px dashed var(--dv-stage-line)',
                }}
              />
              <p style={{ fontSize: 17, fontWeight: 500 }}>Здесь пока ничего нет</p>
              <p className="font-light" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--dv-stage-ink-60)', maxWidth: '34ch' }}>
                Первый проект появится в списке сразу после создания.
              </p>
              <DemoButton variant="solid" size="sm" state="default" icon={false} full={false} />
            </div>
          )}

          {st === 'error' && (
            <div className="flex flex-col items-start" style={{ gap: 12 }}>
              <span style={{ ...mono, color: 'var(--dv-accent)' }}>Ошибка запроса</span>
              <p style={{ fontSize: 17, fontWeight: 500 }}>Не удалось загрузить список</p>
              <p className="font-light" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--dv-stage-ink-60)', maxWidth: '40ch' }}>
                Соединение прервалось. Данные не потеряны — попробуйте ещё раз.
              </p>
              <div className="flex flex-wrap items-center" style={{ gap: 12, marginTop: 4 }}>
                <DemoButton variant="outline" size="sm" state="default" icon={false} full={false} />
                <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>
                  Код 504 · request-id 8f2c
                </span>
              </div>
            </div>
          )}

          {st === 'ready' && (
            <div className="flex flex-col" style={{ gap: 12 }}>
              {ROWS.map((r) => (
                <div
                  key={r.t}
                  className="flex items-center justify-between gap-4"
                  style={{
                    height: 56,
                    paddingInline: 18,
                    borderRadius: 'var(--r-md)',
                    background: 'var(--dv-stage-2)',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{r.t}</span>
                  <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>{r.s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Stage>

      <Panel style={{ padding: 'var(--s-6)' }}>
        <div className="flex flex-wrap gap-2">
          {DATA_STATES.map((d) => {
            const active = d.id === st
            return (
              <button
                key={d.id}
                onClick={() => setSt(d.id)}
                aria-pressed={active}
                className="rounded-md px-3 py-1.5"
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontSize: '0.75rem',
                  border: `1px solid ${active ? 'var(--dv-green)' : 'var(--dv-line)'}`,
                  background: active ? 'var(--dv-wash)' : 'transparent',
                  color: active ? 'var(--dv-green-bright)' : 'var(--dv-cream-45)',
                  transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
                }}
              >
                {d.label}
              </button>
            )
          })}
        </div>
        <p
          className="font-light"
          style={{ marginTop: 'var(--s-6)', fontSize: '0.9rem', lineHeight: 1.62, color: 'var(--dv-cream-70)' }}
        >
          {current.note}
        </p>
        <p
          className="font-light"
          style={{
            marginTop: 'var(--s-6)',
            paddingTop: 'var(--s-4)',
            borderTop: '1px solid var(--dv-line-soft)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'var(--dv-cream-45)',
          }}
        >
          Демонстрационный список. Данные вымышленные — важна не таблица,
          а то, что состояний четыре, а не одно.
        </p>
      </Panel>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   04 · ДОСТУПНОСТЬ
   Доступность продают как «бонус по возможности». На деле это два
   проверяемых инженерных требования: по интерфейсу можно пройти
   клавиатурой, и текст на фоне читается по посчитанному контрасту.
   Оба проверяются здесь же — на этом самом экране.
   ══════════════════════════════════════════════════════════════════ */

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const parts = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]
}

function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Пороги WCAG 2.1: 4.5 для основного текста, 3 — для крупного и границ. */
function grade(r: number): string {
  if (r >= 7) return 'AAA'
  if (r >= 4.5) return 'AA'
  if (r >= 3) return 'AA · крупный'
  return 'нетекстовое'
}

const PAIRS = [
  { fg: HEX.cream, bg: HEX.panel, label: 'Кремовый на панели', role: 'Основной текст' },
  { fg: HEX.green, bg: HEX.panel, label: 'Зелёный на панели', role: 'Статусы и подписи' },
  { fg: HEX.greenBright, bg: HEX.panel, label: 'Светлый зелёный на панели', role: 'Код и значения' },
  { fg: HEX.greenDim, bg: HEX.panel, label: 'Тусклый зелёный на панели', role: 'Линии и рамки' },
  { fg: HEX.accent, bg: HEX.panel, label: 'Акцент на панели', role: 'Предупреждения' },
  { fg: HEX.stageInk, bg: HEX.stage, label: 'Чернила на сцене', role: 'Текст продукта' },
]

const FIELDS = [
  { id: 'name', kind: 'input' as const, label: 'Имя', hint: 'input · type=text · label связан через id' },
  { id: 'topic', kind: 'select' as const, label: 'Тема', hint: 'select · нативный, открывается с клавиатуры' },
  { id: 'agree', kind: 'check' as const, label: 'Готов обсудить сроки', hint: 'checkbox · переключается пробелом' },
  { id: 'submit', kind: 'submit' as const, label: 'Отправить', hint: 'button · срабатывает по Enter и пробелу' },
]

function FocusPolygon() {
  const [focused, setFocused] = useState<number | null>(null)

  // Порядок обхода читаем из событий фокуса, а не из умозрительной схемы:
  // так на экране показано ровно то, что произойдёт по Tab у посетителя.
  const onFocusCapture = useCallback((e: FocusEvent<HTMLFormElement>) => {
    const i = Number((e.target as HTMLElement).dataset.order)
    if (!Number.isNaN(i)) setFocused(i)
  }, [])

  const ring = (i: number): CSSProperties =>
    focused === i
      ? { outline: '2px solid var(--dv-accent)', outlineOffset: 2 }
      : { outline: '2px solid transparent', outlineOffset: 2 }

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <Stage style={{ padding: 'var(--s-8)', paddingTop: 'var(--s-12)' }} label="Форма на светлой сцене">
        <form
          onFocusCapture={onFocusCapture}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(null)
          }}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col"
          style={{ gap: 16 }}
        >
          <label className="flex flex-col" style={{ gap: 6 }}>
            <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>Имя</span>
            <input
              data-order="0"
              type="text"
              placeholder="Как к вам обращаться"
              className="rounded-lg px-4 py-3"
              style={{
                ...ring(0),
                fontFamily: 'var(--dv-sans)',
                fontSize: 15,
                background: '#fff',
                color: 'var(--dv-stage-ink)',
                border: '1px solid var(--dv-stage-line)',
              }}
            />
          </label>

          <label className="flex flex-col" style={{ gap: 6 }}>
            <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>Тема</span>
            <select
              data-order="1"
              defaultValue="site"
              className="rounded-lg px-4 py-3"
              style={{
                ...ring(1),
                fontFamily: 'var(--dv-sans)',
                fontSize: 15,
                background: '#fff',
                color: 'var(--dv-stage-ink)',
                border: '1px solid var(--dv-stage-line)',
              }}
            >
              <option value="site">Сайт</option>
              <option value="product">Продукт</option>
              <option value="audit">Аудит</option>
            </select>
          </label>

          <label className="flex items-center" style={{ gap: 10, cursor: 'pointer' }}>
            <input
              data-order="2"
              type="checkbox"
              style={{ ...ring(2), width: 18, height: 18, accentColor: 'var(--dv-accent)' }}
            />
            <span style={{ fontSize: 14 }}>Готов обсудить сроки</span>
          </label>

          <button
            data-order="3"
            type="submit"
            className="inline-flex items-center justify-center rounded-full font-medium self-start"
            style={{
              ...ring(3),
              fontFamily: 'var(--dv-sans)',
              fontSize: 15,
              paddingInline: 22,
              paddingBlock: 12,
              background: 'var(--dv-accent)',
              color: '#fff',
              border: '1px solid transparent',
            }}
          >
            Отправить
          </button>
        </form>
      </Stage>

      <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Порядок обхода · клавиша Tab</span>
          <div className="flex flex-col" style={{ marginTop: 'var(--s-4)', gap: 2 }}>
            {FIELDS.map((f, i) => {
              const on = focused === i
              return (
                <div
                  key={f.id}
                  className="flex items-baseline gap-3 rounded-md px-3 py-2"
                  style={{
                    background: on ? 'var(--dv-accent-wash)' : 'transparent',
                    transition: `background-color var(--d-fast) ${cssEase.standard}`,
                  }}
                >
                  <span
                    style={{
                      ...mono,
                      color: on ? 'var(--dv-accent)' : 'var(--dv-cream-45)',
                      minWidth: 22,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <span style={{ fontSize: 14, color: on ? 'var(--dv-cream)' : 'var(--dv-cream-70)' }}>
                      {f.label}
                    </span>
                    <p style={{ ...code, fontSize: '0.7rem', color: 'var(--dv-cream-45)', lineHeight: 1.5 }}>
                      {f.hint}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <p
            className="font-light"
            style={{ marginTop: 'var(--s-4)', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
          >
            Нажмите Tab, стоя на форме слева. Подсветка идёт по порядку разметки,
            потому что порядок в разметке совпадает с визуальным. Как только его
            начинают править отступами и абсолютным позиционированием, обход
            рассыпается — и это самая частая причина недоступной формы.
          </p>
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>
            Контраст этого экрана · WCAG 2.1
          </span>
          <div style={{ marginTop: 'var(--s-4)' }}>
            {PAIRS.map((p) => {
              const r = contrast(p.fg, p.bg)
              const pass = r >= 4.5
              /* flex-wrap: на 390px оценка контраста уходит на свою строку,
                 а не распирает панель. */
              return (
                <div
                  key={p.label}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5"
                  style={{ borderBottom: '1px solid var(--dv-line-soft)' }}
                >
                  <span
                    aria-hidden
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 30,
                      height: 24,
                      borderRadius: 6,
                      background: p.bg,
                      border: '1px solid var(--dv-line-soft)',
                      color: p.fg,
                      fontFamily: 'var(--dv-mono)',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Аа
                  </span>
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: 13, color: 'var(--dv-cream-70)' }}>{p.label}</p>
                    <p style={{ ...mono, fontSize: '0.625rem', color: 'var(--dv-cream-45)' }}>{p.role}</p>
                  </div>
                  <span
                    style={{
                      ...mono,
                      letterSpacing: '0.06em',
                      color: pass ? 'var(--dv-green)' : 'var(--dv-accent)',
                      whiteSpace: 'nowrap',
                      marginLeft: 'auto',
                    }}
                  >
                    {r.toFixed(1)}:1 · {grade(r)}
                  </span>
                </div>
              )
            })}
          </div>
          <p
            className="font-light"
            style={{ marginTop: 'var(--s-4)', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
          >
            Значения посчитаны по формуле относительной яркости прямо на этой
            странице — их можно перепроверить любым сторонним калькулятором.
            Пары ниже 4.5:1 на экране есть, и они допустимы только там, где
            стоят: линии, рамки и крупные подписи, а не основной текст.
          </p>
        </Panel>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   05 · ХЕНДОФФ
   Разница между макетом «на посмотреть» и макетом, отданным в
   разработку, — не в красоте, а в количестве решений, которые не
   придётся принимать разработчику. Оверлей существует всегда и
   включается прозрачностью: монтирование десятка выносок стоило бы кадра.
   ══════════════════════════════════════════════════════════════════ */

const REDLINES: { top: string; left: string; text: string; align?: 'left' | 'right' }[] = [
  { top: '6%', left: '4%', text: 'padding: --s-6 / 24' },
  { top: '30%', left: '58%', text: 'text: --t-body / 300', align: 'left' },
  { top: '52%', left: '4%', text: 'gap: 12' },
  { top: '74%', left: '52%', text: 'radius: --r-md / 14', align: 'left' },
]

const HANDOFF = [
  { k: 'Токены, а не значения', v: 'Отступ подписан как ступень шкалы, цвет — как роль в палитре. «24 пикселя» разработчик впишет числом, «--s-6» переиспользует.' },
  { k: 'Состояния целиком', v: 'Наведение, фокус, нажатие, загрузка, недоступность, ошибка. Всё, что не описано, будет придумано — и в каждом месте по-разному.' },
  { k: 'Поведение на границах', v: 'Что происходит с длинным именем, пустым списком, картинкой другой пропорции. Это правила, а не «подгоним по месту».' },
  { k: 'Брейкпоинты как логика', v: 'Не «на телефоне поуже», а какой блок и почему меняет приоритет: что уходит под кнопку, что сворачивается, что исчезает.' },
  { k: 'Доступные имена', v: 'Что читает скринридер у иконки без текста и какой элемент получает фокус после закрытия модального окна.' },
  { k: 'Готовность к передаче', v: 'Файл, по которому разработчик собирает экран, не задавая ни одного вопроса. Ровно это и отличает срок в неделю от срока в три.' },
]

function Handoff() {
  const [redline, setRedline] = useState(false)

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <div>
        <Stage style={{ minHeight: 300, padding: 'var(--s-8)', paddingTop: 'var(--s-12)' }} label="Карточка проекта">
          <div className="relative">
            <div
              className="flex flex-col"
              style={{
                gap: 12,
                padding: 24,
                borderRadius: 14,
                background: '#fff',
                border: '1px solid var(--dv-stage-line)',
              }}
            >
              <span style={{ ...mono, color: 'var(--dv-accent)', fontSize: '0.625rem' }}>Проект</span>
              <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Сайт производственной компании
              </p>
              <p className="font-light" style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--dv-stage-ink-60)' }}>
                Каталог, расчёт стоимости и заявка. Демонстрационная карточка.
              </p>
              <DemoButton variant="outline" size="sm" state="default" icon full={false} />
            </div>

            {/* Слой выносок. Всегда в дереве, гасится прозрачностью. */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none hidden sm:block"
              style={{
                opacity: redline ? 1 : 0,
                transition: `opacity var(--d-base) ${cssEase.standard}`,
              }}
            >
              <span
                className="absolute inset-0"
                style={{ border: '1px dashed var(--dv-accent)', borderRadius: 14 }}
              />
              {REDLINES.map((r) => (
                <span
                  key={r.text}
                  className="absolute whitespace-nowrap px-1.5 py-0.5 rounded"
                  style={{
                    top: r.top,
                    left: r.left,
                    ...mono,
                    fontSize: '0.5625rem',
                    letterSpacing: '0.08em',
                    background: 'var(--dv-accent)',
                    color: '#fff',
                  }}
                >
                  {r.text}
                </span>
              ))}
            </div>
          </div>
        </Stage>

        <button
          onClick={() => setRedline((v) => !v)}
          aria-pressed={redline}
          className="rounded-full px-5 py-2.5"
          style={{
            ...mono,
            marginTop: 'var(--s-4)',
            border: `1px solid ${redline ? 'var(--dv-accent)' : 'var(--dv-line)'}`,
            background: redline ? 'var(--dv-accent-wash)' : 'transparent',
            color: redline ? 'var(--dv-accent)' : 'var(--dv-cream-45)',
            transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
          }}
        >
          {redline ? 'Скрыть разметку' : 'Показать разметку'}
        </button>
        <p
          className="font-light sm:hidden"
          style={{ marginTop: 'var(--s-3)', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--dv-cream-45)' }}
        >
          Выноски показываются на экранах шире 640 px — на телефоне они
          перекрыли бы саму карточку. Их содержание — в списке ниже.
        </p>
      </div>

      <div>
        {HANDOFF.map((h, i) => (
          <Reveal key={h.k} y={16} delay={i * stagger.item}>
            <div
              className="flex flex-col sm:flex-row gap-1.5 sm:gap-6"
              style={{ paddingBlock: 'var(--s-5)', borderBottom: '1px solid var(--dv-line-soft)' }}
            >
              <span style={{ ...mono, minWidth: '16ch', paddingTop: 3, color: 'var(--dv-green)' }}>
                {h.k}
              </span>
              <p
                className="font-light"
                style={{ fontSize: '0.92rem', lineHeight: 1.62, color: 'var(--dv-cream-70)' }}
              >
                {h.v}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── Что остаётся у заказчика ────────────────────────────────────── */
const DELIVERABLES = [
  { t: 'Репозиторий', d: 'Типизированный код с историей изменений. Проект открывается и запускается по инструкции из двух команд.' },
  { t: 'Компонентная база', d: 'Кнопки, поля, карточки, состояния данных — собранные один раз и переиспользуемые, а не скопированные по страницам.' },
  { t: 'Бюджеты', d: 'Зафиксировано, что считается приемлемым временем кадра и весом страницы. Это критерий приёмки, а не пожелание.' },
  { t: 'Доступность', d: 'Клавиатурный обход, доступные имена, контраст и уважение к prefers-reduced-motion — проверенные, а не заявленные.' },
  { t: 'Сборка и деплой', d: 'Автоматическая сборка и выкладка. Обновление сайта не требует моего участия и моей машины.' },
  { t: 'Документация', d: 'Как устроен проект, где что лежит и как добавить страницу. Пишется для того, кто придёт после меня.' },
]

const PROCESS = [
  { n: '01', t: 'Разбор', d: 'Задача бизнеса, объём, ограничения. Что считается результатом — фиксируется до первой строки кода.' },
  { n: '02', t: 'Проектирование', d: 'Структура, состояния, движение. Решения принимаются в макете, где они дешевле всего.' },
  { n: '03', t: 'Сборка', d: 'Семантическая разметка, компоненты, данные. Продакшен выглядит так же, как макет, а не «примерно».' },
  { n: '04', t: 'Проверка', d: 'Время кадра, клавиатура, контраст, поведение на границах — по списку, а не по ощущению.' },
  { n: '05', t: 'Передача', d: 'Деплой, документация, доступы. Дальше проект живёт и обновляется без меня.' },
]

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function DevelopmentScreen({ onClose }: { onClose: () => void }) {
  useDevFonts()
  const reduce = prefersReducedMotion()
  // Курсор в заголовке — единственная бесконечная анимация над сгибом.
  const caretRef = useOffscreenPause<HTMLSpanElement>()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main
      data-screen="development"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        background: 'var(--dv-bg)',
        color: 'var(--dv-cream)',
        fontFamily: 'var(--dv-sans)',
      }}
    >
      {/* Фон: техническая сетка и одно мягкое свечение. Статичен —
          движущийся фон на экране про бюджет кадра был бы издевательством. */}
      <style>{LOCAL_KEYFRAMES}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 6%, rgba(74,222,128,0.05), transparent 46%), radial-gradient(rgba(120,150,135,0.045) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 34px 34px',
        }}
      />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 rounded-full px-4 py-2 backdrop-blur"
        style={{
          ...mono,
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--dv-line)',
          color: 'var(--dv-green)',
          background: 'rgba(4,7,10,0.68)',
        }}
      >
        ← Назад
      </button>

      {/* ══ ГЕРОЙ ══════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full flex flex-col justify-center min-h-screen relative"
        style={{
          maxWidth: 'var(--max-w)',
          paddingInline: 'var(--gutter)',
          paddingTop: 'var(--s-32)',
          paddingBottom: 'var(--s-24)',
        }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <Reveal y={14}>
              <span style={{ ...mono, color: 'var(--dv-accent)' }}>Компетенция · Разработка</span>
            </Reveal>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slower, ease: ease.entrance }}
              style={{
                marginTop: 'var(--s-6)',
                fontFamily: 'var(--dv-mono)',
                fontWeight: 700,
                fontSize: 'clamp(2.6rem, 10.5vw, 8rem)',
                letterSpacing: '-0.055em',
                // 1.0, а не плотнее: в «Разработка» у моноширинной кириллицы
                // диакритика и выносные элементы выходят за прописную высоту,
                // и на плотном интерлиньяже верхняя строка их срезает.
                lineHeight: 1.0,
                color: 'var(--dv-cream)',
              }}
            >
              Разработка
              <span ref={caretRef} style={{ display: 'inline-block' }}>
                <span className="animate-caret" style={{ color: 'var(--dv-accent)' }}>
                  _
                </span>
              </span>
            </motion.h1>

            <Reveal y={18} delay={0.28}>
              <p
                className="font-light"
                style={{
                  marginTop: 'var(--s-8)',
                  maxWidth: '48ch',
                  fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.012em',
                }}
              >
                Проектирую интерфейс и сам довожу его до продакшена. Ниже — не
                рассказ об этом, а инструменты: время кадра меряется в вашем
                браузере, контраст считается на этой странице, порядок фокуса
                вы пройдёте клавишей Tab.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal y={18} delay={0.36}>
              <Panel style={{ padding: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Что проверяется на этом экране</span>
                <div className="flex flex-col" style={{ marginTop: 'var(--s-4)', gap: 10 }}>
                  {[
                    'Бюджет кадра и стадии конвейера',
                    'Связка «код → результат» и типы',
                    'Четыре состояния данных',
                    'Клавиатура и контраст по WCAG',
                    'Что входит в передачу проекта',
                  ].map((t, i) => (
                    <div key={t} className="flex items-baseline gap-3">
                      <span style={{ ...mono, color: 'var(--dv-green)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="font-light"
                        style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--dv-cream-70)' }}
                      >
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 01 · БЮДЖЕТ КАДРА ═════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="01"
          title="Кадр длится 16.7 мс"
          lead="Плавность — не вкусовая категория, а арифметика. На 60 Гц у браузера 16.7 миллисекунды на кадр, на 120 Гц — 8.3. Свойство, которое анимируют, определяет, сколько стадий конвейера придётся пройти заново в каждом из этих кадров. Выберите свойство и посмотрите, за что платит браузер."
        />
        <FrameBudget />
      </section>

      {/* ══ 02 · КОД → РЕЗУЛЬТАТ ══════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="02"
          title="Компонент — это тип, а не картинка"
          lead="Соберите кнопку параметрами. Слева появится исходник, который из них получается, справа — то, что он рендерит. Ниже — тип, который эту кнопку ограничивает: он и есть причина, по которой в проекте не заводится «ещё один размер, чуть побольше»."
        />
        <CodeToResult />
      </section>

      {/* ══ 03 · СОСТОЯНИЯ ДАННЫХ ═════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="03"
          title="Экран живёт в четырёх состояниях"
          lead="Готовое состояние рисуют все. Проект ломается на трёх остальных: пока данные едут, когда их нет и когда запрос упал. Это не придирка, а прямая стоимость поддержки — каждое неописанное состояние разработчик придумывает сам."
        />
        <DataStateDemo />
      </section>

      {/* ══ 04 · ДОСТУПНОСТЬ ══════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="04"
          title="Доступность — это требование, а не доработка"
          lead="Её продают как бонус, хотя это два проверяемых инженерных условия: по интерфейсу проходят клавиатурой, а текст на фоне имеет посчитанный контраст. Оба проверяются здесь же — на форме слева и на палитре самого этого экрана."
        />
        <FocusPolygon />
      </section>

      {/* ══ 05 · ХЕНДОФФ ══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="05"
          title="Макет в разработку — это спецификация"
          lead="Внешне он не отличается от макета «на посмотреть». Отличается количеством решений, которые не придётся принимать разработчику: включите разметку и посмотрите, что на самом деле передаётся вместе с картинкой."
        />
        <Handoff />
      </section>

      {/* ══ 06 · ЧТО ОСТАЁТСЯ ═════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead n="06" title="Что остаётся у заказчика" />
        <div className="grid lg:grid-cols-12 gap-x-8">
          <div className="lg:col-span-8 lg:col-start-5">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.t} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8"
                  style={{ paddingBlock: 'var(--s-6)', borderBottom: '1px solid var(--dv-line-soft)' }}
                >
                  <span style={{ ...mono, color: 'var(--dv-accent)', minWidth: 36, paddingTop: 4 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--dv-mono)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                        marginBottom: 6,
                        color: 'var(--dv-cream)',
                      }}
                    >
                      {d.t}
                    </h3>
                    <p
                      className="font-light"
                      style={{ maxWidth: '50ch', color: 'var(--dv-cream-70)', lineHeight: 1.62 }}
                    >
                      {d.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 07 · ПРОЦЕСС ══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead n="07" title="Как идёт работа" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} y={18} delay={i * stagger.item}>
              <div style={{ borderTop: '1px solid var(--dv-line)', paddingTop: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--dv-accent)' }}>{s.n}</span>
                <h3
                  style={{
                    marginTop: 'var(--s-4)',
                    marginBottom: 'var(--s-3)',
                    fontFamily: 'var(--dv-mono)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                    color: 'var(--dv-cream)',
                  }}
                >
                  {s.t}
                </h3>
                <p
                  className="font-light"
                  style={{ color: 'var(--dv-cream-70)', fontSize: '0.9rem', lineHeight: 1.6 }}
                >
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ФИНАЛ ═════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <Reveal y={22}>
              <h2
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.7rem, 6vw, 4.2rem)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1.08,
                  color: 'var(--dv-cream)',
                }}
              >
                Половина решений
                <br />
                принимается в сборке
              </h2>
            </Reveal>
            <Reveal y={16} delay={0.16}>
              <p
                className="font-light"
                style={{
                  marginTop: 'var(--s-6)',
                  maxWidth: '54ch',
                  color: 'var(--dv-cream-70)',
                  lineHeight: 1.65,
                }}
              >
                Поэтому разработку невыгодно брать отдельным подрядом: то, что
                в макете стоило правки, между двумя подрядчиками стоит недели
                согласований. Дешевле, когда проектирует и собирает один человек.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Reveal y={16} delay={0.26}>
              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-full"
                style={{
                  ...mono,
                  border: '1px solid var(--dv-accent)',
                  color: 'var(--dv-accent)',
                  paddingInline: 'var(--s-8)',
                  paddingBlock: 'var(--s-4)',
                }}
              >
                {/* Заливка — scaleY отдельного слоя: переход по background
                    стоил бы отрисовки на каждом кадре наведения. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
                  style={{
                    background: 'var(--dv-accent-wash)',
                    transition: `transform ${duration.base}s ${cssEase.standard}`,
                  }}
                />
                <span className="relative">← Вернуться к услугам</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
