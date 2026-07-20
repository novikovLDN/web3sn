/**
 * Общая механика Motion-экрана.
 *
 * ГЛАВНОЕ ЗДЕСЬ — КРИВАЯ ЭКРАНА
 * ─────────────────────────────
 * На экране есть одно персистентное состояние, которым управляет посетитель:
 * кривая. Она живёт в двух видах одновременно, и оба нужны:
 *
 *   • как CSS-переменная --m-ease на корне <main> — по ней идут все CSS-переходы
 *     (наведения, смена состояния кнопок, подсветки, прогоны инструментов);
 *   • как контекст React — по ней идут все появления на framer-motion.
 *
 * Без второй половины «весь экран двигается по выбранной кривой» было бы
 * рекламным преувеличением: появления секций — самое заметное движение
 * на странице, и они обязаны подчиняться тому же выбору.
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { duration, ease, inView as inViewCfg } from '../../design/motion'
import { T, mono } from './palette'

/* ── Набор кривых экрана ──────────────────────────────────────────
   Это не витрина easing, а полный именованный набор из design/motion.ts —
   тот самый, на котором построено движение всего сайта. Названия оставлены
   как в коде: названный easing в тексте читается как язык профессионала
   и здесь ничего не стоит, потому что система уже именована.

   Linear включён намеренно: без него сравнивать не с чем, а весь экран
   держится на сравнении. Overshoot включён потому, что демонстрация кривых
   и есть содержание этого экрана — на главной он не используется. */
export type Curve = {
  id: string
  /** Имя ровно как ключ в design/motion.ts. */
  name: string
  /** Что эта кривая делает в системе. */
  role: string
  /** Что она делает с характером экрана, когда выбрана глобально. */
  feel: string
  v: [number, number, number, number]
}

export const CURVES: Curve[] = [
  {
    id: 'standard',
    name: 'ease.standard',
    role: 'База интерфейса',
    feel: 'Резкий старт, длинный выход. Экран отвечает мгновенно и оседает мягко.',
    v: [...ease.standard] as [number, number, number, number],
  },
  {
    id: 'entrance',
    name: 'ease.entrance',
    role: 'Появление контента',
    feel: 'Почти без разгона. Всё уже приехало, пока вы дочитывали строку.',
    v: [...ease.entrance] as [number, number, number, number],
  },
  {
    id: 'editorial',
    name: 'ease.editorial',
    role: 'Крупные блоки и шторки',
    feel: 'Симметричный вход и выход. Движение приобретает вес полотна, а не элемента.',
    v: [...ease.editorial] as [number, number, number, number],
  },
  {
    id: 'exit',
    name: 'ease.exit',
    role: 'Уход контента',
    feel: 'Долгая заминка и рывок в конце. На появлениях читается как задержка ввода.',
    v: [...ease.exit] as [number, number, number, number],
  },
  {
    id: 'overshoot',
    name: 'ease.overshoot',
    role: 'Только акценты, никогда текст',
    feel: 'Перелёт за цель. Одна кнопка — характер, весь экран — суетливость.',
    v: [...ease.overshoot] as [number, number, number, number],
  },
  {
    id: 'linear',
    name: 'ease.linear',
    role: 'Только бесконечные циклы',
    feel: 'Постоянная скорость. Ничто не разгоняется и не тормозит — механика без веса.',
    v: [...ease.linear] as [number, number, number, number],
  },
]

/* ── Контекст кривой ──────────────────────────────────────────────── */

const EaseContext = createContext<Curve>(CURVES[0])

export function EaseProvider({ curve, children }: { curve: Curve; children: ReactNode }) {
  return <EaseContext.Provider value={curve}>{children}</EaseContext.Provider>
}

/** Текущая кривая экрана. Меняется только из CurveDock. */
export function useScreenCurve() {
  return useContext(EaseContext)
}

/** Та же кривая строкой для inline-CSS. */
export function curveCss(c: Curve) {
  return `cubic-bezier(${c.v.join(', ')})`
}

/* ── Уважение к системной настройке ──────────────────────────────
   Реактивен к смене настройки: пользователь может включить «меньше
   движения» не выходя со страницы. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * Решатель cubic-bezier.
 *
 * Нужен там, где кадр не проигрывается, а считается: чтобы нарисовать график
 * кривой и показать положение объекта в произвольный момент, надо уметь
 * получать значение кривой, а не отдавать её браузеру. Ньютон по x за шесть
 * итераций — тот же метод, что внутри движка анимаций; точности 1e-5 хватает,
 * расхождения с нативным переходом на глаз нет.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) {
      const err = sampleX(t) - x
      if (Math.abs(err) < 1e-5) break
      const d = slopeX(t)
      // Плоский участок: деление на почти ноль выбросило бы t за пределы.
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    return sampleY(Math.min(1, Math.max(0, t)))
  }
}

/**
 * График кривой в квадрате «от 0 до 1».
 *
 * Путь строится из самих контрольных точек, а не хранится строкой: рисованные
 * вручную пути расходились бы со значениями при первой же правке motion.ts.
 * В системе координат SVG ось Y смотрит вниз, поэтому точка (x, y) кривой
 * лежит в (x·100, 100 − y·100). Поля viewBox сверху и снизу — запас под
 * overshoot: без них перелёт обрезался бы и перестал читаться как перелёт.
 */
