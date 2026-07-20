/**
 * Секция «Проекты».
 *
 * Здесь два разных состояния, и это осознанно.
 *
 *  1. Есть настоящие кейсы (filled: true) — стопка карточек на sticky:
 *     каждая следующая наезжает на предыдущую, нижние слегка уменьшаются.
 *     Приём даёт ощущение колоды и держит внимание без скролл-джекинга.
 *
 *  2. Кейсов нет — секция показывает «портфолио по запросу». Не «скоро
 *     здесь что-то появится», а сформулированная позиция: работы под NDA,
 *     подборка присылается под конкретную задачу. Пустое портфолио,
 *     оформленное как незаконченный шаблон, обесценивает всю страницу;
 *     то же пустое портфолио, оформленное как условие доступа, — не
 *     обесценивает ничего.
 *
 * Технические ограничения, которые нельзя нарушать:
 *  • на секции и её предках не должно быть overflow: hidden — это ломает
 *    position: sticky у карточек. Здесь уже наступали на эти грабли;
 *  • анимируются только transform и opacity;
 *  • у изображений задано соотношение сторон, чтобы загрузка не двигала
 *    вёрстку и не рвала расчёт sticky-позиций.
 *
 * ЕДИНСТВЕННАЯ ИНВЕРСИЯ СВЕТА НА ВСЮ СТРАНИЦУ — ЗДЕСЬ
 * ───────────────────────────────────────────────────
 * Раньше светлым блоком была секция услуг. Это тратило самый сильный
 * визуальный удар страницы на список того, что человек умеет делать, —
 * то есть на утверждение о себе. Теперь свет стоит на работах.
 *
 * Разница смысловая, а не декоративная. Строка «Портфолио по запросу»
 * под ударом света на второй позиции читается как условие доступа;
 * та же строка на общем тёмном фоне в середине страницы читается как
 * оправдание за отсутствие работ.
 *
 * Инверсия обязана быть одна. Второе появление светлого блока обесценивает
 * первое: один удар за десять экранов — это заявление, три — оформление.
 * По той же причине скругление верхних углов осталось только здесь: жест
 * «лист бумаги, наложенный сверху» работает, пока он один за страницу.
 *
 * Цвета внутри секции — не инвертированные автоматически, а подобранные:
 * семантические токены (--text, --text-muted, --border) рассчитаны на
 * тёмный фон и на светлом дали бы кремовый текст по кремовому. Здесь
 * используется прямая шкала --n-*, и каждая пара проверена на контраст:
 *  • --n-50 на --n-950 — основной текст, 16:1;
 *  • --n-500 на --n-950 — приглушённый текст, 5.3:1 (норма AA 4.5:1);
 *  • --a-dim вместо --a для мелких подписей: сам --a на светлом даёт
 *    3.4:1 и для кегля подписи не проходит, --a-dim даёт 4.9:1.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import StaticIcon from '../components/StaticIcon'
import { Reveal, SplitText } from '../design/primitives'
import {
  ease,
  duration,
  stagger,
  inView as inViewCfg,
  scaleIn,
  prefersReducedMotion,
} from '../design/motion'
import { scrollToTarget } from '../lib/scroll'
import { PROJECTS_COPY } from '../data/content'
import {
  FILLED_PROJECTS,
  PORTFOLIO_ON_REQUEST,
  CARD_THEMES,
  type ProjectCard as CaseData,
} from '../data/projects'

// ── Общая шапка секции ────────────────────────────────────────────────

function SectionHead() {
  return (
    <header className="shell mb-[var(--s-16)] md:mb-[var(--s-24)]">
      <Reveal y={14} className="mb-[var(--s-4)]">
        <span className="t-mono" style={{ color: 'var(--a-dim)' }}>
          {PROJECTS_COPY.label}
        </span>
      </Reveal>

      {/* by="word", а не by="char": пословный reveal читается как речь,
          посимвольный — как эффект. Посимвольный на странице остаётся
          ровно один — на имени в героe, где он и уместен. */}
      <h2 className="t-h2 optical-left" style={{ color: 'var(--n-50)' }}>
        <SplitText text={PROJECTS_COPY.title} by="word" />
      </h2>

      <Reveal delay={0.15} y={16} className="mt-[var(--s-6)] max-w-[46ch]">
        <p className="t-body" style={{ color: 'var(--n-500)' }}>
          {PROJECTS_COPY.subtitle}
        </p>
      </Reveal>
    </header>
  )
}

