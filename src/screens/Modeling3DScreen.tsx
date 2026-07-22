/**
 * Экран услуги — 3D-моделинг.
 *
 * ТЕЗИС: ЭКРАН — ЭТО ПРОСМОТРОВАЯ, А НЕ ГАЛЕРЕЯ
 * ─────────────────────────────────────────────
 * Портфолио 3D-художника почти всегда устроено как галерея финальных
 * кадров. Проблема в том, что финальный кадр перестал быть доказательством:
 * картинку такого качества выдаёт генератор, и зритель это знает.
 * Доказательством стало ровно то, чего у генератора нет, — сетка,
 * развёртка, ретопология, бюджет полигонов. То есть всё, что на финальном
 * кадре по определению не видно.
 *
 * Поэтому экран собран не как галерея, а как просмотровая: один объект
 * под светом и док внизу, которым его прогоняют по стадиям пайплайна —
 * сетка, ретопология, развёртка, глина, затенение, финальный кадр.
 * Переключение меняет весь экран разом: сам объект на стенде, текст
 * закона, температуру интерфейса и то, какие из живых метрик выходят
 * на первый план. Одно решение — вся страница; так устроено управление
 * системой, а не набор кнопок сбоку.
 *
 * ВИЗУАЛЬНАЯ НИША: ЗАТЕМНЁННЫЙ ПАВИЛЬОН
 * ─────────────────────────────────────
 * Температуры остальных экранов заняты: светлая швейцарская с ультрамарином
 * (Веб-дизайн), средний серый цикл (Брендинг), петроль (Моушн), терминальный
 * зелёный (Разработка), тёмная тёплая (главная). За 3D закреплена тёплая
 * глина, и здесь она углублена до конкретного места — умбра затемнённого
 * съёмочного павильона, где единственный источник цвета это объект под
 * светом. Ниша работает на смысл услуги: спорить с объектом нечему.
 *
 * ПРО ЦВЕТ СТАДИЙ. У каждой стадии своя температура, и это не украшение:
 * во всех редакторах проходы вьюпорта закодированы цветом, человек из
 * профессии читает стадию по цвету раньше, чем по подписи. Дисциплина
 * при этом сохранена — одна температура на стадию, ноль градиентов,
 * и она приходит из общего словаря, а не подбирается на месте.
 *
 * ПРО НУМЕРАЦИЮ. Исследование помечает разделы «01 / 02 / 03» как признак
 * шаблонности, и здесь это справедливо: у раздела номер ничего не значит.
 * Поэтому номера сняты с разделов и оставлены там, где несут смысл, —
 * на стадиях пайплайна: пятую физически нельзя сделать раньше третьей,
 * и порядок в доке это утверждает. Разделы вместо номера получили
 * технический ярлык — имя того, что в разделе можно потрогать.
 *
 * ЧТО ЗДЕСЬ ДОКАЗЫВАЕТ КОМПЕТЕНЦИЮ
 * ────────────────────────────────
 *   · стенд с шестью стадиями — интерактивный вьюер, которого нет ни у
 *     кого из индустриальных модельеров: это сигнал «код + 3D», а не
 *     общее место;
 *   · метрики, посчитанные из самого файла в кадре, — треугольники,
 *     плотность текселя, вызовы отрисовки. Врать в них нельзя;
 *   · гранёность силуэта, изгиб, материал и свет — четыре стенда, где
 *     утверждение проверяется рукой, а не принимается на слово.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * WebGL монтируется только когда стенд в кадре, и размонтируется при
 * уходе: r3f иначе рендерит всегда. На узком экране сцена не грузится
 * сама — только по явному нажатию, чтобы телефон не платил за бандл
 * three.js при пролистывании. Смена стадии — подмена материала на уже
 * загруженной геометрии.
 *
 * В DOM-части анимируются только transform и opacity. Всё остальное —
 * мгновенная смена состояния: ползунок обязан ответить в тот же кадр,
 * анимированный ползунок это не плавность, а задержка.
 * Кривые и длительности — только из design/motion.ts.
 */

import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { Reveal, SplitText } from '../design/primitives'
import { cssEase, duration, ease, prefersReducedMotion, stagger } from '../design/motion'
import { STAGES, type MetricKey, type ModelStats, type PipelineStage } from './modeling/stages'

// Ленивый импорт обязателен: иначе three.js и r3f уезжают в основной бандл.
const Model3D = lazy(() => import('./Model3D'))

/* ── Локальная палитра ────────────────────────────────────────────────
   Умбра затемнённого павильона плюс глина. Ниже по дереву цвет берётся
   только через var(): хексов в разметке нет. Температура стадии
   приезжает отдельной переменной и перекрашивает экран целиком. */
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
  // Unbounded и Onest — обе с подтверждённой кириллицей (cyrillic,
  // cyrillic-ext). JetBrains Mono тоже: цифры и подписи на стенде
  // не должны деградировать в подстановочный шрифт.
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

