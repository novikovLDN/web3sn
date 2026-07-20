import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { C, DISPLAY, MONO, T } from './palette'
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
 *
 * Прежняя версия подписывала кадры годами 2019—2026 и объявляла их «работами».
 * Это было утверждение о портфолио, которого здесь нет, — убрано. Лист
 * остался тем, чем он и был по факту: оглавлением экрана в форме
 * экспозиционного листа.
 */
type Frame = { i: number; anchor: string; title: string; to: string }
const FRAMES: Frame[] = [
  { i: 3, anchor: '#m-statement', title: 'Заявление', to: 'заявлению' },
  { i: 9, anchor: '#m-timing', title: '120 мс', to: 'шкале длительностей' },
  { i: 16, anchor: '#m-timing', title: '1400 мс', to: 'шкале длительностей' },
  { i: 24, anchor: '#m-easing', title: 'Ease-out', to: 'лаборатории кривых' },
  { i: 31, anchor: '#m-easing', title: 'Back-out', to: 'лаборатории кривых' },
  { i: 38, anchor: '#m-principles', title: 'Тайминг', to: 'принципам' },
  { i: 45, anchor: '#m-principles', title: 'Функция', to: 'принципам' },
  { i: 52, anchor: '#m-principles', title: 'Система', to: 'принципам' },
  { i: 67, anchor: '#m-formats', title: 'Explainer', to: 'форматам' },
  { i: 74, anchor: '#m-formats', title: 'UI-моушн', to: 'форматам' },
  { i: 81, anchor: '#m-formats', title: '3D-моушн', to: 'форматам' },
  { i: 95, anchor: '#m-word', title: 'Тайминг — решение', to: 'крупному кадру' },
  { i: 103, anchor: '#m-formats', title: 'Титры', to: 'форматам' },
  { i: 116, anchor: '#m-cta', title: 'Связаться', to: 'контактам' },
]
const BY_INDEX = new Map(FRAMES.map((f) => [f.i, f]))

/** Единственный кадр-призыв: только он имеет право на ember. */
const CTA_INDEX = 116

/**
 * Метки удержания (hold) классического экспозиционного листа: линия тянется
 * от экспонированного кадра через кадры, которые он занимает, — до следующей
 * экспозиции в том же слое или до конца строки. Чистая декорация: не кнопки,
 * не фокусируются, aria-hidden. Даёт листу плотность документа.
 */
const HOLD = (() => {
  const s = new Set<number>()
  for (const f of FRAMES) {
    const rowEnd = (Math.floor(f.i / COLS) + 1) * COLS - 1
    for (let j = f.i + 1; j <= rowEnd; j++) {
      if (BY_INDEX.has(j)) break
      s.add(j)
    }
  }
  return s
})()

/** Детерминированные параметры фазы: чистая функция индекса. */
const durFor = (i: number) => 1200 + ((i * 137) % 900)
const phaseFor = (i: number) => -((i * 61) % 800)

/* ── Пять процедурных микроанимаций, ротация по index % 5 ─────────
   Ни один мотив не содержит вращения: спека прямо запрещает
   «ключевые ромбы», а любой поворот на steps() рано или поздно
   замирает на 45°. Вместо этого — вайп, масштаб, проход и рост. */