export function CurveGraph({
  v,
  active,
  size = 96,
}: {
  v: [number, number, number, number]
  active: boolean
  size?: number
}) {
  const [x1, y1, x2, y2] = v
  const d = `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`
  return (
    <svg
      viewBox="-4 -34 108 168"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      style={{ display: 'block' }}
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="var(--m-line)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke={active ? 'var(--m-ember)' : 'var(--m-sea-60)'}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ── Появление блока ──────────────────────────────────────────────
   Собственный Reveal, а не общий из design/primitives: общий жёстко
   зашивает ease.entrance, и тогда обещание «весь экран двигается по
   выбранной кривой» не выполнялось бы на самом заметном движении страницы. */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 22,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  y?: number
}) {
  const reduced = usePrefersReducedMotion()
  const curve = useScreenCurve()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewCfg}
      transition={{
        duration: reduced ? 0 : duration.slow,
        delay: reduced ? 0 : delay,
        ease: curve.v,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ── Заголовок раздела-закона ─────────────────────────────────────
   МАРКИРОВКА РАЗДЕЛОВ: почему не 01 / 02 / 03.
   Исследование помечает сквозную нумерацию как признак шаблонности, и на этом
   экране от неё есть что выиграть, а не только чем пожертвовать. Порядковый
   номер сообщает единственное — «сколько ещё осталось». Здесь вместо него
   стоит имя параметра, которым раздел управляет (ДЛИТЕЛЬНОСТЬ, КРИВАЯ, РИТМ,
   КАДР, СКРОЛЛ): на экране, чей тезис — «движение это параметры, а не
   украшение», маркер раздела обязан называть параметр. Порядок при этом
   не теряется: его несёт риска из делений справа, где текущее подсвечено.
   Считать по ней можно, но она не превращает разделы в пункты списка.

   Заголовок — утверждение, а не назывное словосочетание: под ним стоит
   инструмент, и ему нужно что-то доказывать. */
export function SectionHead({
  param,
  index,
  total,
  title,
  lead,
  hint,
}: {
  param: string
  index: number
  total: number
  title: string
  lead?: string
  hint?: string
}) {
  return (
    <header className="mb-10 md:mb-14">
      <Reveal y={14}>
        <div
          className="flex flex-wrap items-baseline gap-x-5 gap-y-3 pb-4"
          style={{ borderBottom: '1px solid var(--m-line)' }}
        >
          <span style={{ ...mono, color: 'var(--m-ember)' }}>{param}</span>
          <h2 style={{ ...T.h2, color: 'var(--m-chalk)', fontFamily: 'var(--m-display)' }}>
            {title}
          </h2>
          <span className="ml-auto flex items-center gap-1.5" aria-label={`Раздел ${index} из ${total}`}>
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                aria-hidden
                style={{
                  display: 'block',
                  width: i + 1 === index ? 16 : 6,
                  height: 2,
                  background: i + 1 === index ? 'var(--m-ember)' : 'var(--m-line)',
                }}
              />
            ))}
          </span>
        </div>
      </Reveal>
      {lead && (
        <Reveal y={12} delay={0.06}>
          <p
            className="mt-5 max-w-[58ch] font-light"
            style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
          >
            {lead}
          </p>
        </Reveal>
      )}
      {hint && (
        <Reveal y={10} delay={0.1}>
          <p className="mt-4" style={{ ...mono, color: 'var(--m-sea)' }}>
            {hint}
          </p>
        </Reveal>
      )}
    </header>
  )
}

/* ── Кнопка прогона ───────────────────────────────────────────────
   Один вид на все инструменты экрана: если «проиграть» выглядит в каждом
   разделе по-своему, посетитель каждый раз заново ищет, за что тянуть.
   Переход по кривой экрана — на самой кнопке видно, что выбор действует. */
export function RunButton({
  onClick,
  children = '▶ Проиграть',
  wide = false,
}: {
  onClick: () => void
  children?: ReactNode
  wide?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full"
      style={{
        ...mono,
        color: 'var(--m-abyss)',
        background: 'var(--m-ember)',
        paddingInline: wide ? 'var(--s-8)' : 'var(--s-6)',
        paddingBlock: 'var(--s-3)',
        // Только transform и opacity: заливка постоянна, меняется масштаб.
        transition: `transform var(--d-fast) var(--m-ease)`,
      }}
      onPointerEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.04)'
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}

/**
 * Гейт по видимости.
 *
 * Возвращает [ref, visible]. Нужен везде, где иначе пришлось бы держать
 * rAF или измерения включёнными постоянно: rAF и getBoundingClientRect
 * каждый кадр — измеренная на этом проекте причина падения fps, и платить
 * за них имеет смысл только пока блок в кадре.
 */
export function useInViewGate<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: amount,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [amount])
  return [ref, visible] as const
}