/* ══════════════════════════════════════════════════════════════════════
   ОБЩИЕ ЭЛЕМЕНТЫ
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Заголовок раздела.
 *
 * Слева не номер, а ярлык — имя того, что в разделе можно потрогать.
 * Сам заголовок при этом утверждение, а не название: раздел обязан
 * что-то сказать ещё до того, как в нём что-то потрогают.
 */
function SectionHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <header style={{ marginBottom: 'var(--s-12)' }}>
      <Reveal y={16}>
        <div
          className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-4"
          style={{ borderBottom: '1px solid var(--m3-line)' }}
        >
          <span style={{ ...mono, color: 'var(--m3-tint)', whiteSpace: 'nowrap' }}>{label}</span>
          <h2
            style={{
              fontFamily: 'var(--m3-display)',
              fontWeight: 600,
              fontSize: 'clamp(1.55rem, 4vw, 2.9rem)',
              letterSpacing: '-0.03em',
              // 1.06, а не плотнее: у Unbounded высокие «й» и «ё», и на
              // многострочном заголовке верхняя строка срезала бы диакритику.
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
              maxWidth: '58ch',
              fontWeight: 300,
              color: 'var(--m3-ink-70)',
              fontSize: 'clamp(0.98rem, 1.6vw, 1.16rem)',
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

/** Панель-инструмент: общая оправа для всех стендов экрана. */
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
        border: `1px solid ${active ? 'var(--m3-tint)' : 'var(--m3-line)'}`,
        background: active ? 'rgba(216, 189, 148, 0.12)' : 'transparent',
        color: active ? 'var(--m3-tint)' : 'var(--m3-ink-45)',
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
      <span className="flex items-baseline justify-between gap-3" style={{ marginBottom: 'var(--s-3)' }}>
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
        style={{ width: '100%', accentColor: 'var(--m3-tint)' }}
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
   СТЕНД
   Один объект под светом. На широком экране он липнет к верху и держится
   в кадре, пока читаются законы стадий: переключение в доке видно ровно
   в тот момент, когда читаешь, что именно оно должно показать.

   Важно: липкость работает только потому, что ни один предок не имеет
   overflow: hidden — он бы её молча отключил. Корневой контейнер проекта
   использует overflow-x: clip, который sticky не ломает.
   ══════════════════════════════════════════════════════════════════════ */

function Stand({ stage, onStats }: { stage: PipelineStage; onStats: (s: ModelStats) => void }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [autoLoad, setAutoLoad] = useState(false)
  const [requested, setRequested] = useState(false)
  const reduce = prefersReducedMotion()
  const def = STAGES.find((s) => s.id === stage) ?? STAGES[0]

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

  const live = inView && (autoLoad || requested)

  return (
    <Panel style={{ overflow: 'hidden' }}>
      <div
        ref={boxRef}
        className="relative"
        style={{ height: 'clamp(320px, 58vh, 600px)', background: 'var(--m3-stage-2)' }}
      >
        {live ? (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ ...mono, color: 'var(--m3-clay-dim)' }}>Сцена загружается</span>
              </div>
            }
          >
            <Model3D stage={stage} spin={!reduce} onStats={onStats} />
          </Suspense>
        ) : (
          /* Фолбэк — не спиннер: экран не имеет права оказаться пустым.
             Пока сцены нет, в кадре стоит осмысленный статичный кадр —
             разметка павильона и имя текущей стадии. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <StandPlaceholder />
            {!autoLoad && (
              <button
                onClick={() => setRequested(true)}
                style={{
                  ...mono,
                  borderRadius: 'var(--r-full)',
                  padding: '0.7rem 1.4rem',
                  border: '1px solid var(--m3-tint)',
                  background: 'transparent',
                  color: 'var(--m3-tint)',
                }}
              >
                Загрузить сцену
              </button>
            )}
            <span
              style={{
                ...readout,
                color: 'var(--m3-ink-45)',
                maxWidth: '34ch',
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

        {/* Шапка стенда. Номер и имя стадии — там же, где их ищут
            в любом вьюпорте: в верхнем левом углу кадра. */}
        <span
          className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none"
          style={{ ...mono, color: 'var(--m3-tint)' }}
        >
          <span style={{ opacity: 0.55 }}>{def.n}</span>
          {def.label}
        </span>
      </div>
    </Panel>
  )
}

/**
 * Статичный кадр вместо спиннера. Разметка павильона: горизонт, круг
 * поворотного стола, объект и подвес источника. Показывает, что стенд —
 * это место с постановкой, ещё до того как приехал WebGL.
 */
