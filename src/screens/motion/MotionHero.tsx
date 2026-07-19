// src/screens/motion/MotionHero.tsx
// Слой 1 Motion-экрана: входная последовательность.
//
// ── ЧЕСТНЫЙ ПРЕЛОАДЕР ──────────────────────────────────────────────────────
// Прогресс собирается из ДВУХ настоящих событий, ни одного таймера:
//   • onReady() холста — WebGL-контекст создан (см. MotionShader.onCreated);
//   • document.fonts.ready — шрифты применимы, заголовок не прыгнет.
// Если холст не монтируется (reduced / нет WebGL), его сигнал считается
// выполненным сразу — иначе прелоадер завис бы навсегда.
//
// ── ПОЧЕМУ ВХОДНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ НА CSS, А НЕ НА FRAMER ───────────────
// Измерено: пока r3f рендерит цепочку постобработки, rAF на программном
// растеризаторе падает до ~3.4 к/с, и JS-цикл framer-motion перестаёт
// перепланироваться — анимации clip-path и motion-значений НЕ доходят до
// конца (заголовок остаётся под маской inset(100%), ось wdth стоит на 75).
// Уцелели ровно те, что framer отдаёт в WAAPI: opacity и transform занавеса.
// Поэтому весь вход — нативные CSS-анимации: их тикает собственный
// анимационный движок браузера, он не зависит от загруженности rAF-очереди.
// framer здесь остаётся только на интерактиве (пружины указателя, параллакс
// скролла), где подтормаживание при простое безвредно.
//
// ── КОНТРАКТ pointer ───────────────────────────────────────────────────────
// pointer.current === null означает «указателя нет». Обязателен сброс в null
// на pointerleave и полный отказ от записи на coarse-устройствах, иначе
// бугор под курсором в шейдере залипает навсегда (см. шапку MotionShader).
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from 'framer-motion'
import { C, DISPLAY, MONO } from './palette'
import { Magnetic, usePrefersReducedMotion } from './primitives'

const MotionShader = lazy(() => import('./MotionShader'))

/* ── Копия ────────────────────────────────────────────────────────────────
 * Заголовок — четыре строки В DOM. Никакой посимвольной разбивки: скринридер
 * должен читать слова словами, поэтому маска строится на clip-path. */
const HEAD_LINES = ['Моушн —', 'это не', 'украшение.', 'Это язык.']

const META = 'SHOWREEL 2026 — 01:42 — 24FPS'

/* Слой 15 (DOM-двойник): то же зерно для фолбэка без WebGL. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* ── Такты входной последовательности, с (единственный источник правды) ──
 * Отсчёт от момента, когда обе настоящие готовности сошлись. */
const T_CURTAIN = 0.2
const T_CANVAS = 0.55
const T_HEAD = 0.7
const T_HEAD_STAGGER = 0.07
const T_META = 1.25
const T_CTA = 1.45
const T_AMBIENT = 1.75

/* ── CSS входной последовательности ───────────────────────────────────────
 * Всё, что должно доиграть при задушенном rAF, живёт здесь. Селекторы
 * привязаны к [data-hero]; анимации включаются атрибутом data-started. */
