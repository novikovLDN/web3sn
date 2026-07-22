/**
 * Экран услуги — Разработка.
 *
 * ТЕЗИС
 * ─────
 * Разработку в портфолио показывают двумя способами, и оба не работают.
 * Первый — антураж: тёмный терминал, печатающийся код, плавающие скобки.
 * Он доказывает ровно одно — что человек видел терминал. Второй — список
 * технологий: React, TypeScript, Vite. Список ставит автора в один ряд
 * со всеми, кто выучил те же слова.
 *
 * Экран построен на третьем допущении: инженера видно по двум вещам, и
 * обе проверяемы прямо в браузере посетителя.
 *
 *   1. ПО ИЗМЕРЕННОМУ ЧИСЛУ. Не «делаю плавно и легко», а время кадра,
 *      длинные кадры и вес страницы, посчитанные на этой самой странице
 *      на этой самой машине. Такое число нельзя приписать себе: его можно
 *      испортить, открыв тяжёлую вкладку, и оно испортится честно.
 *   2. ПО НАЗВАННОМУ КОМПРОМИССУ. Не «использую Lenis», а «купил инерцию,
 *      заплатил конфликтом со scroll-driven animations, position: sticky
 *      и доступностью — поэтому выключаю его на тач-устройствах и при
 *      prefers-reduced-motion». Названный компромисс вынимает автора из
 *      сравнения по спискам инструментов. Раздел 03 — про решение этого
 *      сайта, с его настоящей ценой, показанной числом.
 *
 * Всё остальное на экране подчинено этим двум: тип вместо картинки,
 * четыре состояния данных вместо одного, доступность как посчитанное
 * условие, а не как обещание.
 *
 * ПЕРСИСТЕНТНОЕ СОСТОЯНИЕ ЭКРАНА
 * ──────────────────────────────
 * Внизу закреплены УСЛОВИЯ ПРИЁМКИ: настольный 120 Гц, ноутбук 60 Гц,
 * телефон на медленном канале. Это не декоративный переключатель — он
 * расходится по всему экрану: под него пересчитывается бюджет кадра
 * (8.3 против 16.7 мс), время загрузки измеренных байтов, и в разделе
 * про компромисс меняется сам вердикт — на тач-устройстве инерционный
 * скролл этого сайта физически выключен, и раздел это показывает.
 * Инженерное решение не бывает верным вообще; оно верно для условий.
 *
 * ВИЗУАЛЬНАЯ НИША
 * ───────────────
 * Температуры остальных экранов заняты: швейцарская бумага с ультрамарином
 * (Веб-дизайн), бумага с переключаемой палитрой (Брендинг), петроль (Моушн),
 * тёплая глина (3D). Здесь — приборная: почти-чёрное с зелёным системным
 * голосом. И зелёный тут не цитата «хакерского терминала», а функция:
 * экран разделён на две поверхности. Тёмная панель — инструмент, на ней
 * живут измерения и код. Светлая сцена — продукт, на ней живёт то, что
 * увидит конечный пользователь. Разделение поверхностей и есть смысл
 * профессии: слева то, что пишут, справа то, что от этого происходит.
 *
 * ГАРНИТУРЫ И КИРИЛЛИЦА
 * ─────────────────────
 * Пиксельная Handjet прежней версии убрана: она читается как игровая, а
 * услуга инженерная. Взяты JetBrains Mono (технический голос, заголовки)
 * и Inter Tight (проза). Кириллица у обеих проверена по метаданным Google
 * Fonts — в subsets присутствуют cyrillic и cyrillic-ext; это была открытая
 * претензия к экрану, и она закрыта не предположением, а проверкой.
 * Шкала экрана — своя, в переменных --dv-t-* / --dv-lh-* / --dv-tr-*
 * ниже, с двумя кириллическими поправками, выведенными на живых словах:
 * интерлиньяж дисплея не ниже 1.0 (в «Разработка» диакритика и выносные
 * элементы моношрифта выходят за прописную высоту) и разрядка прописных
 * 0.14em вместо проектных 0.18em (кириллические прописные шире латинских
 * и при равной разрядке рассыпаются).
 *
 * НУМЕРАЦИЯ РАЗДЕЛОВ
 * ──────────────────
 * 01/02/03 оставлены осознанно, вопреки общей претензии к нумерации как
 * к признаку шаблона. Здесь это не украшение порядка, а сам предмет:
 * разделы — пункты списка приёмки, по которому работу принимают. У списка
 * приёмки номера есть по определению, и последний раздел («Как идёт
 * работа») ссылается на них как на этапы проверки.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Анимируются только transform и opacity — на экране, который сам
 * объясняет почему, нарушить это правило значило бы опровергнуть себя.
 * Все заливки и индикаторы — scaleX/scaleY на отдельном слое, все оверлеи
 * существуют всегда и гасятся прозрачностью. Два rAF-цикла (измеритель
 * кадра и лаборатория инерции) гейтятся IntersectionObserver, не зовут
 * getBoundingClientRect внутри цикла и пишут в состояние React пять раз
 * в секунду, а не шестьдесят: перерисовка на каждый кадр исказила бы сам
 * замер. Бесконечные CSS-анимации останавливаются за кадром через
 * useOffscreenPause.
 *
 * Кривые и длительности — только из design/motion.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { Reveal, useOffscreenPause } from '../design/primitives'
import { cssEase, duration, ease, stagger, prefersReducedMotion } from '../design/motion'

/* ── Палитра экрана ──────────────────────────────────────────────────
   Один источник правды. Хексы объявлены здесь и только здесь: из них
   собираются CSS-переменные корня, и они же попадают в калькулятор
   контраста раздела 06 — из var() цвет обратно не достать, а показывать
   «заранее посчитанный на глаз» контраст на этом экране нельзя.
   В разметке цвет берётся через var() или через это имя, но никогда
   литералом.

   Роли строгие: зелёный — системный голос среды (подписи, статусы,
   разметка, «в норме»), оранжевый — цвет продукта и цвет превышения
   бюджета. Зелёный никогда не красит демо-компонент, оранжевый никогда
   не красит служебную подпись. */
const PALETTE = {
  bg: '#04070a',
  panel: '#090f14',
  panel2: '#0e161d',
  green: '#4ade80',
  greenDim: '#2f9e5f',
  greenBright: '#a7f3c9',
  cream: '#ece7db',
  accent: '#ef4a23',
  /* Светлая сцена: поверхность, на которой продукт выглядит как продукт. */
  stage: '#f2f1ec',
  stage2: '#e7e5dd',
  stageCard: '#ffffff',
  stageInk: '#14120f',
} as const

