import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue } from 'framer-motion'
import { C, EASE, DISPLAY } from './palette'

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

export function Reveal({ children, className, style, delay = 0 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div className={className} style={style} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </motion.div>
  )
}

export function WordReveal({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.p className={className} style={style} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="inline-block mr-[0.26em]" variants={{ hidden: { opacity: 0, y: 22, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } } }}>
          {w}
        </motion.span>
      ))}
    </motion.p>
  )
}

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const t0 = performance.now()
    const dur = 1500
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{v.toLocaleString('ru-RU')}{suffix}</span>
}

/* ── Кинетическая бегущая строка ────────────────────────────────── */
export function Kinetic({ text, dir, color, size = 'clamp(3rem,11vw,9rem)', op = 1 }: { text: string; dir: 'l' | 'r'; color: string; size?: string; op?: number }) {
  const row = Array.from({ length: 5 }, () => text)
  return (
    <div className="overflow-hidden" style={{ opacity: op }}>
      <div className="flex w-max animate-marquee" style={dir === 'r' ? { animationDirection: 'reverse' } : undefined}>
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-bold uppercase tracking-tight px-5 whitespace-nowrap" style={{ fontSize: size, color, lineHeight: 1, ...DISPLAY }}>
                {t} <span style={{ color: C.ember }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Easing ─────────────────────────────────────────────────────── */
export const EASES = [
  { name: 'Linear', css: 'linear', path: 'M0 60 L120 0' },
  { name: 'Ease-out', css: 'cubic-bezier(0.16,1,0.3,1)', path: 'M0 60 C20 0 40 0 120 0' },
  { name: 'Ease-in-out', css: 'cubic-bezier(0.65,0,0.35,1)', path: 'M0 60 C60 60 60 0 120 0' },
  { name: 'Spring', css: 'cubic-bezier(0.34,1.56,0.64,1)', path: 'M0 60 C40 60 55 -18 120 0' },
]

/* ── Магнитная кнопка (тянется к курсору) ───────────────────────── */
export function Magnetic({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.4)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y, ...style }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}
