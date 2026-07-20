/**
 * 05 · Разбор перехода по слоям.
 *
 * ЗАЧЕМ ЭТОТ РАЗДЕЛ
 * ─────────────────
 * Заказчик видит переход как одно событие: «карточка открылась». Работа
 * моушн-дизайнера состоит в том, что это событие расписано по слоям, и у
 * каждого слоя своя длительность, своя задержка и своя кривая. Именно эта
 * таблица, а не референс из Pinterest, отдаётся в разработку.
 *
 * Здесь переход не проигрывается, а СКРАБИТСЯ: ползунок — это позиция на
 * таймлайне, и превью пересобирается для произвольного момента. Разница
 * принципиальная. Проигрывание показывает результат, скраб показывает
 * устройство: видно, что подложка уже доехала, заголовок ещё под маской,
 * а сетка не двигалась вообще.
 *
 * Слои выключаются по одному. Выключенный слой не исчезает — он мгновенно
 * встаёт в конечное состояние. Это и есть ответ на вопрос «что будет, если
 * этого движения не делать»: обычно ничего страшного, но переход теряет
 * причинно-следственную связь.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Скраб не запускает ни одной анимации: значения transform и opacity
 * считаются напрямую из позиции ползунка через решатель cubic-bezier
 * (см. primitives.cubicBezier). Кнопка «проиграть» крутит один rAF на
 * длительность перехода и гасит себя по завершении — постоянного цикла
 * на странице не остаётся. Анимируются только transform и opacity.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { ease } from '../../design/motion'
import { DISPLAY, MONO } from './palette'
import { SectionHead, cubicBezier, usePrefersReducedMotion } from './primitives'

/* ── Спецификация перехода ────────────────────────────────────────
   Ровно то, что уходит в разработку: слой, окно на таймлайне, кривая
   и перечень свойств. Кривые — имена из design/motion.ts, а не числа. */
type Layer = {
  id: string
  name: string
  /** Начало и конец окна слоя, мс от начала перехода. */
  from: number
  to: number
  easeName: 'entrance' | 'standard' | 'editorial'
  props: string
  role: string
}

const TOTAL = 1150

const LAYERS: Layer[] = [
  {
    id: 'scrim',
    name: 'Подложка',
    from: 0,
    to: 240,
    easeName: 'standard',
    props: 'opacity',
    role: 'Гасит фон и сообщает, что всё остальное сейчас недоступно. Уходит первой — задерживать её нечем.',
  },
  {
    id: 'card',
    name: 'Карточка',
    from: 80,
    to: 730,
    easeName: 'entrance',
    props: 'translateY · opacity',
    role: 'Главный объект. Приезжает снизу — оттуда, где на него нажали. Направление здесь несёт смысл, а не вкус.',
  },
  {
    id: 'title',
    name: 'Заголовок',
    from: 260,
    to: 1010,
    easeName: 'entrance',
    props: 'translateY под маской',
    role: 'Выезжает из-под маски внутри уже приехавшей карточки. Вложенное движение — то, что отличает переход от подмены кадра.',
  },
  {
    id: 'action',
    name: 'Кнопка',
    from: 420,
    to: 1070,
    easeName: 'standard',
    props: 'translateY · opacity',
    role: 'Приходит последней. Пока переход не закончился, нажимать нечего — и взгляд к этому моменту уже дошёл донизу.',
  },
  {
    id: 'grid',
    name: 'Сетка фона',
    from: 0,
    to: 0,
    easeName: 'standard',
    props: '— не двигается',
    role: 'Стоит. В любом переходе обязано быть то, что не движется: без неподвижной опоры глазу нечем измерить движение остальных слоёв.',
  },
]

const EASE_FN = {
  entrance: cubicBezier(...(ease.entrance as unknown as [number, number, number, number])),
  standard: cubicBezier(...(ease.standard as unknown as [number, number, number, number])),
  editorial: cubicBezier(...(ease.editorial as unknown as [number, number, number, number])),
}

/** Прогресс слоя в момент t (мс), уже проведённый через свою кривую. */
function progressOf(l: Layer, t: number, muted: boolean): number {
  if (muted) return 1
  if (l.to <= l.from) return 1
  const raw = (t - l.from) / (l.to - l.from)
  return EASE_FN[l.easeName](Math.min(1, Math.max(0, raw)))
}

