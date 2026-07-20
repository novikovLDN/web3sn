/**
 * Переход между секциями.
 *
 * ИСТОРИЯ РЕШЕНИЯ — важно, чтобы это не откатили обратно.
 *
 * Первая версия занимала целый экран (100svh) и ставила афоризм крупным
 * кеглем по центру. Замысел был в паузе: отдать экран под одну мысль —
 * значит показать, что за место здесь не борются.
 *
 * На практике приём провалился. Целый экран под афоризм читается не как
 * пауза, а как «мудрость дня в рамке»: он требует внимания, вместо того
 * чтобы отпускать его. Вместо погружения получался разрыв — человек шёл
 * смотреть работы, а его останавливали и заставляли читать сентенцию.
 * Заказчик сформулировал прямо: отвлекает.
 *
 * Вторая версия — маргиналия. Заметка на полях, как в печатной книге:
 * узкая колонка, мелкий кегль, низкий контраст, сдвиг от основной оси.
 * Такую заметку глаз замечает, но не обязан читать — и именно это делает
 * её дорогой. Маргиналия сообщает: здесь есть, что сказать, но вас не
 * заставляют. Полноэкранный слоган сообщает противоположное.
 *
 * Технически это перестало быть паузой и стало сменой плотности:
 * секция низкая, фон чуть глубже соседних, ритм страницы проседает
 * на один такт — и идёт дальше.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Reveal } from '../design/primitives'
import { spring, prefersReducedMotion } from '../design/motion'

type InterludeProps = {
  /** Одна мысль. Коротко — длинная заметка перестаёт быть заметкой. */
  text: string
  /** Мелкая подпись: о чём заметка. */
  label?: string
  /**
   * Сторона, к которой прижата колонка. Чередование между вставками
   * не даёт им читаться как повторяющийся шаблон.
   */
  side?: 'left' | 'right'
}

export default function Interlude({ text, label, side = 'right' }: InterludeProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = prefersReducedMotion()

  // Заметка идёт чуть медленнее прокрутки. Сдвиг небольшой — задача не
  // привлечь внимание, а дать ощущение, что слой лежит глубже основного.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const raw = useTransform(scrollYProgress, [0, 1], [22, -22])
  const y = useSpring(raw, spring.scroll)

  return (
    <section
      ref={ref}
      aria-label={text}
      className="relative grain"
      style={{
        // Фон чуть глубже соседних секций. Смена плотности вместо провала:
        // разница читается периферийным зрением и не требует остановки.
        background: 'var(--n-0)',
        paddingBlock: 'var(--s-24)',
      }}
    >
      <div className="shell">
        <div
          className={
            'grid grid-cols-1 lg:grid-cols-12 ' +
            // Прижимаем к краю сетки, а не к центру. Центр — это позиция
            // заявления; поля — позиция комментария. Разница в статусе.
            (side === 'right' ? 'justify-items-start' : 'justify-items-start')
          }
        >
          <motion.div
            style={reduce ? undefined : { y }}
            className={
              side === 'right'
                ? 'lg:col-span-4 lg:col-start-9'
                : 'lg:col-span-4 lg:col-start-1'
            }
          >
            <Reveal y={12}>
              {label && (
                <span
                  className="t-mono block"
                  style={{
                    // Не акцентный: акцент в этой секции сделал бы заметку
                    // событием, а она сознательно не событие.
                    color: 'var(--text-faint)',
                    marginBottom: 'var(--s-3)',
                  }}
                >
                  {label}
                </span>
              )}
              <p
                style={{
                  // Кегль основного текста, не заголовочный. Заметка на
                  // полях крупнее основного текста быть не может — иначе
                  // она перестаёт быть заметкой.
                  fontSize: 'var(--t-body)',
                  lineHeight: 'var(--lh-body)',
                  letterSpacing: 'var(--tr-body)',
                  fontWeight: 300,
                  // Приглушённый, а не основной. Читается при желании,
                  // не требует внимания по умолчанию.
                  color: 'var(--text-muted)',
                  maxWidth: '34ch',
                }}
              >
                {text}
              </p>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
