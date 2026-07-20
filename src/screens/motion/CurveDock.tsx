/**
 * Панель кривой — сигнатурная аффорданса экрана.
 *
 * ЗАЧЕМ ИМЕННО ТАК
 * ────────────────
 * Витрина кривых доказывает, что автор видел график easing. Ничего больше.
 * Поэтому здесь выбор кривой вынесен из раздела наружу и живёт с посетителем
 * на всём экране: выбранная кривая уходит в --m-ease на корне <main> и в
 * контекст framer-motion, и по ней начинает идти всё движение страницы —
 * появления секций, наведения, прогоны инструментов, кнопки.
 *
 * Разница принципиальная. Посетитель не рассматривает кривую — он находится
 * внутри неё. Выбрав ease.exit, он получает экран, который отвечает с
 * задержкой, и понимает про кривую больше, чем из любого описания.
 *
 * Панель остаётся на месте, а не живёт в одной секции, ровно потому же,
 * почему в Брендинге на месте остаётся док палитры: эффект глобальный,
 * и увидеть его можно только переключая в произвольном контексте.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Смена кривой — смена состояния, а не анимация: переменная применяется
 * мгновенно. Анимируется только сама панель — масштаб активного свотча.
 */
import { mono } from './palette'
import { CURVES, CurveGraph, type Curve } from './primitives'

export default function CurveDock({
  curve,
  onPick,
}: {
  curve: Curve
  onPick: (c: Curve) => void
}) {
  return (
    <div
      // На узком экране панель поднята над мини-плеером сайта, который живёт
      // в левом нижнем углу: на 390px центрированная панель наезжала на него
      // и первая кривая оказывалась недоступна для нажатия. Проверено вживую.
      className="fixed left-1/2 bottom-24 sm:bottom-5"
      style={{ zIndex: 'var(--z-nav)', transform: 'translateX(-50%)' }}
    >
      <div
        className="flex items-center justify-center gap-2 sm:gap-4 rounded-2xl sm:rounded-full backdrop-blur mx-auto"
        style={{
          border: '1px solid var(--m-line)',
          background: 'var(--m-scrim)',
          paddingInline: 'var(--s-3)',
          paddingBlock: 'var(--s-2)',
          boxShadow: '0 20px 40px -24px rgba(0,0,0,0.8)',
          maxWidth: '100%',
        }}
      >
        <span className="hidden md:inline shrink-0" style={{ ...mono, color: 'var(--m-faint)' }}>
          Кривая экрана
        </span>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {CURVES.map((c) => {
            const on = c.id === curve.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onPick(c)}
                aria-pressed={on}
                // Название кривой в подписи, а не «вариант 3»: посетитель
                // должен уносить с экрана имя, которое есть в коде.
                aria-label={`Кривая ${c.name} — ${c.role}`}
                title={`${c.name} · ${c.role}`}
                className="rounded-lg shrink-0"
                style={{
                  padding: 2,
                  background: on ? 'var(--m-panel-2)' : 'transparent',
                  border: `1px solid ${on ? 'var(--m-ember)' : 'var(--m-line-soft)'}`,
                  // Кривая переключает саму себя: этот переход тоже идёт по --m-ease.
                  transition: 'transform var(--d-fast) var(--m-ease)',
                  transform: on ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <CurveGraph v={c.v} active={on} size={30} />
              </button>
            )
          })}
        </div>

        {/* Значение целиком — то, что можно унести в свой проект.
            aria-live: смена подписи должна дойти и до тех, кто не видит панель. */}
        <span
          aria-live="polite"
          className="hidden sm:block shrink-0"
          style={{ ...mono, color: 'var(--m-sea)', minWidth: '13ch' }}
        >
          {curve.name.replace('ease.', '')}
        </span>
      </div>
    </div>
  )
}
