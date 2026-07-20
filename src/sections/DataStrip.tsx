/**
 * Техническая полоса между секциями.
 *
 * ПОЧЕМУ ЗДЕСЬ НЕ АФОРИЗМ
 *
 * Тут стояла полноэкранная пауза с сентенцией по центру. Она провалилась
 * дважды. Сначала по подаче: целый экран под фразу требует внимания вместо
 * того, чтобы отпускать его. Потом по содержанию — проверка показала, что
 * «быстро, дёшево и хорошо» это железный треугольник проектного управления,
 * то есть ровно та отраслевая банальность, которую правило проекта запрещает:
 * фразу можно поставить на сайт конкурента без единой правки.
 *
 * Механизм провала не в жанре афоризма как таковом, а в разрыве между весом
 * подачи и весом содержания. Крупный кегль, параллакс и целый экран обещали
 * мысль, а приходила поговорка.
 *
 * ЧТО ВМЕСТО
 *
 * Полоса данных. Она отвечает на тот же запрос — «технологично, дорого,
 * погружение» — но не требует, чтобы у автора нашлась незаезженная мысль.
 * Приём подтверждён: данные-полосы есть у 6 из 10 премиальных сайтов
 * выборки (darkroom.engineering, Obys, Snellenberg — ISO-метки, координаты,
 * локальное время).
 *
 * Почему это читается дорого: данные — факт о мире, а не утверждение о себе.
 * «90+ проектов» посетитель обязан принять на веру. Текущее время в Лондоне
 * проверяется взглядом на часы. Первое требует доверия, второго ещё нет;
 * второе доверия не требует вовсе и потому работает сразу.
 *
 * ЖЁСТКОЕ УСЛОВИЕ: все данные здесь обязаны быть настоящими. Полоса с
 * выдуманными числами хуже её отсутствия — она превращает единственный
 * непроверяемый элемент в проверяемую ложь.
 */

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../design/primitives'
import { prefersReducedMotion } from '../design/motion'

/** Часовой пояс и координаты — из IDENTITY.location. Лондон. */
const TZ = 'Europe/London'
const COORDS = '51.5074° N, 0.1278° W'

/** Живое локальное время. Факт о мире, а не заявление о себе. */
function LocalTime() {
  const [time, setTime] = useState<string>('')
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('ru-RU', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)

    // Вкладка в фоне не должна тикать: таймер там всё равно душится
    // браузером, а работу планировщику создаёт.
    const onVis = () => {
      if (document.hidden) window.clearInterval(id)
      else tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <span
      style={{
        // Без табличных цифр строка дёргается на каждой секунде: в
        // пропорциональном наборе «1» уже остальных знаков.
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {time || '--:--:--'}
    </span>
  )
}

type DataStripProps = {
  /** Индекс перехода — «02 / 04». Настоящая позиция, не украшение. */
  index: string
  /** Что дальше. Одно слово-два: полоса подписывает следующую секцию. */
  next: string
}

export default function DataStrip({ index, next }: DataStripProps) {
  const reduce = prefersReducedMotion()

  return (
    <section
      aria-hidden
      className="relative"
      style={{
        background: 'var(--n-0)',
        borderBlock: '1px solid var(--n-300)',
        paddingBlock: 'var(--s-4)',
      }}
    >
      <div className="shell">
        <Reveal y={reduce ? 0 : 8} duration={0.5}>
          <div
            className="flex items-center justify-between gap-4 flex-wrap t-mono"
            style={{
              // n-600, а не n-500: посчитанный контраст n-500 на этом фоне —
              // 3.34:1, то есть ниже AA для мелкого кегля. n-600 даёт 5.5:1.
              color: 'var(--n-600)',
            }}
          >
            <span>{index}</span>

            <span className="hidden sm:inline" style={{ color: 'var(--n-500)' }}>
              {COORDS}
            </span>

            <span className="flex items-center gap-2">
              <span style={{ color: 'var(--n-500)' }}>Лондон</span>
              <LocalTime />
            </span>

            <span className="flex items-center gap-2">
              {/* Единственный акцент на полосе. Одна точка цвета делает
                  строку композицией, две превращают её в светофор. */}
              <span
                aria-hidden
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--a)',
                  display: 'inline-block',
                }}
              />
              {next}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
