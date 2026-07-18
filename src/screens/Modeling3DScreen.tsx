import { Suspense, lazy, useEffect } from 'react'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'

const Model3D = lazy(() => import('./Model3D'))

/* Тёплая «студийная» палитра — своя, не как у «Разработки». */
const C = {
  bg: '#0e0c0a',
  panel: '#181410',
  border: 'rgba(201,168,130,0.16)',
  clay: '#c9a882',
  clayDim: '#8a7355',
  accent: '#ef4a23',
  cream: '#ece7db',
  dim: 'rgba(236,231,219,0.55)',
}

function useFonts() {
  useEffect(() => {
    const id = 'model-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Onest:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Что моделим — bento-сетка (тренд 2026) ─────────────────────── */
const BENTO = [
  { t: 'Персонажи', d: 'Стилизованные и реалистичные герои с характером.', span: 'md:col-span-2 md:row-span-2', big: true },
  { t: 'Предметы', d: 'Продукты, реквизит, гаджеты.', span: '' },
  { t: 'Окружения', d: 'Сцены и локации.', span: '' },
  { t: 'Хард-сурфейс', d: 'Техника, механизмы, оружие.', span: 'md:col-span-2' },
  { t: 'Под анимацию', d: 'Чистая топология и риг-реди сетка.', span: '' },
  { t: 'Стилизация', d: 'Свой визуальный язык проекта.', span: '' },
]

/* ── Пайплайн — горизонтальная лента шагов (не sticky-стек) ─────── */
const STEPS = [
  { n: '01', t: 'Референсы', d: 'Собираю рефы и задаю направление.' },
  { n: '02', t: 'Блокинг', d: 'Грубая форма: пропорции и силуэт.' },
  { n: '03', t: 'Скульпт', d: 'Детали, объём и характер.' },
  { n: '04', t: 'Ретопология', d: 'Чистая сетка под анимацию.' },
  { n: '05', t: 'UV + Текстуры', d: 'Развёртка и PBR-материалы.' },
  { n: '06', t: 'Свет + Рендер', d: 'Постановка света и финал.' },
]

export default function Modeling3DScreen({ onClose }: { onClose: () => void }) {
  useFonts()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main className="animate-screen-in relative font-onest" style={{ background: C.bg, color: C.cream }}>
      {/* тёплое студийное свечение */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 50% at 65% 30%, rgba(239,74,35,0.10), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(201,168,130,0.07), transparent 70%)' }}
      />

      <button onClick={onClose} className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur" style={{ border: `1px solid ${C.clayDim}`, color: C.clay, background: 'rgba(14,12,10,0.6)' }}>
        ← Назад
      </button>

      {/* ── ГЕРОЙ: иммерсивная студия ───────────────────────────── */}
      <section className="relative min-h-screen grid lg:grid-cols-2 items-center gap-6 px-6 md:px-12 pt-24 pb-12">
        {/* левая колонка — редакционный текст */}
        <div className="relative z-10 max-w-xl">
          <FadeIn as="span" delay={0} y={16} className="block text-xs uppercase tracking-[0.35em] mb-5" style={{ color: C.clayDim }}>
            Услуга 01 · Студия
          </FadeIn>
          <FadeIn as="h1" delay={0.05} y={30} className="font-tech font-extrabold uppercase leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(2.6rem,7vw,6rem)', color: C.cream }}>
            3D-<br />моделинг
          </FadeIn>
          <FadeIn as="p" delay={0.15} y={20} className="mt-6 text-lg md:text-xl font-light" style={{ color: C.dim }}>
            Объём, характер и эмоция. Модели, которые хочется рассмотреть со всех сторон — от первого блокинга до финального рендера.
          </FadeIn>
          <FadeIn delay={0.25} y={20} className="mt-8 flex flex-wrap gap-3">
            {['Персонажи', 'Продукты', 'Окружения'].map((t) => (
              <span key={t} className="rounded-full px-4 py-2 text-sm transition-transform duration-300 hover:scale-105 cursor-default" style={{ border: `1px solid ${C.clayDim}`, color: C.clay }}>
                {t}
              </span>
            ))}
          </FadeIn>
        </div>

        {/* правая колонка — 3D-сцена, свободно, без «оконной» рамки */}
        <div className="relative h-[46vh] lg:h-[78vh]">
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><span className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(201,168,130,0.25)', borderTopColor: C.clay }} /></div>}>
            <Model3D />
          </Suspense>
          <span className="absolute top-2 left-2 text-[11px] uppercase tracking-widest" style={{ color: C.clayDim }}>turntable · 360°</span>
        </div>

        {/* стрелка */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 animate-bob-down" style={{ color: C.clayDim }}>
          <span className="text-[11px] uppercase tracking-[0.3em]">Ниже</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      {/* ── BENTO: что моделим ──────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <FadeIn as="h2" delay={0} y={24} className="font-tech font-extrabold uppercase tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream }}>
          Что я создаю
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[190px] gap-4 max-w-6xl">
          {BENTO.map((b, i) => (
            <FadeIn
              key={b.t}
              delay={i * 0.06}
              y={28}
              className={`group rounded-3xl overflow-hidden p-5 md:p-6 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-default ${b.span}`}
              style={{ background: b.big ? C.accent : C.panel, border: `1px solid ${b.big ? 'transparent' : C.border}`, color: b.big ? '#0c0b0a' : C.cream }}
            >
              <span className={`font-tech font-extrabold leading-none ${b.big ? 'text-5xl' : 'text-2xl'}`} style={{ color: b.big ? '#0c0b0a' : C.clay }}>◆</span>
              <div className="min-w-0">
                <h3 className={`font-tech font-bold uppercase mb-1.5 leading-tight ${b.big ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'}`}>{b.t}</h3>
                <p className={`font-light leading-snug ${b.big ? 'text-sm md:text-base' : 'text-xs sm:text-[13px]'}`} style={{ opacity: 0.75 }}>{b.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── ПАЙПЛАЙН: горизонтальная лента ──────────────────────── */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <FadeIn as="h2" delay={0} y={24} className="font-tech font-extrabold uppercase tracking-tight mb-12" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: C.cream }}>
          Как я работаю
        </FadeIn>
        <div className="relative">
          <div className="absolute left-0 right-0 top-8 h-px" style={{ background: C.border }} />
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08} y={24} className="group relative shrink-0 w-[240px]">
                <span className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full font-tech font-bold text-lg transition-transform duration-300 group-hover:scale-110" style={{ background: C.panel, border: `1px solid ${C.clayDim}`, color: C.clay }}>
                  {s.n}
                </span>
                <h3 className="font-tech font-bold uppercase text-lg mt-6 leading-tight" style={{ color: C.cream }}>{s.t}</h3>
                <p className="text-sm font-light mt-2 pr-6" style={{ color: C.dim }}>{s.d}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 py-28 flex flex-col items-center text-center gap-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-tech font-extrabold uppercase tracking-tight" style={{ fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 1.08, color: C.cream }}>
          Оживим вашу
          <br />
          идею в объёме
        </motion.h2>
        <button onClick={onClose} className="rounded-full px-10 py-4 font-medium uppercase tracking-widest transition-transform hover:scale-[1.03]" style={{ background: C.accent, color: '#0c0b0a', boxShadow: '0 8px 24px -6px rgba(239,74,35,0.5)' }}>
          ← Вернуться к услугам
        </button>
      </section>
    </main>
  )
}
