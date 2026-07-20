/**
 * Экран услуги — 3D-моделинг.
 *
 * ВИЗУАЛЬНАЯ НИША: СТУДИЯ, А НЕ РЕНДЕР
 * ────────────────────────────────────
 * Температуры остальных экранов заняты: светлая швейцарская с ультрамарином
 * (Веб-дизайн), средний серый цикл (Брендинг), петроль (Моушн), терминальный
 * зелёный (Разработка), тёмная тёплая (главная). За 3D закреплена тёплая
 * глина — и здесь она углублена до конкретного места: съёмочный павильон.
 *
 * Фон — не «просто тёмный», а умбра, цвет затемнённого павильона; свет на
 * экране приходит с двух сторон, как от рисующего и контрового источника.
 * Это не декорация: весь экран построен вокруг мысли, что 3D — производство,
 * где решают постановка, материал и сетка, а не «красивая картинка».
 *
 * ЧТО ЗДЕСЬ ДОКАЗЫВАЕТ КОМПЕТЕНЦИЮ
 * ────────────────────────────────
 * Рендер — единственный взгляд на модель, по которому о модели судить нельзя:
 * он скрывает ровно то, за что платят. Поэтому экран показывает не результат,
 * а ремесло, и каждый раздел даёт это потрогать:
 *   01 одна модель в четырёх режимах — рендер, вайрфрейм, нормали, развёртка;
 *   02 гранёность силуэта считается на странице: видно, где полигоны ещё
 *      работают, а где их уже оплачивают впустую;
 *   03 изгиб с живым числом лупов — почему деформация про рёбра, а не про
 *      полигоны, и при каком угле на сегмент сетка схлопывается;
 *   04 шероховатость и металличность как два ползунка, меняющие поведение
 *      света, а не цвет;
 *   05 три схемы постановки на одном объекте, с планом расстановки.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * WebGL-сцена монтируется только когда стенд действительно в кадре, и
 * размонтируется, когда уходит: r3f иначе рендерит всегда, независимо от
 * видимости. На узком экране сцена не грузится сама — только по явному
 * нажатию, чтобы телефон не платил за бандл three.js при пролистывании.
 * Смена режима — подмена материала на уже загруженной геометрии.
 *
 * В DOM-части анимируются только transform и opacity. Всё остальное —
 * мгновенная смена состояния: ползунок должен отвечать в тот же кадр,
 * анимированный ползунок — это не плавность, а задержка.
 *
 * Кривые и длительности — только из design/motion.ts.
 */

import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { Reveal, SplitText, useOffscreenPause } from '../design/primitives'
import { cssEase, duration, ease, prefersReducedMotion, stagger } from '../design/motion'
import type { ShadingMode } from './Model3D'

// Ленивый импорт обязателен: иначе three.js и r3f уезжают в основной бандл.
const Model3D = lazy(() => import('./Model3D'))

/* ── Локальная палитра ────────────────────────────────────────────────
   Умбра затемнённого павильона плюс глина. Ниже по дереву цвет берётся
   только через var(): хексов в разметке нет. */
