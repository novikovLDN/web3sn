/**
 * 03 · Дуэль таймингов.
 *
 * ЗАЧЕМ ЭТОТ РАЗДЕЛ
 * ─────────────────
 * «Дорого» и «дёшево» в моушне — не разные картинки, а одна и та же секунда,
 * разложенная по-разному. Доказать это описанием невозможно: читатель просто
 * поверит или не поверит. Поэтому здесь две одинаковые карточки, собранные из
 * одних и тех же прямоугольников, запускаются одновременно. Слева — то, что
 * получается по умолчанию: линейная кривая, короткая длительность, все слои
 * стартуют вместе. Справа — то же движение, разложенное по системе.
 *
 * Правая сторона управляемая: кривая, длительность и шаг между слоями
 * берутся из src/design/motion.ts, а не набираются в поле ввода. Смысл в том,
 * что ухудшить правую сторону можно только выбрав другую системную ступень —
 * произвольных чисел в инструменте нет, как их нет и в проекте.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Оба прогона — framer-motion по y/opacity/scale, ничего кроме transform и
 * opacity. Перезапуск сделан сменой key: это честный повторный монтаж с
 * initial-состояния, без ручного сброса стилей и форсированного reflow.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { duration, ease, stagger } from '../../design/motion'
import { MONO } from './palette'
import { SectionHead, usePrefersReducedMotion } from './primitives'

/* ── Управляемые оси правой стороны ───────────────────────────────
   Только ступени системы. Ни одного числа «на глаз». */
const CURVES = [
  { id: 'entrance', label: 'Entrance', v: ease.entrance },
  { id: 'standard', label: 'Standard', v: ease.standard },
  { id: 'editorial', label: 'Editorial', v: ease.editorial },
] as const

const DURATIONS = [
  { id: 'base', label: 'base', v: duration.base },
  { id: 'slow', label: 'slow', v: duration.slow },
  { id: 'slower', label: 'slower', v: duration.slower },
] as const

const STEPS = [
  { id: 'none', label: 'нет', v: 0 },
  { id: 'line', label: 'line', v: stagger.line },
  { id: 'item', label: 'item', v: stagger.item },
] as const

/** Строки демонстрационной карточки. Содержание вторично — важен их порядок. */
const ROWS = [
  { w: '58%', h: 10 },
  { w: '86%', h: 6 },
  { w: '72%', h: 6 },
]

/* ── Одна карточка ────────────────────────────────────────────────
   Внешний блок и три строки внутри — минимальная композиция, на которой
   вообще возможен внутренний ритм. Меньше слоёв — и сравнивать нечего. */
