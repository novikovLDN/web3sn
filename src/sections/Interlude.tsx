/**
 * Пауза между секциями.
 *
 * Полноэкранный провал в почти-чёрный с одной фразой. Это не декорация
 * и не «ещё один блок» — это ритмический приём.
 *
 * Зачем он нужен. Длинная страница, где секции идут одна за другой без
 * остановки, читается как поток информации: глаз не успевает поставить
 * точку и всё сливается в один такт. Дорогое ощущение создаётся обратным —
 * готовностью отдать целый экран под одну мысль. Пустое место, за которое
 * не борются, и есть самый прямой сигнал, что здесь не тесно.
 *
 * Фраза при этом обязана нести смысл. Пауза с рекламным лозунгом внутри
 * превращается в баннер и работает против себя.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { SplitText } from '../design/primitives'
import { spring, prefersReducedMotion } from '../design/motion'

type InterludeProps = {
  /** Одна мысль. Коротко — длинный текст убивает эффект паузы. */
  text: string
  /** Мелкая подпись сверху: контекст, кто говорит, откуда мысль. */
  label?: string
}

export default function Interlude({ text, label }: InterludeProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = prefersReducedMotion()

  // Текст идёт медленнее прокрутки — из-за этого пауза ощущается длиннее,
  // чем есть на самом деле, и читается как замедление, а не как пустота.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const raw = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y = useSpring(raw, spring.scroll)

  return (
    <section
      ref={ref}
      aria-label={text}
      className="relative flex items-center justify-center overflow-hidden grain"
      style={{
        // svh, а не vh: на мобильных адресная строка меняет высоту вьюпорта,
        // и на vh пауза дёргалась бы при каждом её сворачивании.
        minHeight: '78svh',
        // Глубже основного фона — провал должен читаться как смена глубины,
        // а не как ещё одна секция того же тона.
        background: 'var(--n-0)',
        paddingInline: 'var(--gutter)',
      }}
    >
      <motion.div
        style={reduce ? undefined : { y }}
        className="relative z-10 text-center"
      >
        {label && (
          <span
            className="t-mono block"
            style={{ color: 'var(--a)', marginBottom: 'var(--s-8)' }}
          >
            {label}
          </span>
        )}
        <p
          className="mx-auto"
          style={{
            maxWidth: '22ch',
            fontSize: 'var(--t-h3)',
            lineHeight: 'var(--lh-heading)',
            letterSpacing: 'var(--tr-h3)',
            fontWeight: 300,
            color: 'var(--text)',
          }}
        >
          <SplitText text={text} by="word" />
        </p>
      </motion.div>
    </section>
  )
}