export default function LayerBreakdown() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const visible = useInView(sectionRef, { amount: 0.2 })

  const [t, setT] = useState(TOTAL)
  const [muted, setMuted] = useState<Set<string>>(() => new Set())
  const rafRef = useRef(0)

  const isMuted = useCallback((id: string) => muted.has(id), [muted])

  const toggle = (id: string) =>
    setMuted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  /* Проигрывание — один rAF на длительность перехода, без хвоста.
     Цикл сам себя останавливает на t = TOTAL; постоянно работающего
     таймера на странице не появляется. */
  const play = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      setT(Math.min(TOTAL, elapsed))
      if (elapsed < TOTAL) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // Цикл не должен пережить уход секции из кадра или размонтирование.
  useEffect(() => {
    if (!visible) cancelAnimationFrame(rafRef.current)
    return () => cancelAnimationFrame(rafRef.current)
  }, [visible])

  const p = useMemo(
    () => Object.fromEntries(LAYERS.map((l) => [l.id, progressOf(l, t, isMuted(l.id))])),
    [t, isMuted]
  )

  return (
    <section ref={sectionRef} id="m-layers" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-6xl">
        <SectionHead
          n="05"
          title="Переход состоит из слоёв"
          note="Ползунок — позиция на таймлайне"
          lead="Один переход, разобранный на пять слоёв. Ползунок не проигрывает его, а останавливает в любой точке: видно, что подложка уже доехала, заголовок ещё под маской, а сетка не двигалась вовсе. Любой слой можно выключить и посмотреть, что переход без него теряет."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 items-start">
          {/* ── Превью: собранный кадр в момент t ──────────────────
              Липнет на десктопе: колонка спеки вдвое выше, и без sticky
              превью уезжает из кадра ровно тогда, когда посетитель
              выключает слои и хочет увидеть результат.
              Обрезка живёт на самом липком элементе — overflow-hidden
              у предка сломал бы прилипание. */}
          <div className="lg:sticky lg:top-20">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'var(--m-abyss)',
                border: '1px solid var(--m-border)',
                height: 'clamp(300px, 46vh, 420px)',
              }}
            >
            {/* Слой «сетка»: опора кадра. Не двигается ни при каких t. */}
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--m-sea-16) 1px, transparent 1px), linear-gradient(to bottom, var(--m-sea-16) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                opacity: isMuted('grid') ? 0.35 : 1,
              }}
            />

            {/* Подложка */}
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'rgba(7,19,22,0.72)', opacity: p.scrim }}
            />

            {/* Карточка */}
            <div
              className="absolute left-1/2 top-1/2 rounded-2xl p-6 flex flex-col justify-between"
              style={{
                width: 'min(78%, 300px)',
                height: 'min(64%, 220px)',
                background: 'var(--m-panel)',
                border: '1px solid var(--m-sea-35)',
                opacity: p.card,
                // -50%/-50% центрируют, третий член — само движение слоя.
                transform: `translate(-50%, calc(-50% + ${(1 - p.card) * 28}px))`,
              }}
            >
              {/* Заголовок под маской */}
              <span className="block overflow-hidden" style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}>
                <span
                  className="block font-bold uppercase"
                  style={{
                    color: 'var(--m-chalk)',
                    fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    transform: `translateY(${(1 - p.title) * 110}%)`,
                    ...DISPLAY,
                  }}
                >
                  Карточка открылась
                </span>
              </span>

              <span
                className="inline-flex self-start items-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.18em]"
                style={{
                  background: 'var(--m-ember)',
                  color: 'var(--m-abyss)',
                  opacity: p.action,
                  transform: `translateY(${(1 - p.action) * 14}px)`,
                  ...MONO,
                }}
              >
                Действие
              </span>
            </div>

              <span
                className="absolute left-4 bottom-3 text-[10px] tabular-nums tracking-[0.16em]"
                style={{ color: 'var(--m-sea)', ...MONO }}
              >
                {String(Math.round(t)).padStart(4, '0')} мс
              </span>
            </div>
          </div>

          {/* ── Таймлайн и спека ── */}
          <div>
            <div className="flex flex-col">
              {LAYERS.map((l) => {
                const off = isMuted(l.id)
                const still = l.to <= l.from
                return (
                  <div key={l.id} className="py-3" style={{ borderTop: '1px solid var(--m-border)' }}>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <button
                        type="button"
                        onClick={() => toggle(l.id)}
                        aria-pressed={!off}
                        className="text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
                        style={{ color: off ? 'var(--m-dim)' : 'var(--m-chalk)', ...MONO }}
                      >
                        {off ? '○' : '●'} {l.name}
                      </button>
                      <span className="text-[10px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                        {still ? 'без движения' : `${l.from}–${l.to} мс · ${l.easeName}`}
                      </span>
                      <span className="ml-auto text-[10px] tracking-[0.14em]" style={{ color: 'var(--m-sea)', ...MONO }}>
                        {l.props}
                      </span>
                    </div>

                    {/* Дорожка слоя. Позиция и длина окна статичны —
                        это чертёж, а не анимация. */}
                    <div className="relative mt-2 h-1.5 rounded-full" style={{ background: 'var(--m-sea-16)' }}>
                      {!still && (
                        <span
                          aria-hidden
                          className="absolute top-0 bottom-0 rounded-full"
                          style={{
                            left: `${(l.from / TOTAL) * 100}%`,
                            width: `${((l.to - l.from) / TOTAL) * 100}%`,
                            background: off ? 'var(--m-dim)' : 'var(--m-sea)',
                            opacity: off ? 0.4 : 1,
                          }}
                        />
                      )}
                    </div>

                    <p className="mt-2 max-w-[52ch] font-light text-[0.86rem]" style={{ color: 'var(--m-dim)', lineHeight: 1.55 }}>
                      {l.role}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* ── Пульт таймлайна ── */}
            <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--m-border)' }}>
              <input
                type="range"
                min={0}
                max={TOTAL}
                step={5}
                value={Math.round(t)}
                onChange={(e) => {
                  cancelAnimationFrame(rafRef.current)
                  setT(Number(e.target.value))
                }}
                className="w-full"
                style={{ accentColor: 'var(--m-sea)' }}
                aria-label="Позиция на таймлайне перехода, миллисекунды"
              />
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {!reduced && (
                  <button
                    type="button"
                    onClick={play}
                    className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                    style={{ color: 'var(--m-ember)', ...MONO }}
                  >
                    ▶ Проиграть переход
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    cancelAnimationFrame(rafRef.current)
                    setT(0)
                  }}
                  className="text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
                  style={{ color: 'var(--m-dim)', ...MONO }}
                >
                  ↺ В начало
                </button>
                <span className="text-[11px] tracking-[0.14em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                  Весь переход · {TOTAL} мс
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-[58ch] font-light" style={{ color: 'var(--m-dim)', lineHeight: 1.62 }}>
          Такая таблица и есть результат работы над переходом: разработчику
          отдаются окна, кривые и свойства, а не видеозапись, по которой он
          будет угадывать тайминги. Демонстрационный переход.
        </p>
      </div>
    </section>
  )
}
