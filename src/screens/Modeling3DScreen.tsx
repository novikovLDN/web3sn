/**
 * Экран услуги «3D-моделинг».
 *
 * Визуальная идея — студия: тёплый глиняный свет, крупная редакционная
 * типографика, много воздуха. Противоположность холодному терминалу
 * «Разработки» — и так и должно остаться.
 *
 * Приведено к общей системе: кривые, длительности и stagger берутся из
 * design/motion, типографика — из шкалы токенов. Своё: палитра, гарнитуры,
 * bento-раскладка и горизонтальный пайплайн.
 *
 * Экран должен доказывать компетенцию, а не иллюстрировать её. Поэтому
 * добавлен блок «Что на выходе»: клиента, который платит за 3D, интересует
 * не столько процесс, сколько что именно он получит на руки.
 *
 * ВАЖНО: модель подхватывается в Model3D через import.meta.glob из
 * src/models/*.glb — пользователь кладёт файлы туда сам. Ленивый импорт
 * ниже трогать нельзя, иначе авто-обнаружение сломается.
 */

import { Suspense, lazy, useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Reveal, SplitText } from '../design/primitives'
import { ease, cssEase, duration, stagger } from '../design/motion'

const Model3D = lazy(() => import('./Model3D'))

/* ── Палитра экрана ──────────────────────────────────────────────────
   Тёплая «студийная», своя. Акцент и кремовый — из глобальных токенов. */
const SCREEN_VARS = {
  '--m3-bg': '#0e0c0a',
  '--m3-panel': '#181410',
  '--m3-line': 'rgba(201, 168, 130, 0.16)',
  '--m3-clay': '#c9a882',
  '--m3-clay-dim': '#8a7355',
  '--m3-a': 'var(--a)',
  '--m3-cream': 'var(--n-900)',
  '--m3-ink': 'var(--n-50)',
  '--m3-dim': 'rgba(236, 231, 219, 0.62)',
} as CSSProperties