// ── Мета-строка кейса ─────────────────────────────────────────────────
// Клиент / год / роль. Роль стоит наравне с клиентом намеренно: для
// lead-позиционирования «кем я был в проекте» важнее, чем «что нарисовал».

function MetaRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-[var(--s-1)]">
      <span className="t-mono" style={{ color, opacity: 0.55 }}>
        {label}
      </span>
      <span className="t-body" style={{ color, fontWeight: 400, lineHeight: 1.35 }}>
        {value}
      </span>
    </div>
  )
}

// ── Блок «задача / решение / результат» ───────────────────────────────

function Narrative({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div
      className="pt-[var(--s-4)]"
      // Линия строится из цвета текста карточки: одна тема — один цвет,
      // приглушённый до веса разделителя, а не рамки.
      style={{ borderTop: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <span className="t-mono block mb-[var(--s-3)]" style={{ color, opacity: 0.55 }}>
        {label}
      </span>
      <p className="t-body" style={{ color, opacity: 0.9, maxWidth: '42ch' }}>
        {text}
      </p>
    </div>
  )
}

// ── Карточка кейса ────────────────────────────────────────────────────

function CaseCard({ item, index, total }: { item: CaseData; index: number; total: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduce = prefersReducedMotion()

  // Прогресс считаем от момента входа карточки в кадр до её прилипания.
  // Нижние карточки к этому моменту успевают чуть уменьшиться — так
  // читается глубина стопки, при этом двигается только scale.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'start start'],
  })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : targetScale])

  const theme = CARD_THEMES[item.theme]
  const fg = theme.fg
  const cover = item.images[0]
  const number = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={wrapRef}
      className="sticky flex items-start justify-center"
      // Шаг сверху разводит прилипшие карточки — видны корешки нижних.
      // Нижний отступ входит в sticky-бокс: он и даёт карточке «выдержку»
      // в прилипшем состоянии, пока следующая её не накроет.
      style={{ top: `calc(var(--s-16) + ${index * 22}px)`, paddingBottom: 'var(--s-24)' }}
    >
      <motion.article
        style={{
          scale,
          transformOrigin: 'top center',
          background: theme.bg,
          color: fg,
          borderRadius: 'var(--r-2xl)',
          padding: 'clamp(1.5rem, 4vw, 3.5rem)',
          boxShadow: 'var(--sh-lg)',
        }}
        className="w-full overflow-hidden group"
      >
        {/* Верхняя строка: номер как элемент композиции + год */}
        <div className="flex items-start justify-between gap-[var(--s-6)] mb-[var(--s-8)]">
          <span
            className="t-h2 leading-none select-none"
            style={{ color: fg, opacity: 0.22, fontVariantNumeric: 'tabular-nums' }}
            aria-hidden
          >
            {number}
          </span>
          <span className="t-mono shrink-0 pt-[var(--s-2)]" style={{ color: fg, opacity: 0.55 }}>
            {item.year}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--s-8)] lg:gap-[var(--s-12)]">
          {/* ── Левая колонка: название, мета, суть ──────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-[var(--s-8)]">
            <h3
              className="t-h3 whitespace-pre-line"
              style={{ color: fg, fontWeight: 700, letterSpacing: 'var(--tr-h3)' }}
            >
              {item.title}
            </h3>

            <div className="grid grid-cols-2 gap-[var(--s-6)]">
              <MetaRow label="Клиент" value={item.client} color={fg} />
              <MetaRow label="Роль" value={item.role} color={fg} />
            </div>

            {/* Дисциплины. Контур, а не заливка: заливка на цветной карточке
                конкурирует с изображением за внимание. */}
            <ul className="flex flex-wrap gap-[var(--s-2)]" aria-label="Дисциплины">
              {item.disciplines.map((d) => (
                <li
                  key={d}
                  className="t-mono rounded-[var(--r-full)] px-[var(--s-3)] py-[var(--s-2)]"
                  style={{
                    border: `1px solid color-mix(in srgb, ${fg} 30%, transparent)`,
                    color: fg,
                    opacity: 0.75,
                  }}
                >
                  {d}
                </li>
              ))}
            </ul>

            {item.link && (
              <div className="mt-auto">
                <Button
                  href={item.link}
                  variant="ghost"
                  icon={<ArrowUpRight size={15} />}
                  ariaLabel={`${item.linkLabel ?? 'Смотреть проект'} — ${item.client}`}
                >
                  {item.linkLabel ?? 'Смотреть проект'}
                </Button>
              </div>
            )}
          </div>

          {/* ── Правая колонка: изображение ───────────────────────── */}
          <div className="lg:col-span-7">
            <motion.div
              variants={reduce ? undefined : scaleIn}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={inViewCfg}
              className="w-full overflow-hidden"
              style={{
                borderRadius: 'var(--r-lg)',
                // Соотношение задано жёстко: без него загрузка картинки
                // сдвигает вёрстку и ломает уже рассчитанные sticky-позиции.
                aspectRatio: '16 / 10',
                background: `color-mix(in srgb, ${fg} 8%, transparent)`,
              }}
            >
              {cover ? (
                <img
                  src={cover.src}
                  alt={cover.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    transform: 'scale(1)',
                    transition: `transform var(--d-slow) var(--e-standard)`,
                  }}
                  onMouseEnter={(e) => {
                    if (!reduce) e.currentTarget.style.transform = 'scale(1.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                />
              ) : (
                // Изображения нет — вместо пустого прямоугольника даём знак.
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32" style={{ opacity: 0.5 }}>
                    <StaticIcon name={item.icon ?? 'spark'} color={theme.accent} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Дополнительные кадры — узкой лентой под главным */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-3 gap-[var(--s-3)] mt-[var(--s-3)]">
                {item.images.slice(1, 4).map((img) => (
                  <div
                    key={img.src}
                    className="overflow-hidden"
                    style={{ borderRadius: 'var(--r-sm)', aspectRatio: '4 / 3' }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Нижний ярус: задача / решение / результат ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--s-6)] md:gap-[var(--s-8)] mt-[var(--s-12)]">
          <Narrative label="Задача" text={item.challenge} color={fg} />
          <Narrative label="Решение" text={item.solution} color={fg} />
          {item.outcome && (
            <div
              className="pt-[var(--s-4)]"
              style={{ borderTop: `1px solid color-mix(in srgb, ${fg} 22%, transparent)` }}
            >
              <span className="t-mono block mb-[var(--s-3)]" style={{ color: fg, opacity: 0.55 }}>
                Результат
              </span>
              {item.outcome.metric && (
                <span
                  className="t-h3 block mb-[var(--s-2)]"
                  style={{ color: theme.accent, fontWeight: 700 }}
                >
                  {item.outcome.metric}
                </span>
              )}
              <p className="t-body" style={{ color: fg, opacity: 0.9, maxWidth: '42ch' }}>
                {item.outcome.text}
              </p>
            </div>
          )}
        </div>
      </motion.article>
    </div>
  )
}

// ── Состояние «портфолио по запросу» ──────────────────────────────────

function PortfolioOnRequest() {
  const P = PORTFOLIO_ON_REQUEST
  const reduce = prefersReducedMotion()

  return (
    <div className="shell">
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--s-12)] lg:gap-[var(--s-16)]"
        style={{
          // Приподнятая поверхность внутри светлой секции — на полтона
          // темнее фона, а не светлее: на светлом «выше» читается как
          // «глубже в кремовый», иначе плоскость просто исчезает.
          background: 'var(--n-900)',
          // Волосяная линия строится из цвета текста, а не из --border:
          // токен --border — светлая полупрозрачность, рассчитанная на
          // тёмный фон, и на светлом он невидим.
          border: '1px solid color-mix(in srgb, var(--n-50) 12%, transparent)',
          borderRadius: 'var(--r-2xl)',
          padding: 'clamp(1.75rem, 5vw, 4.5rem)',
        }}
      >
        {/* Левая колонка — сама позиция */}
        <div className="lg:col-span-6 flex flex-col">
          <Reveal y={14} className="mb-[var(--s-6)]">
            <span className="t-mono" style={{ color: 'var(--a-dim)' }}>
              {P.label}
            </span>
          </Reveal>

          <h3
            className="t-h3 whitespace-pre-line"
            style={{ color: 'var(--n-50)', fontWeight: 700 }}
          >
            <SplitText text={P.title} by="word" />
          </h3>

          <Reveal delay={0.12} y={16} className="mt-[var(--s-8)]">
            <p className="t-lead" style={{ color: 'var(--n-50)' }}>
              {P.lead}
            </p>
            <p className="t-body mt-[var(--s-4)]" style={{ color: 'var(--n-500)' }}>
              {P.body}
            </p>
          </Reveal>

          <Reveal delay={0.2} y={16} className="mt-[var(--s-12)]">
            <Button
              variant="primary"
              onClick={() => scrollToTarget('#contact')}
              icon={<ArrowUpRight size={15} />}
            >
              {P.cta}
            </Button>
            <p className="t-mono mt-[var(--s-6)]" style={{ color: 'var(--n-500)' }}>
              {P.note}
            </p>
          </Reveal>
        </div>

        {/* Правая колонка — что именно приходит в ответ.
            Конкретный перечень отличает позицию от отговорки. */}
        <div className="lg:col-span-6">
          <ul>
            {P.provides.map((row, i) => (
              <motion.li
                key={row.n}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewCfg}
                transition={{
                  duration: duration.slow,
                  delay: i * stagger.item,
                  ease: ease.entrance,
                }}
                className="flex items-baseline gap-[var(--s-6)] py-[var(--s-6)]"
                style={{ borderTop: '1px solid color-mix(in srgb, var(--n-50) 12%, transparent)' }}
              >
                <span
                  className="t-mono shrink-0"
                  style={{ color: 'var(--a-dim)', fontVariantNumeric: 'tabular-nums' }}
                >
                  {row.n}
                </span>
                <span className="t-body" style={{ color: 'var(--n-50)' }}>
                  {row.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ── Секция ────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const cases = FILLED_PROJECTS
  const hasCases = cases.length > 0

  return (
    // ВАЖНО: никакого overflow-hidden ни здесь, ни на предках —
    // это выключает position: sticky у карточек.
    <section
      id="projects"
      className="relative z-10 section-pad"
      style={{
        // Единственная инверсия света на всю страницу (обоснование в шапке
        // файла). --n-950 — самая светлая ступень шкалы, заведённая ровно
        // под крупные плоскости.
        background: 'var(--n-950)',
        borderTopLeftRadius: 'var(--r-2xl)',
        borderTopRightRadius: 'var(--r-2xl)',
      }}
    >
      <SectionHead />

      {hasCases ? (
        <div className="shell">
          {cases.map((item, i) => (
            <CaseCard key={item.client + item.title} item={item} index={i} total={cases.length} />
          ))}
        </div>
      ) : (
        <PortfolioOnRequest />
      )}
    </section>
  )
}
