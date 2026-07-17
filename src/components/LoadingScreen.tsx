import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS = ['Motion-дизайн', '3D', 'Кодинг', 'Брендинг']
const DURATION = 3800

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    let raf = 0
    let start: number | null = null
    // мягкое ускорение-замедление прогресса
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / DURATION, 1)
      setCount(Math.round(ease(p) * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        window.setTimeout(onComplete, 450)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  useEffect(() => {
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 1200)
    return () => window.clearInterval(id)
  }, [])

  // круговой прогресс
  const R = 54
  const C = 2 * Math.PI * R
  const offset = C * (1 - count / 100)

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--ink)] flex flex-col justify-between p-6 md:p-10 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* мягкое свечение по центру */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 44%, rgba(239,74,35,0.13), transparent 58%)' }}
      />

      {/* Верхний ряд */}
      <div className="relative z-10 flex items-start justify-between">
        <motion.span
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-heading font-bold uppercase tracking-tight text-xl md:text-2xl"
        >
          NOVIKOV<span className="text-[var(--accent)]">.</span>
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[10px] md:text-xs text-[var(--cream-dim)] uppercase tracking-[0.3em] text-right leading-relaxed"
        >
          Загружаем
          <br />
          портфолио
        </motion.span>
      </div>

      {/* Центр: круговой прогресс + слово */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-9">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-36 h-36 md:w-44 md:h-44"
        >
          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(236,231,219,0.12)" strokeWidth="2" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
          </svg>
          {/* пульсирующее ядро */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full animate-soft-pulse"
              style={{
                background: 'radial-gradient(circle at 35% 30%, var(--accent-2), var(--accent) 60%, #b8360f 100%)',
                boxShadow: '0 12px 40px -6px rgba(239,74,35,0.5)',
              }}
            />
          </div>
        </motion.div>

        <div className="h-9 md:h-12 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-[var(--cream)]"
            >
              {WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Нижний ряд */}
      <div className="relative z-10 flex items-end justify-between">
        <span className="text-[var(--cream-dim)] text-[10px] md:text-xs uppercase tracking-[0.28em] mb-2 md:mb-3 max-w-[120px] leading-relaxed">
          3D · Motion · Код
        </span>
        <span className="font-bold text-[var(--cream)] tabular-nums leading-none flex items-start" style={{ fontSize: 'clamp(4rem, 14vw, 10rem)' }}>
          {String(count).padStart(2, '0')}
          <span className="text-[var(--accent)] text-[0.35em] mt-2 ml-1">%</span>
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#241f1b]">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            background: 'var(--accent)',
            boxShadow: '0 0 12px rgba(239,74,35,0.7)',
            transition: 'transform 0.15s linear',
          }}
        />
      </div>
    </motion.div>
  )
}