const SCREEN_VARS = {
  '--dv-bg': PALETTE.bg,
  '--dv-panel': PALETTE.panel,
  '--dv-panel-2': PALETTE.panel2,
  '--dv-line': 'rgba(74, 222, 128, 0.16)',
  '--dv-line-soft': 'rgba(74, 222, 128, 0.07)',
  '--dv-green': PALETTE.green,
  '--dv-green-dim': PALETTE.greenDim,
  '--dv-green-bright': PALETTE.greenBright,
  '--dv-wash': 'rgba(74, 222, 128, 0.1)',
  '--dv-cream': PALETTE.cream,
  '--dv-cream-70': 'rgba(236, 231, 219, 0.7)',
  '--dv-cream-45': 'rgba(236, 231, 219, 0.45)',
  '--dv-cream-22': 'rgba(236, 231, 219, 0.22)',
  '--dv-accent': PALETTE.accent,
  '--dv-accent-wash': 'rgba(239, 74, 35, 0.14)',
  '--dv-stage': PALETTE.stage,
  '--dv-stage-2': PALETTE.stage2,
  '--dv-stage-card': PALETTE.stageCard,
  '--dv-stage-ink': PALETTE.stageInk,
  '--dv-stage-ink-60': 'rgba(20, 18, 15, 0.6)',
  '--dv-stage-line': 'rgba(20, 18, 15, 0.13)',

  '--dv-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
  '--dv-sans': "'Inter Tight', 'MTS Wide', system-ui, sans-serif",

  /* ── Собственная типографическая шкала экрана ──────────────────────
     Не только var(--t-*) проекта: у экрана свой голос, и решения про
     кегль, интерлиньяж и трекинг приняты здесь явно.

     Кириллические поправки, выведенные на живых словах этого экрана:
     · --dv-lh-h1: 1.0, а не проектные 0.88. В слове «Разработка» у
       моноширинной кириллицы выносные элементы и диакритика выходят за
       прописную высоту, и на плотном интерлиньяже верхняя строка их
       срезает. Проверено на «й» и «ё».
     · --dv-tr-mono: 0.14em вместо проектных --tr-label 0.18em.
       Кириллические прописные шире латинских и при равной разрядке
       рассыпаются на отдельные буквы. */
  '--dv-t-h1': 'clamp(2.6rem, 10.5vw, 7.6rem)',
  '--dv-t-h2': 'clamp(1.45rem, 4.2vw, 3rem)',
  '--dv-t-h3': 'clamp(1.15rem, 2.4vw, 1.5rem)',
  '--dv-t-lead': 'clamp(1.05rem, 2vw, 1.45rem)',
  '--dv-t-body': 'clamp(0.92rem, 1.5vw, 1.05rem)',
  '--dv-t-small': '0.82rem',
  '--dv-t-num': 'clamp(1.5rem, 5vw, 2.4rem)',
  '--dv-t-code': '0.8rem',
  '--dv-t-mono': '0.6875rem',
  '--dv-lh-h1': '1.0',
  '--dv-lh-h2': '1.12',
  '--dv-lh-lead': '1.5',
  '--dv-lh-body': '1.62',
  '--dv-tr-h1': '-0.055em',
  '--dv-tr-h2': '-0.035em',
  '--dv-tr-mono': '0.14em',
} as unknown as CSSProperties

/* ── Локальные кейфреймы экрана ──────────────────────────────────────
   Живут здесь, а не в глобальном css: нужны только двум демо этого
   экрана. Обе анимации трогают исключительно opacity и transform, при
   prefers-reduced-motion выключаются полностью — состояние остаётся
   читаемым, движение исчезает. Останов за кадром обеспечивает
   useOffscreenPause: контейнеры помечены его ref. */
