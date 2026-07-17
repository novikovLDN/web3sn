import { useRef, type CSSProperties } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

type AnimatedTextProps = {
  text: string
  className?: string
  style?: CSSProperties
}

/**
 * Пословное появление при скролле: каждое слово плавно проявляется
 * (opacity + лёгкий подъём) по мере прохождения своего участка прокрутки.
 * Диапазоны слов перекрываются — переход получается мягким.
 */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  })

  const words = text.split(' ')

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const start = (i / words.length) * 0.8
        const end = Math.min(1, start + 0.4)
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  range,
  progress,
}: {
  children: string
  range: [number, number]
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span style={{ opacity, y, display: 'inline-block', marginRight: '0.28em', willChange: 'opacity, transform' }}>
      {children}
    </motion.span>
  )
}
