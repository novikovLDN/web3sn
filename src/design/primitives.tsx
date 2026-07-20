/**
 * Примитивы движения. Небольшой набор компонентов, из которых собирается
 * весь сайт — чтобы почерк анимации был один на всех экранах.
 *
 * Все они соблюдают три правила производительности:
 *  1. Анимируются только transform и opacity — свойства, которые браузер
 *     считает на композиторе, не трогая layout и paint. Это условие 120fps.
 *  2. will-change ставится на время движения и снимается после. Постоянный
 *     слой — это утечка GPU-памяти, а не оптимизация.
 *  3. При prefers-reduced-motion движение схлопывается, но контент остаётся.
 */

import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type ElementType,
  type CSSProperties,
} from 'react'
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion'
import {
  ease,
  duration,
  stagger,
  spring,
  inView as inViewCfg,
  prefersReducedMotion,
} from './motion'

// ── Кэш motion-компонентов ────────────────────────────────────────────
// motion(Tag) обязан вызываться вне рендера: каждый вызов возвращает новый
// тип компонента, а смена типа для React означает полное пересоздание
// поддерева. Кэшируем по имени тега на весь модуль.

const tagCache = new Map<string, ReturnType<typeof motion>>()

function motionTag(as: ElementType) {
  const key = typeof as === 'string' ? as : 'div'
  let cached = tagCache.get(key)
  if (!cached) {
    cached = motion(key as ElementType)
    tagCache.set(key, cached)
  }
  return cached as ElementType
}

// ── Reveal ────────────────────────────────────────────────────────────

type RevealProps = {
  children: ReactNode
  /** Задержка в секундах — для ручной оркестровки внутри секции. */
  delay?: number
  /** Дистанция подъёма в px. 0 — только прозрачность. */
  y?: number
  x?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  duration?: number
}

/**
 * Базовое появление блока при входе в кадр.
 * Заменяет прежний FadeIn: та же роль, но кривая и длительность берутся
 * из общей системы, а не задаются в каждом вызове заново.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  as = 'div',
  className,
  style,
  duration: d = duration.slow,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()
  // motion(as) внутри рендера создавал бы новый тип компонента на каждый
  // проход — React размонтировал бы поддерево целиком. Берём из статической
  // таблицы, созданной один раз на модуль.
  const MotionTag = motionTag(as)

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y, x }}
      animate={
        visible
          ? { opacity: 1, y: 0, x: 0 }
          : reduce
            ? undefined
            : { opacity: 0, y, x }
      }
      transition={{ duration: reduce ? 0 : d, delay, ease: ease.entrance }}
    >
      {children}
    </MotionTag>
  )
}

// ── SplitText ─────────────────────────────────────────────────────────

type SplitTextProps = {
  text: string
  /** Единица дробления. Слова читаются дороже букв на крупных кеглях. */
  by?: 'word' | 'char' | 'line'
  className?: string
  style?: CSSProperties
  as?: ElementType
  delay?: number
  /** Шаг между единицами. По умолчанию берётся из системы под by. */
  step?: number
}

/**
 * Текст, выезжающий из-под маски по словам/буквам.
 *
 * Приём, на котором держится почти вся премиальная типографика в вебе.
 * Ключевая деталь: маскирующий контейнер — inline-block с overflow:hidden,
 * а движется дочерний span. Никакого blur или clip-path — шрифт остаётся
 * идеально резким, а браузер анимирует чистый transform.
 */
