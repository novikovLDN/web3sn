import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { C, DISPLAY, EASE, MONO } from './palette'
import { usePrefersReducedMotion } from './primitives'

/**
 * Кривые лаборатории. `path` — не декоративная закорючка, а точная геометрия
 * своего cubic-bezier: в системе координат SVG (квадрат 120×120, ось Y вниз)
 * контрольная точка (x,y) кривой лежит в (x·120, 120 − y·120).
 * Поэтому overshoot Back-out уходит выше нуля, а Anticipate — ниже
 * (viewBox="0 -34 120 188" у <Curve> даёт запас сверху и снизу под оба случая).
 *
 * Все шесть значений различны: сравнивать две карточки с одинаковым
 * cubic-bezier под разными именами было бы обманом инструмента.
 */
export const EASES = [
  { name: 'Linear', css: 'linear', path: 'M0 120 L120 0' },
  { name: 'Ease-in', css: 'cubic-bezier(0.7,0,0.84,0)', path: 'M0 120 C84 120 100.8 120 120 0' },
  { name: 'Ease-out', css: 'cubic-bezier(0.16,1,0.3,1)', path: 'M0 120 C19.2 0 36 0 120 0' },
  { name: 'Ease-in-out', css: 'cubic-bezier(0.65,0,0.35,1)', path: 'M0 120 C78 120 42 0 120 0' },
  { name: 'Back-out', css: 'cubic-bezier(0.34,1.56,0.64,1)', path: 'M0 120 C40.8 -67.2 76.8 0 120 0' },
  { name: 'Anticipate', css: 'cubic-bezier(0.36,0,0.66,-0.56)', path: 'M0 120 C43.2 120 79.2 187.2 120 0' },
] as const

const DUR = 1400
const PUCK = 56

/**
 * Одна кривая: SVG рисуется pathLength 0→1 при входе во вьюпорт.
 * Единичный квадрат 120×120 и `meet`: растягивание (`preserveAspectRatio="none"`)
 * сплющивало бы все шесть кривых в почти одинаковые полоски — ровно та
 * декорация, против которой сделан этот раздел. Поля viewBox — под overshoot.
 */
function Curve({ d, active, reduced }: { d: string; active: boolean; reduced: boolean }) {
  const stroke = active ? C.seaGlass : 'rgba(127,178,174,0.55)'
  return (
    <svg viewBox="0 -34 120 188" className="h-[152px] w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* рамка «от 0 до 1»: без неё overshoot не читается как overshoot */}
      <rect x="0" y="0" width="120" height="120" fill="none" stroke={C.border} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </svg>
  )
}

export default function EasingLab() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const laneRef = useRef<HTMLDivElement>(null)
  const puckRef = useRef<HTMLDivElement>(null)
  const copyTimer = useRef<number | undefined>(undefined)
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })

  /** Перезапуск демо: сброс без перехода → reflow → проход с выбранным easing. */
  const run = useCallback((css: string) => {
    const lane = laneRef.current
    const puck = puckRef.current
    if (!lane || !puck) return
    const travel = Math.max(0, lane.clientWidth - PUCK)
    puck.style.transition = 'none'
    puck.style.transform = 'translateX(0px)'
    void puck.offsetHeight // форсируем reflow, иначе браузер схлопнет два стиля в один
    puck.style.transition = `transform ${DUR}ms ${css}`
    puck.style.transform = `translateX(${travel}px)`
  }, [])

  // Авто-прогон только при входе во вьюпорт и только без reduced-motion.
  // Явные клики ниже работают всегда — путь доступности не должен быть тупиком.
  useEffect(() => {
    if (inView && !reduced) run(EASES[0].css)
  }, [inView, reduced, run])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const select = (i: number) => {
    setActive(i)
    run(EASES[i].css)
  }

  const copy = async (css: string) => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(css)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(null), 1200)
    } catch {
      // В небезопасном контексте (http://, iframe без разрешения) API бросает.
      // Тихо: подпись не меняется, значит «скопировано» не соврёт.
    }
  }

  const cur = EASES[active]

  return (
    <section ref={sectionRef} id="m-easing" className="px-6 md:px-12 py-24">
      <div className="max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <h2 className="font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.chalk, ...DISPLAY }}>
            Easing-лаборатория
          </h2>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: C.dim, ...MONO }}>
            Клик по кривой — прогон, клик по значению — копия
          </p>
        </div>

        {/* Общий демо-объект: одна дорожка на все кривые, чтобы их можно было сравнивать */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div ref={laneRef} className="relative" style={{ height: PUCK }}>
            {/* дорожка: без неё квадрат висит в пустом прямоугольнике */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-px" style={{ background: C.border }} />
            <div
              ref={puckRef}
              aria-hidden="true"
              data-demo="puck"
              className="absolute left-0 top-0 rounded-xl"
              style={{ width: PUCK, height: PUCK, background: C.seaGlass }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: C.dim, ...MONO }}>
            <button
              type="button"
              onClick={() => run(cur.css)}
              className="uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
              style={{ color: C.ember, ...MONO }}
            >
              ▶ Проиграть
            </button>
            <span aria-live="polite">
              {cur.name} · {DUR} мс
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EASES.map((e, i) => {
            const on = i === active
            return (
              <div
                key={e.name}
                className="rounded-2xl p-5 transition-colors"
                style={{ background: on ? '#132B2F' : C.panel, border: `1px solid ${on ? C.seaGlass : C.border}` }}
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={on}
                  className="block w-full text-left cursor-pointer focus:outline-none focus-visible:opacity-80"
                  aria-label={`Проиграть ${e.name}`}
                >
                  <Curve d={e.path} active={on} reduced={reduced} />
                  <span className="mt-3 block font-semibold text-lg" style={{ color: on ? C.chalk : C.dim }}>
                    {e.name}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => copy(e.css)}
                  data-copy={e.css}
                  className="mt-2 block w-full text-left text-[11px] tracking-[0.06em] transition-opacity hover:opacity-70 break-all"
                  style={{ color: copied === e.css ? C.ember : C.dim, ...MONO }}
                  aria-label={`Скопировать ${e.css}`}
                >
                  {copied === e.css ? 'СКОПИРОВАНО' : e.css}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