const LOCAL_KEYFRAMES = `
@keyframes dv-skeleton { 0%, 100% { opacity: 1 } 50% { opacity: 0.42 } }
@keyframes dv-spin { to { transform: rotate(360deg) } }
[data-screen='development'] .dv-skeleton { animation: dv-skeleton 1.4s ease-in-out infinite }
[data-screen='development'] .dv-spin { animation: dv-spin 0.9s linear infinite }
[data-screen='development'] [data-idle='true'] .dv-skeleton,
[data-screen='development'] [data-idle='true'] .dv-spin { animation-play-state: paused }
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
  fontSize: 'var(--dv-t-mono)',
  letterSpacing: 'var(--dv-tr-mono)',
  textTransform: 'uppercase',
  fontWeight: 500,
}

const code: CSSProperties = {
  fontFamily: 'var(--dv-mono)',
  fontSize: 'var(--dv-t-code)',
  lineHeight: 1.7,
  letterSpacing: 0,
}

/* ══════════════════════════════════════════════════════════════════
   УСЛОВИЯ ПРИЁМКИ — персистентное состояние экрана
   Одно решение посетителя, которое расходится по трём разделам:
   бюджет кадра, время загрузки измеренных байтов и вердикт по
   инерционному скроллу. Числа берутся не с потолка: 8.3 и 16.7 мс —
   это 1/120 и 1/60 секунды; каналы — грубые, но честно подписанные
   как расчётные, а не измеренные.
   ══════════════════════════════════════════════════════════════════ */

type ConditionId = 'desk' | 'laptop' | 'phone'

type Condition = {
  id: ConditionId
  label: string
  short: string
  /** Бюджет одного кадра, мс. */
  budget: number
  /** Расчётная пропускная способность канала, Мбит/с. */
  mbps: number
  /** Грубый указатель, тач это или мышь — от него зависит поведение Lenis. */
  coarse: boolean
  note: string
}

const CONDITIONS: Condition[] = [
  {
    id: 'desk',
    label: 'Настольный · 120 Гц',
    short: '120 Гц',
    budget: 8.3,
    mbps: 30,
    coarse: false,
    note: 'Самый жёсткий бюджет кадра из трёх: на 120 Гц у браузера вдвое меньше времени, и ошибка в выборе анимируемого свойства видна сразу.',
  },
  {
    id: 'laptop',
    label: 'Ноутбук · 60 Гц',
    short: '60 Гц',
    budget: 16.7,
    mbps: 12,
    coarse: false,
    note: 'Условия, в которых работает большинство. Бюджет 16.7 мс — то самое число, которое обычно пишут словами «60 fps».',
  },
  {
    id: 'phone',
    label: 'Телефон · медленный канал',
    short: 'телефон',
    budget: 16.7,
    mbps: 1.6,
    coarse: true,
    note: 'Тач-устройство и узкий канал. Здесь вес страницы решает больше, чем кадр, а инерционный скролл этого сайта выключен — см. раздел 03.',
  },
]

/* ── Мелкие типографические примитивы экрана ─────────────────────── */

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
              fontSize: 'var(--dv-t-h2)',
              letterSpacing: 'var(--dv-tr-h2)',
              lineHeight: 'var(--dv-lh-h2)',
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
              fontSize: 'var(--dv-t-body)',
              lineHeight: 'var(--dv-lh-body)',
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

/** Полоса-индикатор. Заливка — scaleX отдельного слоя, а не ширина:
    анимировать здесь width значило бы проиллюстрировать ровно ту ошибку,
    о которой говорит раздел 01. */
function Bar({
  fill,
  alarm,
  height = 8,
  marks,
}: {
  fill: number
  alarm?: boolean
  height?: number
  marks?: number[]
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height, borderRadius: height / 2, background: 'var(--dv-line-soft)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 origin-left"
        style={{
          background: alarm ? 'var(--dv-accent)' : 'var(--dv-green)',
          transform: `scaleX(${Math.max(0, Math.min(1, fill))})`,
          transition: `transform var(--d-fast) ${cssEase.standard}`,
        }}
      />
      {marks?.map((m) => (
        <span
          key={m}
          aria-hidden
          className="absolute top-0 bottom-0"
          style={{ left: `${m * 100}%`, width: 1, background: 'var(--dv-cream-45)' }}
        />
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   01 · ИЗМЕРЕННАЯ ПАНЕЛЬ
   Главный раздел экрана и прямая замена прежней прозе про «60 fps».
   Здесь нет ни одного числа, написанного автором: время кадра, длинные
   кадры и время блокировки считает браузер посетителя прямо сейчас.
   Эти числа можно испортить — открыть тяжёлую вкладку, свернуть окно —
   и они испортятся честно. Именно это и делает их доказательством.
   ══════════════════════════════════════════════════════════════════ */

/** Запись Long Animation Frames. Типов в lib.dom пока нет — описываем сами. */
type LoafEntry = PerformanceEntry & {
  blockingDuration?: number
  renderStart?: number
}

type Loaf = {
  /** Сколько длинных кадров браузер зафиксировал с открытия страницы. */
  count: number
  /** Самый длинный из них, мс. */
  worst: number
  /** Суммарное время, на которое такие кадры блокировали ввод, мс. */
  blocking: number
  /** Какой API реально доступен: LoAF, старый long-task или никакого. */
  api: 'loaf' | 'longtask' | 'none'
}

/**
 * Наблюдатель за длинными кадрами.
 *
 * Long Animation Frames — это не «долгий скрипт», а кадр, который целиком
 * не уложился в бюджет: вместе со стилем, раскладкой и отрисовкой. Ровно
 * то, что пользователь видит как рывок. Где LoAF недоступен, честно
 * откатываемся на long-task (он видит только скрипты) и подписываем это.
 *
 * buffered: true — чтобы поймать и то, что случилось до монтирования
 * компонента, в том числе стоимость самого открытия экрана.
 */
function useLoaf(): Loaf {
  const [state, setState] = useState<Loaf>({ count: 0, worst: 0, blocking: 0, api: 'none' })

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const supported: readonly string[] = PerformanceObserver.supportedEntryTypes ?? []
    const type = supported.includes('long-animation-frame')
      ? 'long-animation-frame'
      : supported.includes('longtask')
        ? 'longtask'
        : null
    if (!type) return

    const api: Loaf['api'] = type === 'long-animation-frame' ? 'loaf' : 'longtask'
    // Накапливаем в ref-подобных локальных переменных и пишем в состояние
    // одним setState на пачку записей: наблюдатель не должен сам стать
    // причиной длинного кадра.
    let count = 0
    let worst = 0
    let blocking = 0

    const obs = new PerformanceObserver((list) => {
      for (const raw of list.getEntries()) {
        const e = raw as LoafEntry
        count += 1
        if (e.duration > worst) worst = e.duration
        // blockingDuration есть только у LoAF; у long-task считаем
        // блокировкой всё сверх 50 мс — так же, как это делает TBT.
        blocking += e.blockingDuration ?? Math.max(0, e.duration - 50)
      }
      setState({ count, worst, blocking, api })
    })

    try {
      obs.observe({ type, buffered: true })
    } catch {
      return
    }
    setState({ count: 0, worst: 0, blocking: 0, api })
    return () => obs.disconnect()
  }, [])

  return state
}

/**
 * Измеритель кадра.
 *
 * Цикл rAF запускается только пока блок в кадре: постоянный измеритель
 * сам стал бы той фоновой работой, о которой рассказывает раздел.
 * getBoundingClientRect внутри цикла нет — единственная работа за кадр
 * это вычитание двух чисел. В состояние пишем пять раз в секунду, а не
 * шестьдесят: перерисовка React на каждый кадр исказила бы сам замер.
 * Отдаём медиану и 95-й перцентиль: среднее прячет именно те провалы,
 * ради которых замер и делается.
 */
function useFrameMeter() {
  const ref = useRef<HTMLDivElement>(null)
  const [stat, setStat] = useState<{ median: number; p95: number } | null>(null)

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
        if (acc.length > 120) acc.shift()
      }
      last = now
      if (now - lastPush > 200 && acc.length > 8) {
        lastPush = now
        const sorted = [...acc].sort((a, b) => a - b)
        setStat({
          median: sorted[Math.floor(sorted.length * 0.5)],
          p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
        })
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

  return { ref, stat }
}

/** Одна строка приборной панели: подпись, число, шкала. */
function Readout({
  label,
  value,
  unit,
  alarm,
  fill,
  marks,
  note,
}: {
  label: string
  value: string
  unit?: string
  alarm?: boolean
  fill?: number
  marks?: number[]
  note?: string
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>{label}</span>
        <span
          style={{
            fontFamily: 'var(--dv-mono)',
            fontWeight: 700,
            fontSize: 'var(--dv-t-num)',
            letterSpacing: '-0.03em',
            color: alarm ? 'var(--dv-accent)' : 'var(--dv-green)',
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: '0.5em', marginLeft: 6, color: 'var(--dv-cream-45)' }}>
              {unit}
            </span>
          )}
        </span>
      </div>
      {fill !== undefined && (
        <div style={{ marginTop: 'var(--s-4)' }}>
          <Bar fill={fill} alarm={alarm} height={10} marks={marks} />
        </div>
      )}
      {note && (
        <p
          className="font-light"
          style={{
            marginTop: 'var(--s-3)',
            fontSize: 'var(--dv-t-small)',
            lineHeight: 1.6,
            color: 'var(--dv-cream-70)',
            maxWidth: '62ch',
          }}
        >
          {note}
        </p>
      )}
    </div>
  )
}

/* Стадии конвейера и стоимость свойств — объяснение к измеренному числу.
   Без него панель показывает «сколько», но не показывает «за что». */
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
    css: 'transform: translate / scale',
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
    note: 'Считается на GPU, но заново каждый кадр и по всей площади слоя. Дороже transform, дешевле отрисовки.',
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
    note: 'То же самое, но обычно ещё и на длинной странице: сдвиг одного элемента переставляет за собой весь поток.',
  },
]

function Instruments({ cond }: { cond: Condition }) {
  const [pi, setPi] = useState(0)
  const p = PROPS[pi]
  const { ref, stat } = useFrameMeter()
  const loaf = useLoaf()

  // Шкала измерителя — до двойного бюджета выбранных условий.
  const scaleMax = cond.budget * 2
  const overBudget = stat !== null && stat.median > cond.budget * 1.05

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-8 items-start">
      {/* Приборы. sticky здесь работает только потому, что ни один предок
          секции не имеет overflow: hidden — на этом проекте это уже ломалось. */}
      <div ref={ref} className="lg:sticky lg:top-24 flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <Readout
            label={`Кадр сейчас · бюджет ${cond.budget} мс`}
            value={stat === null ? '—' : stat.median.toFixed(1)}
            unit="мс · медиана"
            alarm={overBudget}
            fill={stat === null ? 0 : stat.median / scaleMax}
            marks={[cond.budget / scaleMax]}
            note={
              stat === null
                ? 'Измерение начнётся, когда панель окажется в кадре: постоянно работающий измеритель сам был бы фоновой нагрузкой.'
                : `95-й перцентиль ${stat.p95.toFixed(1)} мс. Медиана говорит, как экран ощущается обычно, перцентиль — как он ощущается в худшие моменты. Отметка на шкале — бюджет выбранных условий.`
            }
          />
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <Readout
            label={loaf.api === 'longtask' ? 'Длинные задачи · long-task' : 'Длинные кадры · LoAF'}
            value={loaf.api === 'none' ? '—' : String(loaf.count)}
            unit={loaf.api === 'none' ? '' : 'с открытия страницы'}
            alarm={loaf.count > 0}
            note={
              loaf.api === 'none'
                ? 'Ваш браузер не отдаёт этот показатель. Это тоже результат измерения — придумывать вместо него число нельзя.'
                : loaf.api === 'longtask'
                  ? `Худшая ${loaf.worst.toFixed(0)} мс, суммарная блокировка ввода ${loaf.blocking.toFixed(0)} мс. Ваш браузер знает только про длинные скрипты; кадры, испорченные раскладкой и отрисовкой, он не покажет.`
                  : `Худший ${loaf.worst.toFixed(0)} мс, суммарная блокировка ввода ${loaf.blocking.toFixed(0)} мс. Long Animation Frames считает кадр целиком — со стилем, раскладкой и отрисовкой, а не только скрипт. Ноль здесь честнее обещания плавности.`
            }
          />
        </Panel>
      </div>

      {/* Объяснение: за что именно платит браузер */}
      <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>
            Что происходит, если анимировать
          </span>
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: 'var(--s-4)' }}>
            {PROPS.map((item, i) => {
              const active = i === pi
              const heavy = item.stages.includes('layout') || item.stages.includes('paint')
              return (
                <button
                  key={item.id}
                  onClick={() => setPi(i)}
                  aria-pressed={active}
                  className="rounded-md px-3 py-1.5 text-left"
                  style={{
                    fontFamily: 'var(--dv-mono)',
                    fontSize: '0.72rem',
                    border: `1px solid ${active ? (heavy ? 'var(--dv-accent)' : 'var(--dv-green)') : 'var(--dv-line)'}`,
                    background: active ? (heavy ? 'var(--dv-accent-wash)' : 'var(--dv-wash)') : 'transparent',
                    color: active ? 'var(--dv-cream)' : 'var(--dv-cream-45)',
                    transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
                  }}
                >
                  {item.id}
                </button>
              )
            })}
          </div>

          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2"
            style={{ marginTop: 'var(--s-6)' }}
          >
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
                      color: on ? (alarm ? 'var(--dv-accent)' : 'var(--dv-green)') : 'var(--dv-cream-22)',
                      transition: `color var(--d-fast) ${cssEase.standard}`,
                      paddingTop: 6,
                    }}
                  >
                    {s.label}
                  </span>
                  <div>
                    <Bar fill={on ? 1 : 0} alarm={alarm} height={6} />
                    <p
                      className="font-light"
                      style={{
                        marginTop: 6,
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        color: on ? 'var(--dv-cream-70)' : 'var(--dv-cream-22)',
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

        <Panel style={{ padding: 'var(--s-6)' }}>
          <p
            className="font-light"
            style={{ fontSize: 'var(--dv-t-small)', lineHeight: 1.65, color: 'var(--dv-cream-70)' }}
          >
            Проверьте панель на прочность: откройте тяжёлую вкладку или начните
            быструю прокрутку. Числа испортятся — и это ровно то, чего нельзя
            добиться от фразы «делаю плавно». Замер стоит браузеру одного
            вычитания за кадр и останавливается, как только панель уходит
            из вида.
          </p>
        </Panel>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   02 · ВЕС СТРАНИЦЫ
   Второе измеренное число и вторая замена прозе. Байты берутся из
   Resource Timing — это ровно то, что браузер посетителя скачал, чтобы
   показать этот экран. Время загрузки считается под выбранный канал и
   подписано как расчётное: выдавать расчёт за замер на экране про
   инженерную честность было бы саморазоблачением.
   ══════════════════════════════════════════════════════════════════ */

type WeightRow = { key: string; label: string; bytes: number; count: number }

type Weight = { rows: WeightRow[]; total: number; unknown: number; ok: boolean }

const KIND_LABEL: Record<string, string> = {
  doc: 'Документ',
  script: 'Скрипты',
  css: 'Стили',
  font: 'Шрифты',
  img: 'Изображения',
  other: 'Прочее',
}

function classify(e: PerformanceResourceTiming): string {
  const t = e.initiatorType
  if (t === 'script') return 'script'
  if (t === 'css' || (t === 'link' && e.name.includes('.css'))) return 'css'
  if (t === 'link' && e.name.includes('fonts.googleapis')) return 'css'
  if (t === 'font') return 'font'
  if (t === 'img' || t === 'image') return 'img'
  if (/\.(woff2?|ttf|otf)(\?|$)/.test(e.name)) return 'font'
  return 'other'
}

/**
 * Что реально скачал браузер.
 *
 * transferSize — это байты по сети вместе со сжатием и заголовками; ноль
 * означает либо попадание в кэш, либо кросс-доменный ресурс без
 * Timing-Allow-Origin. Такие случаи не подменяем оценкой, а считаем
 * отдельно и подписываем: «столько-то ресурсов размер не сообщили».
 * Наблюдатель на 'resource' нужен потому, что часть файлов (шрифты
 * экрана) приезжает уже после монтирования.
 */
function usePageWeight(): Weight {
  const [w, setW] = useState<Weight>({ rows: [], total: 0, unknown: 0, ok: false })

  useEffect(() => {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) return

    const measure = () => {
      const buckets = new Map<string, WeightRow>()
      let unknown = 0

      const add = (key: string, bytes: number) => {
        const row = buckets.get(key) ?? { key, label: KIND_LABEL[key], bytes: 0, count: 0 }
        row.bytes += bytes
        row.count += 1
        buckets.set(key, row)
      }

      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined
      if (nav) {
        if (nav.transferSize > 0) add('doc', nav.transferSize)
        else unknown += 1
      }

      for (const raw of performance.getEntriesByType('resource')) {
        const e = raw as PerformanceResourceTiming
        if (e.transferSize > 0) add(classify(e), e.transferSize)
        else unknown += 1
      }

      const rows = [...buckets.values()].sort((a, b) => b.bytes - a.bytes)
      const total = rows.reduce((s, r) => s + r.bytes, 0)
      setW({ rows, total, unknown, ok: total > 0 })
    }

    measure()

    let obs: PerformanceObserver | null = null
    if (typeof PerformanceObserver !== 'undefined') {
      obs = new PerformanceObserver(() => measure())
      try {
        obs.observe({ type: 'resource', buffered: false })
      } catch {
        obs = null
      }
    }
    return () => obs?.disconnect()
  }, [])

  return w
}

const KB = 1024

function PageWeight({ cond }: { cond: Condition }) {
  const w = usePageWeight()

  // Расчёт, а не замер: байты × 8 бит / пропускная способность канала.
  const ms = (w.total * 8) / (cond.mbps * 1000)
  const heavy = ms > 1000

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] items-start">
      <Panel style={{ padding: 'var(--s-6)' }}>
        <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>
          Скачано браузером для этого экрана
        </span>

        <div style={{ marginTop: 'var(--s-6)' }}>
          {w.rows.map((r) => (
            <div
              key={r.key}
              className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[120px_minmax(0,1fr)_84px] items-center"
              style={{ paddingBlock: 'var(--s-3)', borderBottom: '1px solid var(--dv-line-soft)' }}
            >
              <span style={{ ...mono, color: 'var(--dv-cream-70)' }}>
                {r.label}
                <span style={{ color: 'var(--dv-cream-45)' }}> · {r.count}</span>
              </span>
              <Bar fill={w.total ? r.bytes / w.total : 0} height={6} />
              <span
                style={{
                  ...mono,
                  letterSpacing: '0.06em',
                  color: 'var(--dv-green)',
                  textAlign: 'right',
                }}
              >
                {(r.bytes / KB).toFixed(1)} КБ
              </span>
            </div>
          ))}

          {!w.ok && (
            <p
              className="font-light"
              style={{ fontSize: 'var(--dv-t-small)', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
            >
              Браузер не сообщил размеры ресурсов — так бывает при полном
              попадании в кэш. Число здесь не появится: подставлять вместо
              измерения оценку на экране про измерения нельзя.
            </p>
          )}
        </div>

        {w.unknown > 0 && (
          <p
            className="font-light"
            style={{
              marginTop: 'var(--s-4)',
              fontSize: '0.78rem',
              lineHeight: 1.6,
              color: 'var(--dv-cream-45)',
            }}
          >
            Ещё {w.unknown} {w.unknown === 1 ? 'ресурс' : 'ресурсов'} размер не
            сообщили: либо взяты из кэша, либо пришли с чужого домена без
            заголовка Timing-Allow-Origin. В сумму они не входят — и это
            занижает её, а не завышает.
          </p>
        )}
      </Panel>

      <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <Readout
            label="Всего по сети"
            value={w.ok ? (w.total / KB).toFixed(0) : '—'}
            unit="КБ"
            fill={w.ok ? Math.min(1, w.total / (600 * KB)) : 0}
            marks={[300 / 600]}
            note="Отметка на шкале — 300 КБ, порог, за которым страница перестаёт быть лёгкой на медленном канале. Шкала кончается на 600 КБ."
          />
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <Readout
            label={`Загрузка на канале ${cond.mbps} Мбит/с`}
            value={w.ok ? ms.toFixed(0) : '—'}
            unit="мс · расчёт"
            alarm={heavy}
            fill={w.ok ? Math.min(1, ms / 2000) : 0}
            marks={[0.5]}
            note="Единственное расчётное число на экране, и оно подписано как расчётное: измеренные байты, делённые на заявленную полосу выбранных условий. Задержки соединения и очередь запросов сюда не входят — в жизни будет дольше."
          />
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <p
            className="font-light"
            style={{ fontSize: 'var(--dv-t-small)', lineHeight: 1.65, color: 'var(--dv-cream-70)' }}
          >
            Вес — это не техническая мелочь, а первое, чем пользователь платит
            за сайт, и платит до того, как что-то увидит. Поэтому он входит
            в приёмку числом: строка «страница весит не
            больше N» либо выполнена, либо нет.
          </p>
        </Panel>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   03 · НАЗВАННЫЙ КОМПРОМИСС
   Ядро экрана. Список технологий ставит автора в один ряд со всеми,
   кто выучил те же слова; названный компромисс вынимает его из этого
   сравнения. Пример взят не выдуманный, а из кода этого самого сайта:
   Lenis вместо нативной прокрутки.

   Доказательство здесь не текстовое: посетитель сам крутит две колонки —
   нативную и инерционную — и видит цену инерции числом. Отставание
   отрисованной позиции от настоящей и есть то, из-за чего ломаются
   scroll-driven animations и position: sticky: браузер знает одно
   положение прокрутки, а глаз видит другое.
   ══════════════════════════════════════════════════════════════════ */

/** Реальные значения из src/hooks/useSmoothScroll.ts — не иллюстрация. */
const LENIS_LERP = 0.085

const COST = [
  {
    k: 'Scroll-driven animations',
    v: 'Нативные scroll-timeline читают настоящую позицию прокрутки. Инерция рисует другую — привязанное к ней движение расходится с картинкой. Всё, что должно двигаться по скроллу, приходится вести из того же цикла.',
  },
  {
    k: 'position: sticky',
    v: 'Липкие элементы остаются на нативной позиции и на быстрой прокрутке отстают от инерционного полотна. Это не гипотеза: на этом проекте ломалось.',
  },
  {
    k: 'Доступность',
    v: 'Перехваченная прокрутка меняет поведение клавиатуры, поиска по странице и переходов по якорям. Каждый такой случай приходится возвращать руками.',
  },
  {
    k: 'Кадр',
    v: 'Появляется постоянный rAF-цикл, который работает всё время, пока открыта страница. Его стоимость видна на панели раздела 01.',
  },
]

function InertiaLab({ cond }: { cond: Condition }) {
  const [inertia, setInertia] = useState(true)
  const [lerp, setLerp] = useState(LENIS_LERP)
  const [lag, setLag] = useState(0)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Позиции держим в ref: они меняются каждый кадр, и любое состояние
  // React здесь означало бы перерисовку на 60 Гц.
  const target = useRef(0)
  const current = useRef(0)
  const max = useRef(0)

  const reduce = prefersReducedMotion()
  // Ровно та же проверка, что и в useSmoothScroll: на тач-устройстве
  // инерция сайта выключена. Раздел показывает не абстракцию, а поведение
  // этого кода в выбранных условиях.
  const disabledHere = cond.coarse || reduce
  const active = inertia && !disabledHere

  // Пересчёт предела прокрутки: ResizeObserver вместо замера в цикле.
  useEffect(() => {
    const vp = viewportRef.current
    const tr = trackRef.current
    if (!vp || !tr) return
    const ro = new ResizeObserver(() => {
      max.current = Math.max(0, tr.offsetHeight - vp.clientHeight)
      target.current = Math.min(target.current, max.current)
    })
    ro.observe(vp)
    ro.observe(tr)
    return () => ro.disconnect()
  }, [])

  // Ввод: колесо и перетаскивание. Колесо перехватываем только пока
  // движение остаётся внутри полосы — на краях страница прокручивается
  // дальше сама, и посетитель не оказывается заперт в демонстрации.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onWheel = (e: WheelEvent) => {
      const next = target.current + e.deltaY
      if (next <= 0 || next >= max.current) {
        target.current = Math.max(0, Math.min(max.current, next))
        return
      }
      e.preventDefault()
      target.current = next
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  // Цикл сглаживания. Крутится только когда полоса в кадре и инерция
  // включена: постоянный цикл был бы ровно той ценой, о которой раздел
  // и рассказывает.
  useEffect(() => {
    const vp = viewportRef.current
    const tr = trackRef.current
    if (!vp || !tr) return

    let raf = 0
    let running = false
    let lastPush = 0

    const draw = (now: number) => {
      if (active) current.current += (target.current - current.current) * lerp
      else current.current = target.current
      // Пишем в стиль напрямую, минуя React: transform, и ничего больше.
      tr.style.transform = `translate3d(0, ${-current.current}px, 0)`
      if (now - lastPush > 180) {
        lastPush = now
        setLag(Math.abs(target.current - current.current))
      }
      if (running) raf = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return
      running = entry.isIntersecting
      if (running) raf = requestAnimationFrame(draw)
      else cancelAnimationFrame(raf)
    })
    io.observe(vp)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [active, lerp])

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const startY = e.clientY
    const startTarget = target.current
    const move = (ev: PointerEvent) => {
      target.current = Math.max(0, Math.min(max.current, startTarget - (ev.clientY - startY)))
    }
    const up = () => {
      el.releasePointerCapture(e.pointerId)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start">
      <div>
        <Stage style={{ padding: 'var(--s-6)', paddingTop: 'var(--s-12)' }} label="Полоса прокрутки">
          {/* Полоса. Внутренний слой едет transform-ом, а не скроллом:
              так видно расхождение между «где мы на самом деле» и «что
              нарисовано» — та самая цена инерции. */}
          <div
            ref={viewportRef}
            tabIndex={0}
            role="group"
            aria-label="Демонстрация инерционной прокрутки: колесо, перетаскивание или стрелки"
            onPointerDown={onPointerDown}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') target.current = Math.min(max.current, target.current + 48)
              if (e.key === 'ArrowUp') target.current = Math.max(0, target.current - 48)
            }}
            className="relative overflow-hidden"
            style={{
              height: 260,
              borderRadius: 'var(--r-md)',
              background: 'var(--dv-stage-2)',
              cursor: 'grab',
              touchAction: 'none',
              overscrollBehavior: 'contain',
            }}
          >
            <div ref={trackRef} style={{ padding: 18, willChange: 'transform' }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    height: 52,
                    marginBottom: 10,
                    paddingInline: 16,
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--dv-stage-card)',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500 }}>Строка {i + 1}</span>
                  <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>
                    {String((i + 1) * 8).padStart(3, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Stage>

        <p
          className="font-light"
          style={{
            marginTop: 'var(--s-4)',
            fontSize: 'var(--dv-t-small)',
            lineHeight: 1.6,
            color: 'var(--dv-cream-45)',
          }}
        >
          Колесо, перетаскивание или стрелки на клавиатуре. Полоса намеренно
          сделана отдельной от страницы: инерцию нельзя показать, не дав её
          сравнить.
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
        <Panel style={{ padding: 'var(--s-6)' }}>
          <Segmented
            label="Прокрутка полосы"
            value={inertia ? 'on' : 'off'}
            onChange={(v) => setInertia(v === 'on')}
            options={[
              { id: 'on', label: 'со сглаживанием' },
              { id: 'off', label: 'без сглаживания' },
            ]}
          />

          <div style={{ marginTop: 'var(--s-6)' }}>
            <span className="flex items-baseline justify-between" style={{ marginBottom: 'var(--s-3)' }}>
              <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>lerp</span>
              <span style={{ ...mono, color: 'var(--dv-green)', letterSpacing: '0.06em' }}>
                {lerp.toFixed(3)}
                {Math.abs(lerp - LENIS_LERP) < 0.0005 ? ' · значение сайта' : ''}
              </span>
            </span>
            <input
              type="range"
              min={0.03}
              max={0.3}
              step={0.005}
              value={lerp}
              onChange={(e) => setLerp(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: PALETTE.green }}
              aria-label="Коэффициент сглаживания"
              disabled={!active}
            />
            <p
              className="font-light"
              style={{ marginTop: 'var(--s-3)', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--dv-cream-70)' }}
            >
              На сайте стоит 0.085 — тяжелее дефолтных 0.1. Ниже 0.07
              начинается ощущение задержки ввода, выше 0.2 инерция пропадает
              и смысл вместе с ней.
            </p>
          </div>
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <Readout
            label="Отставание картинки от прокрутки"
            value={lag.toFixed(0)}
            unit="px"
            alarm={lag > 40}
            fill={Math.min(1, lag / 200)}
            note="Вот чем оплачена инерция. Браузер считает, что прокрутка уже здесь, а глаз видит её там. Именно это расхождение ломает scroll-driven animations и position: sticky — они верят браузеру, а не картинке."
          />
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <span
            style={{
              ...mono,
              color: disabledHere ? 'var(--dv-accent)' : 'var(--dv-green)',
            }}
          >
            {disabledHere ? 'В этих условиях инерция выключена' : 'В этих условиях инерция включена'}
          </span>
          <p
            className="font-light"
            style={{ marginTop: 'var(--s-3)', fontSize: 'var(--dv-t-small)', lineHeight: 1.62, color: 'var(--dv-cream-70)' }}
          >
            {reduce
              ? 'У вас включена системная настройка «меньше движения». Сайт это уважает: инерция не запускается вообще, а полоса слева работает нативно.'
              : cond.coarse
                ? 'Выбран телефон. На тач-устройствах сайт не перехватывает прокрутку: у системного скролла собственная физика, и вторая поверх неё ощущается как неисправность. Тот же выключатель стоит в коде — проверка pointer: coarse.'
                : 'Мышь и колесо: здесь инерция даёт то, ради чего её берут, — вес прокрутки. Переключите условия на телефон, и раздел покажет обратное решение.'}
          </p>
        </Panel>
      </div>

      {/* Цена решения — списком, без смягчений */}
      <div className="lg:col-span-2">
        <div className="grid gap-x-8 md:grid-cols-2">
          {COST.map((c, i) => (
            <Reveal key={c.k} y={16} delay={i * stagger.item}>
              <div
                className="flex flex-col sm:flex-row gap-1.5 sm:gap-6"
                style={{ paddingBlock: 'var(--s-5)', borderBottom: '1px solid var(--dv-line-soft)' }}
              >
                <span style={{ ...mono, minWidth: '15ch', paddingTop: 3, color: 'var(--dv-accent)' }}>
                  {c.k}
                </span>
                <p
                  className="font-light"
                  style={{ fontSize: '0.92rem', lineHeight: 1.62, color: 'var(--dv-cream-70)' }}
                >
                  {c.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p
          className="font-light"
          style={{
            marginTop: 'var(--s-8)',
            maxWidth: '62ch',
            fontSize: 'var(--dv-t-body)',
            lineHeight: 'var(--dv-lh-body)',
            color: 'var(--dv-cream)',
          }}
        >
          Решение принято в пользу инерции — и вместе с ним приняты четыре
          строчки выше. Это и есть разница между «использую Lenis» и «выбрал
          Lenis, зная за что плачу»: вторую фразу нельзя сказать, не сделав
          работу.
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   04 · КОД → РЕЗУЛЬТАТ
   Слева параметры компонента, посередине исходник, который из них
   получается, справа то, что этот исходник рендерит. Смысл в связке:
   компонент в продакшене — это не картинка, а тип с ограниченным
   набором допустимых значений. Именно поэтому в проекте не может
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
      ? { background: 'var(--dv-accent)', color: 'var(--dv-stage-card)', border: '1px solid transparent' }
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
 * ради шести токенов — на экране, который эти килобайты и измеряет,
 * такую цену платить нельзя.
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
          ? 'var(--dv-cream-22)'
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
  // останавливает тот же хук, что и бегущие строки на остальном сайте.
  const idleRef = useOffscreenPause<HTMLDivElement>()

  const src = useMemo(
    () =>
      [
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
      ]
        .filter(Boolean)
        .join('\n'),
    [variant, size, state, full, icon]
  )

  return (
    <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
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
        <Panel className="flex flex-col" style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Что написано</span>
          {/* overflow-x на самом блоке кода: длинная строка не должна
              растягивать страницу на 390 px. */}
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
            style={{ marginTop: 'var(--s-4)', fontSize: 'var(--dv-t-small)', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
          >
            Тип не даёт собрать кнопку, которой нет в системе. Четвёртый размер
            или «почти такой же» вариант не пройдут сборку — их физически
            некуда передать.
          </p>
        </Panel>

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
   05 · СОСТОЯНИЯ ДАННЫХ
   Готовое состояние рисуют все. Проект ломается на трёх остальных:
   пока данные едут, когда их нет и когда запрос упал. Это не дизайнерская
   придирка, а прямая стоимость поддержки: каждое неописанное состояние
   разработчик придумывает сам, и в каждом месте по-своему.
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
          а то, что состояний четыре.
        </p>
      </Panel>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   06 · ДОСТУПНОСТЬ
   Доступность продают как «бонус по возможности». На деле это два
   проверяемых инженерных требования: по интерфейсу можно пройти
   клавиатурой, и текст на фоне читается по посчитанному контрасту.
   Оба проверяются здесь же — на этом самом экране и на его палитре.
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
  { fg: PALETTE.cream, bg: PALETTE.panel, label: 'Кремовый на панели', role: 'Основной текст' },
  { fg: PALETTE.green, bg: PALETTE.panel, label: 'Зелёный на панели', role: 'Статусы и подписи' },
  { fg: PALETTE.greenBright, bg: PALETTE.panel, label: 'Светлый зелёный на панели', role: 'Код и значения' },
  { fg: PALETTE.greenDim, bg: PALETTE.panel, label: 'Тусклый зелёный на панели', role: 'Линии и рамки' },
  { fg: PALETTE.accent, bg: PALETTE.panel, label: 'Акцент на панели', role: 'Предупреждения' },
  { fg: PALETTE.stageInk, bg: PALETTE.stage, label: 'Чернила на сцене', role: 'Текст продукта' },
]

const FIELDS = [
  { id: 'name', label: 'Имя', hint: 'input · type=text · label связан через обёртку' },
  { id: 'topic', label: 'Тема', hint: 'select · нативный, открывается с клавиатуры' },
  { id: 'agree', label: 'Готов обсудить сроки', hint: 'checkbox · переключается пробелом' },
  { id: 'submit', label: 'Отправить', hint: 'button · срабатывает по Enter и пробелу' },
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

  const field: CSSProperties = {
    fontFamily: 'var(--dv-sans)',
    fontSize: 15,
    background: 'var(--dv-stage-card)',
    color: 'var(--dv-stage-ink)',
    border: '1px solid var(--dv-stage-line)',
  }

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
              style={{ ...ring(0), ...field }}
            />
          </label>

          <label className="flex flex-col" style={{ gap: 6 }}>
            <span style={{ ...mono, color: 'var(--dv-stage-ink-60)', fontSize: '0.625rem' }}>Тема</span>
            <select data-order="1" defaultValue="site" className="rounded-lg px-4 py-3" style={{ ...ring(1), ...field }}>
              <option value="site">Сайт</option>
              <option value="product">Продукт</option>
              <option value="audit">Аудит</option>
            </select>
          </label>

          <label className="flex items-center" style={{ gap: 10, cursor: 'pointer' }}>
            <input
              data-order="2"
              type="checkbox"
              style={{ ...ring(2), width: 18, height: 18, accentColor: PALETTE.accent }}
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
              color: 'var(--dv-stage-card)',
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
                  <span style={{ ...mono, color: on ? 'var(--dv-accent)' : 'var(--dv-cream-45)', minWidth: 22 }}>
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
            style={{ marginTop: 'var(--s-4)', fontSize: 'var(--dv-t-small)', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
          >
            Нажмите Tab, стоя на форме слева. Подсветка идёт по порядку разметки,
            потому что порядок в разметке совпадает с визуальным. Как только его
            начинают править отступами и абсолютным позиционированием, обход
            рассыпается — и это самая частая причина недоступной формы.
          </p>
        </Panel>

        <Panel style={{ padding: 'var(--s-6)' }}>
          <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Контраст этого экрана · WCAG 2.1</span>
          <div style={{ marginTop: 'var(--s-4)' }}>
            {PAIRS.map((p) => {
              const r = contrast(p.fg, p.bg)
              const pass = r >= 4.5
              /* flex-wrap: на 390 px оценка контраста уходит на свою строку,
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
            style={{ marginTop: 'var(--s-4)', fontSize: 'var(--dv-t-small)', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
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

/* ── Что остаётся у заказчика ────────────────────────────────────── */
const DELIVERABLES = [
  { t: 'Репозиторий', d: 'Типизированный код с историей изменений — проект открывается и запускается по инструкции из двух команд.' },
  { t: 'Компонентная база', d: 'Кнопки, поля, карточки, состояния данных — собранные один раз и переиспользуемые по всем страницам.' },
  { t: 'Бюджеты', d: 'Сколько миллисекунд стоит кадр и сколько килобайт весит страница — критерий приёмки, а не пожелание.' },
  { t: 'Список компромиссов', d: 'Какие решения приняты, что дали и чем оплачены — через год этот список единственный объясняет, почему код такой.' },
  { t: 'Доступность', d: 'Клавиатурный обход, доступные имена, контраст и уважение к prefers-reduced-motion — проверенные в приёмке.' },
  { t: 'Сборка и деплой', d: 'Автоматическая сборка и выкладка — обновление сайта не требует моего участия и моей машины.' },
]

const PROCESS = [
  { n: '01', t: 'Разбор', d: 'Задача бизнеса, объём, ограничения. Бюджеты кадра и веса — из разделов 01 и 02 — фиксируются до первой строки кода.' },
  { n: '02', t: 'Решения', d: 'Что берём, что не берём и чем платим. Каждый выбор попадает в список компромиссов вместе с ценой — как Lenis в разделе 03.' },
  { n: '03', t: 'Сборка', d: 'Типы, компоненты, все состояния данных. Продакшен выглядит точно так же, как макет.' },
  { n: '04', t: 'Приёмка', d: 'По тем же приборам, что и здесь: время кадра, длинные кадры, вес, клавиатура, контраст. По списку.' },
  { n: '05', t: 'Передача', d: 'Деплой, документация, доступы. Дальше проект живёт и обновляется без меня.' },
]

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function DevelopmentScreen({ onClose }: { onClose: () => void }) {
  useDevFonts()
  const reduce = prefersReducedMotion()
  const [condId, setCondId] = useState<ConditionId>('laptop')
  const cond = CONDITIONS.find((c) => c.id === condId) as Condition
  // Курсор в заголовке — единственная бесконечная анимация над сгибом.
  const caretRef = useOffscreenPause<HTMLSpanElement>()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const section: CSSProperties = {
    maxWidth: 'var(--max-w)',
    paddingInline: 'var(--gutter)',
    paddingBlock: 'var(--section-y)',
  }

  return (
    <main
      data-screen="development"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        background: 'var(--dv-bg)',
        color: 'var(--dv-cream)',
        fontFamily: 'var(--dv-sans)',
        // Запас снизу под закреплённый док условий.
        paddingBottom: 'var(--s-24)',
      }}
    >
      <style>{LOCAL_KEYFRAMES}</style>

      {/* Фон: техническая сетка и одно мягкое свечение. Статичен —
          движущийся фон на экране про бюджет кадра был бы издевательством. */}
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

      {/* ══ ДОК УСЛОВИЙ ════════════════════════════════════════════
          Персистентное состояние экрана. Закреплён внизу, а не вверху:
          сверху уже стоит кнопка возврата, и два закреплённых слоя на
          одной кромке дерутся за внимание. */}
      <div
        /* На узком экране — во всю ширину по нижней кромке; на широком
           уходит в правый угол, чтобы не стоять поперёк текста. */
        className="fixed left-4 right-4 bottom-4 lg:left-auto lg:right-5 lg:w-[340px] backdrop-blur"
        style={{
          zIndex: 'var(--z-nav)',
          background: 'rgba(9,15,20,0.88)',
          border: '1px solid var(--dv-line)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--s-4)',
        }}
      >
        <span style={{ ...mono, color: 'var(--dv-cream-45)' }}>Условия приёмки</span>
        <div className="flex flex-wrap gap-1.5" style={{ marginTop: 'var(--s-3)' }}>
          {CONDITIONS.map((c) => {
            const active = c.id === condId
            return (
              <button
                key={c.id}
                onClick={() => setCondId(c.id)}
                aria-pressed={active}
                className="rounded-md px-3 py-1.5 flex-1"
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${active ? 'var(--dv-green)' : 'var(--dv-line)'}`,
                  background: active ? 'var(--dv-wash)' : 'transparent',
                  color: active ? 'var(--dv-green-bright)' : 'var(--dv-cream-45)',
                  transition: `color var(--d-fast) ${cssEase.standard}, border-color var(--d-fast) ${cssEase.standard}, background-color var(--d-fast) ${cssEase.standard}`,
                }}
              >
                {c.short}
              </button>
            )
          })}
        </div>
        {/* Пояснение к условиям на телефоне скрыто: закреплённый док не
            должен съедать треть экрана. Тот же текст читается в разделах. */}
        <p
          className="font-light hidden sm:block"
          style={{ marginTop: 'var(--s-3)', fontSize: '0.72rem', lineHeight: 1.5, color: 'var(--dv-cream-70)' }}
        >
          {cond.note}
        </p>
      </div>

      {/* ══ ГЕРОЙ ══════════════════════════════════════════════════ */}
      <section
        className="grain mx-auto w-full flex flex-col justify-center min-h-screen relative"
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
                fontSize: 'var(--dv-t-h1)',
                letterSpacing: 'var(--dv-tr-h1)',
                lineHeight: 'var(--dv-lh-h1)',
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
                  maxWidth: '50ch',
                  fontSize: 'var(--dv-t-lead)',
                  lineHeight: 'var(--dv-lh-lead)',
                  letterSpacing: '-0.012em',
                }}
              >
                Инженера видно по двум вещам: по числу, которое он измерил, и
                по компромиссу, который он назвал. Ниже — и то и другое. Время
                кадра и вес страницы считает ваш браузер прямо сейчас; решение
                про прокрутку этого сайта показано вместе с его ценой.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal y={18} delay={0.36}>
              <Panel style={{ padding: 'var(--s-6)' }}>
                {/* Объявленная аффорданса: посетителю прямым текстом
                    сказано, чем на этом экране можно управлять. */}
                <span style={{ ...mono, color: 'var(--dv-green)' }}>Внизу — условия приёмки</span>
                <p
                  className="font-light"
                  style={{ marginTop: 'var(--s-3)', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--dv-cream-70)' }}
                >
                  Переключите устройство — и бюджет кадра, время загрузки и
                  вердикт по инерционной прокрутке пересчитаются под него.
                  Инженерное решение не бывает верным вообще: оно верно для
                  условий.
                </p>
                <div className="flex flex-col" style={{ marginTop: 'var(--s-6)', gap: 10 }}>
                  {[
                    'Измеренный кадр и длинные кадры',
                    'Измеренный вес этой страницы',
                    'Названный компромисс с его ценой',
                    'Компонент как строгий тип',
                    'Четыре состояния данных',
                    'Клавиатура и контраст по WCAG',
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

      {/* ══ 01 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="01"
          title="Плавность — это арифметика, а не вкус"
          lead={`У браузера на кадр ${cond.budget} мс в выбранных условиях. Всё, что в них не уложилось, пользователь видит как рывок — и браузер об этом знает: у него есть API длинных кадров. Панель слева не рассказывает про производительность, она её показывает на вашей машине. Справа — за что именно браузер платит, когда анимируют не то свойство.`}
        />
        <Instruments cond={cond} />
      </section>

      {/* ══ 02 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="02"
          title="Страница весит столько, сколько за неё скачали"
          lead="Ниже — не средние цифры по индустрии, а байты, которые ваш браузер действительно принял, чтобы показать этот экран. Разложены по типам и пересчитаны в секунды на канале выбранных условий."
        />
        <PageWeight cond={cond} />
      </section>

      {/* ══ 03 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="03"
          title="Инженер — это названный компромисс"
          lead="Список технологий ставит в один ряд со всеми, кто выучил те же слова. Поэтому вместо списка — одно решение этого сайта целиком, с ценой. Инерционная прокрутка вместо нативной: куплен вес движения, заплачено расхождением между тем, где прокрутка на самом деле, и тем, что нарисовано. Величина расхождения — справа, в пикселях."
        />
        <InertiaLab cond={cond} />
      </section>

      {/* ══ 04 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="04"
          title="Компонент — это строгий тип"
          lead="Соберите кнопку параметрами. Слева появится исходник, который из них получается, справа — то, что он рендерит. Ниже — тип, который эту кнопку ограничивает: он и есть причина, по которой в проекте не заводится «ещё один размер, чуть побольше»."
        />
        <CodeToResult />
      </section>

      {/* ══ 05 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="05"
          title="Экран живёт в четырёх состояниях"
          lead="Готовое состояние рисуют все. Проект ломается на трёх остальных: пока данные едут, когда их нет и когда запрос упал. Это не придирка, а прямая стоимость поддержки — каждое неописанное состояние разработчик придумывает сам."
        />
        <DataStateDemo />
      </section>

      {/* ══ 06 ═════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead
          n="06"
          title="Доступность — это инженерное требование"
          lead="Её продают как бонус, хотя это два проверяемых инженерных условия: по интерфейсу проходят клавиатурой, а текст на фоне имеет посчитанный контраст. Оба проверяются здесь же — на форме слева и на палитре самого этого экрана."
        />
        <FocusPolygon />
      </section>

      {/* ══ ЧТО ОСТАЁТСЯ ═══════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead n="07" title="Что остаётся у заказчика" />
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
                        fontSize: 'var(--dv-t-h3)',
                        fontWeight: 500,
                        letterSpacing: '-0.015em',
                        marginBottom: 6,
                      }}
                    >
                      {d.t}
                    </h3>
                    <p
                      className="font-light"
                      style={{
                        maxWidth: '52ch',
                        color: 'var(--dv-cream-70)',
                        fontSize: 'var(--dv-t-body)',
                        lineHeight: 'var(--dv-lh-body)',
                      }}
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

      {/* ══ ПРОЦЕСС ════════════════════════════════════════════════ */}
      <section className="mx-auto w-full" style={section}>
        <SectionHead n="08" title="Как идёт работа" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} y={18} delay={i * stagger.item}>
              <Panel className="h-full" style={{ padding: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--dv-green)' }}>{p.n}</span>
                <h3
                  style={{
                    marginTop: 'var(--s-4)',
                    fontFamily: 'var(--dv-mono)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {p.t}
                </h3>
                <p
                  className="font-light"
                  style={{
                    marginTop: 'var(--s-3)',
                    fontSize: 'var(--dv-t-small)',
                    lineHeight: 1.62,
                    color: 'var(--dv-cream-70)',
                  }}
                >
                  {p.d}
                </p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ЗАКРЫВАЮЩЕЕ УТВЕРЖДЕНИЕ ════════════════════════════════ */}
      <section className="grain mx-auto w-full relative" style={section}>
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <Reveal y={22}>
              <h2
                style={{
                  fontFamily: 'var(--dv-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.7rem, 6vw, 4.2rem)',
                  letterSpacing: 'var(--dv-tr-h2)',
                  lineHeight: 'var(--dv-lh-h2)',
                  color: 'var(--dv-cream)',
                }}
              >
                Всё, что здесь заявлено,
                <br />
                посчитано на этой странице
              </h2>
            </Reveal>
            <Reveal y={18} delay={0.1}>
              <p
                className="font-light"
                style={{
                  marginTop: 'var(--s-6)',
                  maxWidth: '54ch',
                  fontSize: 'var(--dv-t-body)',
                  lineHeight: 'var(--dv-lh-body)',
                  color: 'var(--dv-cream-70)',
                }}
              >
                Ни одного числа результата, ни одного логотипа технологии, ни
                одной цифры про себя. Только приборы, которые вы можете
                испортить, и решение, цену которого я назвал вслух. Так же
                будет выглядеть и приёмка вашего проекта.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Reveal y={18} delay={0.16}>
              <button
                onClick={onClose}
                className="rounded-full px-9 py-4"
                style={{
                  ...mono,
                  background: 'var(--dv-accent)',
                  color: 'var(--dv-stage-card)',
                  border: '1px solid transparent',
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