const EXPO_CSS = 'cubic-bezier(0.16,1,0.3,1)'
const EASE_CSS = 'cubic-bezier(0.22,0.61,0.36,1)'
const HERO_CSS = `
[data-hero] .mh-line{clip-path:inset(100% 0 0 0)}
[data-hero] .mh-fade{opacity:0}
[data-hero] .mh-rise{opacity:0;transform:translateY(18px)}
[data-hero] .mh-curtain-t,[data-hero] .mh-curtain-b{transform:translateY(0)}
[data-hero] .mh-head{font-variation-settings:"opsz" 96,"wdth" 75,"wght" 800}

[data-hero][data-started="1"] .mh-line{animation:mh-line .8s ${EXPO_CSS} both}
[data-hero][data-started="1"] .mh-head{animation:mh-wdth .55s ${EXPO_CSS} ${T_HEAD}s both}
[data-hero][data-started="1"] .mh-fade{animation:mh-fade .7s ${EASE_CSS} both}
[data-hero][data-started="1"] .mh-rise{animation:mh-rise .6s ${EASE_CSS} ${T_CTA}s both}
[data-hero][data-started="1"] .mh-curtain-t{animation:mh-curtain-t 1s ${EXPO_CSS} ${T_CURTAIN}s both}
[data-hero][data-started="1"] .mh-curtain-b{animation:mh-curtain-b 1s ${EXPO_CSS} ${T_CURTAIN}s both}
[data-hero][data-started="1"] .mh-canvas{animation:mh-canvas .9s ${EXPO_CSS} ${T_CANVAS}s both}
[data-hero][data-started="1"] .mh-preloader{animation:mh-out .24s ${EASE_CSS} both}

[data-hero] .mh-trickle{animation:mh-trickle 1.8s ease-in-out infinite}
[data-hero] .mh-pulse{animation:mh-pulse 1.6s ease-in-out infinite alternate}

@keyframes mh-line{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes mh-wdth{from{font-variation-settings:"opsz" 96,"wdth" 75,"wght" 800}
                   to{font-variation-settings:"opsz" 96,"wdth" 100,"wght" 800}}
/* --mh-op задаёт конечную непрозрачность поэлементно (частицы разной глубины). */
@keyframes mh-fade{from{opacity:0}to{opacity:var(--mh-op,1)}}
@keyframes mh-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes mh-curtain-t{from{transform:translateY(0)}to{transform:translateY(-100%)}}
@keyframes mh-curtain-b{from{transform:translateY(0)}to{transform:translateY(100%)}}
@keyframes mh-canvas{from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}}
@keyframes mh-out{from{opacity:1}to{opacity:0}}
@keyframes mh-trickle{0%{transform:translateY(-16px);opacity:0}
                      20%{opacity:1}75%{opacity:1}
                      100%{transform:translateY(48px);opacity:0}}
@keyframes mh-pulse{from{opacity:.32;transform:scale(1)}to{opacity:.6;transform:scale(1.12)}}

/* Одна 200 мс проявка — весь вход при prefers-reduced-motion. */
[data-hero-reduced]{animation:mh-fade .2s linear both}

@media (prefers-reduced-motion: reduce){
  [data-hero] *,[data-hero-reduced]{animation-duration:.2s!important;animation-delay:0s!important}
}
`

/* ── Слой 14: поле частиц ─────────────────────────────────────────────────
 * Позиции детерминированы индексом. Math.random() здесь запрещён: он даёт
 * новые координаты на каждом ререндере, и поле дёргается. */
type Particle = { left: number; top: number; size: number; depth: number; op: number }
const PARTICLES: Particle[] = Array.from({ length: 40 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
    return s - Math.floor(s)
  }
  const depth = [0.3, 0.6, 1.0][i % 3]
  return { left: r(1) * 100, top: r(2) * 100, size: 1 + Math.round(r(3) * 2), depth, op: 0.18 + depth * 0.35 }
})

type PV = MotionValue<number>

/* Частица: CSS отвечает за проявление, framer — за параллакс от указателя.
 * Разделение намеренное: проявление обязано доиграть даже при душном rAF. */
function ParticleDot({ p, i, px, py }: { p: Particle; i: number; px: PV; py: PV }) {
  const x = useTransform(px, (v) => -v * 26 * p.depth)
  const y = useTransform(py, (v) => v * 26 * p.depth)
  return (
    <motion.span
      className="absolute rounded-full mh-fade"
      style={{
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: p.size,
        height: p.size,
        background: C.petrol,
        x,
        y,
        animationDelay: `${T_AMBIENT + (i % 8) * 0.03}s`,
        ['--mh-op' as string]: p.op,
      }}
    />
  )
}

/* ── Строка заголовка ──────────────────────────────────────────────────────
 * Обёртка overflow:hidden + маска clip-path inset(100% 0 0 0) → inset(0 0 0 0).
 * Слой 7: собственный параллакс от указателя, в противофазе к форме (минус).
 * Параллакс живёт на ВНЕШНЕМ span, чтобы CSS-анимация clip-path на внутреннем
 * не конфликтовала с transform от framer. */
function HeadLine({ text, i, px, py }: { text: string; i: number; px: PV; py: PV }) {
  const x = useTransform(px, (v) => -v * (4 + i * 2))
  const y = useTransform(py, (v) => v * (4 + i * 2))
  return (
    <motion.span className="block overflow-hidden" style={{ x, y }}>
      <span className="block mh-line" style={{ animationDelay: `${T_HEAD + i * T_HEAD_STAGGER}s` }}>
        {text}
      </span>
    </motion.span>
  )
}

/* ── Слой 8: кольцо курсора ───────────────────────────────────────────── */
function CursorRing({ x, y, over }: { x: number; y: number; over: boolean }) {
  const sx = useSpring(0, { stiffness: 380, damping: 32, mass: 0.6 })
  const sy = useSpring(0, { stiffness: 380, damping: 32, mass: 0.6 })
  useEffect(() => {
    sx.set(x)
    sy.set(y)
  }, [x, y, sx, sy])
  const size = over ? 90 : 40
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-40 pointer-events-none flex items-center justify-center rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: size,
        height: size,
        opacity: over ? 1 : 0.65,
        border: `1px solid ${C.seaGlass}`,
        transition: 'width .35s, height .35s, opacity .35s',
      }}
    >
      <span
        className="text-[9px] uppercase"
        style={{
          letterSpacing: '0.28em',
          color: C.seaGlass,
          opacity: over ? 0.9 : 0,
          transition: 'opacity .3s',
          ...MONO,
        }}
      >
        DRAG
      </span>
    </motion.div>
  )
}

