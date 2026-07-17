import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconGyro } from './TechIcons'

const WORDS = ['Моделинг', 'Рендер', 'Моушн', 'Брендинг']
const DURATION = 2700

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    let raf = 0
    let start: number | null = null
    const tick = (t: number) => {
      if (start === null) start = t
      const progress = Math.min((t - start) / DURATION, 1)
      setCount(Math.round(progress * 100))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        window.setTimeout(onComplete, 400)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  useEffect(() => {
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 800)
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--ink)] flex flex-col justify-between p-6 md:p-10 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Верх: имя + подпись */}
      <div className="flex items-start justify-between">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
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
          className="text-[10px] md:text-xs text-[var(--cream-dim)] uppercase tracking-[0.3em]"
        >
          Загружаем портфолио
        </motion.span>
      </div>

      {/* Центр: знак + ротация слов */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-24 h-24 md:w-32 md:h-32"
        >
          <IconGyro color="#ef4a23" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[var(--cream)]"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Низ: счётчик */}
      <div className="flex items-end justify-between">
        <span className="text-[var(--cream-dim)] text-xs uppercase tracking-[0.25em] mb-2">
          Почти готово
        </span>
        <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-[var(--cream)] tabular-nums leading-none">
          {String(count).padStart(3, '0')}
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#241f1b]">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            background: 'var(--accent)',
            boxShadow: '0 0 10px rgba(239,74,35,0.6)',
          }}
        />
      </div>
    </motion.div>
  )
}
