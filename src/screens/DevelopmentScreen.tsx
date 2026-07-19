import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import FadeIn from '../components/FadeIn'

/* ── Палитра терминального экрана ───────────────────────────────── */
const C = {
  bg: '#04070a',
  panel: '#0b1117',
  border: 'rgba(74,222,128,0.18)',
  green: '#4ade80',
  greenDim: '#2f9e5f',
  greenBright: '#a7f3c9',
  accent: '#ef4a23',
  cream: '#ece7db',
}

/* ── Ленивая загрузка тематических шрифтов ──────────────────────── */
function useDevFonts() {
  useEffect(() => {
    const id = 'dev-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Handjet:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap'
    document.head.appendChild(link)
  }, [])
}

/* ══════════════════════════════════════════════════════════════════
   ИНТЕРАКТИВНЫЙ ТЕРМИНАЛ
   ══════════════════════════════════════════════════════════════════ */
type Lang = { id: string; label: string; code: string }
const LANGS: Lang[] = [
  { id: 'html', label: 'HTML', code: `<!DOCTYPE html>\n<html lang="ru">\n  <body>\n    <h1>Hello, world 👋</h1>\n  </body>\n</html>` },
  { id: 'js', label: 'JavaScript', code: `const hello = (name = "world") => {\n  console.log(\`Hello, \${name} 👋\`)\n}\n\nhello("NOVIKOV")` },
  { id: 'react', label: 'React', code: `export default function App() {\n  return <h1>Hello, world 👋</h1>\n}` },
  { id: 'python', label: 'Python', code: `def hello(name="world"):\n    print(f"Hello, {name} 👋")\n\nhello("NOVIKOV")` },
  { id: 'go', label: 'Go', code: `package main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world 👋")\n}` },
]

/** Что можно «собрать» после приветствия. */
type Template = { id: string; label: string; code: string; preview: PreviewKey }
type PreviewKey = 'hello' | 'button' | 'card' | 'profile'
const TEMPLATES: Template[] = [
  { id: 'button', label: 'Кнопка', preview: 'button', code: `<button class="btn">\n  Нажми меня →\n</button>` },
  { id: 'card', label: 'Карточка', preview: 'card', code: `<div class="card">\n  <h3>NOVIKOV</h3>\n  <p>3D · Web · Motion</p>\n</div>` },
  { id: 'profile', label: 'Профиль', preview: 'profile', code: `<div class="profile">\n  <div class="avatar"/>\n  <b>NOVIKOV</b>\n</div>` },
]

function Preview({ k }: { k: PreviewKey }) {
  if (k === 'button')
    return (
      <button className="rounded-full px-7 py-3.5 font-semibold" style={{ background: '#ef4a23', color: '#0c0b0a' }}>
        Нажми меня →
      </button>
    )
  if (k === 'card')
    return (
      <div className="rounded-2xl p-6 text-left shadow-lg" style={{ background: '#0c0b0a', color: '#ece7db', width: 240 }}>
        <h3 className="text-2xl font-bold uppercase">NOVIKOV</h3>
        <p className="mt-1 text-sm" style={{ color: '#9a948a' }}>3D · Web · Motion</p>
        <div className="mt-4 h-1.5 w-16 rounded-full" style={{ background: '#ef4a23' }} />
      </div>
    )
  if (k === 'profile')
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #ff6a3d, #ef4a23 60%, #b8360f)' }} />
        <b className="text-xl uppercase tracking-tight" style={{ color: '#0c0b0a' }}>NOVIKOV</b>
        <span className="text-xs uppercase tracking-widest" style={{ color: '#6b665c' }}>3D-креатор</span>
      </div>
    )
  return <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#0c0b0a' }}>Hello, world 👋</h1>
}

