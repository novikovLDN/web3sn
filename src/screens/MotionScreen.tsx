import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useVelocity, type MotionValue } from 'framer-motion'
import { C, EASE, DISPLAY } from './motion/palette'
import { useMotionFonts } from './motion/useMotionFonts'
import { Reveal, WordReveal, CountUp, Kinetic, Magnetic } from './motion/primitives'
import MotionHero from './motion/MotionHero'
import DopeSheet from './motion/DopeSheet'
import EasingLab from './motion/EasingLab'
import { scrollToTarget } from '../lib/scroll'

/* ── Универсальные хелперы анимации ─────────────────────────────── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const rise = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }

/* ── Горизонтальная галерея форматов ────────────────────────────── */
const FORMATS = [
  { t: 'Explainer', c: C.ember },
  { t: 'Логотип', c: C.seaGlass },
  { t: 'Reels', c: '#A8C9C5' },
  { t: 'UI-моушн', c: C.deepOcean },
  { t: '3D-моушн', c: C.petrol },
  { t: 'Титры', c: '#0B3A40' },
]
function HGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['3%', '-64%'])
  return (
    <section id="m-formats" ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <h2 className="px-6 md:px-12 mb-10 font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.chalk, ...DISPLAY }}>
          Форматы
        </h2>
        <motion.div style={{ x }} className="flex gap-6 px-6 md:px-12">
          {FORMATS.map((f) => (
            <div key={f.t} className="shrink-0 w-[70vw] md:w-[38vw] h-[52vh] rounded-3xl p-8 flex flex-col justify-between" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <span className="w-16 h-16 rounded-2xl" style={{ background: f.c }} />
              <div>
                <h3 className="font-bold uppercase text-3xl md:text-5xl mb-2" style={{ color: C.chalk, ...DISPLAY }}>{f.t}</h3>
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
    <section id="m-word" ref={ref} className="py-40 overflow-hidden flex items-center justify-center">
      <motion.h2 style={{ scale, rotate, opacity }} className="text-center font-bold uppercase leading-[0.9]" >
        <span className="block" style={{ color: C.seaGlass, fontSize: 'clamp(2.5rem,11vw,9rem)', ...DISPLAY }}>
          Анимация
        </span>
        <span className="block" style={{ color: C.chalk, fontSize: 'clamp(2.5rem,11vw,9rem)', ...DISPLAY }}>решает всё</span>
      </motion.h2>
    </section>
  )
}

/* ── Портал «влёта в пространство» ──────────────────────────────── */
const RING_COLORS = [C.ember, C.seaGlass, '#A8C9C5', C.deepOcean, C.petrol, '#0B3A40']
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
    <section id="m-portal" ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <PortalRing key={i} p={scrollYProgress} i={i} />
        ))}
        <motion.div style={{ opacity: textOpacity, scale: textScale }} className="relative z-10 text-center px-6">
          <h2 className="font-bold uppercase leading-[0.95]" style={{ color: C.chalk, fontSize: 'clamp(2.2rem,7vw,5rem)', ...DISPLAY }}>
            Внутри движения
          </h2>
          <p className="mt-4 font-light max-w-md mx-auto" style={{ color: C.dim }}>Каждый кадр — шаг в пространство истории.</p>
        </motion.div>
      </div>
    </section>
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
  useMotionFonts()
  const { scrollY } = useScroll()
  const scrollVel = useVelocity(scrollY)
  const bandSkew = useTransform(scrollVel, [-2500, 0, 2500], [-6, 0, 6], { clamp: true })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main data-screen="motion" className="animate-screen-in relative font-sans" style={{ background: C.abyss, color: C.chalk }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 50% 15%, rgba(31,92,99,0.20), transparent 70%), radial-gradient(45% 40% at 85% 85%, rgba(226,114,91,0.06), transparent 70%)' }} />

      <button onClick={onClose} className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur transition-transform hover:scale-105" style={{ border: `1px solid ${C.petrol}`, color: C.seaGlass, background: 'rgba(7,19,22,0.6)' }}>
        ← Назад
      </button>

      {/* 1 · Герой */}
      <MotionHero onClose={onClose} />

      {/* 2 · Полоса тегов (наклоняется от скорости скролла) */}
      <motion.div className="py-3 border-y" style={{ borderColor: C.border, skewX: bandSkew }}>
        <Kinetic text="AFTER EFFECTS · CINEMA 4D · SPLINE · RIVE · LOTTIE · BLENDER" dir="l" color={C.petrol} size="clamp(0.9rem,2vw,1.4rem)" op={0.9} />
      </motion.div>

      {/* 3 · Заявление с пословным появлением */}
      <section id="m-statement" className="px-6 md:px-12 py-28 max-w-5xl">
        <WordReveal
          text="Хорошая анимация невидима — её не замечаешь, но чувствуешь. Она ведёт взгляд, задаёт настроение и превращает интерфейс в историю."
          className="font-bold uppercase leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(1.6rem,4.5vw,3.4rem)', color: C.chalk, ...DISPLAY }}
        />
      </section>

      {/* 4 · Статистика (счётчики) */}
      <section id="m-stats" className="px-6 md:px-12 py-16 border-y" style={{ borderColor: C.border }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl">
          {STATS.map((s) => (
            <motion.div key={s.l} variants={rise}>
              <div className="font-bold" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: C.ember, ...DISPLAY }}>
                <CountUp to={s.to} suffix={s.suf} />
              </div>
              <div className="mt-1 text-sm uppercase tracking-widest" style={{ color: C.dim }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5 · Easing-лаборатория */}
      <EasingLab />

      {/* 6 · Услуги */}
      <section id="m-services" className="px-6 md:px-12 py-24">
        <Reveal><h2 className="font-bold uppercase tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.chalk, ...DISPLAY }}>Что я анимирую</h2></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {SERVICES.map((s, i) => (
            <motion.div key={s.t} variants={rise} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.4, ease: EASE }} className="rounded-2xl p-6 cursor-default" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <span className="inline-block w-10 h-10 rounded-lg mb-4" style={{ background: i % 2 ? C.seaGlass : C.ember }} />
              <h3 className="font-semibold text-xl mb-1" style={{ color: C.chalk }}>{s.t}</h3>
              <p className="text-sm font-light" style={{ color: C.dim }}>{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7 · Экспозиционный лист — навигация по кадрам */}
      <DopeSheet onJump={(a) => scrollToTarget(a)} />

      {/* 8 · Принципы */}
      <section id="m-principles" className="px-6 md:px-12 py-24">
        <Reveal><h2 className="font-bold uppercase tracking-tight mb-12" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.chalk, ...DISPLAY }}>Принципы</h2></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid md:grid-cols-3 gap-6 max-w-6xl">
          {PRINCIPLES.map((p) => (
            <motion.div key={p.n} variants={rise} className="relative">
              <span className="font-bold" style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: C.petrol, opacity: 0.5, ...DISPLAY }}>{p.n}</span>
              <h3 className="font-bold uppercase text-2xl mt-2" style={{ color: C.chalk, ...DISPLAY }}>{p.t}</h3>
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
      <section id="m-cta" className="px-6 py-32 flex flex-col items-center text-center gap-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }} className="font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 1.08, color: C.chalk, ...DISPLAY }}>
          Заставим ваш
          <br />
          бренд двигаться
        </motion.h2>
        <Magnetic onClick={onClose} className="rounded-full px-10 py-4 font-medium uppercase tracking-widest" style={{ background: C.ember, color: '#0c0b0a', boxShadow: '0 10px 30px -8px rgba(226,114,91,0.55)' }}>
          ← Вернуться к услугам
        </Magnetic>
      </section>
    </main>
  )
}
