import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { duration, ease, spring, stagger, inView as inViewCfg } from '../../design/motion'
import { DISPLAY } from './palette'

/** true, если пользователь просил уменьшить анимацию. Реактивен к смене настройки. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  y?: number
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewCfg}
      transition={{ duration: reduced ? 0 : duration.slow, ease: ease.entrance, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Пословное появление крупного текста.
 *
 * Слово выезжает из-под маски: обёртка с overflow:hidden, движется вложенный
 * span. Прежняя версия дополнительно анимировала filter: blur — от него
 * отказались по двум причинам: blur заставляет браузер перерисовывать текст
 * на каждом кадре (это не композиторское свойство), и он же размывает шрифт
 * ровно в тот момент, когда читатель пытается его прочесть.
 */
export function WordReveal({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = usePrefersReducedMotion()

  // При reduced-motion отдаём обычный текст: сотня лишних узлов в DOM
  // не нужна тому, кто отключил движение.
  if (reduced) {
    return (
      <p className={className} style={style}>
        {text}
      </p>
    )
  }

  return (
    <motion.p
      className={className}
      style={style}
      aria-label={text}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.word } } }}
      initial="hidden"
      whileInView="show"
      viewport={inViewCfg}
    >
      {text.split(' ').map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-top mr-[0.26em]"
          // Свесы литер (у, р, д) обрезались бы маской по базовой линии —
          // компенсируем вертикальным запасом и втягиваем его обратно.
          style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: duration.slower, ease: ease.entrance } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}

/* ── Кинетическая бегущая строка ──────────────────────────────────
   Два одинаковых блока и сдвиг на -50% — единственный способ получить
   бесшовный цикл без пересчёта ширины в JS.

   ВАЖНО: суммарная ширина обязана оставаться в пределах ~12000px.
   Выше начинается предел max texture size у GPU, и слой просто перестаёт
   отрисовываться на реальных машинах. Отсюда всего три повтора в блоке. */
export function Kinetic({
  text,
  dir,
  color,
  size = 'clamp(0.9rem, 2vw, 1.4rem)',
  op = 1,
}: {
  text: string
  dir: 'l' | 'r'
  color: string
  size?: string
  op?: number
}) {
  const row = [0, 1, 2]
  return (
    <div className="overflow-hidden" style={{ opacity: op }}>
      <div className="flex w-max animate-marquee" style={dir === 'r' ? { animationDirection: 'reverse' } : undefined}>
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((i) => (
              <span
                key={i}
                className="font-medium uppercase whitespace-nowrap px-6"
                style={{ fontSize: size, color, lineHeight: 1, letterSpacing: '0.08em', ...DISPLAY }}
              >
                {text}
                <span className="px-6" style={{ color: 'var(--m-ember)' }}>
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Магнитная кнопка ─────────────────────────────────────────────
   На пружине, а не на кривой: движение может быть прервано в любой момент,
   и только пружина отрабатывает это без рывка. На тач-устройствах курсора
   нет — там эффект отключён целиком. */
export function Magnetic({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced)
  }, [reduced])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring.snappy)
  const sy = useSpring(y, spring.snappy)

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onPointerMove={(e) => {
        if (!enabled || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={enabled ? { x: sx, y: sy, ...style } : style}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: duration.fast, ease: ease.soft }}
      className={className}
    >
      {children}
    </motion.button>
  )
}