export function SplitText({
  text,
  by = 'word',
  className,
  style,
  as: Tag = 'span',
  delay = 0,
  step,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()

  const units =
    by === 'char' ? Array.from(text) : by === 'line' ? text.split('\n') : text.split(' ')

  // Потолок суммарной задержки.
  //
  // Без него длинный абзац разваливается: 30 слов × 0.045с — это 1.35с
  // только на разбег, и последнее слово приезжает почти через 2.5 секунды
  // после появления абзаца. Пользователь читает это как подтормаживание
  // сайта, а не как выверенный ритм.
  //
  // Поэтому шаг сжимается так, чтобы вся волна укладывалась в 0.6с.
  // На коротком заголовке ограничение не срабатывает и шаг остаётся
  // штатным — ритм страдает только там, где иначе пострадала бы скорость.
  const MAX_TOTAL = 0.6
  const base = step ?? (by === 'char' ? stagger.letter : by === 'line' ? stagger.line : stagger.word)
  const gap = units.length > 1 ? Math.min(base, MAX_TOTAL / (units.length - 1)) : 0

  // При reduced-motion отдаём обычный текст — без сотни лишних узлов в DOM.
  if (reduce) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            // Свесы литер (у, р, д) обрезались бы маской по базовой линии —
            // компенсируем вертикальным запасом и втягиваем его обратно.
            paddingBottom: '0.14em',
            marginBottom: '-0.14em',
            verticalAlign: 'top',
          }}
        >
          <motion.span
            style={{
              display: 'inline-block',
              // Пробел внутри inline-block схлопывается, и при дроблении по
              // буквам «Обо мне» превращалось в «Обомне». pre сохраняет его.
              whiteSpace: 'pre',
              willChange: 'transform',
            }}
            initial={{ y: '110%' }}
            animate={visible ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: duration.slower,
              delay: delay + i * gap,
              ease: ease.entrance,
            }}
          >
            {unit}
            {by === 'word' && i < units.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// ── Magnetic ──────────────────────────────────────────────────────────

type MagneticProps = {
  children: ReactNode
  /** Сила притяжения: доля расстояния до курсора. */
  strength?: number
  /** Радиус захвата в px сверх габаритов элемента. */
  radius?: number
  className?: string
}

/**
 * Магнитный элемент: тянется к курсору и мягко возвращается.
 *
 * Работает на пружине, а не на кривой — движение может быть прервано в любой
 * момент, и только пружина отрабатывает это без рывка. Отключается на
 * тач-устройствах, где курсора нет и эффект бессмысленен.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring.snappy)
  const sy = useSpring(y, spring.snappy)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !prefersReducedMotion()
    )
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      // Зона захвата — прямоугольник элемента, расширенный на radius.
      if (Math.abs(dx) > r.width / 2 + radius || Math.abs(dy) > r.height / 2 + radius) {
        x.set(0)
        y.set(0)
        return
      }
      x.set(dx * strength)
      y.set(dy * strength)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, radius, strength, x, y])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x: sx, y: sy } : undefined}
    >
      {children}
    </motion.div>
  )
}

// ── Parallax ──────────────────────────────────────────────────────────

/**
 * Параллакс по вертикали, привязанный к прокрутке.
 *
 * Считается через один общий rAF и transform — без scroll-обработчиков,
 * дёргающих layout. Значение сглаживается пружиной, поэтому движение
 * не «залипает» на быстрой прокрутке.
 */
export function Parallax({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const offset = useMotionValue(0)
  const smooth = useSpring(offset, spring.scroll)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    // Цикл крутится ТОЛЬКО пока элемент в кадре.
    //
    // Раньше rAF работал всегда и на каждом кадре звал getBoundingClientRect —
    // а это принудительный reflow. Десяток таких компонентов на длинной
    // странице означал десяток пересчётов геометрии за кадр независимо от
    // того, видно их или нет. Замер показал разницу: 25мс против 8.3мс.
    let raf = 0
    let visible = false

    const tick = () => {
      const r = el.getBoundingClientRect()
      // Насколько центр элемента отклонён от центра экрана, в долях экрана.
      const fromCenter = r.top + r.height / 2 - window.innerHeight / 2
      offset.set(-fromCenter * speed)
      if (visible) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return
        visible = entry.isIntersecting
        if (visible) raf = requestAnimationFrame(tick)
        else cancelAnimationFrame(raf)
      },
      // Запас в пол-экрана: параллакс должен быть в нужной позиции
      // к моменту, когда элемент реально появится.
      { rootMargin: '50% 0px' }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [offset, speed])

  return (
    <motion.div ref={ref} className={className} style={{ y: smooth }}>
      {children}
    </motion.div>
  )
}

// ── useOffscreenPause ─────────────────────────────────────────────────

/**
 * Останавливает CSS-анимации внутри элемента, пока он вне экрана.
 *
 * Зачем: CSS-анимация не прекращается сама, когда элемент уходит из кадра.
 * Бесконечная бегущая строка шириной в несколько тысяч пикселей продолжает
 * двигать свой композиторский слой всё время, пока страница открыта, —
 * и платит за это каждый кадр, включая те, где её никто не видит.
 *
 * Измерено на этом проекте: постоянно работающие marquee держали медиану
 * кадра на 25мс при 8мс в режиме reduced-motion. Это была самая дорогая
 * фоновая работа на странице.
 *
 * Возвращает ref — навесить на контейнер с анимациями.
 */
export function useOffscreenPause<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.idle = entry.isIntersecting ? 'false' : 'true'
      },
      // Небольшой запас, чтобы движение уже шло к моменту появления
      // и строка не «стартовала с нуля» на глазах у пользователя.
      { rootMargin: '20% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

// ── Counter ───────────────────────────────────────────────────────────

/**
 * Число, «набегающее» до значения при появлении в кадре.
 *
 * Пишем напрямую в textContent из rAF, минуя React-стейт: перерисовка
 * компонента 60+ раз в секунду ради одной строки — верный способ
 * потерять кадры на длинной странице.
 */
export function Counter({
  to,
  suffix = '',
  prefix = '',
  duration: d = 1.8,
  className,
  style,
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el || !visible) return
    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${to}${suffix}`
      return
    }

    const start = performance.now()
    const ms = d * 1000
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1)
      // Тот же ease-out, что у появления блоков — числа и блоки живут в одном ритме.
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent = `${prefix}${Math.round(to * eased)}${suffix}`
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, to, d, prefix, suffix])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  )
}
