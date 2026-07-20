/**
 * Секция цифр.
 *
 * Цифры на портфолио работают только в двух случаях: когда им веришь и когда
 * они поданы спокойно. Поэтому здесь нет ни одной «продающей» интонации —
 * крупный кегль, разделители, длинная пауза между значением и подписью.
 *
 * Что изменилось:
 *  • Данные берутся из STATS (content.ts), а не дублируются в компоненте.
 *    Выдуманные «200% вовлечённости» удалены оттуда — цифра, которая не может
 *    быть правдой, обесценивает соседние, которые правда.
 *  • Числа набегают через примитив Counter, а не появляются готовыми.
 *  • Вертикальные разделители прочерчиваются сверху вниз через scaleY.
 *    Именно они превращают четыре независимых числа в один блок.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Reveal, Counter } from '../design/primitives'
import {
  ease,
  duration,
  stagger,
  inView as inViewCfg,
  prefersReducedMotion,
} from '../design/motion'
import { STATS } from '../data/content'

/**
 * Вертикальный разделитель колонки.
 *
 * Высота задана раз и навсегда (inset-y-0), видимость даёт scaleY от верхнего
 * края — анимировать height значило бы гонять layout на каждом кадре.
 */
function ColumnRule({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-y-0 left-0"
      style={{ width: 1, overflow: 'hidden' }}
    >
      <motion.div
        className="h-full w-full"
        style={{ background: 'var(--border)', transformOrigin: 'top center' }}
        initial={reduce ? false : { scaleY: 0 }}
        animate={visible ? { scaleY: 1 } : reduce ? undefined : { scaleY: 0 }}
        transition={{
          duration: reduce ? 0 : duration.slower,
          delay,
          ease: ease.editorial,
        }}
      />
    </div>
  )
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative section-pad"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="shell">
        <Reveal y={12} style={{ marginBottom: 'var(--s-12)' }}>
          <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
            В цифрах
          </span>
        </Reveal>

        {/* Две колонки на телефоне, четыре от lg. Три колонки промежуточно
            дали бы висящую четвёртую цифру — сетка должна делиться нацело. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12">
          {STATS.map((stat, i) => {
            // Разделитель не рисуется у первой ячейки строки: линия слева от
            // левого края блока читалась бы как ошибка вёрстки.
            const ruleClass =
              i === 0 ? 'hidden' : i % 2 === 0 ? 'hidden lg:block' : 'block'

            return (
              <div
                key={stat.label}
                className="relative"
                style={{ paddingInline: 'var(--s-6)' }}
              >
                <div className={ruleClass}>
                  <ColumnRule delay={i * stagger.item} />
                </div>

                <Reveal delay={i * stagger.item} y={20} duration={duration.slower}>
                  {/* Число и суффикс идут одним оптическим блоком: кегль
                      крупный, поэтому любой лишний пробел рвёт его надвое. */}
                  <div
                    className="t-h2 optical-left"
                    style={{ color: 'var(--text)', whiteSpace: 'nowrap' }}
                  >
                    <Counter to={stat.value} duration={1.6} />
                    {stat.suffix && (
                      <span style={{ color: 'var(--a)' }}>{stat.suffix}</span>
                    )}
                  </div>

                  <p
                    className="t-label"
                    style={{
                      color: 'var(--text-muted)',
                      marginTop: 'var(--s-4)',
                      maxWidth: '22ch',
                    }}
                  >
                    {stat.label}
                  </p>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
