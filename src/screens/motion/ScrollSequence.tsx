/**
 * Раздел «СКРОЛЛ» — прокрутка как таймлайн, canvas вместо видео.
 *
 * ЗАЧЕМ ЭТО ЗДЕСЬ
 * ───────────────
 * Стандартный способ показать моушн на сайте — положить в hero автовоспроизводимое
 * видео. Это признание, что сам сайт демонстрацией не является: движение на нём
 * идёт отдельно от того, что делает посетитель. Приём, которым это заменяют
 * с 2025 года, — покадровая последовательность, отрисованная в canvas и
 * привязанная к позиции прокрутки. Скролл перестаёт быть транспортёром и
 * становится ручкой протяжки: назад — и кадр отматывается назад.
 *
 * Почему canvas, а не <video> со скрабом по currentTime: браузер не обязан
 * отдавать произвольный кадр немедленно, и на быстром свайпе видео заикается.
 * Отрисовка готового кадра в canvas — одна операция, у которой нет состояния
 * декодера, поэтому протяжка одинаково точна в обе стороны и на любой скорости.
 *
 * ЧЕСТНОСТЬ ИСТОЧНИКА
 * ───────────────────
 * На реальном проекте кадры приходят из просчёта — последовательность WebP,
 * подгружаемая по направлению прокрутки, урезанная по количеству на мобильных.
 * Здесь просчёта нет и выдумывать несуществующий шоурил незачем, поэтому кадр
 * рисуется процедурно прямо на клиенте. Отличается только источник кадра.
 * Механика протяжки — та же и написана здесь настоящая: прогресс квантуется
 * в номер кадра, кадр рисуется ровно один раз, при неизменившемся номере
 * не делается ничего. Счётчик под сценой это и показывает.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Ни одного requestAnimationFrame: подписка на прогресс прокрутки срабатывает
 * только когда прокрутка идёт, и первым делом сравнивает номер кадра со
 * старым. Стоять на этой секции — бесплатно.
 *
 * ГОЧА: sticky ломается, если у любого предка есть overflow-hidden. Поэтому
 * ни на секции, ни на её обёртках обрезки нет — она живёт только на самом
 * липком элементе.
 */
import { useEffect, useRef, useState, type Ref } from 'react'
import { useScroll } from 'framer-motion'
import { T, mono, monoNum } from './palette'
import { usePrefersReducedMotion } from './primitives'

/** Кадров в последовательности. На узком экране набор урезан — ровно та же
    экономия, что делают с настоящей последовательностью WebP. */
const FRAMES_WIDE = 48
const FRAMES_NARROW = 24

/* ── Отрисовка одного кадра ───────────────────────────────────────
   Кольцо из вертикальных штрихов в перспективе: положение по эллипсу даёт
   глубину, высота штриха модулируется по фазе. Всё в координатах 0..1 от
   размера холста — кадр не зависит от того, на чём его рисуют. */
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w * 0.42, h * 0.95)
  const N = 84
  const turn = t * Math.PI * 2

  // Горизонт: та же эллиптическая траектория, по которой идут штрихи.
  ctx.strokeStyle = 'rgba(134,183,176,0.14)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(cx, cy, R, R * 0.26, 0, 0, Math.PI * 2)
  ctx.stroke()

  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + turn
    const sin = Math.sin(a)
    const x = cx + R * Math.cos(a)
    const y = cy + R * 0.26 * sin
    // Глубина: дальняя половина кольца тоньше, бледнее и ниже.
    const depth = (sin + 1) / 2
    const s = 0.35 + 0.65 * depth
    const bar = h * 0.34 * s * (0.35 + 0.65 * Math.abs(Math.sin(a * 3 + turn * 2)))

    // Один штрих из ста подсвечен акцентом — метка оборота, по которой
    // видно, что кадр действительно отматывается назад, а не просто мигает.
    const marked = i === 0
    ctx.fillStyle = marked
      ? `rgba(226,114,91,${0.35 + 0.65 * depth})`
      : `rgba(134,183,176,${0.08 + 0.5 * depth})`
    ctx.fillRect(x - s, y - bar / 2, Math.max(1, s * 2), bar)
  }
}