export default function MotionHero({ onClose }: { onClose: () => void }) {
  const reduced = usePrefersReducedMotion()

  const hasWebGL = useMemo(() => {
    try {
      return !!document.createElement('canvas').getContext('webgl2')
    } catch {
      return false
    }
  }, [])
  const coarse = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    []
  )

  /** Холст монтируется, только если он и допустим, и поддержан. */
  const useCanvas = !reduced && hasWebGL

  const sectionRef = useRef<HTMLElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const velocity = useRef(0)

  // Скорость скролла — только в ref. В state она вызывала бы ререндер на кадр.
  const { scrollY } = useScroll()
  const scrollVel = useVelocity(scrollY)
  useEffect(
    () =>
      scrollVel.on('change', (v) => {
        velocity.current = v
      }),
    [scrollVel]
  )

  // Слой 12: параллакс скролла — заголовок уезжает быстрее холста.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -180])
  const canvasY = useTransform(scrollYProgress, [0, 1], [0, -60])

  // Слой 7: параллакс от указателя.
  const pxRaw = useMotionValue(0)
  const pyRaw = useMotionValue(0)
  const px = useSpring(pxRaw, { stiffness: 90, damping: 20 })
  const py = useSpring(pyRaw, { stiffness: 90, damping: 20 })

  /* ── Честная готовность ── */
  const [glReady, setGlReady] = useState(!useCanvas)
  const [fontsReady, setFontsReady] = useState(false)
  useEffect(() => {
    let live = true
    document.fonts.ready.then(() => {
      if (live) setFontsReady(true)
    })
    return () => {
      live = false
    }
  }, [])
  const ready = glReady && fontsReady
  const progress = ((glReady ? 1 : 0) + (fontsReady ? 1 : 0)) / 2

  /* ── Старт последовательности: только от ready, никаких таймеров прогресса ── */
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!ready) return
    const id = window.setTimeout(() => setStarted(true), reduced ? 0 : 200)
    return () => window.clearTimeout(id)
  }, [ready, reduced])

  // Слой 17: метаданные печатаются посимвольно за 1.2 с. На таймере, а не на
  // rAF, поэтому переживает провал частоты кадров.
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (!started) return
    if (reduced) {
      setTyped(META.length)
      return
    }
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n + 1 >= META.length) window.clearInterval(id)
        return n + 1
      })
    }, 1200 / META.length)
    return () => window.clearInterval(id)
  }, [started, reduced])

  /* ── Указатель ── */
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [overCanvas, setOverCanvas] = useState(false)
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (coarse) return
    const r = e.currentTarget.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1)
    pointer.current = { x: nx, y: ny }
    pxRaw.set(nx)
    pyRaw.set(ny)
    setCursor({ x: e.clientX, y: e.clientY })
    if (!overCanvas) setOverCanvas(useCanvas)
  }
  // Без этого сброса сила бугра в шейдере никогда не затухнет.
  const onPointerLeave = () => {
    pointer.current = null
    pxRaw.set(0)
    pyRaw.set(0)
    setOverCanvas(false)
  }
  useEffect(() => {
    if (coarse) pointer.current = null
  }, [coarse])

  const fallback = (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 45%, ${C.deepOcean}, ${C.abyss} 65%)` }}
      />
      <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: GRAIN_URL, opacity: 0.12 }} />
    </>
  )

  /* ── Reduced motion: холст не монтируется, вход — одна 200 мс проявка ── */
  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden"
      >
        <style>{HERO_CSS}</style>
        <div className="absolute inset-0 pointer-events-none">{fallback}</div>
        <div data-hero-reduced className="relative z-20 flex flex-col items-center gap-6">
          <span className="text-[11px] uppercase" style={{ letterSpacing: '0.08em', color: C.dim, ...MONO }}>
            {META}
          </span>
          <h1
            className="uppercase leading-[0.88] tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem,9vw,7rem)',
              color: C.chalk,
              fontVariationSettings: '"opsz" 96, "wdth" 100, "wght" 800',
              ...DISPLAY,
            }}
          >
            {HEAD_LINES.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Magnetic
              onClick={() => window.scrollTo({ top: window.innerHeight })}
              className="rounded-full px-9 py-4 text-sm font-medium uppercase tracking-widest"
              style={{ background: C.ember, color: C.abyss }}
            >
              Смотреть работы
            </Magnetic>
            <button onClick={onClose} className="text-sm underline underline-offset-4" style={{ color: C.dim }}>
              ← Все услуги
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      data-hero
      data-started={started ? '1' : '0'}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ cursor: !coarse && useCanvas ? 'none' : undefined }}
    >
      <style>{HERO_CSS}</style>

      {/* ── Фон: холст или CSS-фолбэк ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: canvasY }}>
        {useCanvas ? (
          <div className="absolute inset-0 mh-canvas">
            <Suspense fallback={null}>
              <MotionShader pointer={pointer} velocity={velocity} onReady={() => setGlReady(true)} />
            </Suspense>
          </div>
        ) : (
          fallback
        )}
      </motion.div>

      {/* ── Слой 14: поле частиц, три глубины ── */}
      <div aria-hidden className="absolute inset-0 z-10 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <ParticleDot key={i} p={p} i={i} px={px} py={py} />
        ))}
      </div>

      {/* ── Содержимое ── */}
      <motion.div className="relative z-20 px-6 md:px-12 flex flex-col items-start" style={{ y: textY }}>
        {/* Слой 17: метаданные, печать посимвольно */}
        <span
          className="text-[11px] uppercase mb-6 mh-fade"
          style={{ letterSpacing: '0.08em', color: C.dim, animationDelay: `${T_META}s`, ...MONO }}
        >
          {META.slice(0, typed)}
          <span style={{ opacity: typed < META.length ? 1 : 0 }}>▌</span>
        </span>

        {/* Заголовок: четыре DOM-строки, маска через clip-path.
            Посимвольная разбивка исключена — иначе скринридер читает по буквам. */}
        <h1
          className="uppercase leading-[0.88] tracking-tight mh-head"
          style={{ fontSize: 'clamp(2.6rem,9vw,7rem)', color: C.chalk, ...DISPLAY }}
        >
          {HEAD_LINES.map((line, i) => (
            <HeadLine key={line} text={line} i={i} px={px} py={py} />
          ))}
        </h1>

        {/* Слой 18: CTA с пульсирующим свечением вокруг C.ember */}
        <div className="mt-10 flex flex-wrap items-center gap-5 mh-rise">
          <span className="relative inline-flex">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full pointer-events-none mh-pulse"
              style={{ background: C.ember, filter: 'blur(18px)' }}
            />
            <Magnetic
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="relative rounded-full px-9 py-4 text-sm font-medium uppercase tracking-widest"
              style={{ background: C.ember, color: C.abyss }}
            >
              Смотреть работы
            </Magnetic>
          </span>
          <button
            onClick={onClose}
            className="text-sm underline underline-offset-4 transition-colors hover:text-white"
            style={{ color: C.dim }}
          >
            ← Все услуги
          </button>
        </div>
      </motion.div>

      {/* ── Слой 19: подсказка скролла. Своя, не animate-bob-down —
             та занята двумя соседними экранами. Стекающий отрезок. ── */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex flex-col items-center gap-3 mh-fade"
        style={{ animationDelay: `${T_AMBIENT}s` }}
      >
        <span className="text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: C.dim, ...MONO }}>
          Scroll
        </span>
        <span className="relative block overflow-hidden" style={{ width: 1, height: 48, background: C.petrol }}>
          <span className="absolute left-0 top-0 block mh-trickle" style={{ width: 1, height: 16, background: C.seaGlass }} />
        </span>
      </div>

      {/* ── Занавес: две половины расходятся ── */}
      <div
        aria-hidden
        className="absolute left-0 top-0 w-full z-30 pointer-events-none mh-curtain-t"
        style={{ background: C.abyss, height: '50.5%' }}
      />
      <div
        aria-hidden
        className="absolute left-0 bottom-0 w-full z-30 pointer-events-none mh-curtain-b"
        style={{ background: C.abyss, height: '50.5%' }}
      />

      {/* ── Прелоадер: обе величины привязаны к настоящим сигналам ── */}
      <div
        aria-hidden={started}
        className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 pointer-events-none mh-preloader"
      >
        <span className="text-[11px] uppercase" style={{ letterSpacing: '0.3em', color: C.seaGlass, ...MONO }}>
          {String(Math.round(progress * 100)).padStart(3, '0')}
        </span>
        <span className="block overflow-hidden" style={{ width: 160, height: 1, background: C.border }}>
          <span
            className="block h-full origin-left"
            style={{ background: C.seaGlass, transform: `scaleX(${progress})`, transition: 'transform .45s ease-out' }}
          />
        </span>
      </div>

      {/* Слой 8: кольцо курсора. На coarse не рендерим вовсе. */}
      {!coarse && useCanvas && <CursorRing x={cursor.x} y={cursor.y} over={overCanvas} />}
    </section>
  )
}
