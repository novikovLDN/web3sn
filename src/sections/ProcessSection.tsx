/**
 * Процесс.
 *
 * Почему секция вообще существует: клиент с большим бюджетом покупает не
 * картинки, а снятие риска. Главный его страх — «я не понимаю, за что плачу
 * и что будет дальше». Показанный по шагам процесс со сроками закрывает этот
 * страх лучше, чем любое количество слов о качестве.
 *
 * Почему это таймлайн, а не сетка карточек:
 *  • процесс линеен по сути — сетка сообщила бы «делаем всё сразу»,
 *    а линия сообщает «последовательность, у которой есть начало и конец»;
 *  • линия, прочерчивающаяся по мере прокрутки, физически даёт ощущение
 *    прохождения пути. Это тот случай, когда движение несёт смысл, а не декор.
 *
 * Ритм относительно соседних секций: шапка прижата влево и не центрируется,
 * контент идёт одной колонкой с крупными номерами-якорями слева. Это
 * намеренно не похоже ни на аккордеон FAQ, ни на отзывы.
 *
 * ИСПРАВЛЕННЫЕ НАРУШЕНИЯ АУДИТА (.design-research/homepage-2026.md, разд. 3)
 * ────────────────────────────────────────────────────────────────────────
 *  №14 — точка на таймлайне появлялась через ease.overshoot [0.34,1.56,...].
 *        Кривая с перелётом — прямой маркер сгенерированного интерфейса и
 *        по правилу системы допустима только на мелких акцентах, никогда на
 *        блоках. Заменена на ease.entrance — та же кривая, что у текста
 *        этапа рядом, поэтому точка и строка теперь приезжают одним жестом.
 *  №5  — заголовок секции раскрывается by="word", а не by="char".
 *  №6  — меры набора выведены из токена --max-w-text вместо чисел по месту.
 */

import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { Reveal, SplitText } from '../design/primitives'
import {
  ease,
  duration,
  inView as inViewCfg,
  prefersReducedMotion,
} from '../design/motion'
import { PROCESS } from '../data/content'

type Step = (typeof PROCESS.steps)[number]

/**
 * Меры набора (нарушение №6). Источник один — токен --max-w-text (68ch).
 * Корпус этапа набирается на базовой мере, подзаголовок шапки — на короткой,
 * производной от той же базы, чтобы правка токена двигала обе.
 * MEASURE_NOTE ≈ 38ch.
 */
const MEASURE_BODY = 'var(--max-w-text)'
const MEASURE_NOTE = 'calc(var(--max-w-text) * 0.56)'

/**
 * Один этап.
 *
 * Точка на линии — отдельный элемент, а не ::before у строки: её нужно
 * анимировать независимо от текста, и только через transform/opacity.
 */
function ProcessStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()

  // Небольшой сдвиг по индексу: этапы, попавшие в кадр одновременно,
  // всё равно проявляются по очереди — так читается направление сверху вниз.
  const delay = reduce ? 0 : index * 0.06

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10"
      style={{ paddingBottom: 'var(--s-16)' }}
    >
      {/* ── Якорь на линии ─────────────────────────────────────────────
          Кружок сидит ровно по центру рельса (см. left у рельса в родителе).
          Заливается акцентом при попадании в кадр — это визуальный
          «пройденный» маркер. */}
      <div className="relative flex justify-center" style={{ width: 'var(--s-12)' }}>
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: '0.55em',
            width: 'var(--s-3)',
            height: 'var(--s-3)',
            background: 'var(--a)',
            boxShadow: 'var(--glow-a)',
          }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={visible ? { scale: 1, opacity: 1 } : reduce ? undefined : { scale: 0, opacity: 0 }}
          // ease.entrance вместо ease.overshoot (нарушение №14): перелёт
          // на появлении блока читается как сгенерированный интерфейс.
          transition={{ duration: duration.base, delay, ease: ease.entrance }}
        />
      </div>

      <div>
        {/* Шапка этапа: номер + срок. Срок вынесен в одну строку с номером
            и оформлен как техническая метка — это деталь доверия, её нельзя
            прятать в конце абзаца. */}
        <motion.div
          className="flex items-baseline flex-wrap gap-x-4 gap-y-2"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: duration.slow, delay, ease: ease.entrance }}
        >
          <span className="t-mono" style={{ color: 'var(--a)' }}>
            {step.n}
          </span>
          <span
            className="t-mono rounded-full border"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'var(--border-strong)',
              padding: 'var(--s-1) var(--s-3)',
            }}
          >
            {step.duration}
          </span>
        </motion.div>

        {/* Заголовок этапа выезжает из-под маски — тот же приём, что в Hero,
            чтобы почерк секций совпадал. */}
        <h3 className="t-h3 mt-3" style={{ color: 'var(--text)' }}>
          <SplitText text={step.title} by="word" delay={delay + 0.05} />
        </h3>

        <motion.p
          className="t-body mt-4"
          style={{ color: 'var(--text-muted)', maxWidth: MEASURE_BODY }}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={visible ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 14 }}
          transition={{ duration: duration.slow, delay: delay + 0.12, ease: ease.entrance }}
        >
          {step.text}
        </motion.p>
      </div>
    </li>
  )
}

