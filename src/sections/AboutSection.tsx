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
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import { Reveal, SplitText, Parallax } from '../design/primitives'
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
 * Портретная зона. Честный плейсхолдер вместо чужой картинки:
 * пустое место с подписью «сюда фото» выглядит как незаполненный слот
 * системы, а случайный сток — как сознательный выбор плохой картинки.
 *
 * Внутри — геометрическая разметка на inline-SVG: кадрирующие метки и
 * окружность в акценте. Ноль сетевых запросов, масштабируется до любого dpr.
 */
function PortraitSlot() {
  return (
    <div
      className="relative w-full overflow-hidden grain"
      style={{
        aspectRatio: '4 / 5',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        background: 'var(--surface-raised)',
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Окружность на месте головы: задаёт кадр будущему портрету */}
        <circle
          cx="200"
          cy="215"
          r="118"
          fill="none"
          stroke="var(--a)"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="215"
          r="164"
          fill="none"
          stroke="var(--n-300)"
          strokeWidth="1"
        />
        {/* Оси кадрирования — язык технической разметки, а не украшение */}
        <line x1="200" y1="0" x2="200" y2="500" stroke="var(--n-300)" strokeWidth="1" />
        <line x1="0" y1="215" x2="400" y2="215" stroke="var(--n-300)" strokeWidth="1" />
        {/* Угловые метки */}
        {[
          [24, 24, 1, 1],
          [376, 24, -1, 1],
          [24, 476, 1, -1],
          [376, 476, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <path
            key={i}
            d={`M ${x} ${y + 22 * sy} L ${x} ${y} L ${x + 22 * sx} ${y}`}
            fill="none"
            stroke="var(--n-400)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Подпись слота — внизу, техническим голосом сайта */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between"
        style={{ padding: 'var(--s-4)' }}
      >
        <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
          Сюда портретное фото
        </span>
        <span className="t-mono" style={{ color: 'var(--a)' }}>
          4:5
        </span>
      </div>
    </div>
  )
}

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
    <section id="about" className="relative overflow-hidden section-pad">
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

        {/* ── Основная сетка: 12 колонок, намеренно асимметричная ────
            Текст занимает 7 из 12 и упирается в --max-w-text, портрет —
            4 со сдвигом на одну. Пустая колонка между блоками и есть
            воздух, ради которого затевалась вся раскладка. */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-8"
          style={{ marginTop: 'var(--s-16)' }}
        >
          {/* Левая колонка — заголовок и текст */}
          <div className="lg:col-span-7">
            <h2
              className="t-h2 optical-left"
              style={{ color: 'var(--text)', marginBottom: 'var(--s-12)' }}
            >
              <SplitText text={ABOUT.title} by="char" />
            </h2>

            <div style={{ maxWidth: 'var(--max-w-text)' }}>
              {/* Первый абзац — позиция, поэтому крупнее остальных и
                  раскрывается по словам: это самая читаемая строка секции. */}
              <SplitText
                as="p"
                text={ABOUT.paragraphs[0]}
                by="word"
                className="t-lead"
                style={{ color: 'var(--text)', display: 'block' }}
                delay={0.2}
              />

              {ABOUT.paragraphs.slice(1).map((p, i) => (
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

          {/* Правая колонка — портретный слот и мета.
              Со сдвигом на колонку: край текста и край медиа не должны
              совпадать, иначе сетка снова читается как симметричная. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Parallax speed={0.05}>
              <Reveal y={28} duration={duration.slower}>
                <PortraitSlot />
              </Reveal>
            </Parallax>

            <div style={{ marginTop: 'var(--s-8)' }}>
              <MetaRow k="Роль" v={IDENTITY.role} delay={0.1} />
              <MetaRow k="Где" v={IDENTITY.location} delay={0.1 + stagger.item} />
              <MetaRow k="Почта" v={IDENTITY.email} delay={0.1 + stagger.item * 2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
