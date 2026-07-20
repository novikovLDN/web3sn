/**
 * Раздел «ДЛИТЕЛЬНОСТЬ» — живое число экрана.
 *
 * ЧТО ЗДЕСЬ ДОКАЗЫВАЕТСЯ
 * ──────────────────────
 * Длительность перехода — не константа и не вкус. Это функция расстояния,
 * которое проходит объект, потому что глаз читает не время, а скорость.
 * Один и тот же интервал в 400 мс на сдвиге в 40 px выглядит как залипание,
 * а на пролёте через весь экран — как рывок.
 *
 * Закон, по которому здесь считается длительность:
 *
 *     мс = 120 + 100 · √(px / 100)
 *
 * Это не подогнанная формула, а непрерывная запись общепринятых интервалов:
 * до 100 px → ~200 мс, 100–500 px → ~300 мс, 500–1000 px → ~400 мс, пролёт
 * во весь экран → 500–600 мс. Подставьте границы — формула их и выдаёт.
 * Корень, а не прямая: при линейной зависимости длинные переходы становятся
 * невыносимо долгими, а глаз к этому моменту уже понял, что происходит.
 *
 * ЧЕСТНОСТЬ ЧИСЛА
 * ───────────────
 * Расстояние берётся не из поля ввода, а из реальной геометрии страницы:
 * посетитель тянет метку по дорожке, и путь измеряется в настоящих
 * CSS-пикселях его экрана. Второе число — ширина его собственного окна.
 * Ни одно значение здесь не заявлено, все посчитаны на месте.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * getBoundingClientRect вызывается только на событиях указателя и на
 * ResizeObserver — не в каждом кадре. Прогон обеих дорожек — нативные
 * CSS-переходы по transform, ноль работы на главном потоке во время движения.
 */
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { mono, monoNum } from './palette'
import {
  Reveal,
  RunButton,
  SectionHead,
  curveCss,
  usePrefersReducedMotion,
  useScreenCurve,
} from './primitives'

/** Тот самый закон. Округление до 10 мс — сетка, в которой живут тайминги. */
export function durationForDistance(px: number): number {
  const raw = 120 + 100 * Math.sqrt(Math.max(0, px) / 100)
  return Math.round(raw / 10) * 10
}

/** С чем сравниваем: одна длительность на всё, самый частый способ ошибиться. */
const FIXED_MS = 400
const PUCK = 28

