import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { C, EASE, MONO } from './palette'
import { cssEase, duration } from '../../design/motion'
import { SectionHead, usePrefersReducedMotion } from './primitives'

/**
 * Кривые лаборатории — это НЕ произвольная витрина easing. Это ровно тот
 * набор, на котором построено движение всего сайта (src/design/motion.ts),
 * с подписью, за что каждая отвечает. Раздел поэтому доказывает тезис услуги
 * буквально: движение здесь — система, а не набор решений на глаз.
 *
 * `path` — не декоративная закорючка, а точная геометрия своего cubic-bezier:
 * в системе координат SVG (квадрат 120×120, ось Y вниз) контрольная точка
 * (x,y) кривой лежит в (x·120, 120 − y·120). Поэтому overshoot у Back-out
 * уходит выше нуля — запас под это даёт viewBox="0 -34 120 188" у <Curve>.
 *
 * Все шесть значений различны: сравнивать две карточки с одинаковым
 * cubic-bezier под разными именами было бы обманом инструмента.
 */
export const EASES = [
  { name: 'Standard', role: 'База интерфейса', css: cssEase.standard, path: 'M0 120 C38.4 33.6 0 0 120 0' },
  { name: 'Entrance', role: 'Появление контента', css: cssEase.entrance, path: 'M0 120 C19.2 0 36 0 120 0' },
  { name: 'Exit', role: 'Уход контента', css: cssEase.exit, path: 'M0 120 C84 120 100.8 120 120 0' },
  { name: 'Editorial', role: 'Крупные блоки', css: cssEase.editorial, path: 'M0 120 C78 120 42 0 120 0' },
  { name: 'Overshoot', role: 'Акценты, никогда текст', css: cssEase.overshoot, path: 'M0 120 C40.8 -67.2 76.8 0 120 0' },
  { name: 'Linear', role: 'Только бесконечные циклы', css: 'linear', path: 'M0 120 L120 0' },
] as const

/** Демо-прогон идёт на самой длинной ступени шкалы — разницу кривых видно. */
const DUR = duration.cinematic * 1000
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
    <section ref={sectionRef} id="m-easing" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-6xl">
        <SectionHead
          n="02"
          title="Кривая — это характер, а не сглаживание"
          note="Клик по кривой — прогон, клик по значению — копия"
          lead="Шесть кривых ниже — не витрина easing, а полный набор, на котором построено движение всего сайта. У каждой своя работа, и подменять одну другой нельзя: резкий вход даёт отзывчивость, длинный выход — вес. Один объект прогоняется по всем шести, чтобы разницу можно было увидеть, а не прочитать."
        />

        {/* Общий демо-объект: одна дорожка на все кривые, чтобы их можно было сравнивать */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--m-panel)', border: '1px solid var(--m-border)' }}>
          <div ref={laneRef} className="relative" style={{ height: PUCK }}>
            {/* дорожка: без неё квадрат висит в пустом прямоугольнике */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'var(--m-border)' }} />
            <div
              ref={puckRef}
              aria-hidden="true"
              data-demo="puck"
              className="absolute left-0 top-0 rounded-xl"
              style={{ width: PUCK, height: PUCK, background: 'var(--m-sea)' }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--m-dim)', ...MONO }}>
            <button
              type="button"
              onClick={() => run(cur.css)}
              className="uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
              style={{ color: 'var(--m-ember)', ...MONO }}
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
                style={{
                  background: on ? 'var(--m-panel-2)' : 'var(--m-panel)',
                  border: `1px solid ${on ? 'var(--m-sea)' : 'var(--m-border)'}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={on}
                  className="block w-full text-left cursor-pointer focus:outline-none focus-visible:opacity-80"
                  aria-label={`Проиграть ${e.name}`}
                >
                  <Curve d={e.path} active={on} reduced={reduced} />
                  <span className="mt-3 block font-semibold text-lg" style={{ color: on ? 'var(--m-chalk)' : 'var(--m-dim)' }}>
                    {e.name}
                  </span>
                  {/* Роль кривой — половина смысла раздела: без неё это
                      снова витрина, против которой он и сделан. */}
                  <span className="mt-1 block font-light text-[0.82rem]" style={{ color: 'var(--m-dim)', lineHeight: 1.45 }}>
                    {e.role}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => copy(e.css)}
                  data-copy={e.css}
                  className="mt-2 block w-full text-left text-[11px] tracking-[0.06em] transition-opacity hover:opacity-70 break-all"
                  style={{ color: copied === e.css ? 'var(--m-ember)' : 'var(--m-dim)', ...MONO }}
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
