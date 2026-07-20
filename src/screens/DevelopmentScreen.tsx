/**
 * Экран услуги «Разработка».
 *
 * Визуальная идея экрана — терминал: моноширинный голос, зелёный фосфор,
 * тёмный фон. Это единственный экран сайта с такой температурой, и он должен
 * ей и остаться — уникальность экранов важнее их единообразия.
 *
 * Что здесь приведено к общей системе, а что намеренно оставлено своим:
 *  • Общее — движение. Все кривые и длительности берутся из design/motion,
 *    поэтому при чужой палитре почерк анимации читается тот же, что на главной.
 *  • Общее — типографическая шкала и трекинг: на крупных кеглях он обязан
 *    быть отрицательным, иначе заголовок рассыпается.
 *  • Своё — палитра, шрифты, раскладка и сигнатурные приёмы: печатающийся
 *    терминал, sticky-стек этапов, кольцо стека, вращаемое прокруткой.
 *
 * Палитра задана локальными CSS-переменными в корне экрана. Хексы по JSX не
 * разбросаны: сменить температуру экрана — это правка одного объекта.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import { Reveal, SplitText } from '../design/primitives'
import { ease, cssEase, duration, stagger, prefersReducedMotion } from '../design/motion'

/* ── Палитра экрана ──────────────────────────────────────────────────
   Локальные переменные, а не хексы в разметке. Акцент и кремовый берём
   из глобальных токенов — экран остаётся частью одной системы. */
const SCREEN_VARS = {
  '--dev-bg': '#04070a',
  '--dev-panel': '#0b1117',
  '--dev-line': 'rgba(74, 222, 128, 0.16)',
  '--dev-line-soft': 'rgba(74, 222, 128, 0.07)',
  '--dev-green': '#4ade80',
  '--dev-green-dim': '#2f9e5f',
  '--dev-green-bright': '#a7f3c9',
  '--dev-wash': 'rgba(74, 222, 128, 0.12)',
  '--dev-a': 'var(--a)',
  '--dev-a-wash': 'rgba(239, 74, 35, 0.14)',
  '--dev-cream': 'var(--n-900)',
  '--dev-ink': 'var(--n-50)',
} as CSSProperties

/* ── Ленивая загрузка тематических шрифтов ───────────────────────────
   Гарнитуры экрана не нужны на главной — тянем их только при открытии,
   чтобы не платить за них в первом рендере сайта. */
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

/* ── Чип-команда ─────────────────────────────────────────────────────
   Заливка при наведении — через scaleY отдельного слоя, а не через
   переход background-color: цвет фона считается на paint, transform — нет. */
