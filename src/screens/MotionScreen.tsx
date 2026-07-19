import { useEffect } from 'react'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'

/* Вибрантная «кинетическая» палитра — своя. */
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

/* ── Кинетическая бегущая строка (герой) ────────────────────────── */
function Kinetic({ text, dir, color }: { text: string; dir: 'l' | 'r'; color: string }) {
  const row = Array.from({ length: 4 }, () => text)
  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee" style={dir === 'r' ? { animationDirection: 'reverse' } : undefined}>
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-bold uppercase tracking-tight px-5 whitespace-nowrap" style={{ fontSize: 'clamp(3rem,11vw,9rem)', color, lineHeight: 1 }}>
                {t} <span style={{ color: C.accent }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Демонстрация easing ────────────────────────────────────────── */
const EASES = [
  { name: 'Linear', css: 'linear', path: 'M0 60 L120 0' },
  { name: 'Ease-in-out', css: 'cubic-bezier(0.65,0,0.35,1)', path: 'M0 60 C60 60 60 0 120 0' },
  { name: 'Spring', css: 'cubic-bezier(0.34,1.56,0.64,1)', path: 'M0 60 C40 60 55 -18 120 0' },
]
function EasingCard({ e, i }: { e: (typeof EASES)[number]; i: number }) {
  return (
    <FadeIn delay={i * 0.1} y={26} className="rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <span className="text-xs uppercase tracking-widest" style={{ color: C.violet }}>{e.name}</span>
      <svg viewBox="0 0 120 60" className="w-full h-16 my-4" preserveAspectRatio="none">
        <path d={e.path} fill="none" stroke={C.violet} strokeWidth="2.5" />
      </svg>
      {/* дорожка с шариком, движущимся с этим easing */}
      <div className="relative h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <span
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          style={{ background: C.accent, animation: `ease-run 1.5s ${e.css} infinite alternate` }}
        />
      </div>
    </FadeIn>
  )
}

/* ── Таймлайн с кейфреймами (стиль After Effects) ───────────────── */
const TRACKS = ['Position', 'Scale', 'Opacity', 'Rotation']
function Timeline() {
  return (
    <div className="relative rounded-2xl p-5 md:p-7 overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      {/* бегунок */}
      <div className="absolute top-4 bottom-4 w-px z-10" style={{ background: C.accent, left: '4%', animation: 'playhead-run 4s ease-in-out infinite alternate' }}>
        <span className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rotate-45" style={{ background: C.accent }} />
      </div>
      {TRACKS.map((t, r) => (
        <div key={t} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="w-24 shrink-0 text-sm" style={{ color: C.dim }}>{t}</span>
          <div className="relative flex-1 h-4">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            {[0.12, 0.38, 0.6, 0.85].map((p, k) => (
              <span
                key={k}
                className="absolute top-1/2 w-3 h-3"
                style={{ left: `${p * 100}%`, background: k % 2 ? C.violet : C.accent, animation: `kf-pulse 2.4s ease-in-out ${(r + k) * 0.2}s infinite`, transformOrigin: 'center' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const SERVICES = [
  { t: 'Explainer-ролики', d: 'Объясняем продукт понятно и динамично.' },
  { t: 'Логотип в движении', d: 'Живой айдент: интро, аутро, стингеры.' },
  { t: 'UI-моушн', d: 'Микроанимации и переходы интерфейсов.' },
  { t: 'Соцсети', d: 'Reels, шортсы, вертикальный контент.' },
  { t: '3D-моушн', d: 'Объёмная графика и симуляции.' },
  { t: 'Титры и графика', d: 'Ловер-трети, инфографика, субтитры.' },
]

const easeApple = 'transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]'

export default function MotionScreen({ onClose }: { onClose: () => void }) {
  useFonts()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main className="animate-screen-in relative font-onest" style={{ background: C.bg, color: C.cream }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 50% 20%, rgba(160,107,255,0.14), transparent 70%), radial-gradient(45% 40% at 80% 80%, rgba(239,74,35,0.10), transparent 70%)' }} />

      <button onClick={onClose} className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur" style={{ border: `1px solid ${C.violetDim}`, color: C.violet, background: 'rgba(10,8,18,0.6)' }}>
        ← Назад
      </button>

      {/* ── Кинетический герой ──────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden">
        <div className="relative z-10 opacity-[0.14]">
          <Kinetic text="ДВИЖЕНИЕ" dir="l" color={C.cream} />
          <Kinetic text="MOTION" dir="r" color={C.violet} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <FadeIn as="span" delay={0} y={16} className="text-xs uppercase tracking-[0.35em] mb-5" style={{ color: C.violet }}>
            Услуга 03
          </FadeIn>
          <FadeIn as="h1" delay={0.05} y={30} className="font-bold uppercase leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(3rem,10vw,8rem)', color: C.cream, fontFamily: "'MTS Wide', sans-serif" }}>
            Motion<span style={{ color: C.accent }}>.</span>
          </FadeIn>
          <FadeIn as="p" delay={0.15} y={20} className="mt-6 max-w-xl text-lg md:text-xl font-light" style={{ color: C.dim }}>
            Анимация, которая держит внимание. Оживляю бренды, интерфейсы и истории — кадр за кадром.
          </FadeIn>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 animate-bob-down z-20" style={{ color: C.violetDim }}>
          <span className="text-[11px] uppercase tracking-[0.3em]">Ниже</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      {/* ── Easing ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <FadeIn as="h2" delay={0} y={24} className="font-bold uppercase tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, fontFamily: "'MTS Wide', sans-serif" }}>
          Всё в тайминге
        </FadeIn>
        <FadeIn as="p" delay={0.05} y={16} className="mb-10 max-w-xl font-light" style={{ color: C.dim }}>
          Характер анимации задаёт кривая скорости. Правильный easing — и движение оживает.
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl">
          {EASES.map((e, i) => <EasingCard key={e.name} e={e} i={i} />)}
        </div>
      </section>

      {/* ── Услуги ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <FadeIn as="h2" delay={0} y={24} className="font-bold uppercase tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, fontFamily: "'MTS Wide', sans-serif" }}>
          Что я анимирую
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.t} delay={i * 0.06} y={26} className={`group rounded-2xl p-6 cursor-default hover:-translate-y-1.5 ${easeApple}`} style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <span className="inline-block w-10 h-10 rounded-lg mb-4" style={{ background: i % 2 ? C.violet : C.accent }} />
              <h3 className="font-semibold text-xl mb-1" style={{ color: C.cream }}>{s.t}</h3>
              <p className="text-sm font-light" style={{ color: C.dim }}>{s.d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Таймлайн ────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <FadeIn as="h2" delay={0} y={24} className="font-bold uppercase tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream, fontFamily: "'MTS Wide', sans-serif" }}>
          Покадрово
        </FadeIn>
        <div className="max-w-5xl">
          <FadeIn delay={0.05} y={26}>
            <Timeline />
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 py-28 flex flex-col items-center text-center gap-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 1.08, color: C.cream, fontFamily: "'MTS Wide', sans-serif" }}>
          Заставим ваш
          <br />
          бренд двигаться
        </motion.h2>
        <button onClick={onClose} className="rounded-full px-10 py-4 font-medium uppercase tracking-widest transition-transform hover:scale-[1.03]" style={{ background: C.accent, color: '#0c0b0a', boxShadow: '0 8px 24px -6px rgba(239,74,35,0.5)' }}>
          ← Вернуться к услугам
        </button>
      </section>
    </main>
  )
}
