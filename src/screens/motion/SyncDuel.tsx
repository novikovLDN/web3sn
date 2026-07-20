/**
 * Раздел «РИТМ» — до и после, запуск в один кадр.
 *
 * ЗАЧЕМ ИМЕННО СРАВНЕНИЕ
 * ──────────────────────
 * Компетенция моушн-дизайнера доказывается сравнением, а не демонстрацией.
 * Показать красивое появление может кто угодно; показать рядом плохое может
 * только тот, кто уверен в хорошем и умеет объяснить разницу. Здесь одна и та
 * же композиция, собранная из одних и тех же прямоугольников, появляется
 * дважды и стартует одновременно с одной кнопки — иначе сравнение превратится
 * в «посмотрите ещё раз, теперь лучше».
 *
 * Слева: линейная кривая, короткая длительность, все слои стартуют вместе.
 * Ровно то, что получается по умолчанию, когда движение не проектировали.
 * Справа: ease.entrance и stagger.item 0.09 — оба значения из
 * src/design/motion.ts, ни одного числа «на глаз».
 *
 * ПОЧЕМУ ЗДЕСЬ НЕ ДЕЙСТВУЕТ КРИВАЯ ЭКРАНА
 * ───────────────────────────────────────
 * Это единственный раздел, который --m-ease не слушается, и это осознанно:
 * кривая здесь не оформление, а предмет сравнения. Если бы правая сторона
 * ехала по выбранной посетителем кривой, выбрав linear, он получил бы два
 * одинаковых прогона и раздел перестал бы что-либо доказывать. Управление
 * панелью при этом видно на всём остальном: заголовке, подписях, кнопке.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Оба прогона — framer-motion по opacity и y, больше ничего. Перезапуск
 * сменой key: честный повторный монтаж с initial-состояния, без ручного
 * сброса стилей и форсированных reflow.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { duration, ease, stagger } from '../../design/motion'
import { mono, monoNum } from './palette'
import { Reveal, RunButton, SectionHead, usePrefersReducedMotion } from './primitives'

/* ── Две раскладки времени. Только они и различаются. ─────────────── */
type Recipe = {
  side: 'left' | 'right'
  title: string
  ease: [number, number, number, number]
  dur: number
  step: number
  spec: string
  verdict: string
}

const WITHOUT: Recipe = {
  side: 'left',
  title: 'Без системы',
  ease: [...ease.linear] as [number, number, number, number],
  dur: duration.fast,
  step: 0,
  spec: 'linear · 240 мс · шаг 0',
  verdict:
    'Все слои приходят одновременно и с постоянной скоростью. Блок не появляется — он включается, как лампочка. Читать в нём нечего: порядок не задан, вес не показан.',
}

const WITH: Recipe = {
  side: 'right',
  title: 'По системе',
  ease: [...ease.entrance] as [number, number, number, number],
  dur: duration.slow,
  step: stagger.item,
  spec: 'ease.entrance · 650 мс · stagger.item 0.09',
  verdict:
    'Слои идут по очереди и тормозят на подходе. Порядок появления и есть иерархия: глаз получает подсказку, что читать первым, ещё до того, как прочитает.',
}

/** Слои демонстрационной композиции. Содержание вторично — важен их порядок. */
const LAYERS = [
  { w: '38%', h: 9, tone: 'ember' },
  { w: '84%', h: 22, tone: 'chalk' },
  { w: '68%', h: 8, tone: 'dim' },
  { w: '52%', h: 8, tone: 'dim' },
  { w: '34%', h: 26, tone: 'sea' },
] as const

const TONE = {
  ember: 'var(--m-ember)',
  chalk: 'var(--m-sea-60)',
  dim: 'var(--m-line)',
  sea: 'var(--m-sea-35)',
} as const

function Composition({ r, runKey, reduced }: { r: Recipe; runKey: number; reduced: boolean }) {
  return (
    <div
      className="rounded-2xl h-full flex flex-col"
      style={{
        background: 'var(--m-panel)',
        border: `1px solid ${r.side === 'right' ? 'var(--m-sea-35)' : 'var(--m-line)'}`,
        padding: 'var(--s-6)',
      }}
    >
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <span style={{ ...mono, color: r.side === 'right' ? 'var(--m-sea)' : 'var(--m-faint)' }}>
          {r.title}
        </span>
      </div>
      <span className="block mb-6" style={{ ...monoNum, color: 'var(--m-faint)' }}>
        {r.spec}
      </span>

      {/* Сцена. Фиксированная высота: иначе перезапуск дёргал бы раскладку
          соседа, и синхронность старта стала бы незаметной. */}
      <motion.div
        key={runKey}
        className="flex flex-col gap-3 justify-center"
        style={{ minHeight: 190 }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : r.step } } }}
      >
        {LAYERS.map((l, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="block rounded"
            style={{ width: l.w, height: l.h, background: TONE[l.tone] }}
            variants={{
              hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: reduced ? 0 : r.dur, ease: r.ease },
              },
            }}
          />
        ))}
      </motion.div>

      <p
        className="mt-6 pt-5 font-light"
        style={{
          borderTop: '1px solid var(--m-line-soft)',
          color: 'var(--m-dim)',
          fontSize: '0.88rem',
          lineHeight: 1.55,
        }}
      >
        {r.verdict}
      </p>
    </div>
  )
}

export default function SyncDuel() {
  const reduced = usePrefersReducedMotion()
  const [runKey, setRunKey] = useState(0)

  return (
    <section
      className="mx-auto w-full"
      style={{
        maxWidth: 'var(--max-w)',
        paddingInline: 'var(--gutter)',
        paddingBlock: 'var(--section-y)',
      }}
    >
      <SectionHead
        param="Ритм"
        index={3}
        total={5}
        title="Разницу видно только рядом"
        lead="Одна композиция, два расписания. Слева — то, что получается само собой: линейная кривая, короткая длительность, общий старт. Справа — те же слои по системе. Запуск общий: сравнивать по памяти нельзя, память всегда на стороне второго показа."
        hint="Обе стороны стартуют в одном кадре"
      />

      <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">
        <Composition r={WITHOUT} runKey={runKey} reduced={reduced} />
        <Composition r={WITH} runKey={runKey} reduced={reduced} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <RunButton onClick={() => setRunKey((k) => k + 1)}>▶ Запустить обе</RunButton>
        <span style={{ ...monoNum, color: 'var(--m-faint)' }}>
          Кривые и шаг — из design/motion.ts, произвольных чисел нет
        </span>
      </div>

      <Reveal y={14}>
        <p
          className="mt-8 max-w-[62ch] font-light"
          style={{ color: 'var(--m-dim)', fontSize: '0.92rem', lineHeight: 1.62 }}
        >
          Шаг между слоями держится в рабочем диапазоне не по вкусу, а по
          бюджету: вся волна обязана укладываться примерно в 0,6 секунды.
          Пять слоёв с шагом 0,09 дают 0,36 с плюс длительность последнего —
          на границе. Тридцать слоёв с тем же шагом дали бы почти три секунды,
          в течение которых страница выглядит подвисшей, а не ритмичной.
        </p>
      </Reveal>
    </section>
  )
}