function StandPlaceholder() {
  return (
    <svg
      viewBox="-100 -70 200 140"
      style={{ width: 'min(70%, 300px)', display: 'block', opacity: 0.55 }}
      aria-hidden
    >
      <ellipse cx="0" cy="34" rx="72" ry="16" fill="none" stroke="var(--m3-line)" strokeWidth="1" />
      <ellipse cx="0" cy="34" rx="44" ry="10" fill="none" stroke="var(--m3-line-soft)" strokeWidth="1" />
      <path d="M-16 34 L0 -22 L16 34 Z" fill="none" stroke="var(--m3-tint)" strokeWidth="1.2" />
      <line x1="-92" y1="34" x2="92" y2="34" stroke="var(--m3-line-soft)" strokeWidth="1" />
      <line x1="0" y1="-52" x2="0" y2="-34" stroke="var(--m3-line)" strokeWidth="1" />
      <circle cx="0" cy="-56" r="4" fill="none" stroke="var(--m3-tint)" strokeWidth="1.2" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   МЕТРИКИ
   Числа приходят из обхода геометрии и из renderer.info — то есть из
   того самого файла, который сейчас крутится в кадре. Их нельзя
   вписать в вёрстку: пока сцена не измерена, тут прочерки.
   ══════════════════════════════════════════════════════════════════════ */

const nf = new Intl.NumberFormat('ru-RU')

type MetricRow = { key: MetricKey; label: string; value: string; note: string }

function buildMetrics(s: ModelStats | null): MetricRow[] {
  const dash = '—'
  return [
    {
      key: 'triangles',
      label: 'Треугольников',
      value: s ? nf.format(s.triangles) : dash,
      note: 'Считано по индексу геометрии. В glTF любая сетка уже триангулирована — квадов в файле физически не существует, и обещать их числом было бы враньём.',
    },
    {
      key: 'vertices',
      label: 'Вершин',
      value: s ? nf.format(s.vertices) : dash,
      note: 'Вершин всегда больше, чем углов формы: шов развёртки и жёсткое ребро разрезают вершину надвое. Разрыв между вершинами и треугольниками — это цена швов.',
    },
    {
      key: 'meshes',
      label: 'Мешей',
      value: s ? nf.format(s.meshes) : dash,
      note: 'Каждый отдельный меш — это минимум один вызов отрисовки. Модель из сорока деталей стоит дороже той же формы, слитой в один объект.',
    },
    {
      key: 'materials',
      label: 'Материалов',
      value: s ? nf.format(s.materials) : dash,
      note: 'Материалы исходные — те, что в самом файле. Их число — прямой множитель к нагрузке: движок переключает состояние на каждом.',
    },
    {
      key: 'textures',
      label: 'Текстур',
      value: s
        ? s.textures === 0
          ? 'нет'
          : `${s.textures} · ${(s.texturePixels / 1e6).toFixed(1)} Мпикс`
        : dash,
      note: 'Уникальные карты и их суммарная площадь в пикселях — то, что реально ляжет в видеопамять, независимо от веса файла на диске.',
    },
    {
      key: 'texel',
      label: 'Плотность текселя',
      value: s?.texel ? `${Math.round(s.texel)} px/ед.${s.texelAssumed ? ' *' : ''}` : dash,
      note: s?.texelAssumed
        ? 'Посчитано из UV-площади и площади поверхности при гипотетической карте 2048². Звёздочка — потому что своих текстур у объекта нет и подставлять реальное разрешение неоткуда.'
        : `Посчитано из UV-площади и площади поверхности при реальном разрешении карт (${s?.texelBasis ?? 0}²). Ровная плотность по всей модели — то, ради чего развёртку и переделывают.`,
    },
    {
      key: 'calls',
      label: 'Вызовов отрисовки',
      value: s ? nf.format(s.calls) : dash,
      note: 'Показание renderer.info за последний кадр, а не оценка. На стадии ретопологии число выше: сетка поверх поверхности — это отдельный проход.',
    },
    {
      key: 'bounds',
      label: 'Габариты',
      value: s ? s.bounds.map((v) => v.toFixed(2)).join(' × ') : dash,
      note: 'Размер в единицах сцены. Модель, приехавшая в чужих единицах, ломает и свет, и физику — поэтому масштаб проверяют до передачи, а не после.',
    },
  ]
}

function MetricsBoard({ stats, stage }: { stats: ModelStats | null; stage: PipelineStage }) {
  const rows = useMemo(() => buildMetrics(stats), [stats])
  const def = STAGES.find((s) => s.id === stage) ?? STAGES[0]
  const reduce = prefersReducedMotion()

  return (
    <div>
      <div
        className="grid gap-px sm:grid-cols-2 lg:grid-cols-4"
        style={{ background: 'var(--m3-line-soft)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}
      >
        {rows.map((r) => {
          // Стадия выводит вперёд свои метрики. Остальные не прячутся —
          // они гаснут: список должен остаться целым, иначе теряется
          // ощущение, что это один прибор, а не шесть разных.
          const focused = def.focus.includes(r.key)
          return (
            <div
              key={r.key}
              style={{
                background: 'var(--m3-panel)',
                padding: 'var(--s-6)',
                opacity: focused ? 1 : 0.55,
                transition: `opacity ${duration.base}s ${cssEase.standard}`,
              }}
            >
              <span style={{ ...mono, color: focused ? 'var(--m3-tint)' : 'var(--m3-ink-45)' }}>
                {r.label}
              </span>
              <p
                style={{
                  marginTop: 'var(--s-3)',
                  fontFamily: 'var(--m3-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.55rem)',
                  letterSpacing: '-0.01em',
                  color: 'var(--m3-ink)',
                }}
              >
                {r.value}
              </p>
              <p
                style={{
                  marginTop: 'var(--s-4)',
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: 'var(--m3-ink-70)',
                }}
              >
                {r.note}
              </p>
            </div>
          )
        })}
      </div>

      <motion.p
        key={stats ? stats.source : 'idle'}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.entrance }}
        style={{
          marginTop: 'var(--s-6)',
          maxWidth: '68ch',
          ...readout,
          letterSpacing: 0,
          lineHeight: 1.6,
          color: 'var(--m3-ink-45)',
        }}
      >
        {stats === null
          ? 'Прочерки стоят до первого замера: пока сцена не отрисовала кадр, брать числа неоткуда. Включите стенд выше — таблица заполнится сама.'
          : stats.source === 'demo'
            ? 'Замер сделан на демонстрационном объекте — своего .glb в src/models сейчас нет. Положите файл туда, и стенд подхватит его, а таблица пересчитается по нему.'
            : 'Замер сделан на модели из src/models — на том самом файле, который сейчас в кадре.'}
      </motion.p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   ГРАНЁНОСТЬ СИЛУЭТА
   Число полигонов само по себе ничего не значит — значит только то,
   видно ли грань. Отклонение хорды от дуги считается прямо здесь:
   r·(1−cos(π/n)). Величину можно перепроверить, и именно она
   показывает, где полигоны перестают работать.
   ══════════════════════════════════════════════════════════════════════ */

function facetVerdict(devPct: number): { text: string; hot: boolean } {
  if (devPct > 5) return { text: 'Грань видна даже в движении', hot: true }
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
            { k: 'Треугольников', v: nf.format(tris) },
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
                return <circle key={p} cx={x} cy={y} r={2.2} fill="var(--m3-tint)" />
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
          секунду, и решение принимается в начале работы.
        </StageNote>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   ИЗГИБ
   Между лупами поверхность плоская — значит ломаная по станциям и есть
   настоящий силуэт согнутой формы, а не его иллюстрация. Отсюда правило,
   которое обычно передают на словах: считать надо не полигоны, а
   градусы на сегмент.
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
          style={{
            marginTop: 'var(--s-8)',
            paddingTop: 'var(--s-3)',
            borderTop: '1px solid var(--m3-line-soft)',
          }}
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
                stroke={crushed ? 'var(--m3-a)' : 'var(--m3-clay-dim)'}
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
   МАТЕРИАЛ И СВЕТ
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
    note: 'Рисующий задаёт форму, заполняющий не даёт тени провалиться в чёрное, контровой отделяет объект от фона. Схема, с которой и начинают.',
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
 * при смене состояния: ни одного перехода, ползунок обязан ответить сразу.
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
    <svg
      viewBox="0 0 200 200"
      style={{ width: '100%', display: 'block' }}
      role="img"
      aria-label="Схема поведения света на поверхности"
    >
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
    <svg
      viewBox="-70 -60 140 120"
      style={{ width: '100%', display: 'block' }}
      role="img"
      aria-label={`План расстановки: ${scheme.name}`}
    >
      <circle r={12} cx={0} cy={0} fill="rgba(216, 189, 148, 0.18)" stroke="var(--m3-clay)" strokeWidth={1} />
      {scheme.plan.map((l) => (
        <g key={l.label}>
          <line x1={l.x} y1={l.y} x2={0} y2={0} stroke="var(--m3-line)" strokeWidth={0.8} strokeDasharray="3 3" />
          <circle
            cx={l.x}
            cy={l.y}
            r={l.r}
            fill={l.strong ? 'rgba(239, 74, 35, 0.28)' : 'rgba(216, 189, 148, 0.14)'}
            stroke={l.strong ? 'var(--m3-tint)' : 'var(--m3-clay-dim)'}
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
    d: 'Обычно чёрно-белая, без полутонов: материал либо металл, либо нет. Промежуточные значения — чаще ошибка запекания.',
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
  { n: '03', t: 'Скульпт', d: 'Объём, детали и характер. Плотная сетка под форму.' },
  { n: '04', t: 'Ретопология', d: 'Чистая сетка под деформацию, а не под скриншот. Лупы ставятся туда, где будет сгиб.' },
  { n: '05', t: 'Развёртка и материалы', d: 'Швы на невидимых местах, ровная плотность текселей, PBR-сеты по каналам.' },
  { n: '06', t: 'Свет и передача', d: 'Постановка, финальные кадры и сборка файлов так, чтобы модель открылась у вас.' },
]

/* ══════════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════════ */
export default function Modeling3DScreen({ onClose }: { onClose: () => void }) {
  useModelingFonts()
  const [stage, setStage] = useState<PipelineStage>('beauty')
  const [stats, setStats] = useState<ModelStats | null>(null)
  const [rough, setRough] = useState(35)
  const [metal, setMetal] = useState(0)
  const [si, setSi] = useState(0)
  const scheme = SCHEMES[si]
  const reduce = prefersReducedMotion()
  const def = STAGES.find((s) => s.id === stage) ?? STAGES[0]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Цифры 1–6 переключают стадию, как слоты вьюпорта в любом редакторе.
  // Жест, по которому человек из профессии сразу понимает, что стенд
  // сделан своим, а не собран из чужого компонента.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      const i = Number(e.key)
      if (!Number.isInteger(i) || i < 1 || i > STAGES.length) return
      setStage(STAGES[i - 1].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Замер приходит из кадра WebGL: держим обработчик стабильным, иначе
  // стенд получал бы новый проп на каждый рендер экрана.
  const onStats = useCallback((s: ModelStats) => setStats(s), [])

  // Активная стадия подтягивается в видимую часть дока. На 390px шесть
  // кнопок не помещаются, и переключение цифрами уводило бы активную
  // кнопку за край: человек нажал — и не увидел, что именно выбрано.
  const dockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scroller = dockRef.current
    const el = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!scroller || !el) return
    // Центруем активный чип ГОРИЗОНТАЛЬНО внутри самого дока и только его.
    // Прежний scrollIntoView({block:'nearest'}) утаскивал ВСЮ страницу вниз
    // к доку: он position:fixed, но при входной анимации экрана его fixed
    // резолвится относительно трансформируемого предка (motion.div в App),
    // а не вьюпорта, — и «ближайшая» прокрутка оказывалась прокруткой
    // страницы к финальному блоку. scrollBy по дельте прямоугольников
    // двигает только горизонтальную полосу дока, вертикаль не трогает.
    const er = el.getBoundingClientRect()
    const sr = scroller.getBoundingClientRect()
    const delta = er.left - sr.left - (sr.width - er.width) / 2
    scroller.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' })
  }, [stage, reduce])

  /* Температура текущей стадии уезжает в переменную корня — ровно тем же
     механизмом, что палитра в Брендинге. Ниже по дереву акцент берётся
     только через var(--m3-tint): ни одного хекса в разметке. */
  const stageVars = { '--m3-tint': def.tint } as unknown as CSSProperties

  return (
    <main
      data-screen="modeling"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        ...stageVars,
        background: 'var(--m3-stage)',
        color: 'var(--m3-ink)',
        fontFamily: 'var(--m3-sans)',
        // Место под док, который живёт поверх контента.
        paddingBottom: 'var(--s-32)',
      }}
    >
      <button
        onClick={onClose}
        className="fixed top-5 left-5 rounded-full px-4 py-2 text-sm backdrop-blur"
        style={{
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--m3-line)',
          color: 'var(--m3-ink)',
          background: 'rgba(23, 18, 14, 0.78)',
        }}
      >
        ← Назад
      </button>

      {/* ══ ГЕРОЙ ══════════════════════════════════════════════════════
          Ни бенто, ни сетки превью: один объект под светом и текст рядом.
          Всё, что можно было бы разложить по ячейкам, показывается на том
          же самом объекте — переключением стадии. */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 'var(--max-w)',
          paddingInline: 'var(--gutter)',
          paddingTop: 'var(--s-32)',
          paddingBottom: 'var(--s-16)',
        }}
      >
        <Reveal y={14}>
          <span style={{ ...mono, color: 'var(--m3-tint)' }}>Компетенция · 3D-моделинг</span>
        </Reveal>

        <h1
          className="optical-left"
          style={{
            marginTop: 'var(--s-6)',
            fontFamily: 'var(--m3-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
            letterSpacing: '-0.045em',
            // 0.96, а не плотнее: у кириллицы «й» и «ё» выходят выше
            // прописной высоты, и строка сверху срезала бы диакритику.
            lineHeight: 0.96,
          }}
        >
          <SplitText text="3D-моделинг" by="char" delay={0.1} />
        </h1>

        <Reveal y={18} delay={0.3}>
          <p
            style={{
              marginTop: 'var(--s-8)',
              maxWidth: '48ch',
              fontWeight: 300,
              fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
              lineHeight: 1.5,
              letterSpacing: '-0.012em',
            }}
          >
            Финальный кадр сегодня умеет делать кто угодно. Сетку, развёртку
            и ретопологию — нет. Поэтому здесь не галерея рендеров, а
            просмотровая: один объект и док, которым его прогоняют по всем
            стадиям производства.
          </p>
        </Reveal>
      </section>

      {/* ══ СТЕНД И ЗАКОНЫ СТАДИЙ ══════════════════════════════════════
          Стенд липнет к верху и держится в кадре, пока читаются законы:
          переключение в доке видно ровно в тот момент, когда читаешь,
          что именно оно должно показать. */}
      <section
        className="mx-auto w-full"
        style={{
          maxWidth: 'var(--max-w)',
          paddingInline: 'var(--gutter)',
          paddingBottom: 'var(--section-y)',
        }}
      >
        <SectionHead
          label="Стенд · WebGL"
          title="Каждая стадия отвечает на свой вопрос и ни одна не отвечает на чужой"
          lead="Шесть стадий — это не шесть фильтров поверх картинки, а шесть разных работ над одним объектом. Док внизу экрана прогоняет модель по ним и вместе с ней меняет весь экран: текст закона, температуру интерфейса и то, какие числа выходят вперёд."
        />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Стенд первым по порядку на узком экране и справа на широком:
              объект обязан быть виден раньше текста о нём. */}
          <div className="lg:col-span-7 lg:order-2 lg:sticky lg:top-24">
            <Stand stage={stage} onStats={onStats} />

            <motion.div
              key={def.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: ease.entrance }}
              style={{ marginTop: 'var(--s-6)' }}
            >
              <p style={{ fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.62, color: 'var(--m3-ink)' }}>
                {def.what}
              </p>
              <p
                style={{
                  marginTop: 'var(--s-4)',
                  fontWeight: 300,
                  fontSize: '0.9rem',
                  lineHeight: 1.62,
                  color: 'var(--m3-ink-70)',
                }}
              >
                {def.why}
              </p>
            </motion.div>

            <p
              style={{
                marginTop: 'var(--s-6)',
                paddingTop: 'var(--s-5)',
                borderTop: '1px solid var(--m3-line-soft)',
                ...readout,
                letterSpacing: 0,
                lineHeight: 1.55,
                color: 'var(--m3-ink-45)',
              }}
            >
              Стадии переключаются доком внизу или цифрами 1–6. Объект на
              стенде — демонстрационный: если положить свой .glb в src/models,
              стенд подхватит его автоматически.
            </p>
          </div>

          {/* Список стадий — второе управление тем же состоянием.
              Док даёт скорость, список даёт порядок: видно, что стадии
              идут друг за другом, а не лежат кучей. */}
          <ol className="lg:col-span-5 lg:order-1">
            {STAGES.map((s, i) => {
              const active = s.id === stage
              return (
                <Reveal key={s.id} y={16} delay={i * stagger.item}>
                  <li>
                    <button
                      onClick={() => setStage(s.id)}
                      aria-pressed={active}
                      className="w-full text-left flex items-baseline gap-4"
                      style={{
                        paddingBlock: 'var(--s-5)',
                        borderTop: '1px solid var(--m3-line-soft)',
                        background: 'transparent',
                      }}
                    >
                      <span
                        style={{
                          ...mono,
                          minWidth: '2.5ch',
                          color: active ? 'var(--m3-tint)' : 'var(--m3-ink-45)',
                        }}
                      >
                        {s.n}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '1.05rem',
                            fontWeight: 500,
                            letterSpacing: '-0.015em',
                            color: active ? 'var(--m3-tint)' : 'var(--m3-ink)',
                          }}
                        >
                          {s.label}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            marginTop: 4,
                            fontWeight: 300,
                            fontSize: '0.88rem',
                            lineHeight: 1.55,
                            color: 'var(--m3-ink-70)',
                          }}
                        >
                          {s.what}
                        </span>
                      </span>
                    </button>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ══ МЕТРИКИ ════════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          label="Замер · из файла"
          title="Числа берутся из файла, а не из резюме"
          lead="Всё в таблице посчитано на вашем устройстве обходом той самой геометрии, которая сейчас в кадре: треугольники и вершины — из буферов, плотность текселя — из отношения UV-площади к площади поверхности, вызовы отрисовки — показание рендерера за последний кадр. Написать «оптимизировано» может кто угодно; показать — нет."
        />
        <MetricsBoard stats={stats} stage={stage} />
      </section>

      {/* ══ БЮДЖЕТ ПОЛИГОНОВ ═══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          label="Стенд · силуэт"
          title="Полигон — это бюджет, а не оценка качества"
          lead="«Сто тысяч полигонов» само по себе не значит ни хорошо, ни плохо. Значит только одно: видно грань или уже нет. Величину, которая это решает, можно посчитать — и она посчитана ниже."
        />
        <FacetLab />
      </section>

      {/* ══ ДЕФОРМАЦИЯ ═════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          label="Стенд · изгиб"
          title="Деформацию держат рёбра"
          lead="Модель ломается в анимации не потому, что полигонов мало, а потому, что они лежат не там. Ниже — одна и та же форма при разном числе лупов в зоне сгиба."
        />
        <BendLab />
      </section>

      {/* ══ МАТЕРИАЛ ═══════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          label="Стенд · материал"
          title="Материал — это поведение света"
          lead="Шероховатость управляет шириной блика, металличность гасит собственный цвет и красит отражение. Две ручки — и пластик становится металлом, хотя цвет не изменился ни на тон."
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
                paddingTop: 'var(--s-5)',
                borderTop: '1px solid var(--m3-line-soft)',
                ...readout,
                letterSpacing: 0,
                lineHeight: 1.55,
                color: 'var(--m3-ink-70)',
              }}
            >
              {metal > 60
                ? 'Металл: собственный цвет почти погашен, весь вид держится на отражении. Ошибиться здесь дороже всего — металл выдаёт неверную развёртку мгновенно.'
                : rough < 20
                  ? 'Полированный диэлектрик: блик собран в точку, поверхность читается как лак или стекло.'
                  : 'Диэлектрик со средней шероховатостью: блик рассеян, поверхность читается как окрашенная или матовая.'}
            </p>
          </Panel>

          <div>
            <Panel style={{ padding: 'var(--s-6)', background: 'var(--m3-stage-2)' }}>
              <div style={{ maxWidth: 360, margin: '0 auto' }}>
                <LitSphere uid="mat" scheme={SCHEMES[0]} roughness={rough / 100} metalness={metal / 100} />
              </div>
            </Panel>

            <div
              className="grid gap-px sm:grid-cols-2"
              style={{
                marginTop: 'var(--s-6)',
                background: 'var(--m3-line-soft)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
              }}
            >
              {CHANNELS.map((c, i) => (
                <Reveal key={c.t} y={14} delay={i * stagger.item}>
                  <div style={{ background: 'var(--m3-panel)', padding: 'var(--s-6)', height: '100%' }}>
                    <span
                      aria-hidden
                      style={{
                        display: 'block',
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--r-sm)',
                        backgroundImage: c.swatch,
                        marginBottom: 'var(--s-4)',
                      }}
                    />
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 6 }}>
                      {c.t}
                    </h3>
                    <p style={{ fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--m3-ink-70)' }}>
                      {c.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ СВЕТ ═══════════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          label="Стенд · постановка"
          title="Свет решает, что зритель поймёт"
          lead="Один и тот же объект при трёх схемах читается как три разные вещи. Постановка — не финальная косметика, а способ сказать, что в модели главное."
        />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10 items-start">
          <Panel style={{ padding: 'var(--s-6)' }}>
            <div className="flex flex-wrap gap-2">
              {SCHEMES.map((s, i) => (
                <Chip key={s.id} active={i === si} onClick={() => setSi(i)}>
                  {s.name}
                </Chip>
              ))}
            </div>

            <motion.p
              key={scheme.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: ease.entrance }}
              style={{
                marginTop: 'var(--s-6)',
                fontWeight: 300,
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'var(--m3-ink-70)',
              }}
            >
              {scheme.note}
            </motion.p>

            <div
              style={{
                marginTop: 'var(--s-8)',
                paddingTop: 'var(--s-5)',
                borderTop: '1px solid var(--m3-line-soft)',
              }}
            >
              <span style={{ ...mono, color: 'var(--m3-ink-45)' }}>План расстановки</span>
              <div style={{ marginTop: 'var(--s-4)', maxWidth: 240 }}>
                <LightPlan scheme={scheme} />
              </div>
            </div>
          </Panel>

          <div>
            <Panel style={{ padding: 'var(--s-6)', background: 'var(--m3-stage-2)' }}>
              <div style={{ maxWidth: 360, margin: '0 auto' }}>
                <LitSphere uid="light" scheme={scheme} roughness={rough / 100} metalness={metal / 100} />
              </div>
            </Panel>
            <StageNote>
              Шар здесь схема: он показывает поведение света, не красивый кадр.
              Материал взят из предыдущего стенда — ползунки
              продолжают работать и здесь, поэтому видно главное: одна и та же
              постановка по-разному обходится с матовой поверхностью и с металлом,
              и выбирать схему в отрыве от материала бессмысленно.
            </StageNote>
          </div>
        </div>
      </section>

      {/* ══ ЧТО ОСТАЁТСЯ У ЗАКАЗЧИКА ══════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead label="Передача" title="Что остаётся у заказчика" />
        <div className="grid lg:grid-cols-12 gap-x-8">
          <div className="lg:col-span-8 lg:col-start-5">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.t} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8"
                  style={{ paddingBlock: 'var(--s-6)', borderBottom: '1px solid var(--m3-line-soft)' }}
                >
                  <span style={{ ...mono, color: 'var(--m3-tint)', minWidth: 36, paddingTop: 4 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 6 }}>
                      {d.t}
                    </h3>
                    <p style={{ fontWeight: 300, maxWidth: '48ch', color: 'var(--m3-ink-70)', lineHeight: 1.6 }}>
                      {d.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ПРОЦЕСС ════════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead label="Порядок" title="Как идёт работа" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} y={18} delay={i * stagger.item}>
              <div style={{ borderTop: '1px solid var(--m3-line)', paddingTop: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--m3-tint)' }}>{s.n}</span>
                <h3
                  style={{
                    marginTop: 'var(--s-4)',
                    marginBottom: 'var(--s-3)',
                    fontFamily: 'var(--m3-display)',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.24,
                  }}
                >
                  {s.t}
                </h3>
                <p style={{ fontWeight: 300, color: 'var(--m3-ink-70)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ФИНАЛ ══════════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <h2
              className="optical-left"
              style={{
                fontFamily: 'var(--m3-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 6vw, 4rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
              }}
            >
              <SplitText text="Модель живёт дольше кадра" by="word" />
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
                Картинку можно переснять за вечер. Объект, который встаёт в чужую
                сцену без разворотов, гнётся без изломов и держит крупный план, —
                нельзя. Разница закладывается на ретопологии, а не на финальном
                рендере.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Reveal y={16} delay={0.28}>
              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-full"
                style={{
                  border: '1px solid var(--m3-line)',
                  color: 'var(--m3-ink)',
                  paddingInline: 'var(--s-8)',
                  paddingBlock: 'var(--s-4)',
                  ...mono,
                }}
              >
                {/* Заливка — scaleY отдельного слоя. Переход по background
                    стоил бы paint на каждом кадре наведения. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
                  style={{
                    background: 'var(--m3-tint)',
                    transition: `transform ${duration.base}s ${cssEase.standard}`,
                  }}
                />
                <span className="relative">← Вернуться к услугам</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ ДОК СТАДИЙ ═════════════════════════════════════════════════
          Управление остаётся с посетителем на всём экране, а не живёт в
          одной секции: смысл в том, что одно решение меняет объект, текст,
          температуру и метрики одновременно, — а увидеть это можно только
          если переключатель доступен в любом контексте.

          На 390px шесть кнопок в строку не помещаются, поэтому строка
          прокручивается по горизонтали. Прокрутка живёт внутри самого дока:
          overflow на общем предке отключил бы липкость стенда выше. */}
      <div
        /* На узком экране док поднят: в левом нижнем углу сайта живёт
           мини-плеер, и на 390px широкая полоса стадий налезала на него.
           На sm+ док узкий относительно ширины экрана и не конфликтует. */
        className="fixed left-1/2 bottom-[5.5rem] sm:bottom-6 w-full"
        style={{
          zIndex: 'var(--z-nav)',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100vw - 1.5rem)',
          // Полоса растянута на всю ширину только ради центровки — клики
          // мимо дока должны доставать до страницы под ним.
          pointerEvents: 'none',
        }}
      >
        <div
          className="mx-auto flex items-center gap-3 rounded-full backdrop-blur w-fit max-w-full"
          style={{
            border: '1px solid var(--m3-line)',
            background: 'rgba(23, 18, 14, 0.88)',
            paddingInline: 'var(--s-4)',
            paddingBlock: 'var(--s-3)',
            boxShadow: '0 20px 40px -24px rgba(0,0,0,0.8)',
            pointerEvents: 'auto',
          }}
        >
          <span className="hidden md:inline shrink-0" style={{ ...mono, color: 'var(--m3-ink-45)' }}>
            Стадия
          </span>
          <div ref={dockRef} className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {STAGES.map((s) => {
              const active = s.id === stage
              return (
                <button
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  aria-pressed={active}
                  aria-label={`Стадия ${s.n}: ${s.label}`}
                  title={s.label}
                  className="shrink-0 rounded-full"
                  style={{
                    ...mono,
                    letterSpacing: '0.1em',
                    padding: '0.5rem 0.7rem',
                    border: `1px solid ${active ? s.tint : 'transparent'}`,
                    // Цвет стадии стоит прямо на кнопке: во вьюпорте проходы
                    // закодированы цветом, и здесь так же.
                    color: active ? s.tint : 'var(--m3-ink-45)',
                    background: active ? 'rgba(242, 236, 225, 0.06)' : 'transparent',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                    transition: `transform ${duration.fast}s ${cssEase.standard}`,
                  }}
                >
                  {s.short}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
