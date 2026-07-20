/**
 * Раздел «КАДР» — откуда берётся правило «только transform и opacity».
 *
 * ЗАЧЕМ ЭТОТ РАЗДЕЛ
 * ─────────────────
 * Фраза «анимируем только transform и opacity» звучит как суеверие, пока не
 * показано, откуда она берётся. Берётся она из арифметики: при 60 кадрах в
 * секунду на кадр отведено 16,7 мс, при 120 — 8,3 мс, и в этот бюджет должна
 * уложиться вся работа браузера. Свойства отличаются не «скоростью», а тем,
 * сколько этапов конвейера они запускают заново.
 *
 * ЖИВОЕ ЧИСЛО
 * ───────────
 * Частота обновления берётся не из предположения, а измеряется на машине
 * посетителя: короткая серия rAF, из интервалов между кадрами берётся медиана.
 * Из неё считается бюджет кадра, в который упирается таблица ниже. Замер идёт
 * ровно один раз и только когда раздел в кадре, после результата цикл
 * останавливается — постоянно работающий rAF был бы ровно той проблемой,
 * о которой раздел и рассказывает.
 *
 * ЗДЕСЬ НАМЕРЕННО НИЧЕГО НЕ ДВИГАЕТСЯ. Демонстрировать проблему, анимируя
 * width, значило бы нарушить то самое правило, которое раздел защищает.
 */
import { useEffect, useRef, useState } from 'react'
import { mono, monoNum } from './palette'
import { Reveal, SectionHead, useInViewGate } from './primitives'

/* ── Этапы конвейера кадра ────────────────────────────────────────
   Порядок обязателен: каждый следующий выполняется только после
   предыдущего, поэтому поднятие раннего этапа тянет за собой все
   последующие. */
const STAGES = [
  { id: 'style', name: 'Стиль', note: 'Пересчёт применимых правил' },
  { id: 'layout', name: 'Раскладка', note: 'Геометрия соседей заново' },
  { id: 'paint', name: 'Отрисовка', note: 'Заливка пикселей в слои' },
  { id: 'composite', name: 'Композит', note: 'Сборка слоёв на GPU' },
] as const

type StageId = (typeof STAGES)[number]['id']

const PROPS: { css: string; stages: StageId[]; ok: boolean; verdict: string }[] = [
  {
    css: 'transform',
    stages: ['composite'],
    ok: true,
    verdict:
      'Слой уже отрисован — при сборке меняется только его положение. Считает GPU, главный поток свободен. Единственный способ двигать что-либо в каждом кадре.',
  },
  {
    css: 'opacity',
    stages: ['composite'],
    ok: true,
    verdict:
      'Прозрачность применяется к готовому слою на этапе сборки. Стоимость не зависит от того, насколько сложное содержимое внутри слоя.',
  },
  {
    css: 'background-color',
    stages: ['style', 'paint', 'composite'],
    ok: false,
    verdict:
      'Раскладка не трогается, но слой приходится заливать заново каждый кадр. На одной кнопке незаметно, на десятке карточек одновременно — уже нет.',
  },
  {
    css: 'filter: blur()',
    stages: ['style', 'paint', 'composite'],
    ok: false,
    verdict:
      'Отрисовка с размытием стоит кратно обычной и растёт с радиусом. Отдельная беда на тексте: размывается ровно то, что человек в этот момент пытается прочесть.',
  },
  {
    css: 'width / height',
    stages: ['style', 'layout', 'paint', 'composite'],
    ok: false,
    verdict:
      'Поднимает раскладку: браузер пересчитывает геометрию соседей, потом всё перерисовывает. Заменяется на transform: scale с обратной компенсацией у детей.',
  },
  {
    css: 'top / left',
    stages: ['style', 'layout', 'paint', 'composite'],
    ok: false,
    verdict:
      'То же самое: позиционирование живёт в раскладке. Ровно тот же сдвиг через transform: translate стоит одного этапа вместо четырёх.',
  },
]