const SCREEN_VARS = {
  '--m3-stage': '#17120e',
  '--m3-stage-2': '#1f1812',
  '--m3-panel': '#251d15',
  '--m3-line': 'rgba(216, 189, 148, 0.16)',
  '--m3-line-soft': 'rgba(216, 189, 148, 0.08)',
  '--m3-clay': '#d8bd94',
  '--m3-clay-dim': 'rgba(216, 189, 148, 0.52)',
  '--m3-ink': '#f2ece1',
  '--m3-ink-70': 'rgba(242, 236, 225, 0.7)',
  '--m3-ink-45': 'rgba(242, 236, 225, 0.45)',
  '--m3-a': 'var(--a)',
  '--m3-a-08': 'rgba(239, 74, 35, 0.08)',
  '--m3-display': "'Unbounded', 'MTS Wide', system-ui, sans-serif",
  '--m3-sans': "'Onest', system-ui, sans-serif",
  '--m3-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as unknown as CSSProperties

/* ── Шрифты грузим при открытии экрана, а не глобально ────────────────
   Моноширинный здесь не украшение: все числа на экране считаются вживую,
   и в пропорциональной гарнитуре они дёргали бы вёрстку на каждом кадре
   перетаскивания ползунка. */
function useModelingFonts() {
  useEffect(() => {
    const id = 'modeling-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Onest:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Технический голос экрана ────────────────────────────────────────── */
const mono: CSSProperties = {
  fontFamily: 'var(--m3-mono)',
  fontSize: '0.6875rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
}

/** Числовой отсчёт: те же цифры, но без капса и разрядки — их читают, а не сканируют. */
const readout: CSSProperties = {
  fontFamily: 'var(--m3-mono)',
  fontSize: '0.78rem',
  letterSpacing: '0.02em',
  fontVariantNumeric: 'tabular-nums',
}

function SectionHead({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <header style={{ marginBottom: 'var(--s-12)' }}>
      <Reveal y={16}>
        <div
          className="flex items-baseline gap-4 sm:gap-5 pb-4"
          style={{ borderBottom: '1px solid var(--m3-line)' }}
        >
          <span style={{ ...mono, color: 'var(--m3-a)' }}>{n}</span>
          <h2
            style={{
              fontFamily: 'var(--m3-display)',
              fontWeight: 600,
              fontSize: 'clamp(1.6rem, 4.2vw, 3.2rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.06,
            }}
          >
            {title}
          </h2>
        </div>
      </Reveal>
      {lead && (
        <Reveal y={14} delay={0.06}>
          <p
            style={{
              marginTop: 'var(--s-6)',
              maxWidth: '56ch',
              color: 'var(--m3-ink-70)',
              fontWeight: 300,
              fontSize: 'clamp(0.96rem, 1.6vw, 1.16rem)',
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

/** Панель-инструмент: общая оправа для всех пяти стендов экрана. */
function Panel({
  children,
  style,
  className,
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--m3-panel)',
        border: '1px solid var(--m3-line)',
        borderRadius: 'var(--r-lg)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Кнопка-переключатель. Цвет меняется мгновенно — это состояние, а не движение. */
function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={title}
      style={{
        ...mono,
        borderRadius: 'var(--r-full)',
        padding: '0.55rem 1rem',
        border: `1px solid ${active ? 'var(--m3-clay)' : 'var(--m3-line)'}`,
        background: active ? 'rgba(216, 189, 148, 0.12)' : 'transparent',
        color: active ? 'var(--m3-clay)' : 'var(--m3-ink-45)',
      }}
    >
      {children}
    </button>
  )
}

/** Ползунок с подписью и живым значением. */
function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <label style={{ display: 'block' }}>
      <span className="flex items-baseline justify-between" style={{ marginBottom: 'var(--s-3)' }}>
        <span style={{ ...mono, color: 'var(--m3-ink-45)' }}>{label}</span>
        <span style={{ ...readout, color: 'var(--m3-clay)' }}>
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{ width: '100%', accentColor: 'var(--a)' }}
      />
    </label>
  )
}

/** Подпись под стендом: всё, что показано, — демонстрационное. */
function StageNote({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        marginTop: 'var(--s-5)',
        maxWidth: '62ch',
        fontWeight: 300,
        fontSize: '0.86rem',
        lineHeight: 1.6,
        color: 'var(--m3-ink-70)',
      }}
    >
      {children}
    </p>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   01 · ЧЕТЫРЕ ВЗГЛЯДА НА ОДИН ОБЪЕКТ
   Стенд монтирует WebGL только когда он в кадре и только если экран
   достаточно широкий: на телефоне сцена грузится по явному нажатию.
   ══════════════════════════════════════════════════════════════════════ */

const MODES: { id: ShadingMode; label: string; caption: string }[] = [
  {
    id: 'render',
    label: 'Рендер',
    caption:
      'То, что видит заказчик. Материал и свет прячут и хорошую сетку, и плохую — по этому кадру о модели судить нельзя.',
  },
  {
    id: 'wire',
    label: 'Вайрфрейм',
    caption:
      'Сетка. Здесь видно, из чего собрана форма: равномерны ли грани, идут ли лупы по местам сгиба, нет ли треугольных вееров там, где будет деформация.',
  },
  {
    id: 'normals',
    label: 'Нормали',
    caption:
      'Направление граней цветом. Тёмные пятна — вывернутые нормали: на рендере они дают дыры и чёрные артефакты, а в движке ещё и пропадают вовсе.',
  },
  {
    id: 'uv',
    label: 'Развёртка',
    caption:
      'Клетка по UV. Ровная клетка — ровное разрешение текстуры; растянутая — участок, где текстура поплывёт. Швы проходят там, где их не увидит камера.',
  },
]

function Viewer() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<ShadingMode>('render')
  const [inView, setInView] = useState(false)
  const [autoLoad, setAutoLoad] = useState(false)
  const [requested, setRequested] = useState(false)
  const reduce = prefersReducedMotion()

  // Широкий экран с курсором тянет сцену сам. Узкий — только по нажатию:
  // бандл three.js не должен приезжать к тому, кто просто листает страницу.
  useEffect(() => {
    setAutoLoad(window.matchMedia('(min-width: 768px) and (pointer: fine)').matches)
  }, [])

  // Гейт по видимости. Без него r3f крутит рендер-цикл всё время, что
  // страница открыта, — включая те экраны, где стенда давно не видно.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '10% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // W — как переключение вайрфрейма в любом 3D-редакторе. Жест, по которому
  // человек из профессии сразу понимает, что стенд сделан своим.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'w' && e.key !== 'W' && e.key !== 'ц' && e.key !== 'Ц') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      setMode((m) => (m === 'wire' ? 'render' : 'wire'))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const live = inView && (autoLoad || requested)
  const active = MODES.find((m) => m.id === mode) ?? MODES[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-10 items-start">
      <Panel style={{ overflow: 'hidden' }}>
        <div
          ref={boxRef}
          className="relative"
          style={{ height: 'clamp(320px, 52vh, 560px)', background: 'var(--m3-stage-2)' }}
        >
          {live ? (
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ ...mono, color: 'var(--m3-clay-dim)' }}>Сцена загружается</span>
                </div>
              }
            >
              <Model3D mode={mode} spin={!reduce} />
            </Suspense>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <span style={{ ...mono, color: 'var(--m3-clay-dim)' }}>Стенд · WebGL</span>
              {!autoLoad && (
                <button
                  onClick={() => setRequested(true)}
                  style={{
                    ...mono,
                    borderRadius: 'var(--r-full)',
                    padding: '0.7rem 1.4rem',
                    border: '1px solid var(--m3-clay)',
                    background: 'transparent',
                    color: 'var(--m3-clay)',
                  }}
                >
                  Загрузить сцену
                </button>
              )}
              <span
                style={{
                  ...readout,
                  color: 'var(--m3-ink-45)',
                  maxWidth: '32ch',
                  lineHeight: 1.5,
                  letterSpacing: 0,
                }}
              >
                {autoLoad
                  ? 'Сцена включится, когда стенд окажется в кадре.'
                  : 'Сцена весит заметно — на мобильном она грузится только по вашему нажатию.'}
              </span>
            </div>
          )}

          <span className="absolute top-3 left-4" style={{ ...mono, color: 'var(--m3-clay-dim)' }}>
            {active.label}
          </span>
        </div>
      </Panel>

      <div>
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--s-6)' }}>
          {MODES.map((m) => (
            <Chip key={m.id} active={m.id === mode} onClick={() => setMode(m.id)}>
              {m.label}
            </Chip>
          ))}
        </div>

        {/* key по режиму: подпись меняется проявлением, а не подменой текста
            на месте — иначе переключение читается как сбой, а не как ответ. */}
        <motion.p
          key={active.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: ease.entrance }}
          style={{
            fontWeight: 300,
            fontSize: '0.92rem',
            lineHeight: 1.62,
            color: 'var(--m3-ink-70)',
          }}
        >
          {active.caption}
        </motion.p>

        <p
          style={{
            marginTop: 'var(--s-6)',
            paddingTop: 'var(--s-6)',
            borderTop: '1px solid var(--m3-line-soft)',
            ...readout,
            letterSpacing: 0,
            lineHeight: 1.55,
            color: 'var(--m3-ink-45)',
          }}
        >
          Клавиша W переключает рендер и сетку. Объект на стенде —
          демонстрационный: если положить свой .glb в src/models, стенд
          подхватит его автоматически.
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   02 · ГРАНЁНОСТЬ СИЛУЭТА
   Число полигонов само по себе ничего не значит — значит только то, видно
   ли грань. Отклонение хорды от дуги считается прямо здесь: r·(1−cos(π/n)).
   Это единственная величина на экране, которую можно перепроверить, — и
   именно она показывает, где полигоны перестают работать.
   ══════════════════════════════════════════════════════════════════════ */

function facetVerdict(devPct: number): { text: string; hot: boolean } {
  if (devPct > 5) return { text: 'Грань видна на любом кадре', hot: true }
  if (devPct > 1.5) return { text: 'Видно на крупном плане', hot: true }
  if (devPct > 0.4) return { text: 'В движении незаметно', hot: false }
  return { text: 'За пределом различимого — полигоны оплачены впустую', hot: true }
}

function FacetLab() {
  const [seg, setSeg] = useState(16)
  const R = 92
  // Форма вращения: seg сегментов по окружности и seg/2 колец по высоте.
  const tris = seg * Math.max(1, Math.round(seg / 2)) * 2
  const devPct = (1 - Math.cos(Math.PI / seg)) * 100
  const verdict = facetVerdict(devPct)

  const points = useMemo(() => {
    const out: string[] = []
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2 - Math.PI / 2
      out.push(`${(Math.cos(a) * R).toFixed(2)},${(Math.sin(a) * R).toFixed(2)}`)
    }
    return out.join(' ')
  }, [seg])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10 items-start">
      <Panel style={{ padding: 'var(--s-6)' }}>
        <Slider label="Сегментов по окружности" value={seg} min={5} max={128} onChange={setSeg} />

        <dl style={{ marginTop: 'var(--s-8)' }}>
          {[
            { k: 'Треугольников', v: tris.toLocaleString('ru-RU') },
            { k: 'Отклонение от дуги', v: `${devPct.toFixed(3)} % радиуса` },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-baseline justify-between gap-4"
              style={{ paddingBlock: 'var(--s-3)', borderTop: '1px solid var(--m3-line-soft)' }}
            >
              <dt style={{ ...mono, color: 'var(--m3-ink-45)' }}>{row.k}</dt>
              <dd style={{ ...readout, color: 'var(--m3-ink)' }}>{row.v}</dd>
            </div>
          ))}
        </dl>

        <p
          style={{
            marginTop: 'var(--s-6)',
            ...readout,
            letterSpacing: 0,
            lineHeight: 1.5,
            color: verdict.hot ? 'var(--m3-a)' : 'var(--m3-clay)',
          }}
        >
          {verdict.text}
        </p>
      </Panel>

      <div>
        <Panel
          className="flex items-center justify-center"
          style={{ padding: 'var(--s-6)', background: 'var(--m3-stage-2)' }}
        >
          <svg
            viewBox="-110 -110 220 220"
            style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }}
            role="img"
            aria-label={`Сечение формы из ${seg} сегментов`}
          >
            {/* Идеальная дуга — то, что задумано. Многоугольник — то, что
                на самом деле уедет в движок. Разрыв между ними и есть тема. */}
            <circle r={R} fill="none" stroke="var(--m3-line)" strokeWidth={1} strokeDasharray="4 5" />
            <polygon
              points={points}
              fill="rgba(216, 189, 148, 0.10)"
              stroke="var(--m3-clay)"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            {seg <= 48 &&
              points.split(' ').map((p) => {
                const [x, y] = p.split(',')
                return <circle key={p} cx={x} cy={y} r={2.2} fill="var(--a)" />
              })}
          </svg>
        </Panel>

        <StageNote>
          Показано сечение формы вращения; счётчик треугольников — для неё целиком.
          Полигоны видно только на силуэте: пока отклонение выше половины процента,
          грань читается на крупном плане, а ниже — глаз её уже не отличает, и каждый
          следующий сегмент оплачивается впустую. Поэтому модель под кинорендер и
          модель под реалтайм — разные объекты, а не одна «в разном качестве»: в
          рендере лишняя геометрия стоит минуты просчёта, в движке — кадры каждую
          секунду, и решение принимается в начале работы, а не в конце.
        </StageNote>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   03 · ИЗГИБ
   Между лупами поверхность плоская — значит ломаная по станциям и есть
   настоящий силуэт согнутой формы, а не его иллюстрация. Отсюда правило,
   которое обычно передают на словах: считать надо не полигоны, а градусы
   на сегмент.
   ══════════════════════════════════════════════════════════════════════ */