export default function ProcessSection() {
  const railRef = useRef<HTMLDivElement>(null)
  const reduce = prefersReducedMotion()

  // Прогресс считается по положению списка этапов в кадре, а не по всей
  // странице: линия должна закончиться ровно на последнем этапе.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 75%', 'end 65%'],
  })
  // Пружина поверх scroll-значения: без неё линия дёргается на инерционной
  // прокрутке (lenis выдаёт неравномерные дельты).
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.9,
    restDelta: 0.0005,
  })

  return (
    <section
      id="process"
      className="relative overflow-hidden grain section-pad"
      style={{ background: 'var(--surface)' }}
    >
      <div className="shell relative z-10">
        {/* ── Шапка ───────────────────────────────────────────────────
            Заголовок и подзаголовок разведены по колонкам и посажены по
            нижнему краю: это даёт секции «редакционную» линию и сразу
            отличает её от центрированных блоков. */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">
          <div>
            <Reveal y={16}>
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                {PROCESS.label}
              </span>
            </Reveal>
            <h2 className="t-h2 optical-left mt-5" style={{ color: 'var(--text)' }}>
              {/* by="word" (нарушение №5) */}
              <SplitText text={PROCESS.title} by="word" />
            </h2>
          </div>

          <Reveal delay={0.15} y={20} className="lg:pb-3" style={{ maxWidth: MEASURE_NOTE }}>
            <p className="t-lead" style={{ color: 'var(--text-muted)' }}>
              {PROCESS.subtitle}
            </p>
          </Reveal>
        </header>

        {/* ── Таймлайн ───────────────────────────────────────────────── */}
        <div ref={railRef} className="relative" style={{ marginTop: 'var(--s-24)' }}>
          {/* Рельс: статичная бледная линия во всю высоту. Позиция по X
              совпадает с центром колонки-якоря (--s-12 / 2 = 1.5rem). */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0"
            style={{
              left: 'calc(var(--s-12) / 2)',
              width: '1px',
              background: 'var(--border)',
            }}
          >
            {/* Прочерк прогресса. Анимируется ТОЛЬКО scaleY на отдельном
                слое — height нельзя, он вызывает layout каждый кадр.
                transformOrigin: top — линия растёт сверху вниз. */}
            <motion.div
              className="absolute inset-0 gpu"
              style={{
                background: 'linear-gradient(to bottom, var(--a-dim), var(--a))',
                transformOrigin: 'top',
                scaleY: reduce ? 1 : progress,
                willChange: 'transform',
              }}
            />
          </div>

          <ol className="relative">
            {PROCESS.steps.map((step, i) => (
              <ProcessStep key={step.n} step={step} index={i} />
            ))}
          </ol>

          {/* Замыкающая точка. Без неё линия обрывается в пустоту и процесс
              читается как незаконченный — а обещание секции ровно обратное. */}
          <div
            aria-hidden
            className="absolute bottom-0 flex items-center justify-center"
            style={{
              left: 0,
              width: 'var(--s-12)',
            }}
          >
            <span
              className="rounded-full border"
              style={{
                width: 'var(--s-2)',
                height: 'var(--s-2)',
                borderColor: 'var(--a)',
                background: 'var(--surface)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
