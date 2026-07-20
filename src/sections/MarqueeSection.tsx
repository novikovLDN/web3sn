/**
 * Переходная лента между первым экраном и профилем.
 *
 * Что было и почему это убрано: две ленты карточек-заглушек с бейджем «Скоро»
 * и абстрактными иконками. Пустая карточка — самый дешёвый сигнал, который
 * сайт может подать: она сообщает «здесь должна была быть работа, но её нет».
 * Лучше не показывать ничего, чем показывать рамку от ненаписанного.
 *
 * Что вместо: чистое типографическое полотно — компетенции крупным кеглем,
 * без плашек и иконок. Выбор в пользу типографики, а не «карточек получше»,
 * сделан сознательно: этой секции нечего иллюстрировать, у неё роль связки
 * и заявления. Крупный шрифт заявление держит, картинка — нет.
 *
 * Ритм собран из трёх скоростей: бесконечный CSS-марки (постоянное движение),
 * смещение от скролла (лента реагирует на пользователя) и две строки в
 * противоходе (даёт глубину без параллакса и без лишних слоёв).
 *
 * ⚠️ Ширина анимируемого трека держится намеренно небольшой. Full-bleed слой
 * шире ~12000px превышает max texture size GPU на реальных машинах, и слой
 * просто перестаёт отрисовываться. В проекте это уже случалось. Отсюда:
 * ровно две копии списка, короткие списки и кегль, ограниченный --t-h2.
 */

import { useEffect, useRef } from 'react'
import { Reveal } from '../design/primitives'
import { prefersReducedMotion } from '../design/motion'
import { IDENTITY } from '../data/content'

/** Верхняя строка — что делаю. Нижняя — чем это становится у клиента. */
const ROW_A = ['3D & Motion', 'Product Design', 'Creative Development', 'Brand Systems']
const ROW_B = ['Интерфейс', 'Айдентика', 'Анимация', 'Продакшен']

/** Разделитель между словами. Одна форма, один акцент — без зоопарка глифов. */
function Sep() {
  return (
    <span
      aria-hidden
      className="shrink-0"
      style={{
        color: 'var(--a)',
        fontSize: 'var(--t-h3)',
        lineHeight: 1,
        paddingInline: 'var(--s-8)',
      }}
    >
      /
    </span>
  )
}

/**
 * Одна лента. Внутренний трек крутится CSS-анимацией (-50% за цикл — отсюда
 * ровно две копии списка), внешняя обёртка смещается от скролла. Разделение
 * на два слоя нужно, чтобы два источника движения не переписывали друг другу
 * один и тот же transform.
 */
function Band({
  words,
  outlined,
  reverse,
  trackRef,
}: {
  words: string[]
  /** Контурное начертание — вторая строка «отступает» на второй план. */
  outlined: boolean
  reverse: boolean
  trackRef: React.RefObject<HTMLDivElement>
}) {
  const doubled = [...words, ...words]
  const reduce = prefersReducedMotion()

  return (
    <div className="overflow-hidden" style={{ paddingBlock: 'var(--s-2)' }}>
      <div ref={trackRef} style={{ willChange: 'transform' }}>
        {/* Обратный ход — animation-direction, а не вторые кейфреймы:
            в проекте уже есть .animate-marquee, дублировать его незачем. */}
        <div
          className={`flex items-center w-max ${reduce ? '' : 'animate-marquee'}`}
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {doubled.map((w, i) => (
            <span key={`${w}-${i}`} className="flex items-center shrink-0">
              <span
                className="t-h2 whitespace-nowrap select-none"
                style={
                  outlined
                    ? {
                        color: 'transparent',
                        WebkitTextStroke: '1px var(--n-400)',
                      }
                    : { color: 'var(--n-900)' }
                }
              >
                {w}
              </span>
              <Sep />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackA = useRef<HTMLDivElement>(null)
  const trackB = useRef<HTMLDivElement>(null)

  // Пауза, пока лента вне экрана.
  //
  // CSS-анимация сама не останавливается при уходе из кадра: бесконечный
  // marquee шириной в тысячи пикселей продолжал двигать свой композиторский
  // слой всё время, пока открыта страница. Замер на этом проекте показал,
  // что именно это держало медиану кадра на 25мс против 8мс в reduced-motion.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.idle = entry.isIntersecting ? 'false' : 'true'
      },
      // Запас, чтобы к моменту появления лента уже двигалась и не
      // «стартовала с нуля» на глазах у пользователя.
      { rootMargin: '20% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const target = { v: 0 }
    const current = { v: 0 }
    let raf: number | null = null

    const render = () => {
      const diff = target.v - current.v
      current.v += diff * 0.1
      // Амплитуда намеренно маленькая: скролл здесь — акцент поверх постоянного
      // движения, а не второй марки. Большое смещение читается как рывок.
      const off = current.v
      if (trackA.current) trackA.current.style.transform = `translate3d(${off}px,0,0)`
      if (trackB.current) trackB.current.style.transform = `translate3d(${-off}px,0,0)`
      raf = Math.abs(diff) > 0.3 ? requestAnimationFrame(render) : null
    }

    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // Прогресс прохода секции через экран: -1 … 1 от входа к выходу.
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      target.v = -p * 140
      if (raf == null) raf = requestAnimationFrame(render)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf != null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-pad"
      style={{ background: 'var(--n-50)' }}
    >
      {/* Заявление слева от ленты — оно задаёт, как её читать */}
      <div className="shell" style={{ marginBottom: 'var(--s-12)' }}>
        <Reveal y={16} className="flex flex-col">
          <span className="t-mono" style={{ color: 'var(--a)' }}>
            {IDENTITY.roleRu}
          </span>
          <p
            className="t-lead"
            style={{ color: 'var(--n-700)', maxWidth: '44ch', marginTop: 'var(--s-4)' }}
          >
            Одна голова на весь путь продукта — от позиционирования до кода
            в продакшене. Ниже — то, что в этот путь входит.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col" style={{ gap: 'var(--s-2)' }}>
        <Band words={ROW_A} outlined={false} reverse={false} trackRef={trackA} />
        <Band words={ROW_B} outlined reverse trackRef={trackB} />
      </div>
    </section>
  )
}
