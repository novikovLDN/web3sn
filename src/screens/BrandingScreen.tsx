import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FadeIn from '../components/FadeIn'

/**
 * Экран услуги 04 — Брендинг.
 *
 * Намеренно светлый «бумажный» экран: три предыдущих экрана услуг тёмные,
 * и айдентика читается честнее на бумаге, чем на подсветке.
 *
 * Фирменная механика — живая бренд-система: выбранная палитра
 * перекрашивает знак, свотчи и носители одновременно. Это не декор,
 * а демонстрация главного тезиса услуги: бренд — это система, а не логотип.
 */

const EASE = [0.22, 0.61, 0.36, 1] as const
const SWITCH = 'background-color 600ms cubic-bezier(0.22,0.61,0.36,1), color 600ms cubic-bezier(0.22,0.61,0.36,1), border-color 600ms cubic-bezier(0.22,0.61,0.36,1)'

type Palette = {
  id: string
  name: string
  paper: string
  ink: string
  accent: string
  soft: string
}

/* Пять непохожих систем: разный тон, а не оттенки одного цвета. */
const PALETTES: Palette[] = [
  { id: 'terra', name: 'Терракота', paper: '#f3efe6', ink: '#17130f', accent: '#ef4a23', soft: '#d8c3a5' },
  { id: 'indigo', name: 'Индиго', paper: '#edf0f7', ink: '#0f1420', accent: '#2f4fd8', soft: '#b3c0e8' },
  { id: 'pine', name: 'Хвоя', paper: '#edf3ee', ink: '#0f1a14', accent: '#1f7a4d', soft: '#a9cbb6' },
  { id: 'plum', name: 'Слива', paper: '#f3eef5', ink: '#190f18', accent: '#7a2f8f', soft: '#cfaeda' },
  { id: 'coal', name: 'Уголь', paper: '#ededea', ink: '#0b0b0b', accent: '#111111', soft: '#9a9a95' },
]

const DELIVERABLES = [
  { t: 'Логотип и знак', d: 'Основной, компактный и монохромный варианты + правила отступов.' },
  { t: 'Палитра', d: 'Основные и вспомогательные цвета с контрастом под доступность.' },
  { t: 'Типографика', d: 'Пара шрифтов, шкала размеров и правила набора.' },
  { t: 'Носители', d: 'Визитки, документы, соцсети, вывески, мерч.' },
  { t: 'Гайдлайн', d: 'Документ, по которому бренд соберёт любой подрядчик.' },
  { t: 'Tone of voice', d: 'Как бренд говорит: лексика, интонация, примеры.' },
]

const STEPS = [
  { n: '01', t: 'Бриф', d: 'Задача, аудитория, конкуренты, ограничения.' },
  { n: '02', t: 'Исследование', d: 'Поле рынка и territory — где можно быть собой.' },
  { n: '03', t: 'Концепции', d: 'Две-три разные идеи знака, а не вариации одной.' },
  { n: '04', t: 'Система', d: 'Палитра, шрифты, сетка, носители — всё связно.' },
  { n: '05', t: 'Гайдлайн', d: 'Правила и файлы, чтобы бренд не «поплыл».' },
]

function useFonts() {
  useEffect(() => {
    const id = 'branding-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Onest:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* Знак бренда: монограмма в квадрате + словесная часть. */
function Mark({ p, size = 1 }: { p: Palette; size?: number }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 12 * size }}>
      <span
        className="inline-flex items-center justify-center font-semibold"
        style={{
          width: 44 * size,
          height: 44 * size,
          borderRadius: 12 * size,
          background: p.accent,
          color: p.paper,
          fontSize: 22 * size,
          transition: SWITCH,
        }}
      >
        N
      </span>
      <span
        className="font-semibold tracking-tight"
        style={{ color: p.ink, fontSize: 26 * size, transition: SWITCH }}
      >
        NOVIKOV<span style={{ color: p.accent, transition: SWITCH }}>.</span>
      </span>
    </span>
  )
}

