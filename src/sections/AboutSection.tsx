/**
 * Секция «Обо мне».
 *
 * Что изменилось против прежней версии и почему:
 *  • Убраны четыре PNG с чужого домена (луна, лего, смайлик, курсор). Это была
 *    внешняя зависимость, которая ломается вместе с чужим хостингом, и
 *    визуально — сток-3D. Клипарт на портфолио лида читается как чужая работа.
 *  • Центрированная колонка заменена на редакционную асимметрию. Всё по центру —
 *    композиция без иерархии: глазу негде начать и негде остановиться.
 *  • Текст берётся из ABOUT — единственного источника копирайта.
 *
 * Сигнатурный приём секции — линия-разделитель, прочерчивающаяся по входу в
 * кадр (scaleX от левого края), и абзацы, раскрывающиеся по словам из-под
 * маски. Оба движения — чистый transform, layout не трогается.
 *
 * ИСПРАВЛЕННЫЕ НАРУШЕНИЯ АУДИТА (.design-research/homepage-2026.md, разд. 3)
 * ────────────────────────────────────────────────────────────────────────
 *  №16 — плейсхолдер «Сюда портретное фото» рендерился живому посетителю.
 *        Портретный слот удалён целиком: пустая рамка с подписью «сюда фото»
 *        читается как недоделка независимо от того, насколько аккуратно она
 *        нарисована. Фото либо есть, либо секции незачем его обещать.
 *        Правая колонка осталась колонкой фактов — это честное содержание.
 *  №5  — раскрытие заголовка переведено с by="char" на by="word". Посимвольный
 *        reveal читается как эффект, пословный — как речь; посимвольный
 *        оставлен только на имени в Hero.
 *  №6  — все меры набора берутся от токена --max-w-text, а не назначаются
 *        числом по месту. Лид уже базовой меры: на кегле t-lead 68ch дают
 *        строку под 110 знаков — выше границы читаемости.
 *  №10 — раскладка приведена к общей для секции: главная колонка span 7 от
 *        колонки 1, боковая span 4 от колонки 9. Та же пара стартовых колонок
 *        стоит в FaqSection, поэтому вертикальная линия страницы одна.
 *  №12 — на секцию добавлено зерно: подпись поверхности должна быть либо на
 *        всех секциях, либо ни на одной.
 *  Текст сокращён на абзац: о себе на премиальных сайтах говорят коротко,
 *  а третий абзац дублировал заявление об отборе проектов из Hero.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import { Reveal, SplitText } from '../design/primitives'
import {
  ease,
  duration,
  stagger,
  inView as inViewCfg,
  prefersReducedMotion,
} from '../design/motion'
import { scrollToTarget } from '../lib/scroll'
import { ABOUT, IDENTITY } from '../data/content'

/**
 * Горизонтальная линия, прочерчивающаяся при входе в кадр.
 *
 * Ширина не анимируется намеренно: width вызывает layout на каждом кадре.
 * Линия всегда полной ширины, а видимой её делает scaleX от левого края —
 * это одна композиторская операция без пересчёта потока.
 */
function DrawnRule({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()

  return (
    <div ref={ref} className="w-full" style={{ height: 1, overflow: 'hidden' }}>
      <motion.div
        aria-hidden
        style={{
          height: 1,
          background: 'var(--border-strong)',
          transformOrigin: 'left center',
        }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : reduce ? undefined : { scaleX: 0 }}
        transition={{
          duration: reduce ? 0 : duration.cinematic,
          delay,
          ease: ease.editorial,
        }}
      />
    </div>
  )
}

/**
 * Меры набора (нарушение №6).
 *
 * Единственный источник — токен --max-w-text (68ch). Лид набирается крупнее
 * корпуса, поэтому его мера производится от базовой долей, а не назначается
 * отдельным числом: при правке токена обе меры едут вместе.
 * MEASURE_LEAD ≈ 46ch — верх диапазона читаемости на кегле t-lead.
 */
const MEASURE_BODY = 'var(--max-w-text)'
const MEASURE_LEAD = 'calc(var(--max-w-text) * 0.68)'

/** Строка меты: подпись слева, значение справа. Только факты из content.ts. */
function MetaRow({ k, v, delay }: { k: string; v: string; delay: number }) {
  return (
    <Reveal delay={delay} y={12}>
      <div
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBlock: 'var(--s-3)', borderTop: '1px solid var(--border)' }}
      >
        <span className="t-mono shrink-0" style={{ color: 'var(--text-faint)' }}>
          {k}
        </span>
        <span
          className="text-right"
          style={{ color: 'var(--text)', fontSize: 'var(--t-sm)' }}
        >
          {v}
        </span>
      </div>
    </Reveal>
  )
}