function BendLab() {
  const [angle, setAngle] = useState(90)
  const [loops, setLoops] = useState(3)

  const W = 54 // толщина формы
  const L = 190 // длина по центральной линии
  const perSeg = angle / loops
  const crushed = perSeg > 30

  const { outer, inner, rungs, ideal } = useMemo(() => {
    const rad = (angle * Math.PI) / 180
    // При нулевом угле радиус уходит в бесконечность — держим форму прямой.
    const R = rad < 0.001 ? 1e6 : L / rad
    const half = rad / 2
    const y0 = R * Math.cos(half)

    const station = (t: number) => {
      const a = rad * (t - 0.5)
      const cx = R * Math.sin(a)
      const cy = R * Math.cos(a) - y0
      // Нормаль к центральной линии — вдоль неё и отложена толщина.
      const nx = Math.sin(a)
      const ny = Math.cos(a)
      return {
        o: [cx + nx * (W / 2), cy + ny * (W / 2)],
        i: [cx - nx * (W / 2), cy - ny * (W / 2)],
      }
    }

    const pts = Array.from({ length: loops + 1 }, (_, i) => station(i / loops))
    const fmt = (p: number[]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`
    const smooth = Array.from({ length: 65 }, (_, i) => station(i / 64))

    return {
      outer: pts.map((p) => fmt(p.o)).join(' '),
      inner: pts.map((p) => fmt(p.i)).join(' '),
      rungs: pts.map((p) => [fmt(p.o), fmt(p.i)] as const),
      ideal:
        smooth.map((p) => fmt(p.o)).join(' ') +
        ' ' +
        smooth
          .slice()
          .reverse()
          .map((p) => fmt(p.i))
          .join(' '),
    }
  }, [angle, loops])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10 items-start">
      <Panel style={{ padding: 'var(--s-6)' }}>
        <Slider label="Угол изгиба" value={angle} min={0} max={150} suffix="°" onChange={setAngle} />
        <div style={{ marginTop: 'var(--s-6)' }}>
          <Slider label="Лупов в зоне сгиба" value={loops} min={1} max={14} onChange={setLoops} />
        </div>

        <div
          className="flex items-baseline justify-between gap-4"
          style={{ marginTop: 'var(--s-8)', paddingTop: 'var(--s-3)', borderTop: '1px solid var(--m3-line-soft)' }}
        >
          <span style={{ ...mono, color: 'var(--m3-ink-45)' }}>Градусов на сегмент</span>
          <span style={{ ...readout, color: crushed ? 'var(--m3-a)' : 'var(--m3-clay)' }}>
            {perSeg.toFixed(1)}°
          </span>
        </div>

        <p
          style={{
            marginTop: 'var(--s-6)',
            ...readout,
            letterSpacing: 0,
            lineHeight: 1.55,
            color: crushed ? 'var(--m3-a)' : 'var(--m3-ink-70)',
          }}
        >
          {crushed
            ? 'Выше 30° на сегмент внутренняя сторона схлопывается: грани наезжают друг на друга, и в анимации сустав ломается.'
            : 'Сегменты держат дугу: внутренняя сторона не наезжает сама на себя, деформация останется читаемой.'}
        </p>
      </Panel>

      <div>
        <Panel style={{ padding: 'var(--s-6)', background: 'var(--m3-stage-2)' }}>
          <svg
            viewBox="-115 -40 230 125"
            style={{ width: '100%', display: 'block' }}
            role="img"
            aria-label={`Форма, согнутая на ${angle} градусов, ${loops} лупов`}
          >
            {/* Задуманная гладкая форма — фоном. */}
            <polygon points={ideal} fill="rgba(216, 189, 148, 0.07)" stroke="none" />
            {/* Настоящий силуэт: между лупами поверхность плоская. */}
            <polyline points={outer} fill="none" stroke="var(--m3-clay)" strokeWidth={2} strokeLinejoin="round" />
            <polyline points={inner} fill="none" stroke="var(--m3-clay)" strokeWidth={2} strokeLinejoin="round" />
            {rungs.map(([a, b], i) => (
              <line
                key={i}
                x1={a.split(',')[0]}
                y1={a.split(',')[1]}
                x2={b.split(',')[0]}
                y2={b.split(',')[1]}
                stroke={crushed ? 'var(--a)' : 'var(--m3-clay-dim)'}
                strokeWidth={1.1}
              />
            ))}
          </svg>
        </Panel>

        <StageNote>
          Заливка — форма, которая задумана; ломаная — сетка, которая получится.
          Поперечные линии и есть лупы. Прибавьте угол, не трогая лупы, — грань
          вылезет на силуэт; прибавьте лупы — форма вернётся к дуге. Отсюда
          главное: полигоны нужны не «везде побольше», а именно там, где
          поверхность гнётся. Модель, у которой сетка равномерна, а лупов в
          суставе нет, на превью выглядит так же, а в анимации складывается.
        </StageNote>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   04–05 · МАТЕРИАЛ И СВЕТ
   Схематический шар: не рендер, а диаграмма поведения света. Она честно
   отрабатывает две вещи, ради которых и существуют каналы материала:
   шероховатость управляет шириной блика, металличность гасит диффузную
   составляющую и красит блик в цвет металла.
   ══════════════════════════════════════════════════════════════════════ */

type RGB = [number, number, number]
const ALBEDO: RGB = [196, 138, 86]

const mixRGB = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]
const scaleRGB = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k]
const css = (c: RGB, a = 1) =>
  `rgba(${c.map((v) => Math.round(Math.min(255, Math.max(0, v)))).join(',')},${a})`

type Scheme = {
  id: string
  name: string
  note: string
  key: [number, number]
  keyI: number
  fill: [number, number]
  fillI: number
  rim: [number, number]
  rimI: number
  /** План расстановки: камера внизу, объект в центре. */
  plan: { label: string; x: number; y: number; r: number; strong: boolean }[]
}

const SCHEMES: Scheme[] = [
  {
    id: 'three',
    name: 'Классическая тройка',
    note: 'Рисующий задаёт форму, заполняющий не даёт тени провалиться в чёрное, контровой отделяет объект от фона. Схема, с которой стоит начинать почти всегда.',
    key: [-0.42, -0.46],
    keyI: 1,
    fill: [0.5, 0.08],
    fillI: 0.34,
    rim: [0.5, -0.58],
    rimI: 0.8,
    plan: [
      { label: 'Рисующий', x: -34, y: 22, r: 13, strong: true },
      { label: 'Заполняющий', x: 38, y: 26, r: 9, strong: false },
      { label: 'Контровой', x: 20, y: -36, r: 8, strong: true },
    ],
  },
  {
    id: 'soft',
    name: 'Один большой софтбокс',
    note: 'Мягко и безопасно — и ровно поэтому форма читается хуже всего: без выраженной тени объём приходится угадывать, а объект липнет к фону.',
    key: [-0.08, -0.5],
    keyI: 0.92,
    fill: [0.2, 0.3],
    fillI: 0.62,
    rim: [0.5, -0.6],
    rimI: 0.06,
    plan: [{ label: 'Софтбокс', x: -6, y: 30, r: 26, strong: true }],
  },
  {
    id: 'rim',
    name: 'Только контровой',
    note: 'Силуэт вырезан из темноты, объём почти не читается. Приём для настроения и для проверки формы: если объект не узнаётся по одному силуэту, дело не в свете, а в модели.',
    key: [-0.4, -0.4],
    keyI: 0.12,
    fill: [0.4, 0.2],
    fillI: 0.08,
    rim: [0.1, -0.62],
    rimI: 1,
    plan: [
      { label: 'Контровой', x: -4, y: -36, r: 15, strong: true },
      { label: 'Подсветка', x: -40, y: 18, r: 6, strong: false },
    ],
  },
]

/**
 * Схематический шар. Все величины — атрибуты градиентов, пересчитываемые
 * при смене состояния: ни одного перехода, ползунок обязан отвечать сразу.
 */
function LitSphere({
  uid,
  scheme,
  roughness,
  metalness,
}: {
  uid: string
  scheme: Scheme
  roughness: number
  metalness: number
}) {
  // У металла диффузной составляющей практически нет — весь его вид
  // держится на отражении, поэтому основа темнеет почти до чёрного.
  const diffuse = scaleRGB(ALBEDO, 1 - metalness * 0.88)
  const litSide = scaleRGB(mixRGB(diffuse, [255, 240, 216], 0.22), scheme.keyI)
  const darkSide = scaleRGB(mixRGB(diffuse, [46, 54, 70], 0.55), 0.18 + scheme.fillI * 0.55)
  // Блик у диэлектрика белый, у металла окрашен в цвет самого металла.
  const specular = mixRGB([255, 248, 236], ALBEDO, metalness)
  const specR = 7 + roughness * 55
  const specA = Math.max(0, 0.95 - roughness * 0.78) * (0.55 + metalness * 0.45) * scheme.keyI
  const rimCol = mixRGB([255, 214, 170], ALBEDO, metalness * 0.6)

  const fx = 50 + scheme.key[0] * 40
  const fy = 50 + scheme.key[1] * 40
  const rx = 50 + scheme.rim[0] * 52
  const ry = 50 + scheme.rim[1] * 52

  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', display: 'block' }} role="img" aria-label="Схема поведения света на поверхности">
      <defs>
        <radialGradient id={`${uid}-body`} cx="50%" cy="50%" r="74%" fx={`${fx}%`} fy={`${fy}%`}>
          <stop offset="0%" stopColor={css(litSide)} />
          <stop offset="52%" stopColor={css(mixRGB(litSide, darkSide, 0.62))} />
          <stop offset="100%" stopColor={css(darkSide)} />
        </radialGradient>

        <radialGradient
          id={`${uid}-fill`}
          cx="50%"
          cy="50%"
          r="62%"
          fx={`${50 + scheme.fill[0] * 44}%`}
          fy={`${50 + scheme.fill[1] * 44}%`}
        >
          <stop offset="0%" stopColor={css([150, 172, 200], scheme.fillI * (1 - metalness * 0.5))} />
          <stop offset="100%" stopColor="rgba(150,172,200,0)" />
        </radialGradient>

        <radialGradient id={`${uid}-rim`} cx={`${rx}%`} cy={`${ry}%`} r="46%">
          <stop offset="0%" stopColor={css(rimCol, scheme.rimI)} />
          <stop offset="100%" stopColor={css(rimCol, 0)} />
        </radialGradient>

        <radialGradient id={`${uid}-spec`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={css(specular, specA)} />
          <stop offset="60%" stopColor={css(specular, specA * 0.32)} />
          <stop offset="100%" stopColor={css(specular, 0)} />
        </radialGradient>
      </defs>

      {/* Опорная плоскость: без неё объект висит в пустоте и масштаб не читается. */}
      <ellipse cx="100" cy="176" rx="62" ry="11" fill="rgba(0,0,0,0.42)" />

      <circle cx="100" cy="96" r="76" fill={`url(#${uid}-body)`} />
      <circle cx="100" cy="96" r="76" fill={`url(#${uid}-fill)`} />
      <circle cx="100" cy="96" r="76" fill={`url(#${uid}-rim)`} />
      <ellipse
        cx={100 + scheme.key[0] * 46}
        cy={96 + scheme.key[1] * 46}
        rx={specR}
        ry={specR * 0.86}
        fill={`url(#${uid}-spec)`}
      />
    </svg>
  )
}

/** План расстановки сверху: свет — это места в павильоне, а не бегунки. */
function LightPlan({ scheme }: { scheme: Scheme }) {
  return (
    <svg viewBox="-70 -60 140 120" style={{ width: '100%', display: 'block' }} role="img" aria-label={`План расстановки: ${scheme.name}`}>
      <circle r={12} cx={0} cy={0} fill="rgba(216, 189, 148, 0.18)" stroke="var(--m3-clay)" strokeWidth={1} />
      {scheme.plan.map((l) => (
        <g key={l.label}>
          <line x1={l.x} y1={l.y} x2={0} y2={0} stroke="var(--m3-line)" strokeWidth={0.8} strokeDasharray="3 3" />
          <circle
            cx={l.x}
            cy={l.y}
            r={l.r}
            fill={l.strong ? 'rgba(239, 74, 35, 0.28)' : 'rgba(216, 189, 148, 0.14)'}
            stroke={l.strong ? 'var(--a)' : 'var(--m3-clay-dim)'}
            strokeWidth={1}
          />
        </g>
      ))}
      {/* Камера внизу — точка отсчёта, от которой схема и имеет смысл. */}
      <path d="M-9 46 L9 46 L14 54 L-14 54 Z" fill="var(--m3-clay-dim)" />
    </svg>
  )
}

const CHANNELS = [
  {
    t: 'Альбедо',
    d: 'Собственный цвет без единой тени и блика. Запечённый в альбедо свет — самая частая причина, по которой модель выглядит «плоской» в чужой сцене.',
    swatch: 'linear-gradient(135deg, #c48a56, #a8703f)',
  },
  {
    t: 'Шероховатость',
    d: 'Карта в оттенках серого: где темнее — там поверхность полированная и блик собран в точку, где светлее — рассеян. Именно она отличает металл от пластика.',
    swatch: 'linear-gradient(135deg, #f2ece1, #26201a)',
  },
  {
    t: 'Металличность',
    d: 'Почти всегда чёрно-белая, без полутонов: материал либо металл, либо нет. Промежуточные значения — обычно ошибка запекания, а не решение.',
    swatch: 'linear-gradient(135deg, #f2ece1 0 50%, #14100c 50% 100%)',
  },
  {
    t: 'Нормаль',
    d: 'Мелкий рельеф, записанный направлением нормали. Даёт поры, царапины и резьбу без единого лишнего полигона — но силуэт не меняет.',
    swatch: 'linear-gradient(135deg, #8f8fff, #7a7ae0 40%, #9c9cff)',
  },
]

/* ── Содержание услуги ───────────────────────────────────────────────── */
const DELIVERABLES = [
  { t: 'Исходная сцена', d: 'Файл проекта с историей модификаторов и именованными объектами — не запечённый результат, из которого ничего уже не достать.' },
  { t: 'Модель в обменных форматах', d: 'FBX, OBJ, glTF/GLB с выверенным масштабом и осями: объект встаёт в чужую сцену без разворотов и пересчёта единиц.' },
  { t: 'Сетка под задачу', d: 'Квады, лупы в местах сгиба, честный бюджет полигонов под ту цель, куда модель идёт: рендер, движок или печать.' },
  { t: 'Развёртка и текстурные сеты', d: 'PBR-карты в нужном разрешении, швы на невидимых местах, ровная плотность текселей по всей поверхности.' },
  { t: 'Постановка и рендеры', d: 'Кадры под превью и промо со сведённой постановкой света, а не с включённой «студийкой» по умолчанию.' },
  { t: 'Проверка на цели', d: 'Модель просмотрена в том окружении, где будет жить: в движке, в вебе или в рендере — до сдачи, а не после.' },
]

const STEPS = [
  { n: '01', t: 'Референсы', d: 'Собираю рефы и фиксирую направление до первого полигона. Здесь же выясняется, куда модель пойдёт, — и это определяет всё остальное.' },
  { n: '02', t: 'Блокинг', d: 'Грубая форма: пропорции и силуэт. Самый дешёвый момент, чтобы поменять решение.' },
  { n: '03', t: 'Скульпт', d: 'Объём, детали и характер. Плотная сетка, которая нужна для формы, а не для передачи.' },
  { n: '04', t: 'Ретопология', d: 'Чистая сетка под деформацию, а не под скриншот. Лупы ставятся туда, где будет сгиб.' },
  { n: '05', t: 'Развёртка и материалы', d: 'Швы на невидимых местах, ровная плотность текселей, PBR-сеты по каналам.' },
  { n: '06', t: 'Свет и передача', d: 'Постановка, финальные кадры и сборка файлов так, чтобы модель открылась у вас.' },
]

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════════ */
export default function Modeling3DScreen({ onClose }: { onClose: () => void }) {
  useModelingFonts()
  const [rough, setRough] = useState(35)
  const [metal, setMetal] = useState(0)
  const [si, setSi] = useState(0)
  const scheme = SCHEMES[si]
  const reduce = prefersReducedMotion()
  // Бесконечная подсказка прокрутки не должна двигать свой слой,
  // когда герой давно уехал вверх.
  const hintRef = useOffscreenPause<HTMLDivElement>()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main
      data-screen="modeling"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        background: 'var(--m3-stage)',
        color: 'var(--m3-ink)',
        fontFamily: 'var(--m3-sans)',
      }}
    >
      {/* Свет павильона: рисующий сверху-справа, отражённый глиняный снизу-слева. */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(58% 48% at 68% 26%, rgba(239,74,35,0.10), transparent 72%), radial-gradient(52% 42% at 16% 82%, rgba(216,189,148,0.08), transparent 74%)',
        }}
      />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 rounded-full px-4 py-2 backdrop-blur"
        style={{
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--m3-line)',
          color: 'var(--m3-clay)',
          background: 'rgba(23,18,14,0.78)',
          fontSize: '0.85rem',
        }}
      >
        ← Назад
      </button>

      {/* ══ ГЕРОЙ ══════════════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full flex flex-col justify-center min-h-screen"
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
              <span style={{ ...mono, color: 'var(--m3-a)' }}>Компетенция · 3D-моделинг</span>
            </Reveal>

            <h1
              className="optical-left"
              style={{
                marginTop: 'var(--s-6)',
                fontFamily: 'var(--m3-display)',
                fontWeight: 800,
                fontSize: 'clamp(3rem, 11vw, 9rem)',
                letterSpacing: '-0.045em',
                // 0.92, а не плотнее: в «моделинг» краткая над «й» соседнего
                // набора и выносные элементы поднимаются выше прописной
                // высоты, и на плотном интерлиньяже строка их срезает.
                lineHeight: 0.92,
              }}
            >
              <SplitText text="3D" by="char" delay={0.1} />
              <br />
              <SplitText text="моделинг" by="char" delay={0.2} />
            </h1>

            <Reveal y={18} delay={0.42}>
              <p
                style={{
                  marginTop: 'var(--s-8)',
                  maxWidth: '48ch',
                  fontWeight: 300,
                  fontSize: 'clamp(1.08rem, 2vw, 1.5rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.012em',
                }}
              >
                Рендер — единственный взгляд на модель, по которому о модели
                судить нельзя: он прячет ровно то, за что платят. Ниже — то же
                самое ремесло без красивого кадра, и всё это можно подвигать.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal y={16} delay={0.55}>
              <div style={{ borderTop: '1px solid var(--m3-line)', paddingTop: 'var(--s-6)' }}>
                {['Сетка и топология', 'Развёртка и PBR-материалы', 'Постановка света', 'Передача в движок и рендер'].map(
                  (t) => (
                    <p
                      key={t}
                      style={{
                        ...readout,
                        letterSpacing: 0,
                        color: 'var(--m3-ink-70)',
                        paddingBlock: 'var(--s-2)',
                      }}
                    >
                      {t}
                    </p>
                  )
                )}
              </div>
            </Reveal>
          </div>
        </div>

        <div
          ref={hintRef}
          className="absolute left-1/2 bottom-6 flex flex-col items-center gap-2 animate-bob-down"
          style={{ transform: 'translateX(-50%)', color: 'var(--m3-clay-dim)' }}
          aria-hidden
        >
          <span style={mono}>Далее</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ══ 01 · РЕЖИМЫ ═══════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="01"
          title="Модель смотрят четырьмя способами"
          lead="Один и тот же объект в рендере, в сетке, в нормалях и в развёртке. Три последних режима заказчик обычно не видит — и ровно в них видно, сделана модель как производственный объект или как один удачный кадр."
        />
        <Viewer />
      </section>

      {/* ══ 02 · ПОЛИГОНЫ ═════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="02"
          title="Полигон — это бюджет, а не оценка качества"
          lead="«Сколько полигонов» — вопрос без ответа, пока не сказано, куда модель идёт. Считать надо не полигоны, а видно ли грань: отклонение хорды от дуги посчитано здесь же, и его можно перепроверить."
        />
        <FacetLab />
      </section>

      {/* ══ 03 · ТОПОЛОГИЯ ════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="03"
          title="Деформация — это про рёбра, а не про полигоны"
          lead="Модель под анимацию проверяется не на превью, а в согнутом виде. Между лупами поверхность плоская, поэтому ломаная ниже — настоящий силуэт, а не иллюстрация к нему."
        />
        <BendLab />
      </section>

      {/* ══ 04 · МАТЕРИАЛ ═════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="04"
          title="Материал — это поведение света, а не цвет"
          lead="PBR-материал собран из отдельных каналов, и ни один из них не отвечает за «красиво». Два ползунка ниже меняют не оттенок, а то, как поверхность возвращает свет: ширину блика и наличие диффузной составляющей."
        />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10 items-start">
          <Panel style={{ padding: 'var(--s-6)' }}>
            <Slider label="Шероховатость" value={rough} min={0} max={100} suffix=" %" onChange={setRough} />
            <div style={{ marginTop: 'var(--s-6)' }}>
              <Slider label="Металличность" value={metal} min={0} max={100} suffix=" %" onChange={setMetal} />
            </div>
            <p
              style={{
                marginTop: 'var(--s-8)',
                paddingTop: 'var(--s-6)',
                borderTop: '1px solid var(--m3-line-soft)',
                ...readout,
                letterSpacing: 0,
                lineHeight: 1.55,
                color: 'var(--m3-ink-70)',
              }}
            >
              {metal > 55
                ? 'Металл: собственного цвета почти нет, вся форма держится на отражении, и блик окрашен в цвет самого металла.'
                : rough > 60
                  ? 'Матовая поверхность: блик размазан, форма читается мягкими переходами, мелкий рельеф почти пропадает.'
                  : 'Диэлектрик с гладкой поверхностью: блик собран и остаётся белым — цвет отражения не зависит от цвета материала.'}
            </p>
          </Panel>

          <div>
            <Panel
              className="flex items-center justify-center"
              style={{ padding: 'var(--s-8)', background: 'var(--m3-stage-2)' }}
            >
              <div style={{ width: '100%', maxWidth: 320 }}>
                <LitSphere uid="mat" scheme={SCHEMES[0]} roughness={rough / 100} metalness={metal / 100} />
              </div>
            </Panel>
            <StageNote>
              Это схема поведения света, а не рендер: она показывает зависимость,
              а не считает физику. Проверить её просто — на реальном материале
              работает то же правило.
            </StageNote>
          </div>
        </div>

        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ marginTop: 'var(--s-12)', background: 'var(--m3-line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {CHANNELS.map((c, i) => (
            <Reveal key={c.t} y={16} delay={i * stagger.item}>
              <div className="h-full flex flex-col" style={{ background: 'var(--m3-panel)', padding: 'var(--s-6)', gap: 'var(--s-4)' }}>
                <span aria-hidden style={{ height: 56, borderRadius: 'var(--r-sm)', background: c.swatch }} />
                <h3 style={{ ...mono, color: 'var(--m3-clay)' }}>{c.t}</h3>
                <p style={{ fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--m3-ink-70)' }}>
                  {c.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ 05 · СВЕТ ═════════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="05"
          title="Свет решает, что зритель поймёт"
          lead="Один объект, три постановки. Модель не меняется ни на вершину — меняется только то, читается ли объём, отделён ли объект от фона и куда смотрит глаз. Поэтому свет ставится под задачу кадра, а не включается по умолчанию."
        />

        <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--s-8)' }}>
          {SCHEMES.map((s, i) => (
            <Chip key={s.id} active={i === si} onClick={() => setSi(i)}>
              {s.name}
            </Chip>
          ))}
        </div>

        <motion.div
          key={scheme.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, ease: ease.entrance }}
          className="grid gap-6 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.1fr_0.9fr_1fr] lg:gap-8 items-stretch"
        >
          <Panel className="flex items-center justify-center" style={{ padding: 'var(--s-8)', background: 'var(--m3-stage-2)' }}>
            <div style={{ width: '100%', maxWidth: 280 }}>
              <LitSphere uid="light" scheme={scheme} roughness={0.42} metalness={0} />
            </div>
          </Panel>

          <Panel className="flex flex-col justify-between" style={{ padding: 'var(--s-6)' }}>
            <span style={{ ...mono, color: 'var(--m3-ink-45)' }}>План · вид сверху</span>
            <div style={{ paddingBlock: 'var(--s-4)' }}>
              <LightPlan scheme={scheme} />
            </div>
            <span style={{ ...readout, letterSpacing: 0, color: 'var(--m3-ink-45)' }}>
              Внизу — камера
            </span>
          </Panel>

          <div className="flex flex-col justify-center">
            <h3
              style={{
                fontFamily: 'var(--m3-display)',
                fontWeight: 600,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 'var(--s-4)',
              }}
            >
              {scheme.name}
            </h3>
            <p style={{ fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.62, color: 'var(--m3-ink-70)' }}>
              {scheme.note}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══ 06 · ЧТО ОСТАЁТСЯ ═════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="06"
          title="Что остаётся у заказчика"
          lead="Не кадр, а объект, с которым можно работать дальше — в том числе без меня."
        />
        <div className="grid lg:grid-cols-12 gap-x-8">
          <div className="lg:col-span-8 lg:col-start-5">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.t} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8"
                  style={{ paddingBlock: 'var(--s-6)', borderBottom: '1px solid var(--m3-line-soft)' }}
                >
                  <span style={{ ...mono, color: 'var(--m3-a)', minWidth: 36, paddingTop: 4 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.06rem', fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 6 }}>
                      {d.t}
                    </h3>
                    <p style={{ fontWeight: 300, maxWidth: '50ch', color: 'var(--m3-ink-70)', lineHeight: 1.6 }}>
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
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead n="07" title="Как идёт работа" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} y={18} delay={i * stagger.item}>
              <div style={{ borderTop: '1px solid var(--m3-line)', paddingTop: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--m3-a)' }}>{s.n}</span>
                <h3
                  style={{
                    marginTop: 'var(--s-4)',
                    marginBottom: 'var(--s-3)',
                    fontFamily: 'var(--m3-display)',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.18,
                  }}
                >
                  {s.t}
                </h3>
                <p style={{ fontWeight: 300, color: 'var(--m3-ink-70)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ФИНАЛ ═════════════════════════════════════════════════ */}
      <section
        className="relative mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <h2
              className="optical-left"
              style={{
                fontFamily: 'var(--m3-display)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 6.5vw, 4.6rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
              }}
            >
              <SplitText text="Модель делается под цель" by="word" />
            </h2>
            <Reveal y={16} delay={0.2}>
              <p
                style={{
                  marginTop: 'var(--s-6)',
                  maxWidth: '54ch',
                  fontWeight: 300,
                  color: 'var(--m3-ink-70)',
                  lineHeight: 1.65,
                }}
              >
                Модель под кинорендер и модель под движок — разные объекты, а не
                одна в разном качестве. Скажите, куда она пойдёт, и это определит
                топологию, бюджет полигонов и материалы с первого дня, а не после
                того, как выяснится, что переделывать придётся всё.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Reveal y={16} delay={0.28}>
              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-full"
                style={{
                  border: '1px solid var(--m3-clay)',
                  color: 'var(--m3-clay)',
                  paddingInline: 'var(--s-8)',
                  paddingBlock: 'var(--s-4)',
                  ...mono,
                }}
              >
                {/* Заливка — scaleY отдельного слоя: переход по background
                    стоил бы paint на каждом кадре наведения. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
                  style={{
                    background: 'rgba(216, 189, 148, 0.14)',
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