export default function BrandingScreen({ onClose }: { onClose: () => void }) {
  useFonts()
  const [pi, setPi] = useState(0)
  const p = PALETTES[pi]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const serif = { fontFamily: "'Instrument Serif', Georgia, serif" }

  return (
    <main
      data-screen="branding"
      className="animate-screen-in relative font-onest"
      style={{ background: p.paper, color: p.ink, transition: SWITCH }}
    >
      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur"
        style={{ border: `1px solid ${p.soft}`, color: p.ink, background: `${p.paper}cc`, transition: SWITCH }}
      >
        ← Назад
      </button>

      {/* ── ГЕРОЙ ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16">
        <FadeIn as="span" delay={0} y={16} className="block text-xs uppercase tracking-[0.35em] mb-6" style={{ color: p.ink, opacity: 0.5 }}>
          Услуга 04 · Идентика
        </FadeIn>

        <FadeIn as="h1" delay={0.05} y={30} className="leading-[0.86] tracking-tight" style={{ ...serif, fontSize: 'clamp(3rem,11vw,9rem)' }}>
          Брендинг
        </FadeIn>

        <FadeIn as="p" delay={0.15} y={20} className="mt-7 max-w-xl text-lg md:text-xl font-light" style={{ opacity: 0.7 }}>
          Логотип — это верхушка. Работает система: цвет, шрифт, интонация и
          носители, собранные так, чтобы бренд узнавали без подписи.
        </FadeIn>

        {/* Живая бренд-система */}
        <FadeIn delay={0.25} y={24} className="mt-14">
          <p className="text-[11px] uppercase tracking-[0.3em] mb-4" style={{ opacity: 0.45 }}>
            Живая система · выберите палитру
          </p>

          <div className="flex flex-wrap gap-2.5 mb-10">
            {PALETTES.map((pal, i) => {
              const active = i === pi
              return (
                <button
                  key={pal.id}
                  onClick={() => setPi(i)}
                  aria-pressed={active}
                  className="group flex items-center gap-2.5 rounded-full pl-2 pr-4 py-2 text-sm"
                  style={{
                    border: `1.5px solid ${active ? pal.accent : p.soft}`,
                    color: p.ink,
                    background: active ? `${pal.accent}14` : 'transparent',
                    transition: SWITCH,
                  }}
                >
                  <span className="flex">
                    <span className="w-4 h-4 rounded-full" style={{ background: pal.accent }} />
                    <span className="w-4 h-4 rounded-full -ml-1.5" style={{ background: pal.soft }} />
                  </span>
                  {pal.name}
                </button>
              )
            })}
          </div>

          {/* Знак + свотчи */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-stretch max-w-5xl">
            <motion.div
              key={p.id}
              initial={{ opacity: 0.6, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[240px]"
              style={{ background: p.ink, transition: SWITCH }}
            >
              <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: p.paper, opacity: 0.5 }}>
                Знак на тёмном
              </span>
              <div style={{ transform: 'scale(1)' }}>
                <span className="inline-flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center font-semibold"
                    style={{ width: 56, height: 56, borderRadius: 16, background: p.accent, color: p.ink, fontSize: 28, transition: SWITCH }}
                  >
                    N
                  </span>
                  <span className="font-semibold tracking-tight text-3xl" style={{ color: p.paper, transition: SWITCH }}>
                    NOVIKOV<span style={{ color: p.accent, transition: SWITCH }}>.</span>
                  </span>
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Акцент', c: p.accent },
                { label: 'Чернила', c: p.ink },
                { label: 'Мягкий', c: p.soft },
                { label: 'Бумага', c: p.paper },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 flex flex-col justify-between min-h-[110px]"
                  style={{ background: s.c, border: `1px solid ${p.soft}`, transition: SWITCH }}
                >
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: s.c === p.paper || s.c === p.soft ? p.ink : p.paper, opacity: 0.7 }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: s.c === p.paper || s.c === p.soft ? p.ink : p.paper, opacity: 0.85 }}
                  >
                    {s.c.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── НОСИТЕЛИ (перекрашиваются вместе с палитрой) ─────────── */}
      <section className="px-6 md:px-12 py-20">
        <FadeIn as="h2" delay={0} y={24} className="tracking-tight mb-3" style={{ ...serif, fontSize: 'clamp(1.9rem,5vw,3.6rem)' }}>
          Одна система — все носители
        </FadeIn>
        <FadeIn as="p" delay={0.05} y={16} className="mb-10 max-w-lg font-light" style={{ opacity: 0.6 }}>
          Переключите палитру выше — носители перекрасятся синхронно. Так и
          работает гайдлайн: правило одно, применений много.
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl">
          {/* Визитка */}
          <FadeIn delay={0.05} y={24}>
            <div className="rounded-2xl aspect-[1.6] p-5 flex flex-col justify-between" style={{ background: p.paper, border: `1px solid ${p.soft}`, boxShadow: '0 18px 40px -28px rgba(0,0,0,0.45)', transition: SWITCH }}>
              <Mark p={p} size={0.62} />
              <div className="text-[11px] leading-relaxed" style={{ opacity: 0.65 }}>
                Максим Новиков<br />3D-креатор
              </div>
            </div>
            <p className="text-xs mt-2.5 uppercase tracking-widest" style={{ opacity: 0.45 }}>Визитка</p>
          </FadeIn>

          {/* Аватар */}
          <FadeIn delay={0.1} y={24}>
            <div className="rounded-2xl aspect-[1.6] flex items-center justify-center" style={{ background: p.ink, transition: SWITCH }}>
              <span className="inline-flex items-center justify-center font-semibold" style={{ width: 78, height: 78, borderRadius: '50%', background: p.accent, color: p.ink, fontSize: 36, transition: SWITCH }}>
                N
              </span>
            </div>
            <p className="text-xs mt-2.5 uppercase tracking-widest" style={{ opacity: 0.45 }}>Аватар</p>
          </FadeIn>

          {/* Вывеска */}
          <FadeIn delay={0.15} y={24}>
            <div className="rounded-2xl aspect-[1.6] p-5 flex items-end" style={{ background: p.accent, transition: SWITCH }}>
              <span className="font-semibold tracking-tight text-2xl" style={{ color: p.paper, transition: SWITCH }}>
                NOVIKOV.
              </span>
            </div>
            <p className="text-xs mt-2.5 uppercase tracking-widest" style={{ opacity: 0.45 }}>Вывеска</p>
          </FadeIn>

          {/* Обложка соцсетей */}
          <FadeIn delay={0.2} y={24}>
            <div className="rounded-2xl aspect-[1.6] p-5 flex flex-col justify-between" style={{ background: p.soft, transition: SWITCH }}>
              <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: p.ink, opacity: 0.7 }}>
                Портфолио 2026
              </span>
              <span style={{ ...serif, fontSize: 30, lineHeight: 1, color: p.ink, transition: SWITCH }}>
                Объём<br />и характер
              </span>
            </div>
            <p className="text-xs mt-2.5 uppercase tracking-widest" style={{ opacity: 0.45 }}>Обложка</p>
          </FadeIn>
        </div>
      </section>

      {/* ── ЧТО ВХОДИТ ──────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20">
        <FadeIn as="h2" delay={0} y={24} className="tracking-tight mb-10" style={{ ...serif, fontSize: 'clamp(1.9rem,5vw,3.6rem)' }}>
          Что входит
        </FadeIn>
        <div className="grid gap-px max-w-5xl" style={{ background: p.soft, border: `1px solid ${p.soft}`, borderRadius: 24, overflow: 'hidden', transition: SWITCH }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: p.soft }}>
            {DELIVERABLES.map((d, i) => (
              <FadeIn key={d.t} delay={i * 0.05} y={20}>
                <div className="p-6 h-full" style={{ background: p.paper, transition: SWITCH }}>
                  <span className="block text-[11px] font-mono mb-3" style={{ color: p.accent, transition: SWITCH }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold mb-1.5">{d.t}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ opacity: 0.6 }}>{d.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОЦЕСС ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20">
        <FadeIn as="h2" delay={0} y={24} className="tracking-tight mb-12" style={{ ...serif, fontSize: 'clamp(1.9rem,5vw,3.6rem)' }}>
          Как идёт работа
        </FadeIn>
        <div className="max-w-3xl">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.06} y={20}>
              <div className="flex gap-6 py-6" style={{ borderTop: `1px solid ${p.soft}`, transition: SWITCH }}>
                <span className="font-mono text-sm shrink-0 pt-1" style={{ color: p.accent, transition: SWITCH }}>{s.n}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.t}</h3>
                  <p className="font-light" style={{ opacity: 0.62 }}>{s.d}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 py-28 flex flex-col items-center text-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="tracking-tight"
          style={{ ...serif, fontSize: 'clamp(2rem,7vw,5rem)', lineHeight: 1.05 }}
        >
          Соберём бренд,
          <br />
          который узнают
        </motion.h2>
        <button
          onClick={onClose}
          className="rounded-full px-10 py-4 font-medium uppercase tracking-widest transition-transform hover:scale-[1.03]"
          style={{ background: p.accent, color: p.paper, transition: SWITCH }}
        >
          ← Вернуться к услугам
        </button>
      </section>
    </main>
  )
}
