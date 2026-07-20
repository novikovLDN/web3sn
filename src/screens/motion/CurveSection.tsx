/**
 * Раздел «КРИВАЯ» — развёрнутая форма того, чем управляет панель внизу.
 *
 * Панель даёт переключить, раздел объясняет, что именно переключилось: у каждой
 * кривой есть роль в системе и есть характер, который она навязывает всему
 * экрану. Карточки — те же шесть кривых из design/motion.ts, с их настоящими
 * именами. Выбор здесь и выбор в панели — одно состояние, а не два: раздел
 * управляет тем же самым --m-ease.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Прогон дорожки — нативный CSS-переход по transform. Сброс без перехода,
 * форсированное чтение геометрии, запуск: без чтения браузер схлопнул бы
 * сброс и старт в один стиль, и фишка никуда бы не поехала.
 */
import { useCallback, useEffect, useRef } from 'react'
import { duration } from '../../design/motion'
import { T, mono, monoNum } from './palette'
import {
  CURVES,
  CurveGraph,
  Reveal,
  RunButton,
  SectionHead,
  curveCss,
  useInViewGate,
  usePrefersReducedMotion,
  useScreenCurve,
  type Curve,
} from './primitives'

/** Прогон идёт на длинной ступени шкалы: на 240 мс разница кривых не видна. */
const DUR_MS = duration.cinematic * 1000
const PUCK = 44

export default function CurveSection({ onPick }: { onPick: (c: Curve) => void }) {
  const curve = useScreenCurve()
  const reduced = usePrefersReducedMotion()
  const laneRef = useRef<HTMLDivElement>(null)
  const puckRef = useRef<HTMLDivElement>(null)
  const [gateRef, visible] = useInViewGate<HTMLElement>(0.3)
  const ranOnce = useRef(false)

  const run = useCallback(
    (css: string) => {
      const lane = laneRef.current
      const puck = puckRef.current
      if (!lane || !puck) return
      const travel = Math.max(0, lane.clientWidth - PUCK)
      puck.style.transition = 'none'
      puck.style.transform = 'translate3d(0,0,0)'
      void puck.offsetHeight // форсируем чтение геометрии, иначе сброс и старт схлопнутся
      puck.style.transition = `transform ${DUR_MS}ms ${css}`
      puck.style.transform = `translate3d(${travel}px,0,0)`
    },
    []
  )

  /* Автопрогон ровно один раз при первом входе в кадр. Дальше — только
     по действию посетителя: самозапускающееся движение при каждом
     возврате к секции читается как навязчивость, а не как демонстрация. */
  useEffect(() => {
    if (!visible || reduced || ranOnce.current) return
    ranOnce.current = true
    run(curveCss(curve))
  }, [visible, reduced, run, curve])

  /* Смена кривой — сама по себе повод показать её в деле. */
  useEffect(() => {
    if (!visible || reduced || !ranOnce.current) return
    run(curveCss(curve))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve.id])

  return (
    <section
      ref={gateRef}
      className="mx-auto w-full"
      style={{
        maxWidth: 'var(--max-w)',
        paddingInline: 'var(--gutter)',
        paddingBlock: 'var(--section-y)',
      }}
    >
      <SectionHead
        param="Кривая"
        index={1}
        total={5}
        title="Кривая — это характер, а не сглаживание"
        lead="Шесть кривых ниже — не витрина easing, а полный именованный набор из системы движения этого сайта. У каждой своя работа, и подменять одну другой нельзя. Выберите любую — и по ней пойдёт весь экран: появления секций, наведения, прогоны инструментов, кнопка внизу страницы."
        hint="Выбранная кривая держится на всей странице · панель остаётся внизу"
      />

      {/* Общая дорожка: один объект на все кривые — иначе сравнивать нечего. */}
      <div
        className="rounded-2xl"
        style={{
          background: 'var(--m-panel)',
          border: '1px solid var(--m-line)',
          padding: 'var(--s-6)',
        }}
      >
        <div ref={laneRef} className="relative" style={{ height: PUCK }}>
          <span
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: 'var(--m-line)' }}
          />
          <div
            ref={puckRef}
            aria-hidden
            className="absolute left-0 top-0 rounded-xl"
            style={{ width: PUCK, height: PUCK, background: 'var(--m-sea)' }}
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <RunButton onClick={() => run(curveCss(curve))} />
          <span style={{ ...monoNum, color: 'var(--m-dim)' }}>
            {curve.name} · {DUR_MS} мс · duration.cinematic
          </span>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CURVES.map((c, i) => {
          const on = c.id === curve.id
          return (
            <Reveal key={c.id} y={16} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => onPick(c)}
                aria-pressed={on}
                className="w-full h-full text-left rounded-2xl"
                style={{
                  background: on ? 'var(--m-panel-2)' : 'var(--m-panel)',
                  border: `1px solid ${on ? 'var(--m-ember)' : 'var(--m-line)'}`,
                  padding: 'var(--s-6)',
                  // Только transform: заливка и рамка меняются мгновенно,
                  // потому что это смена состояния, а не анимация.
                  transition: 'transform var(--d-fast) var(--m-ease)',
                }}
                onPointerEnter={(e) => {
                  if (!reduced) e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <CurveGraph v={c.v} active={on} size={92} />
                <span
                  className="mt-4 block"
                  style={{ ...mono, color: on ? 'var(--m-ember)' : 'var(--m-sea)' }}
                >
                  {c.name}
                </span>
                <span
                  className="mt-2 block"
                  style={{ ...T.h3, color: 'var(--m-chalk)', fontFamily: 'var(--m-display)' }}
                >
                  {c.role}
                </span>
                <span
                  className="mt-2.5 block font-light"
                  style={{ color: 'var(--m-dim)', fontSize: '0.88rem', lineHeight: 1.55 }}
                >
                  {c.feel}
                </span>
                <span
                  className="mt-4 block break-all"
                  style={{ ...monoNum, color: 'var(--m-faint)' }}
                >
                  {curveCss(c)}
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