function useFonts() {
  useEffect(() => {
    const id = 'model-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Onest:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Что моделю — bento-сетка ────────────────────────────────────── */
const BENTO = [
  { t: 'Персонажи', d: 'Стилизованные и реалистичные герои с читаемым характером.', span: 'md:col-span-2 md:row-span-2', big: true },
  { t: 'Предметы', d: 'Продукты, реквизит, устройства.', span: '' },
  { t: 'Окружения', d: 'Сцены и локации.', span: '' },
  { t: 'Хард-сурфейс', d: 'Техника и механизмы с корректной фаской.', span: 'md:col-span-2' },
  { t: 'Под анимацию', d: 'Четырёхугольная сетка, готовая к ригу.', span: '' },
  { t: 'Стилизация', d: 'Визуальный язык под конкретный проект.', span: '' },
]

/* ── Пайплайн ────────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', t: 'Референсы', d: 'Собираю рефы и фиксирую направление до первого полигона.' },
  { n: '02', t: 'Блокинг', d: 'Грубая форма: пропорции и силуэт. Здесь дешевле всего менять решение.' },
  { n: '03', t: 'Скульпт', d: 'Объём, детали и характер.' },
  { n: '04', t: 'Ретопология', d: 'Чистая сетка под деформацию, а не под скриншот.' },
  { n: '05', t: 'UV и текстуры', d: 'Развёртка без швов на видимых местах, PBR-материалы.' },
  { n: '06', t: 'Свет и рендер', d: 'Постановка света и финальные кадры.' },
]

/* ── Что получает клиент ─────────────────────────────────────────────
   Конкретика вместо обещаний: это и есть аргумент уровня. */
const DELIVERABLES = [
  { k: 'Форматы', v: 'FBX, OBJ, glTF/GLB и исходная сцена' },
  { k: 'Топология', v: 'Квады, чистые лупы, готовность к ригу' },
  { k: 'Материалы', v: 'PBR-сеты с развёрткой и картами' },
  { k: 'Рендеры', v: 'Кадры под превью и промо в нужном разрешении' },
]

export default function Modeling3DScreen({ onClose }: { onClose: () => void }) {
  useFonts()
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <main
      data-screen="modeling"
      className="animate-screen-in relative font-onest"
      style={{ ...SCREEN_VARS, background: 'var(--m3-bg)', color: 'var(--m3-cream)' }}
    >
      {/* Тёплое студийное свечение: два источника, как в реальной постановке */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(60% 50% at 65% 30%, rgba(239,74,35,0.10), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(201,168,130,0.07), transparent 70%)',
        }}
      />

      <button
        onClick={onClose}
        className="fixed top-5 left-5 z-50 rounded-full px-4 py-2 backdrop-blur"
        style={{
          border: '1px solid var(--m3-clay-dim)',
          color: 'var(--m3-clay)',
          background: 'rgba(14,12,10,0.6)',
          fontSize: 'var(--t-xs)',
        }}
      >
        ← Назад
      </button>

      {/* ── ГЕРОЙ ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen grid lg:grid-cols-2 items-center"
        style={{ paddingInline: 'var(--gutter)', paddingTop: 'var(--s-24)', paddingBottom: 'var(--s-16)', gap: 'var(--s-12)' }}
      >
        <div className="relative z-10 max-w-xl">
          <Reveal y={14} style={{ marginBottom: 'var(--s-6)' }}>
            <span className="t-mono" style={{ color: 'var(--m3-clay-dim)' }}>
              Компетенция · 3D-моделинг
            </span>
          </Reveal>

          <h1
            className="font-tech font-extrabold uppercase optical-left"
            style={{
              fontSize: 'var(--t-h1)',
              lineHeight: 'var(--lh-display)',
              letterSpacing: 'var(--tr-h1)',
              color: 'var(--m3-cream)',
            }}
          >
            <SplitText text="3D" by="char" delay={0.1} />
            <br />
            <SplitText text="моделинг" by="char" delay={0.2} />
          </h1>

          <Reveal delay={0.45} y={18} style={{ marginTop: 'var(--s-8)' }}>
            <p
              className="font-light"
              style={{
                fontSize: 'var(--t-lead)',
                lineHeight: 'var(--lh-body)',
                letterSpacing: 'var(--tr-body)',
                color: 'var(--m3-dim)',
                maxWidth: '44ch',
              }}
            >
              Объём, характер и свет. От первого блокинга до модели, которую
              можно отдать в анимацию, на движок или в рендер — без переделки.
            </p>
          </Reveal>

          <Reveal delay={0.6} y={16} className="flex flex-wrap gap-3" style={{ marginTop: 'var(--s-8)' }}>
            {['Персонажи', 'Продукты', 'Окружения'].map((t) => (
              <span
                key={t}
                className="rounded-full px-4 py-2 cursor-default hover:scale-[1.06]"
                style={{
                  border: '1px solid var(--m3-clay-dim)',
                  color: 'var(--m3-clay)',
                  fontSize: 'var(--t-xs)',
                  transition: `transform ${duration.base}s ${cssEase.standard}`,
                }}
              >
                {t}
              </span>
            ))}
          </Reveal>
        </div>

        {/* 3D-сцена: без «оконной» рамки — модель стоит в пространстве экрана */}
        <div className="relative h-[46vh] lg:h-[78vh]">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="w-8 h-8 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(201,168,130,0.25)', borderTopColor: 'var(--m3-clay)' }}
                />
              </div>
            }
          >
            <Model3D />
          </Suspense>
          <span className="t-mono absolute top-2 left-2" style={{ color: 'var(--m3-clay-dim)' }}>
            turntable · 360°
          </span>
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 animate-bob-down"
          style={{ color: 'var(--m3-clay-dim)' }}
        >
          <span className="t-mono">Далее</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── BENTO ─────────────────────────────────────────────────── */}
      <section className="relative z-10" style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}>
        <h2
          className="font-tech font-extrabold uppercase"
          style={{
            fontSize: 'var(--t-h2)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tr-h2)',
            color: 'var(--m3-cream)',
            marginBottom: 'var(--s-16)',
          }}
        >
          <SplitText text="Что я создаю" by="word" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[190px] gap-4" style={{ maxWidth: 'var(--max-w)' }}>
          {BENTO.map((b, i) => {
            const isH = hovered === i
            const other = hovered !== null && !isH
            return (
              <Reveal key={b.t} delay={i * stagger.item} y={26} className={b.span}>
                <motion.div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  animate={{ scale: isH ? 1.06 : other ? 0.95 : 1, opacity: other ? 0.5 : 1 }}
                  transition={{ duration: duration.base, ease: ease.standard }}
                  className="relative rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full cursor-default"
                  style={{
                    background: b.big ? 'var(--m3-a)' : 'var(--m3-panel)',
                    border: `1px solid ${b.big ? 'transparent' : 'var(--m3-line)'}`,
                    color: b.big ? 'var(--m3-ink)' : 'var(--m3-cream)',
                    zIndex: isH ? 20 : 1,
                  }}
                >
                  {/* Тень отдельным слоем: анимируется его opacity, а не box-shadow —
                      иначе каждый кадр наведения уходил бы в paint. */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ boxShadow: 'var(--sh-lg)' }}
                    initial={false}
                    animate={{ opacity: isH ? 1 : 0 }}
                    transition={{ duration: duration.base, ease: ease.standard }}
                  />
                  <span
                    className="relative font-tech font-extrabold leading-none"
                    style={{
                      fontSize: b.big ? 'var(--t-h3)' : 'var(--t-h4)',
                      color: b.big ? 'var(--m3-ink)' : 'var(--m3-clay)',
                    }}
                  >
                    ◆
                  </span>
                  <div className="relative min-w-0">
                    <h3
                      className="font-tech font-bold uppercase"
                      style={{
                        fontSize: b.big ? 'var(--t-h4)' : 'var(--t-body)',
                        lineHeight: 'var(--lh-heading)',
                        letterSpacing: 'var(--tr-h3)',
                        marginBottom: 'var(--s-2)',
                      }}
                    >
                      {b.t}
                    </h3>
                    <p
                      className="font-light"
                      style={{
                        fontSize: b.big ? 'var(--t-sm)' : 'var(--t-xs)',
                        lineHeight: 'var(--lh-body)',
                        letterSpacing: 'var(--tr-body)',
                        opacity: 0.72,
                      }}
                    >
                      {b.d}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── ПАЙПЛАЙН ──────────────────────────────────────────────── */}
      <section className="relative z-10" style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}>
        <h2
          className="font-tech font-extrabold uppercase"
          style={{
            fontSize: 'var(--t-h2)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tr-h2)',
            color: 'var(--m3-cream)',
            marginBottom: 'var(--s-16)',
          }}
        >
          <SplitText text="Как устроена работа" by="word" />
        </h2>

        <div className="relative">
          <div className="absolute left-0 right-0 top-14 h-px" style={{ background: 'var(--m3-line)' }} />
          {/* Горизонтальная прокрутка вместо переноса: пайплайн — это
              последовательность, и она должна читаться одной линией. */}
          <div
            className="flex gap-6 overflow-x-auto overflow-y-visible pt-6 pb-4"
            style={{ scrollbarWidth: 'none', marginInline: 'calc(-1 * var(--gutter))', paddingInline: 'var(--gutter)' }}
          >
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * stagger.item} y={22} className="shrink-0 w-[240px]">
                <div
                  className="relative hover:scale-[1.05]"
                  style={{ transition: `transform ${duration.base}s ${cssEase.standard}`, transformOrigin: 'left top' }}
                >
                  <span
                    className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full font-tech font-bold"
                    style={{
                      background: 'var(--m3-panel)',
                      border: '1px solid var(--m3-clay-dim)',
                      color: 'var(--m3-clay)',
                      fontSize: 'var(--t-body)',
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    className="font-tech font-bold uppercase"
                    style={{
                      fontSize: 'var(--t-body)',
                      lineHeight: 'var(--lh-heading)',
                      letterSpacing: 'var(--tr-h3)',
                      color: 'var(--m3-cream)',
                      marginTop: 'var(--s-6)',
                    }}
                  >
                    {s.t}
                  </h3>
                  <p
                    className="font-light"
                    style={{
                      fontSize: 'var(--t-sm)',
                      lineHeight: 'var(--lh-body)',
                      letterSpacing: 'var(--tr-body)',
                      color: 'var(--m3-dim)',
                      marginTop: 'var(--s-2)',
                      paddingRight: 'var(--s-6)',
                    }}
                  >
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЧТО НА ВЫХОДЕ ─────────────────────────────────────────── */}
      <section className="relative z-10" style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}>
        <Reveal y={14} style={{ marginBottom: 'var(--s-8)' }}>
          <span className="t-mono" style={{ color: 'var(--m3-clay-dim)' }}>
            Что на выходе
          </span>
        </Reveal>

        <dl className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4" style={{ maxWidth: 'var(--max-w)' }}>
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d.k} delay={i * stagger.item} y={20}>
              <div className="border-t" style={{ borderColor: 'var(--m3-line)', paddingTop: 'var(--s-6)', paddingBottom: 'var(--s-8)' }}>
                <dt className="t-mono" style={{ color: 'var(--m3-clay)', marginBottom: 'var(--s-3)' }}>
                  {d.k}
                </dt>
                <dd
                  className="font-light"
                  style={{
                    fontSize: 'var(--t-body)',
                    lineHeight: 'var(--lh-body)',
                    letterSpacing: 'var(--tr-body)',
                    color: 'var(--m3-dim)',
                  }}
                >
                  {d.v}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ── ФИНАЛ ─────────────────────────────────────────────────── */}
      <section
        className="relative z-10 flex flex-col items-center text-center"
        style={{ paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)', gap: 'var(--s-8)' }}
      >
        <h2
          className="font-tech font-extrabold uppercase"
          style={{
            fontSize: 'var(--t-h2)',
            lineHeight: 'var(--lh-tight)',
            letterSpacing: 'var(--tr-h2)',
            color: 'var(--m3-cream)',
            maxWidth: '16ch',
          }}
        >
          <SplitText text="Модель делается под задачу" by="word" />
        </h2>

        <Reveal delay={0.2} y={18} style={{ maxWidth: '52ch' }}>
          <p
            className="font-light"
            style={{
              fontSize: 'var(--t-body)',
              lineHeight: 'var(--lh-body)',
              letterSpacing: 'var(--tr-body)',
              color: 'var(--m3-dim)',
            }}
          >
            Модель для рендера и модель для реалтайма — разные объекты.
            Скажите, куда она пойдёт, и это определит топологию, бюджет полигонов
            и материалы с самого начала.
          </p>
        </Reveal>

        <Reveal delay={0.3} y={16}>
          <button
            onClick={onClose}
            className="rounded-full px-10 py-4 hover:scale-[1.03]"
            style={{
              background: 'var(--m3-a)',
              color: 'var(--m3-ink)',
              fontSize: 'var(--t-xs)',
              letterSpacing: 'var(--tr-label)',
              textTransform: 'uppercase',
              fontWeight: 500,
              boxShadow: 'var(--glow-a)',
              transition: `transform ${duration.base}s ${cssEase.standard}`,
            }}
          >
            ← Вернуться к услугам
          </button>
        </Reveal>
      </section>
    </main>
  )
}
