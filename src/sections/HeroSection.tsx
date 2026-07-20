/**
 * Первый экран.
 *
 * Задача экрана — за три секунды сообщить три вещи: кто, какого уровня,
 * что делать дальше. Всё остальное вторично.
 *
 * Что изменилось против прежней версии и почему:
 *  • Ушли левитирующие иконки. Набор абстрактных 3D-значков читается как
 *    сток — ровно противоположно «дорого». Вместо них одна сигнатурная
 *    графика: сетка из тонких линий, реагирующая на курсор.
 *  • Навигация получила логотип и статус доступности. Строка ссылок,
 *    растянутая justify-between на всю ширину, выглядела как черновик.
 *  • Имя больше не единственное сообщение. Рядом стоит строка, которая
 *    квалифицирует клиента — она и делает основную работу по продаже.
 */

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import { Reveal, SplitText, Magnetic } from '../design/primitives'
import { ease, duration, stagger, prefersReducedMotion } from '../design/motion'
import { scrollToTarget } from '../lib/scroll'
import { HERO, IDENTITY } from '../data/content'

const NAV_LINKS = [
  { label: 'Профиль', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакты', href: '#contact' },
]

/**
 * Фоновая сетка. Тонкие линии, у которых при приближении курсора
 * поднимается яркость — поле реагирует на присутствие, но не отвлекает.
 *
 * Сделано на canvas, а не на DOM: сотня элементов с меняющейся прозрачностью
 * дала бы сотню перерисовок за кадр. Canvas рисует всё за один проход,
 * а сам холст остаётся одним композиторским слоем.
 */
function ReactiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce = prefersReducedMotion()
    // Ограничиваем плотность пикселей: на 3x-экранах заливка холста
    // становится главным потребителем кадра и роняет fps.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cursor = { x: -9999, y: -9999 }
    const SPACING = 46
    const RADIUS = 190

    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      cursor.x = e.clientX - r.left
      cursor.y = e.clientY - r.top
    }

    let raf = 0
    let t = 0
    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, w, h)

      for (let x = SPACING; x < w; x += SPACING) {
        for (let y = SPACING; y < h; y += SPACING) {
          const dx = x - cursor.x
          const dy = y - cursor.y
          const dist = Math.hypot(dx, dy)
          // Близость курсора — от 0 (далеко) до 1 (под курсором).
          const near = dist < RADIUS ? 1 - dist / RADIUS : 0

          // Медленная волна по всему полю, чтобы сетка жила и без курсора.
          const wave = reduce ? 0 : (Math.sin(x * 0.01 + y * 0.008 + t) + 1) * 0.5

          const alpha = 0.05 + wave * 0.05 + near * near * 0.5
          const size = 1 + near * 2.2

          // Точки у курсора уходят в акцент, остальные — нейтральный тёплый.
          if (near > 0.15) {
            ctx.fillStyle = `rgba(239, 74, 35, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(236, 231, 219, ${alpha})`
          }

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

/** Индикатор доступности. Мелочь, которая снимает вопрос «а он вообще берёт заказы». */
function AvailabilityPill() {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full animate-soft-pulse"
          style={{ background: 'var(--ok-bright)' }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: 'var(--ok)' }} />
      </span>
      <span className="t-mono" style={{ color: 'var(--text-muted)' }}>
        Открыт для проектов
      </span>
    </span>
  )
}

export default function HeroSection() {
  const reduce = prefersReducedMotion()

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden grain">
      <ReactiveGrid />

      {/* ── Навигация ──────────────────────────────────────────────── */}
      <motion.nav
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.1 }}
        className="relative z-20 flex items-center justify-between gap-6"
        style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--s-6)' }}
      >
        {/* Логотип */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget(0)
          }}
          className="font-bold uppercase leading-none shrink-0"
          style={{ fontSize: 'var(--t-sm)', letterSpacing: '0.05em', color: 'var(--text)' }}
        >
          {IDENTITY.name}
          <span style={{ color: 'var(--a)' }}>.</span>
        </a>

        {/* Ссылки компактной группой справа, а не враспор по всей ширине.
            Правый верхний угол намеренно оставлен пустым: там живёт
            мини-плеер, и плашка доступности с ним сталкивалась. */}
        <div className="hidden md:flex items-center gap-8 mr-32 lg:mr-40">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(link.href)
              }}
              className="nav-link t-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── Ядро экрана ────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-1 flex flex-col justify-center"
        style={{ paddingInline: 'var(--gutter)' }}
      >
        {/* Надзаголовок */}
        <Reveal delay={0.25} y={16} className="mb-5 md:mb-7">
          <span className="t-mono" style={{ color: 'var(--a)' }}>
            {HERO.eyebrow}
          </span>
        </Reveal>

        {/* Имя. Дробим по буквам — на таком кегле это читается как титры. */}
        <h1
          className="t-display optical-left"
          style={{ color: 'var(--text)', fontSize: 'var(--t-display)' }}
        >
          <SplitText text={HERO.title} by="char" delay={0.35} />
          <span style={{ color: 'var(--a)' }}>.</span>
        </h1>

        {/* Строка, которая делает основную работу по квалификации клиента */}
        <div className="mt-8 md:mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">
          <Reveal delay={0.7} y={20} className="max-w-[46ch]">
            <p className="t-lead" style={{ color: 'var(--text)' }}>
              {HERO.statement}
            </p>
            <p className="t-body mt-4" style={{ color: 'var(--text-muted)' }}>
              {HERO.detail}
            </p>
          </Reveal>

          {/* Плашка доступности стоит вплотную к кнопке, а не в навбаре:
              сигнал «беру заказы» работает сильнее всего непосредственно
              перед призывом к действию, а не в углу экрана. */}
          <Reveal delay={0.85} y={20} className="flex flex-col items-start lg:items-end gap-5 shrink-0">
            <AvailabilityPill />
            {/* flex-wrap обязателен: на 390px две кнопки в строку не влезают
                и вылезали за вьюпорт. Обрезка через overflow-x: clip на main
                прятала это на странице, но кнопка оставалась недокликиваемой. */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => scrollToTarget('#contact')}
                icon={<ArrowUpRight size={15} />}
              >
                {HERO.cta}
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToTarget('#projects')}
              >
                {HERO.ctaSecondary}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Подвал экрана: дисциплины + приглашение листать ─────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.slow, delay: 1.1, ease: ease.entrance }}
        className="relative z-20 flex items-center justify-between gap-6 border-t"
        style={{
          borderColor: 'var(--border)',
          paddingInline: 'var(--gutter)',
          paddingBlock: 'var(--s-4)',
        }}
      >
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          {IDENTITY.disciplines.map((d, i) => (
            <motion.span
              key={d}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.base,
                delay: 1.2 + i * stagger.item,
                ease: ease.entrance,
              }}
              className="t-mono"
              style={{ color: 'var(--text-faint)' }}
            >
              {d}
            </motion.span>
          ))}
        </div>

        <Magnetic strength={0.3} radius={40}>
          <button
            onClick={() => scrollToTarget('#about')}
            aria-label={HERO.scrollHint}
            className="flex items-center gap-2 shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="t-mono hidden sm:inline">{HERO.scrollHint}</span>
            <ArrowDown size={14} className="animate-bob-down" />
          </button>
        </Magnetic>
      </motion.div>
    </section>
  )
}