export default function ScrollSequence() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrame = useRef(-1)
  const drawn = useRef(0)
  const events = useRef(0)

  /* Количество кадров живёт в ref, а не только в состоянии: им пользуется
     обработчик прокрутки, и пересоздавать подписку ради смены числа кадров
     при ресайзе незачем. Состояние нужно лишь для подписи под сценой. */
  const totalRef = useRef(FRAMES_WIDE)
  const [totalLabel, setTotalLabel] = useState(FRAMES_WIDE)

  /* Показания счётчиков пишем прямо в textContent, минуя состояние React.
     Перерисовывать компонент на каждое событие прокрутки ради трёх строк —
     верный способ потерять ровно те кадры, о плавности которых раздел. */
  const outFrame = useRef<HTMLElement>(null)
  const outDrawn = useRef<HTMLElement>(null)
  const outEvents = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /* Размер холста и протяжка живут в ОДНОМ эффекте намеренно.
     Изменение canvas.width стирает содержимое холста — значит, подгонка
     размера обязана уметь тут же перерисовать текущий кадр. Пока это были
     два эффекта, ResizeObserver срабатывал после первой отрисовки и оставлял
     пустой холст: счётчик показывал «отрисовок 2», а сцена была чёрная.
     Поймано вживую в браузере. */
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    /** Перерисовать тот кадр, на котором стоим сейчас. */
    const paint = () => {
      const f = Math.max(0, lastFrame.current)
      drawFrame(ctx, cv.width, cv.height, f / totalRef.current)
    }

    /* Потолок DPR — 2: третий множитель разрешения даёт вчетверо больше
       пикселей на кадр и ноль видимой разницы. */
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = cv.getBoundingClientRect()
      const w = Math.round(r.width * dpr)
      const h = Math.round(r.height * dpr)
      if (w === cv.width && h === cv.height) return
      cv.width = w
      cv.height = h
      const t = r.width < 640 ? FRAMES_NARROW : FRAMES_WIDE
      totalRef.current = t
      setTotalLabel(t)
      paint()
    }

    const render = (p: number) => {
      events.current += 1
      const total = totalRef.current
      // Квантование в номер кадра: последовательность дискретна, и именно
      // это делает протяжку дешёвой — между двумя соседними позициями
      // прокрутки чаще всего лежит один и тот же кадр.
      const f = Math.min(total - 1, Math.max(0, Math.round(p * (total - 1))))
      if (f !== lastFrame.current) {
        lastFrame.current = f
        drawn.current += 1
        drawFrame(ctx, cv.width, cv.height, f / total)
        if (outFrame.current) {
          outFrame.current.textContent = `${String(f + 1).padStart(2, '0')} / ${total}`
        }
        if (outDrawn.current) outDrawn.current.textContent = String(drawn.current)
      }
      if (outEvents.current) outEvents.current.textContent = String(events.current)
    }

    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    fit()

    // Первый кадр рисуем сразу: пустой холст до первого касания скролла
    // читался бы как незагрузившийся ассет.
    render(reduced ? 0.5 : scrollYProgress.get())

    if (reduced) return () => ro.disconnect()
    const stop = scrollYProgress.on('change', render)
    return () => {
      ro.disconnect()
      stop()
    }
  }, [scrollYProgress, reduced])

  return (
    <section
      ref={sectionRef}
      className="relative"
      // 260vh: столько нужно, чтобы 48 кадров разошлись по прокрутке
      // читаемым шагом. Меньше — и кадры перескакивают через один.
      style={{ height: reduced ? 'auto' : '260vh' }}
    >
      <div
        className={reduced ? '' : 'sticky top-0'}
        style={{ minHeight: reduced ? undefined : '100vh' }}
      >
        <div
          className="mx-auto w-full flex flex-col justify-center"
          style={{
            maxWidth: 'var(--max-w)',
            paddingInline: 'var(--gutter)',
            paddingBlock: 'var(--s-24)',
            minHeight: reduced ? undefined : '100vh',
          }}
        >
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 pb-4" style={{ borderBottom: '1px solid var(--m-line)' }}>
            <span style={{ ...mono, color: 'var(--m-ember)' }}>Скролл</span>
            <h2 style={{ ...T.h2, color: 'var(--m-chalk)', fontFamily: 'var(--m-display)' }}>
              Прокрутка — это протяжка, а не транспортёр
            </h2>
            <span className="ml-auto flex items-center gap-1.5" aria-label="Раздел 4 из 5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    display: 'block',
                    width: i === 4 ? 16 : 6,
                    height: 2,
                    background: i === 4 ? 'var(--m-ember)' : 'var(--m-line)',
                  }}
                />
              ))}
            </span>
          </div>

          <div className="mt-6 grid lg:grid-cols-[1fr_20rem] gap-6 lg:gap-10 items-center">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Покадровая последовательность, привязанная к прокрутке страницы"
              className="w-full rounded-2xl"
              style={{
                height: 'clamp(220px, 42vh, 420px)',
                background: 'var(--m-panel)',
                border: '1px solid var(--m-line)',
              }}
            />

            <div>
              <p
                className="font-light"
                style={{ color: 'var(--m-dim)', fontSize: '0.95rem', lineHeight: 1.62 }}
              >
                Прокрутите вперёд и назад. Кадр отматывается ровно туда, где
                оказался ваш палец — потому что здесь нет воспроизведения,
                которое надо догонять. Есть номер кадра, посчитанный из позиции
                прокрутки, и одна отрисовка на изменившийся номер.
              </p>

              <dl className="mt-6 flex flex-col gap-3">
                <Row k="Кадр" vRef={outFrame} initial={`01 / ${totalLabel}`} accent />
                <Row k="Отрисовок" vRef={outDrawn} initial="0" />
                <Row k="Событий прокрутки" vRef={outEvents} initial="0" />
              </dl>

              <p className="mt-5" style={{ ...monoNum, color: 'var(--m-faint)', lineHeight: 1.6 }}>
                Разница между двумя нижними числами — работа, которой не было
                сделано. Это и есть весь секрет плавной протяжки.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({
  k,
  vRef,
  initial,
  accent,
}: {
  k: string
  vRef: Ref<HTMLElement>
  initial: string
  accent?: boolean
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 pb-2"
      style={{ borderBottom: '1px solid var(--m-line-soft)' }}
    >
      <dt style={{ ...mono, color: 'var(--m-faint)' }}>{k}</dt>
      <dd
        ref={vRef}
        className="tabular-nums"
        style={{
          fontFamily: 'var(--m-mono)',
          fontSize: '1rem',
          color: accent ? 'var(--m-ember)' : 'var(--m-sea)',
        }}
      >
        {initial}
      </dd>
    </div>
  )
}
