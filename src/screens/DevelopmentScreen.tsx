import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

type Lang = { id: string; label: string; code: string }

const LANGS: Lang[] = [
  {
    id: 'html',
    label: 'HTML',
    code: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <title>NOVIKOV — сайт</title>
  </head>
  <body>
    <h1>Hello, world 👋</h1>
  </body>
</html>`,
  },
  {
    id: 'js',
    label: 'JavaScript',
    code: `const hello = (name = "world") => {
  console.log(\`Hello, \${name} 👋\`)
}

hello("NOVIKOV")`,
  },
  {
    id: 'react',
    label: 'React',
    code: `export default function App() {
  return <h1>Hello, world 👋</h1>
}`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `def hello(name: str = "world") -> None:
    print(f"Hello, {name} 👋")

hello("NOVIKOV")`,
  },
  {
    id: 'go',
    label: 'Go',
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, world 👋")
}`,
  },
]

/* ── Печатная машинка ───────────────────────────────────────────── */
function useTypewriter(text: string, active: boolean, speed = 18) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
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

/* ── Окно терминала в стиле macOS ───────────────────────────────── */
function Terminal() {
  const [lang, setLang] = useState<Lang | null>(null)
  const { shown, done } = useTypewriter(lang?.code ?? '', !!lang)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl"
      style={{ background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 40px 120px -30px rgba(74,222,128,0.25)' }}
    >
      {/* Заголовок окна */}
      <div className="flex items-center gap-2 px-4 h-10 border-b" style={{ borderColor: C.border, background: 'rgba(255,255,255,0.02)' }}>
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
        <span className="flex-1 text-center text-xs tracking-wider" style={{ color: C.greenDim }}>
          novikov@studio — ~/project
        </span>
      </div>

      {/* Тело терминала */}
      <div className="p-5 sm:p-7 font-mono text-sm sm:text-[15px] leading-relaxed min-h-[300px]" style={{ color: C.green }}>
        <p style={{ color: C.greenDim }}>
          <span style={{ color: C.accent }}>➜</span> ~/project <span style={{ color: C.greenBright }}>novikov init</span>
        </p>

        {!lang ? (
          <div className="mt-5">
            <p className="mb-4" style={{ color: C.greenBright }}>
              # Выберите язык программирования:
            </p>
            <div className="flex flex-wrap gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l)}
                  className="rounded-md px-4 py-2 text-sm transition-colors"
                  style={{ border: `1px solid ${C.greenDim}`, color: C.green }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(74,222,128,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="mt-4 animate-caret" style={{ color: C.green }}>
              ▋
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="mb-3" style={{ color: C.greenDim }}>
              <span style={{ color: C.accent }}>➜</span> создаю стартовую страницу на{' '}
              <span style={{ color: C.greenBright }}>{lang.label}</span>…
            </p>
            <pre className="whitespace-pre-wrap break-words">
              {shown}
              {!done && <span className="animate-caret">▋</span>}
            </pre>
            {done && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mt-4" style={{ color: C.greenBright }}>
                ✓ Готово. Пролистайте ниже, чтобы увидеть этапы разработки ↓
              </motion.p>
            )}
            <button
              onClick={() => setLang(null)}
              className="mt-4 text-xs underline"
              style={{ color: C.greenDim }}
            >
              ← выбрать другой язык
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Бегущая строка команд/терминов ─────────────────────────────── */
const TERMS = ['git commit -m "feat"', 'npm run build', '<NOVIKOV/>', 'useState()', 'async / await', 'deploy →', 'console.log()', 'const', 'flexbox', 'API', 'CI/CD', 'refactor']
function CodeMarquee() {
  const row = [...TERMS, ...TERMS]
  return (
    <div className="overflow-hidden py-4 border-y" style={{ borderColor: C.border }}>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {row.map((t, i) => (
              <span key={i} className="font-mono text-base sm:text-xl px-6 whitespace-nowrap" style={{ color: i % 3 === 0 ? C.accent : C.greenDim }}>
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

/* ── Этапы разработки (sticky-стек) ─────────────────────────────── */
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
          <span className="font-mono font-bold leading-none" style={{ fontSize: 'clamp(3rem,9vw,110px)', color: C.green }}>
            {stage.n}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ border: `1px solid ${C.greenDim}`, color: C.greenDim }}>
            stage {stage.n}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-bold uppercase leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: C.cream }}>
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

/* ── Экран ──────────────────────────────────────────────────────── */
export default function DevelopmentScreen({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main className="animate-screen-in" style={{ background: C.bg, color: C.green }}>
      {/* Кнопка назад (фиксированная, всегда доступна) */}
      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm backdrop-blur transition-colors"
        style={{ border: `1px solid ${C.greenDim}`, color: C.green, background: 'rgba(4,7,10,0.6)' }}
      >
        ← Назад
      </button>

      {/* 1. Терминал */}
      <section className="min-h-screen flex flex-col items-center justify-center px-5 py-24 relative">
        <FadeIn as="span" delay={0} y={16} className="font-mono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.greenDim }}>
          Услуга · Разработка
        </FadeIn>
        <FadeIn
          as="h1"
          delay={0.05}
          y={30}
          className="font-bold uppercase tracking-tight text-center leading-[0.9] mb-10"
          style={{ fontSize: 'clamp(2.5rem,9vw,7rem)', color: C.cream }}
        >
          Разработка<span style={{ color: C.accent }}>.</span>
        </FadeIn>

        <Terminal />

        {/* Приглашающая стрелка */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-bob-down" style={{ color: C.greenDim }}>
          <span className="font-mono text-xs uppercase tracking-[0.3em]">Пролистайте вниз</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <CodeMarquee />

      {/* 2. Этапы разработки */}
      <section className="px-5 sm:px-8 md:px-10 pt-24 pb-16">
        <FadeIn as="span" delay={0} y={16} className="block text-center font-mono text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.accent }}>
          Процесс
        </FadeIn>
        <FadeIn as="h2" delay={0.05} y={30} className="font-bold uppercase tracking-tight text-center mb-10" style={{ fontSize: 'clamp(2.5rem,10vw,7rem)', color: C.cream }}>
          Этапы
        </FadeIn>
        <div className="max-w-4xl mx-auto">
          {STAGES.map((s, i) => (
            <StageCard key={s.n} i={i} total={STAGES.length} stage={s} />
          ))}
        </div>
      </section>

      <CodeMarquee />

      {/* 3. Финал + возврат */}
      <section className="px-5 py-28 flex flex-col items-center text-center gap-8">
        <h2 className="font-bold uppercase tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(2rem,7vw,5rem)', color: C.cream }}>
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