export default function AboutSection() {
  return (
    // grain — нарушение №12: зерно стояло через секцию и граница между
    // «с зерном» и «без» читалась как смена материала.
    <section id="about" className="relative overflow-hidden grain section-pad">
      <div className="shell">
        {/* ── Шапка секции: лейбл слева, дисциплины справа ─────────── */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3"
          style={{ marginBottom: 'var(--s-6)' }}
        >
          <Reveal y={12}>
            <span className="t-mono" style={{ color: 'var(--a)' }}>
              {ABOUT.label}
            </span>
          </Reveal>
          <Reveal delay={stagger.block} y={12}>
            <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
              {IDENTITY.roleRu}
            </span>
          </Reveal>
        </div>

        <DrawnRule />

        {/* ── Основная сетка: 12 колонок ─────────────────────────────
            Общая раскладка страницы (нарушение №10): главная колонка
            span 7 от колонки 1, боковая span 4 от колонки 9. Пустая
            колонка между ними — воздух, ради которого затевалась вся
            раскладка. Ровно эта же пара стоит в FaqSection, поэтому левый
            край и старт боковой колонки совпадают от секции к секции. */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-8"
          style={{ marginTop: 'var(--s-16)' }}
        >
          {/* Левая колонка — заголовок и текст */}
          <div className="lg:col-span-7 lg:col-start-1">
            <h2
              className="t-h2 optical-left"
              style={{ color: 'var(--text)', marginBottom: 'var(--s-12)' }}
            >
              {/* by="word", а не "char" (нарушение №5): посимвольное
                  раскрытие читается как эффект и оставлено только имени. */}
              <SplitText text={ABOUT.title} by="word" />
            </h2>

            <div style={{ maxWidth: MEASURE_BODY }}>
              {/* Первый абзац — позиция, поэтому крупнее остальных и
                  раскрывается по словам: это самая читаемая строка секции.
                  Мера у него своя и более узкая — на кегле t-lead базовые
                  68ch дали бы строку около 110 знаков. */}
              <SplitText
                as="p"
                text={ABOUT.paragraphs[0]}
                by="word"
                className="t-lead"
                style={{ color: 'var(--text)', display: 'block', maxWidth: MEASURE_LEAD }}
                delay={0.2}
              />

              {/* slice(1, -1): текст сокращён на абзац. Последний абзац
                  повторял заявление об ограниченном наборе проектов, уже
                  сказанное в Hero, — о себе говорят коротко и один раз. */}
              {ABOUT.paragraphs.slice(1, -1).map((p, i) => (
                <Reveal
                  key={i}
                  as="p"
                  delay={0.3 + i * stagger.block}
                  y={18}
                  className="t-body"
                  style={{ color: 'var(--text-muted)', marginTop: 'var(--s-8)' }}
                >
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.45} y={18} style={{ marginTop: 'var(--s-12)' }}>
              <Button
                variant="primary"
                onClick={() => scrollToTarget('#contact')}
                icon={<ArrowUpRight size={15} />}
              >
                {ABOUT.cta}
              </Button>
            </Reveal>
          </div>

          {/* Правая колонка — только факты (нарушение №16).
              Здесь стоял портретный слот с подписью «Сюда портретное фото»,
              то есть незаполненная рамка на живом сайте. Пустое место,
              честно названное пустым, всё равно читается как недоделка,
              поэтому слот снят целиком, а не переоформлен. Колонка меты
              держит ту же боковую линию (span 4 от колонки 9) и работает
              самостоятельно: подпись слева, значение справа — это набор
              выходных данных, а не остаток от удалённой картинки. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <MetaRow k="Роль" v={IDENTITY.role} delay={0.1} />
            <MetaRow k="В профессии" v={IDENTITY.experience} delay={0.1 + stagger.item} />
            <MetaRow k="Где" v={IDENTITY.location} delay={0.1 + stagger.item * 2} />
            <MetaRow k="Почта" v={IDENTITY.email} delay={0.1 + stagger.item * 3} />
          </div>
        </div>
      </div>
    </section>
  )
}
