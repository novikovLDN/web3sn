import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS = ['Дизайн', 'Создание', 'Вдохновение']
const DURATION = 2700

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void
}) {
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
    const id = window.setInterval(
      () => setWordIndex((i) => (i + 1) % WORDS.length),
      900
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0C0C0C] flex flex-col justify-between p-6 md:p-10"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Верх */}
      <motion.span
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs text-[#888] uppercase tracking-[0.3em]"
      >
        Портфолио
      </motion.span>

      {/* Центр — ротация слов */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-medium uppercase tracking-tight text-[#D7E2EA]/80"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Низ — счётчик */}
      <div className="flex items-end justify-end">
        <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#D7E2EA] tabular-nums leading-none">
          {String(count).padStart(3, '0')}
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1e1e1e]">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(182, 0, 168, 0.45)',
          }}
        />
      </div>
    </motion.div>
  )
}