function Chip({
  children,
  onClick,
  tone = 'green',
}: {
  children: ReactNode
  onClick: () => void
  tone?: 'green' | 'accent'
}) {
  const isAccent = tone === 'accent'
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-md px-3.5 py-2"
      style={{
        border: `1px solid ${isAccent ? 'var(--dev-a)' : 'var(--dev-green-dim)'}`,
        color: isAccent ? 'var(--dev-a)' : 'var(--dev-green)',
        fontSize: 'var(--t-xs)',
        letterSpacing: '0.04em',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
        style={{
          background: isAccent ? 'var(--dev-a-wash)' : 'var(--dev-wash)',
          transition: `transform ${duration.base}s ${cssEase.standard}`,
        }}
      />
      <span className="relative">{children}</span>
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ИНТЕРАКТИВНЫЙ ТЕРМИНАЛ
   Сигнатура экрана: посетитель не читает про разработку, а запускает её.
   ══════════════════════════════════════════════════════════════════ */

type Lang = { id: string; label: string; code: string }

/* Эмодзи из примеров кода убраны намеренно: в коде они читаются как
   оформление демо, а не как рабочий фрагмент. */
const LANGS: Lang[] = [
  {
    id: 'html',
    label: 'HTML',
    code: `<!doctype html>\n<html lang="ru">\n  <body>\n    <h1>Hello, world</h1>\n  </body>\n</html>`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    code: `const greet = (name: string = 'world'): void => {\n  console.log(\`Hello, \${name}\`)\n}\n\ngreet('NOVIKOV')`,
  },
  {
    id: 'react',
    label: 'React',
    code: `export default function App() {\n  return <h1>Hello, world</h1>\n}`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `def greet(name: str = "world") -> None:\n    print(f"Hello, {name}")\n\ngreet("NOVIKOV")`,
  },
  {
    id: 'go',
    label: 'Go',
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world")\n}`,
  },
]

type PreviewKey = 'hello' | 'button' | 'card' | 'profile'
type Template = { id: string; label: string; code: string; preview: PreviewKey }

const TEMPLATES: Template[] = [
  { id: 'button', label: 'Кнопка', preview: 'button', code: `<button class="btn">\n  Отправить\n</button>` },
  { id: 'card', label: 'Карточка', preview: 'card', code: `<article class="card">\n  <h3>NOVIKOV</h3>\n  <p>3D · Web · Motion</p>\n</article>` },
  { id: 'profile', label: 'Профиль', preview: 'profile', code: `<div class="profile">\n  <span class="avatar" />\n  <b>NOVIKOV</b>\n</div>` },
]

function Preview({ k }: { k: PreviewKey }) {
  if (k === 'button')
    return (
      <button
        className="rounded-full px-7 py-3.5 font-medium"
        style={{ background: 'var(--dev-a)', color: 'var(--dev-ink)', letterSpacing: '0.01em' }}
      >
        Отправить
      </button>
    )
  if (k === 'card')
    return (
      <div
        className="rounded-2xl p-6 text-left"
        style={{ background: 'var(--dev-ink)', color: 'var(--dev-cream)', width: 240, boxShadow: 'var(--sh-md)' }}
      >
        <h3 className="font-bold uppercase" style={{ fontSize: 'var(--t-h4)', letterSpacing: 'var(--tr-h3)', lineHeight: 'var(--lh-heading)' }}>
          NOVIKOV
        </h3>
        <p className="mt-1" style={{ fontSize: 'var(--t-sm)', color: 'var(--n-600)' }}>
          3D · Web · Motion
        </p>
        <div className="mt-4 h-1.5 w-16 rounded-full" style={{ background: 'var(--dev-a)' }} />
      </div>
    )
  if (k === 'profile')
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 30%, #ff6a3d, #ef4a23 60%, #b8360f)' }}
        />
        <b className="uppercase" style={{ fontSize: 'var(--t-h4)', letterSpacing: 'var(--tr-h3)', color: 'var(--dev-ink)' }}>
          NOVIKOV
        </b>
        <span className="t-mono" style={{ color: 'var(--n-500)' }}>
          Lead Designer
        </span>
      </div>
    )
  return (
    <h1
      className="font-bold"
      style={{ fontSize: 'var(--t-h3)', letterSpacing: 'var(--tr-h3)', color: 'var(--dev-ink)' }}
    >
      Hello, world
    </h1>
  )
}

/** Окно браузера с результатом. */
function BrowserWindow({ pk }: { pk: PreviewKey }) {
  const navBtn = 'w-6 h-6 flex items-center justify-center rounded-md'
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--sh-lg)' }}
    >
      {/* Полоса загрузки: scaleX по composited-слою, ширина не анимируется */}
      <motion.div
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          duration: duration.slower,
          ease: ease.entrance,
          opacity: { delay: duration.slower, duration: duration.fast },
        }}
        className="absolute top-0 left-0 right-0 h-[3px] origin-left z-20"
        style={{ background: 'var(--dev-a)' }}
      />

      <div className="flex items-center gap-3 px-3.5 py-2.5" style={{ background: '#eae5db' }}>
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

        <div
          className="flex-1 flex items-center gap-2 rounded-full px-3.5 py-1.5 font-devmono"
          style={{ background: '#fff', color: '#4a463f', fontSize: 'var(--t-mono)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3fae6a" strokeWidth="2.4"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
          localhost:5173
        </div>

        <div className="flex flex-col gap-[3px]" style={{ color: '#b8b2a5' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
          ))}
        </div>
      </div>

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
    // При reduced-motion печать бессмысленна — сразу отдаём готовый текст.
    if (prefersReducedMotion()) {
      setN(text.length)
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

  // Пауза после печати — имитация сборки. Без неё превью выпрыгивает
  // одновременно с последним символом и связь «код → результат» теряется.
  useEffect(() => {
    if (!sel || !done) return
    setShowPreview(false)
    const id = window.setTimeout(() => setShowPreview(true), 1400)
    return () => window.clearTimeout(id)
  }, [sel, done])

  const pick = (label: string, code: string, preview: PreviewKey) => {
    setShowPreview(false)
    setSel({ label, code, preview })
  }

  return (
    <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-center items-start" style={{ gap: 'var(--s-6)' }}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: duration.slow,
          ease: ease.entrance,
          layout: { duration: duration.slow, ease: ease.editorial },
        }}
        className="w-full lg:w-[520px] lg:shrink-0 rounded-xl overflow-hidden"
        style={{ background: 'var(--dev-panel)', border: '1px solid var(--dev-line)', boxShadow: 'var(--sh-lg)' }}
      >
        <div className="flex items-center gap-2 px-4 h-10 border-b" style={{ borderColor: 'var(--dev-line)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
          <span className="flex-1 text-center font-devmono" style={{ color: 'var(--dev-green-dim)', fontSize: 'var(--t-mono)' }}>
            novikov@studio — ~/project
          </span>
        </div>

        <div
          className="p-5 sm:p-6 font-devmono min-h-[320px]"
          style={{ color: 'var(--dev-green)', fontSize: 'var(--t-sm)', lineHeight: 'var(--lh-body)' }}
        >
          <p style={{ color: 'var(--dev-green-dim)' }}>
            <span style={{ color: 'var(--dev-a)' }}>➜</span> ~/project{' '}
            <span style={{ color: 'var(--dev-green-bright)' }}>novikov init</span>
          </p>

          {!sel ? (
            <div style={{ marginTop: 'var(--s-6)' }}>
              <p style={{ color: 'var(--dev-green-bright)', marginBottom: 'var(--s-4)' }}># Язык</p>
              <div className="flex flex-wrap gap-2.5">
                {LANGS.map((l) => (
                  <Chip key={l.id} onClick={() => pick(l.label, l.code, 'hello')}>
                    {l.label}
                  </Chip>
                ))}
              </div>
              <p className="animate-caret" style={{ marginTop: 'var(--s-4)' }}>▋</p>
            </div>
          ) : (
            <div style={{ marginTop: 'var(--s-4)' }}>
              <p style={{ color: 'var(--dev-green-dim)', marginBottom: 'var(--s-3)' }}>
                <span style={{ color: 'var(--dev-a)' }}>➜</span> {sel.label.toLowerCase()} — пишу
              </p>
              <pre className="whitespace-pre-wrap break-words">
                {shown}
                {!done && <span className="animate-caret">▋</span>}
              </pre>

              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: duration.base, ease: ease.entrance }}
                  style={{ marginTop: 'var(--s-4)' }}
                >
                  <p style={{ color: 'var(--dev-green-bright)' }}>
                    {showPreview ? '✓ сборка готова, результат справа' : '› запускаю dev-сервер'}
                  </p>
                  {showPreview && (
                    <>
                      <p style={{ color: 'var(--dev-green-bright)', marginTop: 'var(--s-4)', marginBottom: 'var(--s-2)' }}>
                        # Следующий компонент
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {TEMPLATES.map((t) => (
                          <Chip key={t.id} onClick={() => pick(t.label, t.code, t.preview)}>
                            {t.label}
                          </Chip>
                        ))}
                        <Chip tone="accent" onClick={() => setSel(null)}>
                          ↺ другой язык
                        </Chip>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {sel && showPreview && (
          <motion.div
            key={sel.preview + sel.label}
            layout
            initial={{ opacity: 0, x: 64, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 64, scale: 0.96 }}
            transition={{ duration: duration.slow, ease: ease.entrance }}
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
   ФОНОВЫЕ ГЛИФЫ
   Плотность убрана намеренно: воздух дороже украшений.
   ══════════════════════════════════════════════════════════════════ */
const GLYPHS = [
  { t: '</>', x: '4%', y: '20%', s: 44, d: 0 },
  { t: '{ }', x: '93%', y: '24%', s: 40, d: 0.6 },
  { t: '( )', x: '7%', y: '72%', s: 34, d: 1.2 },
  { t: ';', x: '95%', y: '68%', s: 48, d: 0.3 },
]

function FloatingGlyphs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden hidden lg:block" aria-hidden>
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="font-devmono animate-float-y absolute"
          style={{
            left: g.x,
            top: g.y,
            fontSize: g.s,
            color: 'var(--dev-green-dim)',
            opacity: 0.1,
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
   Гоча проекта: суммарная ширина анимируемого слоя должна оставаться
   заметно ниже max texture size GPU (~16k) — иначе слой пропадает на
   реальных машинах. Отсюда короткий словарь и ровно два блока.
   ══════════════════════════════════════════════════════════════════ */
const TERMS = ['TypeScript', 'React', 'Three.js', 'WebGL', 'GLSL', 'Node', 'CI/CD', 'a11y', '60 fps']

function CodeMarquee() {
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: 'var(--dev-line)', paddingBlock: 'var(--s-4)' }}>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((blk) => (
          <div key={blk} className="flex shrink-0" aria-hidden={blk === 1}>
            {TERMS.map((t, i) => (
              <span
                key={i}
                className="font-devmono whitespace-nowrap px-6"
                style={{
                  color: i % 3 === 0 ? 'var(--dev-a)' : 'var(--dev-green-dim)',
                  fontSize: 'var(--t-sm)',
                  letterSpacing: '0.08em',
                }}
              >
                {t}
                <span className="px-3" style={{ color: 'var(--dev-line)' }}>/</span>
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
   Тексты переписаны под тон сайта: излагают, а не обещают.
   ══════════════════════════════════════════════════════════════════ */
const STAGES = [
  { n: '01', title: 'Разбор', text: 'Смотрю на бизнес-задачу до того, как смотреть на интерфейс. Фиксирую объём и то, что считается результатом.' },
  { n: '02', title: 'Проектирование', text: 'Структура, состояния, движение. Макет, по которому можно собирать без домысливания.' },
  { n: '03', title: 'Разметка', text: 'Семантика, адаптив, доступность с клавиатуры. Продакшен выглядит так же, как макет.' },
  { n: '04', title: 'Логика', text: 'Данные, интеграции, состояние. Там, где задача требует, — 3D и моушн на том же уровне.' },
  { n: '05', title: 'Оптимизация', text: 'Цель — устойчивые 60 кадров на среднем устройстве, а не только на моей машине.' },
  { n: '06', title: 'Передача', text: 'Деплой, CI и документация. Проект должен обновляться без меня.' },
]

function StageCard({ i, total, stage }: { i: number; total: number; stage: (typeof STAGES)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  // Нижние карточки чуть уменьшаются — стопка читается как глубина, а не как наложение.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - 1 - i) * 0.03])

  return (
    <div ref={ref} className="h-[80vh] flex items-start justify-center sticky" style={{ top: `${96 + i * 24}px` }}>
      <motion.div
        style={{
          scale,
          transformOrigin: 'top center',
          background: 'var(--dev-panel)',
          border: '1px solid var(--dev-line)',
          padding: 'clamp(1.75rem, 4vw, 3rem)',
        }}
        className="w-full max-w-4xl rounded-[32px] min-h-[58vh] flex flex-col"
      >
        <div className="flex items-baseline justify-between" style={{ marginBottom: 'var(--s-8)' }}>
          <span
            className="font-pixel font-extrabold"
            style={{ fontSize: 'var(--t-h1)', lineHeight: 'var(--lh-display)', letterSpacing: 'var(--tr-h1)', color: 'var(--dev-green)' }}
          >
            {stage.n}
          </span>
          <span
            className="t-mono px-3 py-1.5 rounded-full"
            style={{ border: '1px solid var(--dev-line)', color: 'var(--dev-green-dim)' }}
          >
            этап {stage.n}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h3
            className="font-pixel font-bold uppercase"
            style={{
              fontSize: 'var(--t-h2)',
              lineHeight: 'var(--lh-tight)',
              letterSpacing: 'var(--tr-h2)',
              color: 'var(--dev-cream)',
              marginBottom: 'var(--s-6)',
            }}
          >
            {stage.title}
          </h3>
          <p
            className="font-light"
            style={{
              fontSize: 'var(--t-lead)',
              lineHeight: 'var(--lh-body)',
              letterSpacing: 'var(--tr-body)',
              color: 'rgba(236,231,219,0.7)',
              maxWidth: '46ch',
            }}
          >
            {stage.text}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   КОЛЬЦО СТЕКА
   Прокрутка вращает кольцо — единственный элемент экрана, где движение
   напрямую привязано к вводу пользователя.
   ══════════════════════════════════════════════════════════════════ */
const TECH = ['React', 'TypeScript', 'Three.js', 'WebGL', 'GLSL', 'Vite', 'Node.js', 'Rapier', 'Framer Motion', 'Tailwind']
const RADIUS = 190
const TAU = Math.PI * 2

/** Позиционируется по окружности через translate — литеры всегда вертикальны. */
function CircleItem({
  label,
  base,
  angle,
  active,
}: {
  label: string
  base: number
  angle: MotionValue<number>
  active: boolean
}) {
  const x = useTransform(angle, (a) => Math.sin(base + a) * RADIUS)
  const y = useTransform(angle, (a) => -Math.cos(base + a) * RADIUS)
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span
        style={{ x, y, color: active ? 'var(--dev-a)' : 'var(--dev-green-dim)' }}
        animate={{ opacity: active ? 1 : 0.45, scale: active ? 1.28 : 1 }}
        transition={{ duration: duration.base, ease: ease.standard }}
        className="font-pixel font-bold whitespace-nowrap"
      >
        <span style={{ fontSize: 20, letterSpacing: '-0.01em' }}>{label}</span>
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
      {/* overflow-hidden стоит на самом sticky-элементе, а не на предке:
          на предке он бы отключил залипание целиком. */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <span className="t-mono" style={{ color: 'var(--dev-a)', marginBottom: 'var(--s-8)' }}>
          Стек
        </span>

        <div className="relative" style={{ width: RADIUS * 2 + 130, height: RADIUS * 2 + 130, maxWidth: '92vw' }}>
          <div className="absolute rounded-full" style={{ inset: 5, border: '1px dashed var(--dev-line)' }} />
          <div className="absolute rounded-full" style={{ inset: 48, border: '1px solid var(--dev-line-soft)' }} />
          {TECH.map((t, i) => (
            <CircleItem key={t} label={t} base={(i / TECH.length) * TAU} angle={angle} active={i === active} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="font-pixel font-extrabold uppercase text-center"
              style={{ fontSize: 'var(--t-h3)', letterSpacing: 'var(--tr-h3)', lineHeight: 'var(--lh-tight)', color: 'var(--dev-cream)' }}
            >
              {TECH[active]}
            </span>
            <span className="t-mono" style={{ color: 'var(--dev-green-dim)', marginTop: 'var(--s-3)' }}>
              {String(active + 1).padStart(2, '0')} / {TECH.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Инженерные требования ───────────────────────────────────────────
   Блок существует, чтобы доказать компетенцию, а не украсить экран:
   это то, что отличает «сверстано» от «собрано». */
const STANDARDS = [
  { k: 'Производительность', v: 'Анимируются только transform и opacity. Цель — устойчивые 60 кадров, а не пиковые.' },
  { k: 'Доступность', v: 'Клавиатурная навигация, контраст и prefers-reduced-motion — часть работы, а не доработка после.' },
  { k: 'Передача', v: 'Типизированный код, компонентная структура и деплой, который повторяется без меня.' },
]

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
    <main
      data-screen="development"
      className="animate-screen-in relative"
      style={{ ...SCREEN_VARS, background: 'var(--dev-bg)', color: 'var(--dev-green)' }}
    >
      {/* Фон: тонкая тех-сетка и одно мягкое свечение сверху */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 8%, rgba(74,222,128,0.05), transparent 46%), radial-gradient(rgba(120,150,135,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 34px 34px',
        }}
      />
      <FloatingGlyphs />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 rounded-full px-4 py-2 font-devmono backdrop-blur"
        style={{
          border: '1px solid var(--dev-green-dim)',
          color: 'var(--dev-green)',
          background: 'rgba(4,7,10,0.6)',
          fontSize: 'var(--t-xs)',
        }}
      >
        ← Назад
      </button>

      {/* ── 1. Терминал ───────────────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center relative"
        style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <Reveal y={14} className="w-full text-center" style={{ marginBottom: 'var(--s-6)' }}>
          <span className="t-mono" style={{ color: 'var(--dev-a)' }}>
            Компетенция · Разработка
          </span>
        </Reveal>

        <h1
          className="font-pixel font-extrabold uppercase text-center"
          style={{
            fontSize: 'var(--t-h1)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--tr-h1)',
            color: 'var(--dev-cream)',
          }}
        >
          <SplitText text="Разработка" by="char" delay={0.15} />
          <span className="animate-caret" style={{ color: 'var(--dev-a)' }}>_</span>
        </h1>

        <Reveal
          delay={0.45}
          y={18}
          className="text-center"
          style={{ maxWidth: '52ch', marginTop: 'var(--s-8)', marginBottom: 'var(--s-16)' }}
        >
          <p
            className="font-light"
            style={{ fontSize: 'var(--t-lead)', lineHeight: 'var(--lh-body)', letterSpacing: 'var(--tr-body)', color: 'rgba(236,231,219,0.72)' }}
          >
            Проектирую интерфейс и сам довожу его до продакшена. Это убирает
            из процесса самое дорогое — потери на передаче между дизайном и кодом.
          </p>
        </Reveal>

        <Terminal />

        <div
          className="flex flex-col items-center gap-2 animate-bob-down"
          style={{ color: 'var(--dev-green-dim)', marginTop: 'var(--s-16)' }}
        >
          <span className="t-mono">Далее</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <CodeMarquee />

      {/* ── 2. Инженерные требования ──────────────────────────────── */}
      <section className="relative" style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}>
        <div className="mx-auto grid gap-x-12 gap-y-10 md:grid-cols-3" style={{ maxWidth: 'var(--max-w)' }}>
          {STANDARDS.map((s, i) => (
            <Reveal key={s.k} delay={i * stagger.item} y={22}>
              <div className="border-t" style={{ borderColor: 'var(--dev-line)', paddingTop: 'var(--s-6)' }}>
                <h3
                  className="font-pixel font-bold uppercase"
                  style={{
                    fontSize: 'var(--t-h4)',
                    lineHeight: 'var(--lh-heading)',
                    letterSpacing: 'var(--tr-h3)',
                    color: 'var(--dev-cream)',
                    marginBottom: 'var(--s-3)',
                  }}
                >
                  {s.k}
                </h3>
                <p
                  className="font-light"
                  style={{ fontSize: 'var(--t-body)', lineHeight: 'var(--lh-body)', letterSpacing: 'var(--tr-body)', color: 'rgba(236,231,219,0.62)' }}
                >
                  {s.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 3. Этапы ──────────────────────────────────────────────── */}
      <section className="relative" style={{ paddingInline: 'var(--gutter)', paddingTop: 'var(--section-y)', paddingBottom: 'var(--s-16)' }}>
        <Reveal y={14} className="text-center" style={{ marginBottom: 'var(--s-4)' }}>
          <span className="t-mono" style={{ color: 'var(--dev-a)' }}>
            Процесс
          </span>
        </Reveal>
        <h2
          className="font-pixel font-extrabold uppercase text-center"
          style={{
            fontSize: 'var(--t-h2)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tr-h2)',
            color: 'var(--dev-cream)',
            marginBottom: 'var(--s-16)',
          }}
        >
          <SplitText text="Этапы" by="char" />
        </h2>

        {/* Никакого overflow-hidden на этом контейнере: он отключил бы sticky. */}
        <div className="max-w-4xl mx-auto">
          {STAGES.map((s, i) => (
            <StageCard key={s.n} i={i} total={STAGES.length} stage={s} />
          ))}
        </div>
      </section>

      {/* ── 4. Кольцо стека ───────────────────────────────────────── */}
      <CircularSection />

      <CodeMarquee />

      {/* ── 5. Финал ──────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center text-center"
        style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)', gap: 'var(--s-8)' }}
      >
        <h2
          className="font-pixel font-extrabold uppercase"
          style={{
            fontSize: 'var(--t-h2)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tr-h2)',
            color: 'var(--dev-cream)',
            maxWidth: '18ch',
          }}
        >
          <SplitText text="Разработка идёт вместе с дизайном" by="word" />
        </h2>

        <Reveal delay={0.2} y={18} style={{ maxWidth: '52ch' }}>
          <p
            className="font-light"
            style={{ fontSize: 'var(--t-body)', lineHeight: 'var(--lh-body)', letterSpacing: 'var(--tr-body)', color: 'rgba(236,231,219,0.62)' }}
          >
            Отдельным подрядом её брать невыгодно обеим сторонам: половина решений
            принимается в момент сборки.
          </p>
        </Reveal>

        <Reveal delay={0.3} y={16}>
          <button
            onClick={onClose}
            className="group relative overflow-hidden rounded-full px-10 py-4 font-devmono"
            style={{
              border: '1px solid var(--dev-a)',
              color: 'var(--dev-a)',
              fontSize: 'var(--t-xs)',
              letterSpacing: 'var(--tr-label)',
              textTransform: 'uppercase',
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
              style={{ background: 'var(--dev-a-wash)', transition: `transform ${duration.base}s ${cssEase.standard}` }}
            />
            <span className="relative">← Вернуться к услугам</span>
          </button>
        </Reveal>
      </section>
    </main>
  )
}