export default function FrameBudget() {
  const [sel, setSel] = useState(0)
  const [gateRef, visible] = useInViewGate<HTMLElement>(0.25)
  const [hz, setHz] = useState<number | null>(null)
  const measured = useRef(false)

  /* Замер частоты обновления: 24 интервала, медиана вместо среднего —
     один затык на главном потоке сдвинул бы среднее и соврал бы про экран. */
  useEffect(() => {
    if (!visible || measured.current) return
    measured.current = true
    const gaps: number[] = []
    let prev = 0
    let raf = 0
    const tick = (now: number) => {
      if (prev) gaps.push(now - prev)
      prev = now
      if (gaps.length < 24) {
        raf = requestAnimationFrame(tick)
        return
      }
      gaps.sort((a, b) => a - b)
      const med = gaps[Math.floor(gaps.length / 2)]
      setHz(med > 0 ? Math.round(1000 / med) : null)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible])

  const p = PROPS[sel]
  const budget = hz ? 1000 / hz : null

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
        param="Кадр"
        index={5}
        total={5}
        title="«Только transform и opacity» — это арифметика"
        lead="Свойства отличаются не скоростью, а количеством этапов конвейера, которые они запускают заново. Выберите свойство — станет видно, докуда оно поднимает работу браузера и сколько этой работы придётся успеть внутри одного кадра."
        hint={
          hz
            ? `Ваш экран: ${hz} Гц · бюджет кадра ${budget?.toFixed(1)} мс · замерено здесь`
            : 'Частота обновления замеряется на вашей машине…'
        }
      />

      <div className="grid lg:grid-cols-[minmax(0,20rem)_1fr] gap-6 lg:gap-10">
        {/* Список свойств */}
        <div className="flex flex-col gap-1.5">
          {PROPS.map((x, i) => {
            const on = i === sel
            return (
              <button
                key={x.css}
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={on}
                className="flex items-center justify-between rounded-xl text-left"
                style={{
                  ...monoNum,
                  fontSize: '0.82rem',
                  color: on ? 'var(--m-chalk)' : 'var(--m-dim)',
                  background: on ? 'var(--m-panel-2)' : 'var(--m-panel)',
                  border: `1px solid ${on ? 'var(--m-sea-35)' : 'var(--m-line)'}`,
                  paddingInline: 'var(--s-4)',
                  paddingBlock: 'var(--s-3)',
                  transition: 'transform var(--d-fast) var(--m-ease)',
                }}
                onPointerEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(3px)'
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span>{x.css}</span>
                <span style={{ color: x.ok ? 'var(--m-sea)' : 'var(--m-ember)' }}>
                  {x.stages.length}/4
                </span>
              </button>
            )
          })}
        </div>

        {/* Конвейер */}
        <div
          className="rounded-2xl"
          style={{
            background: 'var(--m-panel)',
            border: '1px solid var(--m-line)',
            padding: 'var(--s-6)',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAGES.map((s) => {
              const on = p.stages.includes(s.id)
              return (
                <div
                  key={s.id}
                  className="rounded-xl"
                  style={{
                    padding: 'var(--s-4)',
                    background: on ? 'var(--m-panel-2)' : 'transparent',
                    border: `1px solid ${
                      on ? (p.ok ? 'var(--m-sea-35)' : 'var(--m-ember)') : 'var(--m-line-soft)'
                    }`,
                    // Подсветка применяется мгновенно: это смена состояния,
                    // а не анимация. Переход по цвету здесь стоил бы paint —
                    // ровно то, о чём раздел и предупреждает.
                    opacity: on ? 1 : 0.4,
                  }}
                >
                  <span
                    className="block"
                    style={{
                      ...mono,
                      color: on ? (p.ok ? 'var(--m-sea)' : 'var(--m-ember)') : 'var(--m-faint)',
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="block mt-2 font-light"
                    style={{ color: 'var(--m-dim)', fontSize: '0.78rem', lineHeight: 1.45 }}
                  >
                    {s.note}
                  </span>
                </div>
              )
            })}
          </div>

          <p
            className="mt-6 pt-5 font-light"
            style={{
              borderTop: '1px solid var(--m-line-soft)',
              color: 'var(--m-dim)',
              fontSize: '0.95rem',
              lineHeight: 1.62,
            }}
          >
            {p.verdict}
          </p>

          <p className="mt-5" style={{ ...monoNum, color: 'var(--m-faint)', lineHeight: 1.6 }}>
            {p.css} → {p.stages.length} из 4 этапов
            {budget ? ` · уложиться надо в ${budget.toFixed(1)} мс` : ''}
          </p>
        </div>
      </div>

      <Reveal y={14}>
        <p
          className="mt-8 max-w-[62ch] font-light"
          style={{ color: 'var(--m-dim)', fontSize: '0.92rem', lineHeight: 1.62 }}
        >
          Отсюда и правило. Оно не про чистоту кода: два свойства из шести
          укладываются в бюджет на любой машине, остальные укладываются на вашей
          и не укладываются на той, с которой сайт открывает ваш заказчик.
          Проверить все машины нельзя — можно не создавать проблему.
        </p>
      </Reveal>
    </section>
  )
}