export default function DistanceLaw() {
  const curve = useScreenCurve()
  const reduced = usePrefersReducedMotion()

  const laneRef = useRef<HTMLDivElement>(null)
  const lawPuck = useRef<HTMLSpanElement>(null)
  const fixedPuck = useRef<HTMLSpanElement>(null)

  const [laneW, setLaneW] = useState(600)
  const [dist, setDist] = useState(240)
  const [viewportW, setViewportW] = useState(1280)

  /* Ширина дорожки и окна — измеряем на ResizeObserver, а не на каждом кадре. */
  useLayoutEffect(() => {
    const el = laneRef.current
    if (!el) return
    const read = () => {
      const w = Math.max(0, el.getBoundingClientRect().width - PUCK)
      setLaneW(w)
      // Стартовое расстояние — половина дорожки, чтобы метка не стояла в углу.
      setDist((d) => Math.min(d, w))
      setViewportW(window.innerWidth)
    }
    const ro = new ResizeObserver(read)
    ro.observe(el)
    read()
    return () => ro.disconnect()
  }, [])

  const ms = durationForDistance(dist)
  const fixedSpeed = Math.round(dist / (FIXED_MS / 1000))
  const lawSpeed = Math.round(dist / (ms / 1000))
  const viewportMs = durationForDistance(viewportW)

  const run = useCallback(() => {
    const a = lawPuck.current
    const b = fixedPuck.current
    if (!a || !b) return
    const start = (el: HTMLElement, d: number) => {
      el.style.transition = 'none'
      el.style.transform = 'translate3d(0,0,0)'
      void el.offsetHeight // без чтения геометрии браузер схлопнет сброс и старт
      el.style.transition = `transform ${d}ms ${curveCss(curve)}`
      el.style.transform = `translate3d(${dist}px,0,0)`
    }
    // Запуск в одном кадре: сравнение имеет смысл только при общем старте.
    start(a, ms)
    start(b, FIXED_MS)
  }, [curve, dist, ms])

  /* Перетаскивание метки. Измеряем дорожку на самом событии — указатель
     двигается реже кадров, и держать rAF ради этого не за что. */
  const apply = useCallback((clientX: number) => {
    const el = laneRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setDist(Math.round(Math.min(Math.max(0, clientX - r.left), r.width - PUCK)))
  }, [])

  /* Смена кривой экрана — повод показать закон в новом характере. */
  useEffect(() => {
    if (reduced) return
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve.id])

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
        param="Длительность"
        index={2}
        total={5}
        title="Длительность считается от расстояния"
        lead="Глаз читает не время, а скорость. Поэтому в системе движения нет «универсальных 300 мс»: длительность выводится из пути, который проходит объект. Ниже — тот же закон, работающий на настоящих пикселях вашего экрана."
        hint="Тяните метку по дорожке · длительность пересчитывается на месте"
      />

      <div
        className="rounded-2xl"
        style={{
          background: 'var(--m-panel)',
          border: '1px solid var(--m-line)',
          padding: 'var(--s-6)',
        }}
      >
        {/* ── Управление расстоянием ─────────────────────────────── */}
        <div
          ref={laneRef}
          className="relative touch-none select-none"
          style={{ height: 40, cursor: 'ew-resize' }}
          role="slider"
          tabIndex={0}
          aria-label="Расстояние перехода в пикселях"
          aria-valuemin={0}
          aria-valuemax={Math.round(laneW)}
          aria-valuenow={dist}
          aria-valuetext={`${dist} пикселей, ${ms} миллисекунд`}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 50 : 10
            if (e.key === 'ArrowLeft') setDist((d) => Math.max(0, d - step))
            if (e.key === 'ArrowRight') setDist((d) => Math.min(laneW, d + step))
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            apply(e.clientX)
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) apply(e.clientX)
          }}
        >
          <span
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: 'var(--m-line)' }}
          />
          {/* Отрезок пути — то, что реально измеряется */}
          <span
            aria-hidden
            className="absolute top-1/2 left-0 h-px"
            style={{ background: 'var(--m-ember)', width: dist + PUCK / 2 }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 rounded-full"
            style={{
              left: 0,
              width: PUCK,
              height: PUCK,
              marginTop: -PUCK / 2,
              border: '1px solid var(--m-ember)',
              background: 'var(--m-ember-16)',
              transform: `translateX(${dist}px)`,
            }}
          />
        </div>

        {/* ── Посчитанные числа ──────────────────────────────────── */}
        <div
          className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pt-5"
          style={{ borderTop: '1px solid var(--m-line)' }}
        >
          <Figure label="Путь" value={`${dist} px`} note="Измерено на дорожке" tone="sea" />
          <Figure label="По закону" value={`${ms} мс`} note={`${lawSpeed} px/с`} tone="ember" />
          <Figure label="Константа" value={`${FIXED_MS} мс`} note={`${fixedSpeed} px/с`} tone="dim" />
          <Figure
            label="Ваше окно"
            value={`${viewportW} px`}
            note={`пролёт во всю ширину — ${viewportMs} мс`}
            tone="sea"
          />
        </div>

        {/* ── Две дорожки, синхронный старт ──────────────────────── */}
        <div className="mt-7 flex flex-col gap-4">
          <Track
            ref={lawPuck}
            label="по закону"
            color="var(--m-ember)"
            value={`${ms} мс`}
          />
          <Track
            ref={fixedPuck}
            label="константа"
            color="var(--m-sea-35)"
            value={`${FIXED_MS} мс`}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <RunButton onClick={run}>▶ Запустить обе</RunButton>
          <span style={{ ...monoNum, color: 'var(--m-dim)' }}>
            мс = 120 + 100 · √(px / 100) · кривая {curve.name}
          </span>
        </div>
      </div>

      <Reveal y={14}>
        <p
          className="mt-6 max-w-[62ch] font-light"
          style={{ color: 'var(--m-dim)', fontSize: '0.92rem', lineHeight: 1.62 }}
        >
          Сдвиньте метку к началу — константа начнёт ползти там, где движение
          должно быть мгновенным. Сдвиньте к концу — она же выстрелит через весь
          экран, не дав глазу проследить путь. Одна длительность на все переходы
          ошибается в обе стороны сразу; это и есть причина, по которой интерфейс
          ощущается «то тормозящим, то дёрганым» при формально одинаковых числах.
        </p>
      </Reveal>
    </section>
  )
}

/* ── Числовая ячейка ──────────────────────────────────────────────── */
function Figure({
  label,
  value,
  note,
  tone,
}: {
  label: string
  value: string
  note: string
  tone: 'sea' | 'ember' | 'dim'
}) {
  const color =
    tone === 'ember' ? 'var(--m-ember)' : tone === 'sea' ? 'var(--m-sea)' : 'var(--m-faint)'
  return (
    <div>
      <span className="block" style={{ ...mono, color: 'var(--m-faint)' }}>
        {label}
      </span>
      <span
        className="block mt-2 tabular-nums"
        style={{
          color,
          fontFamily: 'var(--m-display)',
          fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span className="block mt-1.5" style={{ ...monoNum, color: 'var(--m-faint)' }}>
        {note}
      </span>
    </div>
  )
}

/* ── Дорожка прогона ──────────────────────────────────────────────
   Подписи стоят НАД дорожкой, а не по бокам. Причина не декоративная:
   фишка едет ровно на то число пикселей, которое посчитано выше, а боковые
   колонки сузили бы дорожку — и на 390px объект уехал бы за её край,
   то есть демонстрация начала бы врать про измеренное расстояние. */
const Track = forwardRef<HTMLSpanElement, { label: string; color: string; value: string }>(
  function Track({ label, color, value }, ref) {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span style={{ ...mono, color: 'var(--m-faint)' }}>{label}</span>
          <span style={{ ...monoNum, color: 'var(--m-faint)' }}>{value}</span>
        </div>
        <span className="relative block" style={{ height: 18 }}>
          <span
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: 'var(--m-line-soft)' }}
          />
          <span
            ref={ref}
            aria-hidden
            className="absolute left-0 top-1/2 block rounded-sm"
            style={{ width: 14, height: 14, marginTop: -7, background: color }}
          />
        </span>
      </div>
    )
  }
)
