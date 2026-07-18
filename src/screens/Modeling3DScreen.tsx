import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import FadeIn from '../components/FadeIn'

const Model3D = lazy(() => import('./Model3D'))

const C = {
  bg: '#060b14',
  panel: '#0b1420',
  border: 'rgba(76,194,255,0.18)',
  blue: '#4cc2ff',
  blueDim: '#2f6f92',
  accent: '#ef4a23',
  cream: '#ece7db',
}

function useTechFont() {
  useEffect(() => {
    const id = 'tech-font'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Каркасный 3D-куб + вьюпорт ─────────────────────────────────── */
function Viewport() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
      style={{ background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 40px 100px -35px rgba(0,0,0,0.6)' }}
    >
      {/* сетка вьюпорта */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(76,194,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(76,194,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* верхняя строка вьюпорта */}
      <div className="relative flex items-center justify-between px-4 h-9 border-b font-tech text-[11px]" style={{ borderColor: C.border, color: C.blueDim }}>
        <span>viewport · perspective</span>
        <span>1920×1080 · 60 fps</span>
      </div>
      {/* сцена с объёмным 3D-объектом (ленивая r3f-загрузка) */}
      <div className="relative" style={{ height: 360 }}>
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(76,194,255,0.25)', borderTopColor: C.blue }} />
            </div>
          }
        >
          <Model3D />
        </Suspense>
        {/* угловые скобки */}
        {[
          'top-3 left-3 border-t border-l',
          'top-3 right-3 border-t border-r',
          'bottom-3 left-3 border-b border-l',
          'bottom-3 right-3 border-b border-r',
        ].map((c, i) => (
          <span key={i} className={`absolute w-5 h-5 ${c}`} style={{ borderColor: C.blue, opacity: 0.6 }} />
        ))}
        {/* ось-гизмо */}
        <div className="absolute bottom-4 left-4 font-tech text-[10px] leading-tight" style={{ color: C.blueDim }}>
          <div style={{ color: '#ff5f56' }}>— X</div>
          <div style={{ color: '#27c93f' }}>| Y</div>
          <div style={{ color: C.blue }}>／ Z</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Бегущая строка ─────────────────────────────────────────────── */
const TERMS = ['Blender', 'ZBrush', 'ретопология', 'UV-развёртка', 'PBR', 'subdivision', 'скульпт', 'бейкинг', 'low-poly', 'high-poly']
function Marquee() {
  const row = [...TERMS, ...TERMS]
  return (
    <div className="overflow-hidden py-4 border-y" style={{ borderColor: C.border }}>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-tech text-base sm:text-lg px-6 whitespace-nowrap" style={{ color: i % 3 === 0 ? C.accent : C.blueDim }}>
                {t}<span style={{ color: C.blue }} className="px-3">◇</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Этапы (sticky-стек) ────────────────────────────────────────── */
const STAGES = [
  { n: '01', title: 'Референсы и блокинг', text: 'Собираем рефы, строим грубую форму — пропорции и силуэт прежде деталей.' },
  { n: '02', title: 'Скульпт', text: 'Высокополигональная лепка: объём, детали, характер модели.' },
  { n: '03', title: 'Ретопология', text: 'Чистая оптимизированная сетка под анимацию и реалтайм.' },
  { n: '04', title: 'UV и текстуры', text: 'Развёртка и PBR-материалы: цвет, шероховатость, металл, нормали.' },
  { n: '05', title: 'Свет и рендер', text: 'Постановка света, камеры и финальный фотореалистичный рендер.' },
]
function StageCard({ i, total, stage }: { i: number; total: number; stage: (typeof STAGES)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - 1 - i) * 0.03])
  return (
    <div ref={ref} className="h-[80vh] flex items-start justify-center sticky" style={{ top: `${96 + i * 24}px` }}>
      <motion.div style={{ scale, transformOrigin: 'top center', background: C.panel, border: `1px solid ${C.border}` }} className="w-full max-w-4xl rounded-[32px] p-8 md:p-12 min-h-[62vh] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="font-tech font-extrabold leading-none" style={{ fontSize: 'clamp(2.6rem,8vw,90px)', color: C.blue }}>{stage.n}</span>
          <span className="font-tech text-xs uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ border: `1px solid ${C.blueDim}`, color: C.blueDim }}>node {stage.n}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-tech font-bold uppercase leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(1.8rem,4.5vw,3.6rem)', color: C.cream }}>{stage.title}</h3>
          <p className="font-light max-w-xl" style={{ fontSize: 'clamp(0.95rem,1.6vw,1.3rem)', color: 'rgba(236,231,219,0.75)' }}>{stage.text}</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Круговое колесо инструментов ───────────────────────────────── */
const TOOLS = ['Blender', 'ZBrush', 'Maya', 'Substance', 'Marmoset', 'Houdini', 'Cinema 4D', '3ds Max']
const RADIUS = 185
const TAU = Math.PI * 2
function CircleItem({ label, base, angle, active }: { label: string; base: number; angle: MotionValue<number>; active: boolean }) {
  const x = useTransform(angle, (a) => Math.sin(base + a) * RADIUS)
  const y = useTransform(angle, (a) => -Math.cos(base + a) * RADIUS)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span style={{ x, y, color: active ? C.accent : C.blueDim, opacity: active ? 1 : 0.55, fontSize: active ? 24 : 18 }} className="font-tech font-bold whitespace-nowrap transition-colors duration-300">
        {label}
      </motion.span>
    </div>
  )
}
function Wheel() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const angle = useTransform(scrollYProgress, [0, 1], [0, TAU])
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = TOOLS.length
    setActive(((Math.round(-v * n) % n) + n) % n)
  })
  return (
    <section ref={ref} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <span className="font-tech text-xs uppercase tracking-[0.3em] mb-6" style={{ color: C.accent }}>Инструменты</span>
        <div className="relative" style={{ width: RADIUS * 2 + 130, height: RADIUS * 2 + 130 }}>
          <div className="absolute rounded-full" style={{ inset: 5, border: `1px dashed ${C.border}` }} />
          {TOOLS.map((t, i) => (
            <CircleItem key={t} label={t} base={(i / TOOLS.length) * TAU} angle={angle} active={i === active} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-tech font-extrabold uppercase" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', color: C.cream }}>{TOOLS[active]}</span>
            <span className="font-tech text-[11px] mt-2" style={{ color: C.blueDim }}>{String(active + 1).padStart(2, '0')} / {TOOLS.length}</span>
          </div>
        </div>
        <span className="font-tech text-xs mt-6 animate-bob-down" style={{ color: C.blueDim }}>крутите ↓</span>
      </div>
    </section>
  )
}

/* ── Экран ──────────────────────────────────────────────────────── */
export default function Modeling3DScreen({ onClose }: { onClose: () => void }) {
  useTechFont()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main className="animate-screen-in relative" style={{ background: C.bg, color: C.blue }}>
      {/* blueprint-фон */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 8%, rgba(76,194,255,0.06), transparent 46%), linear-gradient(rgba(76,194,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(76,194,255,0.035) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      <button onClick={onClose} className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 font-tech text-sm backdrop-blur" style={{ border: `1px solid ${C.blueDim}`, color: C.blue, background: 'rgba(6,11,20,0.6)' }}>
        ← Назад
      </button>

      {/* Герой */}
      <section className="min-h-screen flex flex-col items-center justify-center px-5 py-24 relative">
        <FadeIn as="span" delay={0} y={16} className="font-tech text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.blueDim }}>Услуга · 3D-моделинг</FadeIn>
        <FadeIn as="h1" delay={0.05} y={30} className="font-tech font-extrabold uppercase tracking-tight text-center leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.2rem,8vw,6.5rem)', color: C.cream }}>
          3D-моделинг
        </FadeIn>
        <Viewport />
        <div className="mt-12 flex flex-col items-center gap-2 animate-bob-down" style={{ color: C.blueDim }}>
          <span className="font-tech text-xs uppercase tracking-[0.3em]">Пролистайте вниз</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      <Marquee />

      {/* Этапы */}
      <section className="px-5 sm:px-8 md:px-10 pt-24 pb-16 relative">
        <FadeIn as="span" delay={0} y={16} className="block text-center font-tech text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.accent }}>Пайплайн</FadeIn>
        <FadeIn as="h2" delay={0.05} y={30} className="font-tech font-extrabold uppercase tracking-tight text-center mb-10" style={{ fontSize: 'clamp(2.2rem,9vw,6rem)', color: C.cream }}>Этапы</FadeIn>
        <div className="max-w-4xl mx-auto">
          {STAGES.map((s, i) => (<StageCard key={s.n} i={i} total={STAGES.length} stage={s} />))}
        </div>
      </section>

      <Wheel />
      <Marquee />

      <section className="px-5 py-28 flex flex-col items-center text-center gap-8 relative">
        <h2 className="font-tech font-extrabold uppercase tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(1.8rem,7vw,4.5rem)', color: C.cream }}>Оживим<br />вашу идею в 3D</h2>
        <button onClick={onClose} className="rounded-full px-10 py-4 font-medium uppercase tracking-widest transition-transform hover:scale-[1.03]" style={{ background: C.accent, color: '#0c0b0a', boxShadow: '0 8px 24px -6px rgba(239,74,35,0.5)' }}>
          ← Вернуться к услугам
        </button>
      </section>
    </main>
  )
}
