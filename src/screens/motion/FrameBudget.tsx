/**
 * 06 · Бюджет кадра.
 *
 * ЗАЧЕМ ЭТОТ РАЗДЕЛ
 * ─────────────────
 * Фраза «анимируем только transform и opacity» звучит как суеверие, пока не
 * показано, откуда она берётся. Берётся она из арифметики: при 60 кадрах в
 * секунду на кадр отведено 16.7 мс, при 120 — 8.3 мс, и в этот бюджет должна
 * уложиться вся работа браузера. Свойства отличаются не «скоростью», а тем,
 * сколько этапов конвейера они запускают заново.
 *
 * Раздел — не анимация, а таблица, которую можно опросить: выбранное свойство
 * подсвечивает этапы, которые оно поднимает. Здесь ничего не двигается
 * намеренно. Это тот случай, когда доказательство — расчёт, а не движение;
 * демонстрировать проблему, анимируя width, значило бы нарушить ровно то
 * правило, которое раздел защищает.
 */
import { useState } from 'react'
import { MONO } from './palette'
import { SectionHead } from './primitives'

/* ── Этапы конвейера кадра ────────────────────────────────────────
   Порядок обязателен: каждый следующий выполняется только после
   предыдущего, поэтому поднятие раннего этапа тянет за собой все
   последующие. */
const STAGES = [
  { id: 'style', name: 'Стиль', note: 'Пересчёт применимых правил' },
  { id: 'layout', name: 'Раскладка', note: 'Геометрия всех соседей заново' },
  { id: 'paint', name: 'Отрисовка', note: 'Заливка пикселей в слои' },
  { id: 'composite', name: 'Композит', note: 'Сборка готовых слоёв на GPU' },
] as const

type StageId = (typeof STAGES)[number]['id']

type Prop = {
  css: string
  /** Этапы, которые свойство поднимает. */
  stages: StageId[]
  verdict: string
  ok: boolean
}

const PROPS: Prop[] = [
  {
    css: 'transform',
    stages: ['composite'],
    ok: true,
    verdict:
      'Слой уже отрисован — меняется только его положение при сборке. Считает GPU, главный поток свободен. Это единственный способ двигать что-либо в каждом кадре.',
  },
  {
    css: 'opacity',
    stages: ['composite'],
    ok: true,
    verdict:
      'То же самое: готовый слой смешивается с фоном с другим коэффициентом. Перерисовывать нечего.',
  },
  {
    css: 'filter: blur()',
    stages: ['composite'],
    ok: false,
    verdict:
      'Формально композиторское, но каждый кадр требует прохода размытия по всей площади слоя. На крупных плоскостях съедает бюджет целиком. Отсюда и отказ от blur в появлении текста на этом сайте.',
  },
  {
    css: 'background-color',
    stages: ['style', 'paint', 'composite'],
    ok: false,
    verdict:
      'Геометрия не меняется, но слой приходится заливать заново каждый кадр. На одной кнопке незаметно, на десятке карточек одновременно — уже нет.',
  },
  {
    css: 'width / height',
    stages: ['style', 'layout', 'paint', 'composite'],
    ok: false,
    verdict:
      'Поднимает раскладку: браузер заново считает геометрию не только этого элемента, но и всего, что от него зависит. Самая дорогая ошибка в анимации — и самая частая.',
  },
  {
    css: 'top / left',
    stages: ['style', 'layout', 'paint', 'composite'],
    ok: false,
    verdict:
      'Тот же счёт, что у ширины, хотя визуальный результат неотличим от transform: translate. Разница только в цене кадра.',
  },
]

/** Доля бюджета — оценочная иллюстрация веса этапов, не измерение. */
const WEIGHT: Record<StageId, number> = { style: 1, layout: 4, paint: 3, composite: 1 }

export default function FrameBudget() {
  const [pi, setPi] = useState(0)
  const cur = PROPS[pi]
  const active = new Set<StageId>(cur.stages)
  const load = cur.stages.reduce((s, id) => s + WEIGHT[id], 0)

  return (
    <section id="m-budget" className="px-6 md:px-12" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="max-w-6xl">
        <SectionHead
          n="06"
          title="Кадр стоит 16.7 миллисекунды"
          note="120 fps — 8.3 мс"
          lead="Плавность — это не «красивая кривая», а успеть. За кадр браузер обязан пройти конвейер до конца, и свойства различаются тем, с какого этапа он вынужден начать. Выберите свойство — увидите, что именно оно поднимает."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10 items-start">
          {/* ── Список свойств ── */}
          <div className="flex flex-col gap-2">
            {PROPS.map((p, i) => {
              const on = i === pi
              return (
                <button
                  key={p.css}
                  type="button"
                  onClick={() => setPi(i)}
                  aria-pressed={on}
                  className="flex items-baseline justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors"
                  style={{
                    ...MONO,
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    border: `1px solid ${on ? 'var(--m-sea)' : 'var(--m-border)'}`,
                    background: on ? 'var(--m-panel-2)' : 'var(--m-panel)',
                    color: on ? 'var(--m-chalk)' : 'var(--m-dim)',
                    transitionDuration: 'var(--d-fast)',
                    transitionTimingFunction: 'var(--e-standard)',
                  }}
                >
                  <span>{p.css}</span>
                  <span style={{ color: p.ok ? 'var(--m-sea)' : 'var(--m-ember)' }}>
                    {p.ok ? 'можно' : 'нельзя'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Конвейер ── */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STAGES.map((s) => {
                const on = active.has(s.id)
                return (
                  <div
                    key={s.id}
                    className="rounded-xl p-4 flex flex-col gap-2 transition-colors"
                    style={{
                      border: `1px solid ${on ? 'var(--m-ember)' : 'var(--m-border)'}`,
                      background: on ? 'var(--m-warn-12)' : 'var(--m-panel)',
                      transitionDuration: 'var(--d-fast)',
                      transitionTimingFunction: 'var(--e-standard)',
                    }}
                  >
                    <span
                      className="text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: on ? 'var(--m-chalk)' : 'var(--m-dim)', ...MONO }}
                    >
                      {s.name}
                    </span>
                    <span className="font-light text-[0.78rem]" style={{ color: 'var(--m-dim)', lineHeight: 1.45 }}>
                      {s.note}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Полоса нагрузки: заполнение через scaleX, не через width. */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between mb-2 text-[10px] tracking-[0.16em]" style={{ color: 'var(--m-dim)', ...MONO }}>
                <span>Этапов поднято: {cur.stages.length} из 4</span>
                <span>Условная доля бюджета</span>
              </div>
              <span className="relative block h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--m-sea-16)' }}>
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left rounded-full"
                  style={{
                    background: cur.ok ? 'var(--m-sea)' : 'var(--m-ember)',
                    transform: `scaleX(${load / 9})`,
                    transition: 'transform var(--d-base) var(--e-standard)',
                  }}
                />
              </span>
            </div>

            <p
              className="mt-6 max-w-[56ch] font-light"
              style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
              aria-live="polite"
            >
              {cur.verdict}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-[58ch] font-light" style={{ color: 'var(--m-dim)', lineHeight: 1.62 }}>
          Доли бюджета на полосе — иллюстрация порядка величин, а не замер
          вашей машины. Проверяемое здесь другое: список этапов у каждого
          свойства, и он одинаков в любом браузере.
        </p>
      </div>
    </section>
  )
}
