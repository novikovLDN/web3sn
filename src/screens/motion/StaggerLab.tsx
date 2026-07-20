/**
 * 04 · Потолок ритма.
 *
 * ЗАЧЕМ ЭТОТ РАЗДЕЛ
 * ─────────────────
 * Stagger — самый дешёвый способ сделать движение дорогим и самый быстрый
 * способ сделать сайт «тормозящим». Граница между этими двумя состояниями
 * не в шаге, а в суммарном времени волны: шаг 45 мс на пяти словах — ритм,
 * тот же шаг на тридцати — две секунды, в течение которых страница выглядит
 * подвисшей.
 *
 * Потолок 0.6 с здесь не выдуман для красоты. Это константа MAX_TOTAL из
 * src/design/primitives.tsx: SplitText сжимает шаг ровно так, чтобы вся
 * волна укладывалась в 0.6 с, и заголовки этого сайта работают по этому
 * правилу. Раздел показывает решение, которое реально принято в коде.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Волна — framer-motion по y и opacity. Ползунок меняет только число:
 * перезапуск волны привязан к key, поэтому перетаскивание не копит
 * незавершённые анимации. Риска потолка на шкале — статическая позиция
 * в процентах, она не анимируется.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { duration, ease } from '../../design/motion'
import { MONO } from './palette'
import { SectionHead, usePrefersReducedMotion } from './primitives'

/** Столько единиц в волне — как слов в среднем заголовке этого сайта. */
const UNITS = 12
/** Тот самый потолок из design/primitives.tsx (SplitText, MAX_TOTAL). */
const CEILING = 0.6
/** Верх шкалы ползунка: 120 мс на единицу — заведомо за гранью. */
const MAX_STEP = 0.12

/** Приговор шагу. Границы — не мнение, а следствие потолка волны. */
function verdict(total: number): { label: string; tone: string } {
  if (total < 0.18) return { label: 'Волна не читается — почти одновременный старт', tone: 'var(--m-dim)' }
  if (total <= CEILING) return { label: 'Рабочий диапазон: ритм есть, ожидания нет', tone: 'var(--m-sea)' }
  return { label: 'За потолком: это уже читается как подтормаживание', tone: 'var(--m-ember)' }
}

export default function StaggerLab() {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState(0.045)
  const [run, setRun] = useState(0)

  const total = step * (UNITS - 1)
  const v = verdict(total)
  const over = total > CEILING

  return (
    <section id="m-stagger" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-5xl">
        <SectionHead
          n="04"
          title="У ритма есть потолок"
          note={`Потолок волны — ${CEILING * 1000} мс`}
          lead="Шаг между элементами создаёт ощущение композиции, но платит за него время. Считать надо не шаг, а всю волну: шаг × количество элементов. Пока волна укладывается в 0.6 секунды, это ритм. Дальше — ожидание, которое посетитель списывает на медленный сайт."
        />

        {/* ── Волна ── */}
        <div
          className="rounded-2xl p-5 md:p-8"
          style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)' }}
        >
          <div className="flex flex-wrap items-end gap-2 md:gap-3" style={{ minHeight: 96 }}>
            {Array.from({ length: UNITS }, (_, i) => (
              <motion.span
                key={`${run}-${step}-${i}`}
                className="block rounded-md"
                style={{
                  width: 'clamp(14px, 4vw, 30px)',
                  // Разная высота — чтобы волна читалась как ряд объектов,
                  // а не как индикатор загрузки. Высота статична.
                  height: 34 + ((i * 37) % 58),
                  background: over && i > 0 ? 'var(--m-ember)' : 'var(--m-sea)',
                }}
                initial={reduced ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0 : duration.slow,
                  ease: ease.entrance,
                  delay: reduced ? 0 : i * step,
                }}
              />
            ))}
          </div>

          {/* ── Шкала времени с риской потолка ── */}
          <div className="mt-8">
            <div className="relative h-6">
              <span
                aria-hidden
                className="absolute left-0 right-0 top-1/2 h-px"
                style={{ background: 'var(--m-border)' }}
              />
              {/* Заполнение — scaleX, а не width: ширина здесь никогда
                  не анимируется, но правило одно на весь экран. */}
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 origin-left rounded-full"
                style={{
                  width: '100%',
                  transform: `scaleX(${Math.min(1, total / (MAX_STEP * (UNITS - 1)))})`,
                  background: over ? 'var(--m-ember)' : 'var(--m-sea)',
                  transition: `transform var(--d-fast) var(--e-standard)`,
                }}
              />
              {/* Риска потолка стоит на своём месте шкалы всегда. */}
              <span
                aria-hidden
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(CEILING / (MAX_STEP * (UNITS - 1))) * 100}%`,
                  background: 'var(--m-chalk)',
                }}
              />
            </div>
            <div className="mt-2 flex items-baseline justify-between text-[10px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }}>
              <span>0</span>
              <span>{CEILING * 1000} мс — потолок</span>
              <span>{Math.round(MAX_STEP * (UNITS - 1) * 1000)} мс</span>
            </div>
          </div>
        </div>

        {/* ── Пульт ── */}
        <div
          className="mt-5 rounded-2xl p-5 md:p-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
          style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)' }}
        >
          <label className="block">
            <span className="flex items-baseline justify-between gap-4 mb-3 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--m-dim)', ...MONO }}>
              <span>Шаг между элементами</span>
              <span style={{ color: 'var(--m-sea)' }}>{Math.round(step * 1000)} мс</span>
            </span>
            <input
              type="range"
              min={0}
              max={MAX_STEP * 1000}
              step={5}
              value={Math.round(step * 1000)}
              onChange={(e) => setStep(Number(e.target.value) / 1000)}
              className="w-full"
              style={{ accentColor: 'var(--m-sea)' }}
              aria-label="Шаг между элементами волны, миллисекунды"
            />
          </label>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {!reduced && (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                style={{ color: 'var(--m-ember)', ...MONO }}
              >
                ▶ Прогнать волну
              </button>
            )}
            <span
              className="text-[11px] tabular-nums tracking-[0.14em]"
              style={{ color: 'var(--m-chalk)', ...MONO }}
              aria-live="polite"
            >
              {UNITS} × {Math.round(step * 1000)} = {Math.round(total * 1000)} мс
            </span>
          </div>

          <p
            className="lg:col-span-2 text-[0.9rem] font-light rounded-xl px-4 py-3"
            style={{
              color: v.tone,
              background: over ? 'var(--m-warn-12)' : 'transparent',
              border: `1px solid ${over ? 'var(--m-ember)' : 'var(--m-border)'}`,
              transition: 'border-color var(--d-fast) var(--e-standard)',
            }}
          >
            {v.label}
          </p>
        </div>

        <p className="mt-6 max-w-[58ch] font-light" style={{ color: 'var(--m-dim)', lineHeight: 1.62 }}>
          Именно поэтому в SplitText этого сайта шаг не фиксирован, а сжимается:
          на коротком заголовке остаётся штатным, на длинном абзаце ужимается
          так, чтобы волна уложилась в потолок. Ритм страдает только там, где
          иначе пострадала бы скорость.
        </p>
      </div>
    </section>
  )
}
