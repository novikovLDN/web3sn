import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { C, DISPLAY, MONO } from './palette'
import { usePrefersReducedMotion } from './primitives'

/* ── Геометрия листа ────────────────────────────────────────────── */
const COLS = 20
const ROWS = 6
const TOTAL = COLS * ROWS // 120 кадров
const LAYERS = ['СЦЕНА', 'ТИПО', 'ЛОГО', 'UI', '3D', 'ФИНАЛ']

/**
 * 14 «экспонированных» кадров. Список ДЕТЕРМИНИРОВАННЫЙ — никакого
 * Math.random(): иначе сетка бы дёргалась между рендерами.
 * Каждый кадр — реальная навигационная цель на этом же экране.
 */
type Frame = { i: number; anchor: string; title: string; year: string; to: string }
const FRAMES: Frame[] = [
  { i: 3, anchor: '#m-statement', title: 'Манифест', year: '2019', to: 'манифесту' },
  { i: 9, anchor: '#m-stats', title: 'Цифры', year: '2019', to: 'статистике' },
  { i: 16, anchor: '#m-services', title: 'Explainer-ролики', year: '2020', to: 'услугам' },
  { i: 24, anchor: '#m-services', title: 'Логотип в движении', year: '2020', to: 'услугам' },
  { i: 31, anchor: '#m-principles', title: 'Ритм', year: '2021', to: 'принципам' },
  { i: 38, anchor: '#m-formats', title: 'Reels', year: '2021', to: 'форматам' },
  { i: 45, anchor: '#m-formats', title: 'UI-моушн', year: '2022', to: 'форматам' },
  { i: 52, anchor: '#m-principles', title: 'Характер', year: '2022', to: 'принципам' },
  { i: 67, anchor: '#m-portal', title: 'Внутри движения', year: '2023', to: 'порталу' },
  { i: 74, anchor: '#m-formats', title: '3D-моушн', year: '2023', to: 'форматам' },
  { i: 81, anchor: '#m-word', title: 'Кинетика', year: '2024', to: 'кинетическому слову' },
  { i: 95, anchor: '#m-services', title: 'Титры и графика', year: '2024', to: 'услугам' },
  { i: 103, anchor: '#m-portal', title: 'Симуляции', year: '2025', to: 'порталу' },
  { i: 116, anchor: '#m-cta', title: 'Связаться', year: '2026', to: 'контактам' },
]
const BY_INDEX = new Map(FRAMES.map((f) => [f.i, f]))

/** Детерминированные параметры фазы: чистая функция индекса. */
const durFor = (i: number) => 1200 + ((i * 137) % 900)
const phaseFor = (i: number) => -((i * 61) % 800)

/* ── Пять процедурных микроанимаций, ротация по index % 5 ───────── */
function Shape({ i }: { i: number }) {
  const anim: React.CSSProperties = {
    animationName: ['ds-a', 'ds-b', 'ds-c', 'ds-d', 'ds-e'][i % 5],
    animationDuration: `${durFor(i)}ms`,
    animationDelay: `${phaseFor(i)}ms`,
  }
  switch (i % 5) {
    case 0: // вращающийся квадрат
      return <span className="ds-shape block" style={{ ...anim, width: '42%', height: '42%', background: C.seaGlass }} />
    case 1: // пульсирующее кольцо
      return (
        <svg viewBox="0 0 20 20" className="ds-shape" style={{ ...anim, width: '68%', height: '68%' }}>
          <circle cx="10" cy="10" r="8" fill="none" stroke={C.seaGlass} strokeWidth="2" />
        </svg>
      )
    case 2: // сдвигающиеся полосы
      return (
        <span className="ds-shape flex items-end justify-center gap-[2px]" style={{ ...anim, width: '60%', height: '52%' }}>
          <i className="block w-[3px] h-[55%]" style={{ background: C.seaGlass }} />
          <i className="block w-[3px] h-full" style={{ background: C.seaGlass }} />
          <i className="block w-[3px] h-[70%]" style={{ background: C.seaGlass }} />
        </span>
      )
    case 3: // морфящийся border-radius
      return <span className="ds-shape block" style={{ ...anim, width: '46%', height: '46%', border: `2px solid ${C.ember}` }} />
    default: // орбитальная точка (пятая заготовка)
      return (
        <span className="relative block" style={{ width: '52%', height: '52%', border: `1px solid rgba(127,178,174,0.35)` }}>
          <i className="ds-shape absolute left-1/2 top-1/2 block w-[5px] h-[5px] -ml-[2.5px] -mt-[2.5px] rounded-full" style={{ ...anim, background: C.ember }} />
        </span>
      )
  }
}

