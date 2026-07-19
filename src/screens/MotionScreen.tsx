import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValue, useScroll, useTransform, useVelocity, type MotionValue } from 'framer-motion'

/* Вибрантная «кинетическая» палитра. */
const C = {
  bg: '#0a0812',
  panel: '#16121f',
  border: 'rgba(160,107,255,0.18)',
  violet: '#a06bff',
  violetDim: '#6a4ba0',
  accent: '#ef4a23',
  cream: '#ece7db',
  dim: 'rgba(236,231,219,0.6)',
}
const EASE = [0.22, 0.61, 0.36, 1] as const
const MTS = { fontFamily: "'MTS Wide', sans-serif" }

function useFonts() {
  useEffect(() => {
    const id = 'motion-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Универсальные хелперы анимации ─────────────────────────────── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const rise = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }

function Reveal({ children, className, style, delay = 0 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div className={className} style={style} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </motion.div>
  )
}

function WordReveal({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.p className={className} style={style} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="inline-block mr-[0.26em]" variants={{ hidden: { opacity: 0, y: 22, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } } }}>
          {w}
        </motion.span>
      ))}
    </motion.p>
  )
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const t0 = performance.now()
    const dur = 1500
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{v.toLocaleString('ru-RU')}{suffix}</span>
}

const ROT = ['интро', 'титры', 'логотипы', 'UI-моушн', 'рекламу', 'соцсети']
function WordRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % ROT.length), 1800)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ minWidth: '6ch', height: '1.2em' }}>
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.5, ease: EASE }} className="font-semibold" style={{ color: C.accent }}>
          {ROT[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ── Плавающие фигуры (герой) ───────────────────────────────────── */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-40 h-40 rounded-full animate-float-a" style={{ left: '8%', top: '20%', background: 'radial-gradient(circle,rgba(160,107,255,0.5),transparent 70%)', filter: 'blur(8px)' }} />
      <div className="absolute w-52 h-52 rounded-full animate-float-b" style={{ right: '6%', top: '30%', background: 'radial-gradient(circle,rgba(239,74,35,0.4),transparent 70%)', filter: 'blur(10px)' }} />
      <div className="absolute w-24 h-24 animate-wobble" style={{ left: '18%', bottom: '18%', border: `2px solid ${C.violet}`, borderRadius: '30%', opacity: 0.4 }} />
      <div className="absolute w-16 h-16 rounded-full animate-float-a" style={{ right: '20%', bottom: '22%', border: `2px solid ${C.accent}`, opacity: 0.5 }} />
    </div>
  )
}