/** Окно браузера с результатом. */
function BrowserWindow({ pk }: { pk: PreviewKey }) {
  const navBtn = 'w-6 h-6 flex items-center justify-center rounded-md'
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ border: `1px solid rgba(255,255,255,0.08)`, boxShadow: '0 40px 100px -35px rgba(0,0,0,0.5)' }}
    >
      {/* Тонкая полоса загрузки страницы */}
      <motion.div
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], opacity: { delay: 0.9, duration: 0.3 } }}
        className="absolute top-0 left-0 right-0 h-[3px] origin-left z-20"
        style={{ background: C.accent }}
      />

      {/* Панель браузера */}
      <div className="flex items-center gap-3 px-3.5 py-2.5" style={{ background: '#eae5db' }}>
        {/* навигация */}
        <div className="flex items-center gap-0.5" style={{ color: '#9a948a' }}>
          <span className={navBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </span>
          <span className={navBtn} style={{ color: '#c4bfb2' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </span>
          <span className={navBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-2.6-6.4M21 3v6h-6" /></svg>
          </span>
        </div>

        {/* адресная строка */}
        <div className="flex-1 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-devmono" style={{ background: '#fff', color: '#4a463f' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3fae6a" strokeWidth="2.4"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
          novikov.dev
          <span className="ml-auto text-[10px] uppercase tracking-widest" style={{ color: '#b8b2a5' }}>превью</span>
        </div>

        {/* меню */}
        <div className="flex flex-col gap-[3px]" style={{ color: '#b8b2a5' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
          ))}
        </div>
      </div>

      {/* Отрендеренная страница */}
      <div className="flex items-center justify-center bg-white px-6 py-10" style={{ minHeight: 240 }}>
        <Preview k={pk} />
      </div>
    </div>
  )
}

function useTypewriter(text: string, active: boolean, speed = 16) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) {
      setN(0)
      return
    }
    setN(0)
    let i = 0
    const id = window.setInterval(() => {
      i++
      setN(i)
      if (i >= text.length) window.clearInterval(id)
    }, speed)
    return () => window.clearInterval(id)
  }, [text, active, speed])
  return { shown: text.slice(0, n), done: n >= text.length }
}