function Card({
  ease: curve,
  dur,
  step,
  tone,
}: {
  ease: readonly [number, number, number, number]
  dur: number
  step: number
  tone: string
}) {
  // Тот, кто просил меньше движения, получает конечный кадр без прогона:
  // сравнивать он будет по подписям, а не по движению.
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className="rounded-2xl p-5 md:p-6 flex flex-col gap-4"
      style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)', minHeight: 168 }}
      initial={reduced ? false : { opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduced ? 0 : dur, ease: curve as [number, number, number, number] }}
    >
      <motion.span
        className="block rounded-lg"
        style={{ width: 40, height: 40, background: tone }}
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : dur, ease: curve as [number, number, number, number], delay: reduced ? 0 : step }}
      />
      <div className="flex flex-col gap-2.5">
        {ROWS.map((r, i) => (
          <motion.span
            key={i}
            className="block rounded-full"
            style={{ width: r.w, height: r.h, background: 'var(--m-sea-35)' }}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : dur,
              ease: curve as [number, number, number, number],
              delay: reduced ? 0 : step * (i + 2),
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/** Кнопка-переключатель оси. Цвет и рамка — состояние, а не анимация. */
function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors"
      style={{
        ...MONO,
        border: `1px solid ${on ? 'var(--m-sea)' : 'var(--m-border)'}`,
        background: on ? 'var(--m-panel-2)' : 'transparent',
        color: on ? 'var(--m-chalk)' : 'var(--m-dim)',
        transitionDuration: 'var(--d-fast)',
        transitionTimingFunction: 'var(--e-standard)',
      }}
    >
      {children}
    </button>
  )
}

export default function TimingDuel() {
  const reduced = usePrefersReducedMotion()
  const [run, setRun] = useState(0)
  const [ci, setCi] = useState(0)
  const [di, setDi] = useState(1)
  const [si, setSi] = useState(1)

  const curve = CURVES[ci]
  const dur = DURATIONS[di]
  const step = STEPS[si]

  /* Полное время правой стороны: последний слой стартует на шаге × 4.
     Цифра показана намеренно — она же упирается в потолок из раздела 04. */
  const total = dur.v + step.v * 4

  return (
    <section id="m-duel" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-6xl">
        <SectionHead
          n="03"
          title="Дёшево и дорого — это одна секунда"
          note="Обе стороны запускаются вместе"
          lead="Слева и справа одна и та же карточка из одних и тех же прямоугольников. Разница только в раскладке движения по времени: линейная кривая и общий старт против системной кривой и разнесённых слоёв. Правую сторону можно испортить прямо здесь — оси переключаются."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* ── Левая: то, что получается само собой ── */}
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                По умолчанию
              </span>
              <span className="text-[11px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                linear · 180 мс · шаг 0
              </span>
            </div>
            {/* 0.18 и linear — не ступень системы, и это ровно то, что
                показывается: значение по умолчанию, взятое не отсюда. */}
            <Card key={`a${run}`} ease={ease.linear} dur={0.18} step={0} tone="var(--m-petrol)" />
          </div>

          {/* ── Правая: то же движение, разложенное по системе ── */}
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--m-sea)', ...MONO }}>
                Решённое
              </span>
              <span className="text-[11px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                {curve.label} · {Math.round(dur.v * 1000)} мс · шаг {Math.round(step.v * 1000)}
              </span>
            </div>
            <Card key={`b${run}-${ci}-${di}-${si}`} ease={curve.v} dur={dur.v} step={step.v} tone="var(--m-ember)" />
          </div>
        </div>

        {/* ── Пульт ── */}
        <div
          className="mt-6 rounded-2xl p-5 flex flex-col gap-5"
          style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)' }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-[11px] uppercase tracking-[0.2em] sm:w-28 shrink-0" style={{ color: 'var(--m-dim)', ...MONO }}>
              Кривая
            </span>
            <div className="flex flex-wrap gap-2">
              {CURVES.map((c, i) => (
                <Chip key={c.id} on={i === ci} onClick={() => setCi(i)}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-[11px] uppercase tracking-[0.2em] sm:w-28 shrink-0" style={{ color: 'var(--m-dim)', ...MONO }}>
              Длительность
            </span>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d, i) => (
                <Chip key={d.id} on={i === di} onClick={() => setDi(i)}>
                  {d.label} · {Math.round(d.v * 1000)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-[11px] uppercase tracking-[0.2em] sm:w-28 shrink-0" style={{ color: 'var(--m-dim)', ...MONO }}>
              Шаг слоёв
            </span>
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <Chip key={s.id} on={i === si} onClick={() => setSi(i)}>
                  {s.label}
                  {s.v > 0 ? ` · ${Math.round(s.v * 1000)}` : ''}
                </Chip>
              ))}
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4"
            style={{ borderTop: '1px solid var(--m-border)' }}
          >
            {!reduced && (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                style={{ color: 'var(--m-ember)', ...MONO }}
              >
                ▶ Прогнать обе
              </button>
            )}
            <span className="text-[11px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }} aria-live="polite">
              Правая сторона целиком: {Math.round(total * 1000)} мс
            </span>
          </div>
        </div>

        <p className="mt-6 max-w-[58ch] font-light" style={{ color: 'var(--m-dim)', lineHeight: 1.62 }}>
          Поставьте шаг в ноль — правая сторона мгновенно теряет глубину, хотя
          кривая и длительность остались прежними. Порядок появления слоёв
          сообщает, что здесь главное; общий старт не сообщает ничего.
          Демонстрационная композиция.
        </p>
      </div>
    </section>
  )
}