export default function DopeSheet({ onJump }: { onJump: (anchor: string) => void }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  // sweep>0 — номер прохода плейхеда; смена номера перезапускает CSS-анимацию.
  const [sweep, setSweep] = useState(0)

  useEffect(() => {
    if (inView && !reduced) setSweep((s) => s + 1)
  }, [inView, reduced])

  const on = reduced || inView
  const playing = sweep > 0 && !reduced

  return (
    <section id="m-dope" className="px-6 md:px-12 py-24">
      <div className="max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <h2 className="font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.chalk, ...DISPLAY }}>
            Экспозиционный лист
          </h2>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: C.dim, ...MONO }}>
            Клик по кадру — переход к разделу
          </p>
        </div>

        <div ref={ref} className={`${on ? 'ds-on' : ''} ${reduced ? 'ds-reduced' : ''}`}>
          <div className="flex gap-3">
            {/* Колонка слоёв */}
            <div className="hidden sm:grid shrink-0 w-20 pt-5" style={{ gridTemplateRows: `repeat(${ROWS},1fr)`, gap: 3 }}>
              {LAYERS.map((l) => (
                <div key={l} className="flex items-center text-[9px] tracking-[0.14em]" style={{ color: C.dim, ...MONO }}>
                  {l}
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              {/* Линейка кадров */}
              <div className="grid mb-1" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gap: 3 }}>
                {Array.from({ length: COLS }, (_, c) => (
                  <span key={c} className="text-center text-[8px] leading-4 tabular-nums" style={{ color: c % 5 === 0 ? C.seaGlass : 'rgba(227,230,228,0.28)', ...MONO }}>
                    {String(c + 1).padStart(2, '0')}
                  </span>
                ))}
              </div>

              {/* Сетка 120 кадров + плейхед */}
              <div className="relative">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gap: 3 }}>
                  {Array.from({ length: TOTAL }, (_, i) => {
                    const row = Math.floor(i / COLS)
                    const col = i % COLS
                    const frame = BY_INDEX.get(i)
                    // Волна появления: один CSS-переход, диагональная задержка.
                    const wave: React.CSSProperties = { transitionDelay: reduced ? '0ms' : `${(row + col) * 12}ms` }
                    const flash = playing ? (
                      <span key={sweep} className="ds-flash absolute inset-0 pointer-events-none" style={{ background: C.seaGlass, animationDelay: `${col * (700 / COLS)}ms` }} />
                    ) : null

                    if (!frame) {
                      return <div key={i} className="ds-cell relative" style={{ aspectRatio: '1', ...wave }}>{flash}</div>
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onJump(frame.anchor)}
                        aria-label={`Кадр ${String(i + 1).padStart(3, '0')} — ${frame.title}, ${frame.year}. Перейти к ${frame.to}.`}
                        className="ds-cell ds-cell--active relative flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.18] focus-visible:scale-[1.18] focus:outline-none"
                        style={{ aspectRatio: '1', boxShadow: `inset 0 0 0 1px ${C.seaGlass}55`, ...wave }}
                      >
                        <Shape i={i} />
                        {flash}
                      </button>
                    )
                  })}
                </div>

                {playing && (
                  <span key={sweep} className="ds-playhead absolute top-0 bottom-0 w-[2px] pointer-events-none" style={{ background: C.seaGlass, boxShadow: `0 0 8px ${C.seaGlass}` }} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] tracking-[0.18em]" style={{ color: C.dim, ...MONO }}>
            <span>120 КАДРОВ / 14 РАБОТ / 2019—2026</span>
            {!reduced && (
              <button type="button" onClick={() => setSweep((s) => s + 1)} className="uppercase tracking-[0.18em] transition-colors" style={{ color: C.seaGlass, ...MONO }}>
                ▶ Прогнать плейхед
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