function Shape({ i, color }: { i: number; color: string }) {
  const anim: React.CSSProperties = {
    animationName: ['ds-a', 'ds-b', 'ds-c', 'ds-d', 'ds-e'][i % 5],
    animationDuration: `${durFor(i)}ms`,
    animationDelay: `${phaseFor(i)}ms`,
  }
  switch (i % 5) {
    case 0: // ступенчатый вайп полосы слева направо
      return <span className="ds-shape block" style={{ ...anim, width: '74%', height: '26%', background: color }} />
    case 1: // пульсирующее кольцо
      return (
        <svg viewBox="0 0 20 20" className="ds-shape" style={{ ...anim, width: '68%', height: '68%' }}>
          <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      )
    case 2: // сдвигающиеся полосы
      return (
        <span className="ds-shape flex items-end justify-center gap-[2px]" style={{ ...anim, width: '60%', height: '52%' }}>
          <i className="block w-[3px] h-[55%]" style={{ background: color }} />
          <i className="block w-[3px] h-full" style={{ background: color }} />
          <i className="block w-[3px] h-[70%]" style={{ background: color }} />
        </span>
      )
    case 3: // ступенчатый рост по одной оси
      return (
        <span
          className="ds-shape block"
          style={{ ...anim, width: '32%', height: '64%', background: color, transformOrigin: 'bottom center' }}
        />
      )
    default: // точка по периметру рамки
      return (
        <span className="relative block" style={{ width: '52%', height: '52%', border: `1px solid rgba(127,178,174,0.35)` }}>
          <i
            className="ds-shape ds-shape--e absolute left-1/2 top-1/2 block w-[5px] h-[5px] -ml-[2.5px] -mt-[2.5px] rounded-full"
            style={{ ...anim, background: color }}
          />
        </span>
      )
  }
}

/**
 * Наведение = скраб фазы ячейки, как в брифе: позиция курсора по ширине
 * кадра отображается в currentTime анимации (пауза + перемотка), а не
 * ускорение воспроизведения, которое выдавало бы себя за скраб.
 */
function scrubTo(host: HTMLElement, clientX: number) {
  const el = host.querySelector('.ds-shape')
  if (!el || typeof el.getAnimations !== 'function') return
  const r = host.getBoundingClientRect()
  if (!r.width) return
  const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
  for (const a of el.getAnimations()) {
    const t = a.effect?.getTiming()
    const d = t?.duration
    if (typeof d !== 'number' || d <= 0) continue
    a.pause()
    // Компенсируем отрицательную фазовую задержку, иначе скраб «перематывал»
    // бы цикл не с начала: слева направо = прогресс 0 → 1.
    a.currentTime = (t?.delay ?? 0) + f * d
  }
}
function releaseScrub(host: HTMLElement) {
  const el = host.querySelector('.ds-shape')
  if (!el || typeof el.getAnimations !== 'function') return
  for (const a of el.getAnimations()) a.play()
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
    <section id="m-dope" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 mb-12">
          <h2 className="font-bold uppercase" style={{ color: 'var(--m-chalk)', ...T.h2, ...DISPLAY }}>
            Экспозиционный лист
          </h2>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--m-dim)', ...MONO }}>
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
                      // Метка удержания: линия по оси времени, перекрывающая
                      // 3px-зазор, чтобы держание читалось как одна черта.
                      const hold = HOLD.has(i) ? (
                        <span
                          aria-hidden="true"
                          className="ds-hold absolute top-1/2 -left-[3px] -right-[3px] h-px"
                          style={{ background: `${C.seaGlass}4D`, transitionDelay: wave.transitionDelay }}
                        />
                      ) : null
                      return (
                        <div key={i} className="ds-cell relative" style={{ aspectRatio: '1', ...wave }}>
                          {hold}
                          {flash}
                        </div>
                      )
                    }
                    const isCta = i === CTA_INDEX
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onJump(frame.anchor)}
                        onPointerMove={(e) => scrubTo(e.currentTarget, e.clientX)}
                        onPointerLeave={(e) => releaseScrub(e.currentTarget)}
                        onPointerCancel={(e) => releaseScrub(e.currentTarget)}
                        onBlur={(e) => releaseScrub(e.currentTarget)}
                        aria-label={`Кадр ${String(i + 1).padStart(3, '0')} — ${frame.title}. Перейти к ${frame.to}.`}
                        className="ds-cell ds-cell--active relative flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.18] focus-visible:scale-[1.18] focus:outline-none"
                        style={{ aspectRatio: '1', boxShadow: `inset 0 0 0 1px ${isCta ? C.ember : C.seaGlass}55`, ...wave }}
                      >
                        <Shape i={i} color={isCta ? C.ember : C.seaGlass} />
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
            {/* 8 fps здесь — не ограничение, а решение: ячейки анимированы
                steps(8) против 60 fps героя. Разница между ними и есть тема. */}
            <span>120 КАДРОВ · 6 СЛОЁВ · 8 FPS</span>
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