function Terminal() {
  const [sel, setSel] = useState<{ label: string; code: string; preview: PreviewKey } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { shown, done } = useTypewriter(sel?.code ?? '', !!sel)

  // Через 2с после окончания печати «открываем» браузер.
  useEffect(() => {
    if (!sel || !done) return
    setShowPreview(false)
    const id = window.setTimeout(() => setShowPreview(true), 2000)
    return () => window.clearTimeout(id)
  }, [sel, done])

  const pick = (label: string, code: string, preview: PreviewKey) => {
    setShowPreview(false)
    setSel({ label, code, preview })
  }

  return (
    <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-center items-start gap-6">
      {/* Терминал (плавно уезжает влево, когда появляется браузер) */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ opacity: { duration: 0.7 }, layout: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } }}
        className="w-full lg:w-[520px] lg:shrink-0 rounded-xl overflow-hidden"
        style={{ background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 30px 80px -30px rgba(0,0,0,0.55)' }}
      >
        <div className="flex items-center gap-2 px-4 h-10 border-b" style={{ borderColor: C.border }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
          <span className="flex-1 text-center text-xs font-devmono" style={{ color: C.greenDim }}>novikov@studio — ~/project</span>
        </div>

        <div className="p-5 sm:p-6 font-devmono text-sm leading-relaxed min-h-[320px]" style={{ color: C.green }}>
          <p style={{ color: C.greenDim }}>
            <span style={{ color: C.accent }}>➜</span> ~/project <span style={{ color: C.greenBright }}>novikov init</span>
          </p>

          {!sel ? (
            <div className="mt-5">
              <p className="mb-4" style={{ color: C.greenBright }}># Выберите язык программирования:</p>
              <div className="flex flex-wrap gap-2.5">
                {LANGS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => pick(l.label, l.code, 'hello')}
                    className="rounded-md px-3.5 py-2 text-sm transition-colors hover:bg-[rgba(74,222,128,0.1)]"
                    style={{ border: `1px solid ${C.greenDim}`, color: C.green }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 animate-caret">▋</p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-3" style={{ color: C.greenDim }}>
                <span style={{ color: C.accent }}>➜</span> пишу код…
              </p>
              <pre className="whitespace-pre-wrap break-words">
                {shown}
                {!done && <span className="animate-caret">▋</span>}
              </pre>

              {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <p style={{ color: C.greenBright }}>
                    {showPreview ? '✓ Открыл результат в браузере →' : '› запускаю dev-сервер…'}
                  </p>
                  {showPreview && (
                    <>
                      <p className="mt-4 mb-2" style={{ color: C.greenBright }}># Что создадим дальше?</p>
                      <div className="flex flex-wrap gap-2.5">
                        {TEMPLATES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => pick(t.label, t.code, t.preview)}
                            className="rounded-md px-3.5 py-2 text-sm transition-colors hover:bg-[rgba(74,222,128,0.1)]"
                            style={{ border: `1px solid ${C.greenDim}`, color: C.green }}
                          >
                            {t.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setSel(null)}
                          className="rounded-md px-3.5 py-2 text-sm transition-colors hover:bg-[rgba(239,74,35,0.12)]"
                          style={{ border: `1px solid ${C.accent}`, color: C.accent }}
                        >
                          ↺ другой язык
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Браузер с результатом — выезжает справа */}
      <AnimatePresence mode="popLayout">
        {sel && showPreview && (
          <motion.div
            key={sel.preview + sel.label}
            layout
            initial={{ opacity: 0, x: 70, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 70, scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="w-full lg:w-[460px] lg:shrink-0"
          >
            <BrowserWindow pk={sel.preview} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ЛЕВИТИРУЮЩИЕ DEV-ЭЛЕМЕНТЫ ПО БОКАМ
   ══════════════════════════════════════════════════════════════════ */
const GLYPHS = [
  { t: '</>', x: '5%', y: '18%', s: 44, d: 0 },
  { t: '{ }', x: '92%', y: '22%', s: 40, d: 0.6 },
  { t: '( )', x: '8%', y: '70%', s: 34, d: 1.2 },
  { t: ';', x: '94%', y: '66%', s: 48, d: 0.3 },
  { t: '#', x: '3%', y: '45%', s: 30, d: 0.9 },
  { t: 'git', x: '90%', y: '46%', s: 26, d: 1.5 },
]
function FloatingGlyphs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="absolute font-devmono font-medium animate-float-y"
          style={{
            left: g.x,
            top: g.y,
            fontSize: g.s,
            color: 'rgba(120,150,135,0.9)',
            opacity: 0.12,
            animationDelay: `${g.d}s`,
          }}
        >
          {g.t}
        </span>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   БЕГУЩАЯ СТРОКА
   ══════════════════════════════════════════════════════════════════ */
const TERMS = ['git commit -m "feat"', 'npm run build', '<NOVIKOV/>', 'useState()', 'async / await', 'deploy →', 'console.log()', 'const', 'API', 'CI/CD']
function CodeMarquee() {
  const row = [...TERMS, ...TERMS]
  return (
    <div className="overflow-hidden py-4 border-y" style={{ borderColor: C.border }}>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-devmono text-base sm:text-lg px-6 whitespace-nowrap" style={{ color: i % 3 === 0 ? C.accent : C.greenDim }}>
                {t}
                <span style={{ color: C.green }} className="px-3">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ЭТАПЫ (sticky-стек)
   ══════════════════════════════════════════════════════════════════ */
const STAGES = [
  { n: '01', title: 'Бриф и идея', text: 'Разбираем задачу, цели и референсы. Фиксируем объём и результат.' },
  { n: '02', title: 'Дизайн и прототип', text: 'UI/UX, макеты и интерактивный прототип в фирменном стиле.' },
  { n: '03', title: 'Вёрстка', text: 'Семантичная адаптивная разметка, пиксель-в-пиксель, любые экраны.' },
  { n: '04', title: 'Логика и API', text: 'Данные, интеграции, состояние, анимации и 3D там, где нужно.' },
  { n: '05', title: 'Тесты и оптимизация', text: 'Скорость, доступность и стабильность на всех устройствах.' },
  { n: '06', title: 'Деплой', text: 'Запуск, CI/CD и мониторинг. Проект живёт и обновляется.' },
]
function StageCard({ i, total, stage }: { i: number; total: number; stage: (typeof STAGES)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - 1 - i) * 0.03])
  return (
    <div ref={ref} className="h-[80vh] flex items-start justify-center sticky" style={{ top: `${96 + i * 24}px` }}>
      <motion.div
        style={{ scale, transformOrigin: 'top center', background: C.panel, border: `1px solid ${C.border}` }}
        className="w-full max-w-4xl rounded-[32px] p-8 md:p-12 min-h-[62vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-pixel font-extrabold leading-none" style={{ fontSize: 'clamp(3rem,9vw,120px)', color: C.green }}>
            {stage.n}
          </span>
          <span className="font-devmono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ border: `1px solid ${C.greenDim}`, color: C.greenDim }}>
            stage {stage.n}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-pixel font-bold uppercase leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: C.cream }}>
            {stage.title}
          </h3>
          <p className="font-light max-w-xl" style={{ fontSize: 'clamp(0.95rem,1.6vw,1.3rem)', color: 'rgba(236,231,219,0.75)' }}>
            {stage.text}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   КРУГОВАЯ СЕКЦИЯ (колесо технологий, pinned)
   ══════════════════════════════════════════════════════════════════ */
const TECH = ['React', 'Three.js', 'Rapier', 'WebGL', 'TypeScript', 'Vite', 'Node.js', 'GLSL', 'Framer', 'Tailwind']
const RADIUS = 190
const TAU = Math.PI * 2

/** Позиционируется по окружности через translate — текст всегда вертикальный. */
function CircleItem({ label, base, angle, active }: { label: string; base: number; angle: MotionValue<number>; active: boolean }) {
  const x = useTransform(angle, (a) => Math.sin(base + a) * RADIUS)
  const y = useTransform(angle, (a) => -Math.cos(base + a) * RADIUS)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span
        style={{ x, y, color: active ? C.accent : C.greenDim, opacity: active ? 1 : 0.55, fontSize: active ? 26 : 19 }}
        className="font-pixel font-bold whitespace-nowrap transition-colors duration-300"
      >
        {label}
      </motion.span>
    </div>
  )
}

function CircularSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const angle = useTransform(scrollYProgress, [0, 1], [0, TAU])
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = TECH.length
    setActive(((Math.round(-v * n) % n) + n) % n)
  })
  return (
    <section ref={ref} className="relative" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <span className="font-devmono text-xs uppercase tracking-[0.3em] mb-6" style={{ color: C.accent }}>
          Наш стек
        </span>
        <div className="relative" style={{ width: RADIUS * 2 + 130, height: RADIUS * 2 + 130 }}>
          <div className="absolute rounded-full" style={{ inset: 5, border: `1px dashed ${C.border}` }} />
          <div className="absolute rounded-full" style={{ inset: 48, border: `1px solid rgba(74,222,128,0.08)` }} />
          {TECH.map((t, i) => (
            <CircleItem key={t} label={t} base={(i / TECH.length) * TAU} angle={angle} active={i === active} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-pixel font-extrabold uppercase" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: C.cream }}>
              {TECH[active]}
            </span>
            <span className="font-devmono text-[11px] mt-2" style={{ color: C.greenDim }}>
              {String(active + 1).padStart(2, '0')} / {TECH.length}
            </span>
          </div>
        </div>
        <span className="font-devmono text-xs mt-6 animate-bob-down" style={{ color: C.greenDim }}>
          крутите ↓
        </span>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function DevelopmentScreen({ onClose }: { onClose: () => void }) {
  useDevFonts()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main data-screen="development" className="animate-screen-in relative" style={{ background: C.bg, color: C.green }}>
      {/* Фон: тонкая тех-сетка + очень мягкое свечение (сдержанно, премиально) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 10%, rgba(74,222,128,0.05), transparent 46%), radial-gradient(rgba(120,150,135,0.045) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 34px 34px',
        }}
      />
      <FloatingGlyphs />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 font-devmono text-sm backdrop-blur transition-colors"
        style={{ border: `1px solid ${C.greenDim}`, color: C.green, background: 'rgba(4,7,10,0.6)' }}
      >
        ← Назад
      </button>

      {/* 1. Терминал */}
      <section className="min-h-screen flex flex-col items-center justify-center px-5 py-24 relative">
        <FadeIn as="span" delay={0} y={16} className="font-devmono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.greenDim }}>
          Услуга · Разработка
        </FadeIn>
        <FadeIn as="h1" delay={0.05} y={30} className="font-pixel font-extrabold uppercase tracking-tight text-center leading-[0.9] mb-10" style={{ fontSize: 'clamp(2.5rem,10vw,8rem)', color: C.cream }}>
          Разработка<span className="animate-caret" style={{ color: C.accent }}>_</span>
        </FadeIn>

        <Terminal />

        <div className="mt-12 flex flex-col items-center gap-2 animate-bob-down" style={{ color: C.greenDim }}>
          <span className="font-devmono text-xs uppercase tracking-[0.3em]">Пролистайте вниз</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <CodeMarquee />

      {/* 2. Этапы */}
      <section className="px-5 sm:px-8 md:px-10 pt-24 pb-16 relative">
        <FadeIn as="span" delay={0} y={16} className="block text-center font-devmono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.accent }}>
          Процесс
        </FadeIn>
        <FadeIn as="h2" delay={0.05} y={30} className="font-pixel font-extrabold uppercase tracking-tight text-center mb-10" style={{ fontSize: 'clamp(2.5rem,10vw,7rem)', color: C.cream }}>
          Этапы
        </FadeIn>
        <div className="max-w-4xl mx-auto">
          {STAGES.map((s, i) => (
            <StageCard key={s.n} i={i} total={STAGES.length} stage={s} />
          ))}
        </div>
      </section>

      {/* 3. Круговая секция */}
      <CircularSection />

      <CodeMarquee />

      {/* 4. Финал + возврат */}
      <section className="px-5 py-28 flex flex-col items-center text-center gap-8 relative">
        <h2 className="font-pixel font-extrabold uppercase tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(2rem,7vw,5rem)', color: C.cream }}>
          Готовы собрать
          <br />
          ваш проект
        </h2>
        <button
          onClick={onClose}
          className="rounded-full px-10 py-4 font-medium uppercase tracking-widest transition-transform hover:scale-[1.03]"
          style={{ background: C.accent, color: '#0c0b0a', boxShadow: '0 8px 24px -6px rgba(239,74,35,0.5)' }}
        >
          ← Вернуться к услугам
        </button>
      </section>
    </main>
  )
}