/* ── Кинетическая бегущая строка ────────────────────────────────── */
function Kinetic({ text, dir, color, size = 'clamp(3rem,11vw,9rem)', op = 1 }: { text: string; dir: 'l' | 'r'; color: string; size?: string; op?: number }) {
  const row = Array.from({ length: 5 }, () => text)
  return (
    <div className="overflow-hidden" style={{ opacity: op }}>
      <div className="flex w-max animate-marquee" style={dir === 'r' ? { animationDirection: 'reverse' } : undefined}>
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-bold uppercase tracking-tight px-5 whitespace-nowrap" style={{ fontSize: size, color, lineHeight: 1, ...MTS }}>
                {t} <span style={{ color: C.accent }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Easing ─────────────────────────────────────────────────────── */
const EASES = [
  { name: 'Linear', css: 'linear', path: 'M0 60 L120 0' },
  { name: 'Ease-out', css: 'cubic-bezier(0.16,1,0.3,1)', path: 'M0 60 C20 0 40 0 120 0' },
  { name: 'Ease-in-out', css: 'cubic-bezier(0.65,0,0.35,1)', path: 'M0 60 C60 60 60 0 120 0' },
  { name: 'Spring', css: 'cubic-bezier(0.34,1.56,0.64,1)', path: 'M0 60 C40 60 55 -18 120 0' },
]
function EasingCard({ e }: { e: (typeof EASES)[number] }) {
  return (
    <motion.div variants={rise} className="rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.border}` }} whileHover={{ y: -6 }} transition={{ duration: 0.4, ease: EASE }}>
      <span className="text-xs uppercase tracking-widest" style={{ color: C.violet }}>{e.name}</span>
      <svg viewBox="0 0 120 60" className="w-full h-14 my-4" preserveAspectRatio="none">
        <motion.path d={e.path} fill="none" stroke={C.violet} strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} />
      </svg>
      <div className="relative h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <span className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: C.accent, animation: `ease-run 1.6s ${e.css} infinite alternate` }} />
      </div>
    </motion.div>
  )
}

/* ── Таймлайн + превью «композиции» ─────────────────────────────── */
const TRACKS = ['Position', 'Scale', 'Opacity', 'Rotation']
function Timeline() {
  return (
    <div className="relative rounded-2xl p-5 md:p-7 overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="absolute top-4 bottom-4 w-px z-10" style={{ background: C.accent, left: '4%', animation: 'playhead-run 4s ease-in-out infinite alternate' }}>
        <span className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rotate-45" style={{ background: C.accent }} />
      </div>
      {TRACKS.map((t, r) => (
        <div key={t} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="w-24 shrink-0 text-sm" style={{ color: C.dim }}>{t}</span>
          <div className="relative flex-1 h-4">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {[0.12, 0.38, 0.6, 0.85].map((p, k) => (
              <span key={k} className="absolute top-1/2 w-3 h-3" style={{ left: `${p * 100}%`, background: k % 2 ? C.violet : C.accent, animation: `kf-pulse 2.4s ease-in-out ${(r + k) * 0.2}s infinite`, transformOrigin: 'center' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
/* ── Горизонтальная галерея форматов ────────────────────────────── */
const FORMATS = [
  { t: 'Explainer', c: '#ef4a23' },
  { t: 'Логотип', c: '#a06bff' },
  { t: 'Reels', c: '#ff4d8d' },
  { t: 'UI-моушн', c: '#3fb6ff' },
  { t: '3D-моушн', c: '#f5b400' },
  { t: 'Титры', c: '#4ade80' },
]
function HGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['3%', '-64%'])
  return (
    <section ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <h2 className="px-6 md:px-12 mb-10 font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, ...MTS }}>
          Форматы
        </h2>
        <motion.div style={{ x }} className="flex gap-6 px-6 md:px-12">
          {FORMATS.map((f) => (
            <div key={f.t} className="shrink-0 w-[70vw] md:w-[38vw] h-[52vh] rounded-3xl p-8 flex flex-col justify-between" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <span className="w-16 h-16 rounded-2xl" style={{ background: f.c }} />
              <div>
                <h3 className="font-bold uppercase text-3xl md:text-5xl mb-2" style={{ color: C.cream, ...MTS }}>{f.t}</h3>
                <p className="font-light" style={{ color: C.dim }}>Динамика, ритм и характер под задачу.</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Большое кинетическое слово на скролле ──────────────────────── */
function BigScrollWord() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 1.05, 0.65])
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  return (
    <section ref={ref} className="py-40 overflow-hidden flex items-center justify-center">
      <motion.h2 style={{ scale, rotate, opacity }} className="text-center font-bold uppercase leading-[0.9]" >
        <span className="block bg-clip-text text-transparent animate-grad" style={{ backgroundImage: `linear-gradient(90deg,${C.accent},${C.violet},${C.accent})`, fontSize: 'clamp(2.5rem,11vw,9rem)', ...MTS }}>
          Анимация
        </span>
        <span className="block" style={{ color: C.cream, fontSize: 'clamp(2.5rem,11vw,9rem)', ...MTS }}>решает всё</span>
      </motion.h2>
    </section>
  )
}

/* ── Портал «влёта в пространство» ──────────────────────────────── */
const RING_COLORS = ['#ef4a23', '#a06bff', '#ff4d8d', '#3fb6ff', '#f5b400', '#4ade80']
function PortalRing({ p, i }: { p: MotionValue<number>; i: number }) {
  const scale = useTransform(p, [0, 1], [0.12 + i * 0.06, 2.6 + i * 1.5])
  const opacity = useTransform(p, [0, 0.15, 0.8, 1], [0, 0.6, 0.6, 0])
  return <motion.div style={{ scale, opacity, borderColor: RING_COLORS[i % RING_COLORS.length] }} className="absolute w-[300px] h-[300px] rounded-full border-2" />
}
function ZoomPortal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.82], [0, 1, 0])
  const textScale = useTransform(scrollYProgress, [0.25, 0.6], [0.7, 1.05])
  return (
    <section ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <PortalRing key={i} p={scrollYProgress} i={i} />
        ))}
        <motion.div style={{ opacity: textOpacity, scale: textScale }} className="relative z-10 text-center px-6">
          <h2 className="font-bold uppercase leading-[0.95] bg-clip-text text-transparent animate-grad" style={{ backgroundImage: `linear-gradient(90deg,${C.accent},${C.violet},${C.accent})`, fontSize: 'clamp(2.2rem,7vw,5rem)', ...MTS }}>
            Внутри движения
          </h2>
          <p className="mt-4 font-light max-w-md mx-auto" style={{ color: C.dim }}>Каждый кадр — шаг в пространство истории.</p>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Магнитная кнопка (тянется к курсору) ───────────────────────── */
function Magnetic({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.4)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y, ...style }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

/* ── Рабочее пространство After Effects (мок) ───────────────────── */
const LAYERS = [
  { n: 'Заголовок', c: '#ef4a23' },
  { n: 'Логотип', c: '#a06bff' },
  { n: 'Фигуры', c: '#ff4d8d' },
  { n: 'Камера', c: '#3fb6ff' },
  { n: 'Null · контроллер', c: '#f5b400' },
  { n: 'Аудио', c: '#4ade80' },
]
function AEWorkspace() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      {/* верхняя панель */}
      <div className="flex items-center gap-2 px-4 h-9 border-b text-[11px] font-mono" style={{ borderColor: C.border, color: C.violetDim }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
        <span className="ml-3">composition · 1920×1080 · 24 fps</span>
      </div>

      <div className="grid md:grid-cols-[230px_1fr]">
        {/* панель слоёв */}
        <div className="border-b md:border-b-0 md:border-r py-2" style={{ borderColor: C.border }}>
          <div className="px-4 py-1.5 text-[10px] uppercase tracking-widest" style={{ color: C.violetDim }}>Слои</div>
          {LAYERS.map((l, i) => (
            <div key={l.n} className="group flex items-center gap-2.5 px-4 py-2 cursor-default transition-colors hover:bg-white/5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.violetDim} strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: l.c }} />
              <span className="text-sm truncate transition-colors group-hover:text-white" style={{ color: C.dim }}>{l.n}</span>
              <span className="ml-auto w-2 h-2 rotate-45 shrink-0" style={{ background: l.c, animation: `kf-pulse 2.4s ease-in-out ${i * 0.25}s infinite` }} />
            </div>
          ))}
        </div>

        {/* превью композиции */}
        <div className="relative flex items-center justify-center" style={{ minHeight: 240 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(160,107,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(160,107,255,0.05) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <motion.div
            animate={{ x: [-70, 70, 70, -70], y: [0, -20, 20, 0], scale: [1, 1.4, 0.85, 1], rotate: [0, 90, 220, 360], borderRadius: ['24%', '50%', '24%', '24%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20"
            style={{ background: `linear-gradient(135deg,${C.accent},${C.violet})` }}
          />
          <motion.span
            className="absolute w-14 h-14 rounded-full border-2"
            style={{ borderColor: C.violet }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* таймлайн снизу */}
      <div className="border-t" style={{ borderColor: C.border }}>
        <Timeline />
      </div>
    </div>
  )
}

/* ── Данные ─────────────────────────────────────────────────────── */
const STATS = [
  { to: 140, suf: '+', l: 'проектов' },
  { to: 60, suf: ' fps', l: 'плавность' },
  { to: 8, suf: ' лет', l: 'в моушене' },
  { to: 24, suf: '/7', l: 'на связи' },
]
const SERVICES = [
  { t: 'Explainer-ролики', d: 'Объясняем продукт понятно и динамично.' },
  { t: 'Логотип в движении', d: 'Живой айдент: интро, аутро, стингеры.' },
  { t: 'UI-моушн', d: 'Микроанимации и переходы интерфейсов.' },
  { t: 'Соцсети', d: 'Reels, шортсы, вертикальный контент.' },
  { t: '3D-моушн', d: 'Объёмная графика и симуляции.' },
  { t: 'Титры и графика', d: 'Ловер-трети, инфографика, субтитры.' },
]
const PRINCIPLES = [
  { n: '01', t: 'Ритм', d: 'Тайминг и паузы, которые чувствуются телом.' },
  { n: '02', t: 'Смысл', d: 'Каждое движение работает на историю, а не ради красоты.' },
  { n: '03', t: 'Характер', d: 'Свой почерк анимации под тон бренда.' },
]

export default function MotionScreen({ onClose }: { onClose: () => void }) {
  useFonts()
  const gx = useMotionValue(720)
  const gy = useMotionValue(320)
  const glow = useMotionTemplate`radial-gradient(520px circle at ${gx}px ${gy}px, rgba(160,107,255,0.22), transparent 60%)`
  const { scrollY } = useScroll()
  const scrollVel = useVelocity(scrollY)
  const bandSkew = useTransform(scrollVel, [-2500, 0, 2500], [-6, 0, 6], { clamp: true })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main className="animate-screen-in relative font-onest" style={{ background: C.bg, color: C.cream }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 50% 15%, rgba(160,107,255,0.14), transparent 70%), radial-gradient(45% 40% at 85% 85%, rgba(239,74,35,0.10), transparent 70%)' }} />

      <button onClick={onClose} className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur transition-transform hover:scale-105" style={{ border: `1px solid ${C.violetDim}`, color: C.violet, background: 'rgba(10,8,18,0.6)' }}>
        ← Назад
      </button>

      {/* 1 · Кинетический герой */}
      <section
        className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          gx.set(e.clientX - r.left)
          gy.set(e.clientY - r.top)
        }}
      >
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: glow }} />
        <FloatingShapes />
        <div className="relative z-0 opacity-[0.13]">
          <Kinetic text="ДВИЖЕНИЕ" dir="l" color={C.cream} />
          <Kinetic text="MOTION" dir="r" color={C.violet} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-xs uppercase tracking-[0.35em] mb-5" style={{ color: C.violet }}>
            Услуга 03 · Motion-дизайн
          </motion.span>
          <motion.h1 initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: EASE }} className="font-bold uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3rem,10vw,8rem)', ...MTS }}>
            <span className="bg-clip-text text-transparent animate-grad" style={{ backgroundImage: `linear-gradient(90deg,${C.cream},${C.violet},${C.cream})` }}>Motion</span>
            <span style={{ color: C.accent }}>.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 max-w-xl text-lg md:text-2xl font-light flex flex-wrap items-baseline justify-center gap-x-2" style={{ color: C.dim }}>
            Анимирую <WordRotator /> — красиво и по делу.
          </motion.p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 animate-bob-down z-20" style={{ color: C.violetDim }}>
          <span className="text-[11px] uppercase tracking-[0.3em]">Ниже</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      {/* 2 · Полоса тегов (наклоняется от скорости скролла) */}
      <motion.div className="py-3 border-y" style={{ borderColor: C.border, skewX: bandSkew }}>
        <Kinetic text="AFTER EFFECTS · CINEMA 4D · SPLINE · RIVE · LOTTIE · BLENDER" dir="l" color={C.violetDim} size="clamp(0.9rem,2vw,1.4rem)" op={0.9} />
      </motion.div>

      {/* 3 · Заявление с пословным появлением */}
      <section className="px-6 md:px-12 py-28 max-w-5xl">
        <WordReveal
          text="Хорошая анимация невидима — её не замечаешь, но чувствуешь. Она ведёт взгляд, задаёт настроение и превращает интерфейс в историю."
          className="font-bold uppercase leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(1.6rem,4.5vw,3.4rem)', color: C.cream, ...MTS }}
        />
      </section>

      {/* 4 · Статистика (счётчики) */}
      <section className="px-6 md:px-12 py-16 border-y" style={{ borderColor: C.border }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl">
          {STATS.map((s) => (
            <motion.div key={s.l} variants={rise}>
              <div className="font-bold" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: C.accent, ...MTS }}>
                <CountUp to={s.to} suffix={s.suf} />
              </div>
              <div className="mt-1 text-sm uppercase tracking-widest" style={{ color: C.dim }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5 · Easing */}
      <section className="px-6 md:px-12 py-24">
        <Reveal>
          <h2 className="font-bold uppercase tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, ...MTS }}>Всё в тайминге</h2>
          <p className="mb-10 max-w-xl font-light" style={{ color: C.dim }}>Характер движения задаёт кривая скорости. Правильный easing — и анимация оживает.</p>
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
          {EASES.map((e) => <EasingCard key={e.name} e={e} />)}
        </motion.div>
      </section>

      {/* 6 · Услуги */}
      <section className="px-6 md:px-12 py-24">
        <Reveal><h2 className="font-bold uppercase tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, ...MTS }}>Что я анимирую</h2></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {SERVICES.map((s, i) => (
            <motion.div key={s.t} variants={rise} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.4, ease: EASE }} className="rounded-2xl p-6 cursor-default" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <span className="inline-block w-10 h-10 rounded-lg mb-4" style={{ background: i % 2 ? C.violet : C.accent }} />
              <h3 className="font-semibold text-xl mb-1" style={{ color: C.cream }}>{s.t}</h3>
              <p className="text-sm font-light" style={{ color: C.dim }}>{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7 · Рабочее пространство After Effects */}
      <section className="px-6 md:px-12 py-24">
        <Reveal><h2 className="font-bold uppercase tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, ...MTS }}>Рабочий процесс</h2></Reveal>
        <Reveal delay={0.05}><p className="mb-10 max-w-xl font-light" style={{ color: C.dim }}>Слои, композиция и таймлайн — здесь рождается движение. Наведите на слой.</p></Reveal>
        <Reveal delay={0.1}><div className="max-w-6xl"><AEWorkspace /></div></Reveal>
      </section>

      {/* 8 · Принципы */}
      <section className="px-6 md:px-12 py-24">
        <Reveal><h2 className="font-bold uppercase tracking-tight mb-12" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, ...MTS }}>Принципы</h2></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid md:grid-cols-3 gap-6 max-w-6xl">
          {PRINCIPLES.map((p) => (
            <motion.div key={p.n} variants={rise} className="relative">
              <span className="font-bold" style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: C.violetDim, opacity: 0.5, ...MTS }}>{p.n}</span>
              <h3 className="font-bold uppercase text-2xl mt-2" style={{ color: C.cream, ...MTS }}>{p.t}</h3>
              <p className="mt-2 font-light" style={{ color: C.dim }}>{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 9 · Горизонтальная галерея */}
      <HGallery />

      {/* 10 · Портал: влёт в пространство */}
      <ZoomPortal />

      {/* 11 · Большое слово на скролле */}
      <BigScrollWord />

      {/* 11 · CTA */}
      <section className="px-6 py-32 flex flex-col items-center text-center gap-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }} className="font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 1.08, color: C.cream, ...MTS }}>
          Заставим ваш
          <br />
          бренд двигаться
        </motion.h2>
        <Magnetic onClick={onClose} className="rounded-full px-10 py-4 font-medium uppercase tracking-widest" style={{ background: C.accent, color: '#0c0b0a', boxShadow: '0 10px 30px -8px rgba(239,74,35,0.55)' }}>
          ← Вернуться к услугам
        </Magnetic>
      </section>
    </main>
  )
}
