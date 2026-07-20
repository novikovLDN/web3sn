/**
 * Единый источник правды для всего движения на сайте.
 *
 * Правило проекта: ни один компонент не задаёт свою кривую или длительность
 * «на глаз». Всё берётся отсюда. Это то, что отличает дорогую работу от
 * набора разрозненных анимаций — движение читается как один почерк.
 *
 * Основа — кривые, на которых построена анимация iOS/macOS и работы студий
 * уровня Locomotive/Active Theory. Общий принцип: быстрый старт, длинный
 * мягкий выход. Резкий вход даёт ощущение отзывчивости, длинный выход —
 * ощущение веса и дороговизны.
 */

// ── Кривые ────────────────────────────────────────────────────────────
// Значения — cubic-bezier. Держим и как кортеж (framer-motion),
// и как строку (CSS), чтобы не расходились.

export const ease = {
  /** Основная кривая интерфейса. Apple-подобный standard ease-out. */
  standard: [0.32, 0.72, 0, 1],
  /** Появление контента: почти без входного разгона, долгий выход. */
  entrance: [0.16, 1, 0.3, 1],
  /** Уход контента: быстрый, чтобы не задерживать пользователя. */
  exit: [0.7, 0, 0.84, 0],
  /** Сдержанный «дорогой» ease-in-out для крупных блоков и переходов. */
  editorial: [0.65, 0, 0.35, 1],
  /** Мягкая пружинность без overshoot — для hover и мелких состояний. */
  soft: [0.4, 0, 0.2, 1],
  /** Лёгкий overshoot. Только для акцентов, никогда для текста. */
  overshoot: [0.34, 1.56, 0.64, 1],
  /** Линейная — исключительно для бесконечных marquee/вращений. */
  linear: [0, 0, 1, 1],
} as const

export type EaseName = keyof typeof ease

/** Та же кривая строкой для CSS transition/animation. */
export const cssEase = Object.fromEntries(
  Object.entries(ease).map(([k, v]) => [k, `cubic-bezier(${v.join(', ')})`])
) as Record<EaseName, string>

// ── Длительности ──────────────────────────────────────────────────────
// Шкала, а не произвольные числа. Кратность ~1.5 между ступенями.
// Секунды — framer-motion работает в секундах.

export const duration = {
  /** Мгновенная обратная связь: смена цвета, подсветка. */
  instant: 0.12,
  /** Микровзаимодействия: hover, focus, мелкие сдвиги. */
  fast: 0.24,
  /** База для большинства переходов состояния. */
  base: 0.4,
  /** Появление блоков контента. */
  slow: 0.65,
  /** Крупные композиционные движения, разворот секций. */
  slower: 0.95,
  /** Переходы между экранами, кинематографичные моменты. */
  cinematic: 1.4,
} as const

// ── Пружины ───────────────────────────────────────────────────────────
// Для всего, что следует за курсором или прямым вводом пользователя.
// Пружина всегда честнее кривой там, где движение может быть прервано.

export const spring = {
  /** Курсор, магнитные элементы — должно «догонять» без запаздывания. */
  cursor: { type: 'spring', stiffness: 520, damping: 40, mass: 0.6 },
  /** Мелкие интерактивные элементы: кнопки, чипы. */
  snappy: { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 },
  /** База для панелей и карточек — вес чувствуется, но не тормозит. */
  gentle: { type: 'spring', stiffness: 180, damping: 26, mass: 1 },
  /** Крупные тяжёлые блоки, параллакс. */
  heavy: { type: 'spring', stiffness: 90, damping: 22, mass: 1.4 },
  /** Сглаживание scroll-linked значений (useSpring над useScroll). */
  scroll: { stiffness: 140, damping: 30, mass: 0.9, restDelta: 0.0005 },
} as const

// ── Ритм появления ────────────────────────────────────────────────────
// Stagger — главный инструмент «дорогого» ощущения. Слишком большой шаг
// читается как лаг, слишком малый — как отсутствие композиции.

export const stagger = {
  /** Буквы в заголовке. */
  letter: 0.018,
  /** Слова в строке. */
  word: 0.045,
  /** Строки текста. */
  line: 0.075,
  /** Элементы списка/сетки. */
  item: 0.09,
  /** Крупные блоки секции. */
  block: 0.14,
} as const

// ── Готовые варианты для framer-motion ────────────────────────────────

/** Проявление снизу — базовый приём появления контента. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
} as const

/** Контейнер, раскрывающий детей по очереди. */
export const staggerContainer = (step: number = stagger.item, delay = 0) =>
  ({
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  }) as const

/**
 * Маска-шторка для строки текста. Родитель — overflow:hidden,
 * ребёнок уезжает под него. Даёт «печатный» реветь без размытия шрифта.
 */
export const maskLine = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: duration.slower, ease: ease.entrance },
  },
} as const

/** Появление символа в заголовке — с лёгким разворотом по вертикали. */
export const maskChar = {
  hidden: { y: '105%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.entrance },
  },
} as const

/** Масштаб «из глубины» — для медиа и карточек. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.cinematic, ease: ease.entrance },
  },
} as const

// ── Порог появления ───────────────────────────────────────────────────
// Единый viewport-конфиг: анимация играет один раз, когда элемент
// действительно вошёл в кадр, а не когда его край коснулся границы.

export const inView = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' } as const

// ── Уважение к системным настройкам ───────────────────────────────────

/** Пользователь просил меньше движения? Отвечаем честно. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Обёртка над transition: при reduced-motion схлопывает длительность
 * почти в ноль, сохраняя конечное состояние. Контент остаётся доступным.
 */
export function respectMotion<T extends { duration?: number }>(t: T): T {
  return prefersReducedMotion() ? { ...t, duration: 0.001 } : t
}
