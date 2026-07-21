/**
 * Экран услуги — Брендинг.
 *
 * ВИЗУАЛЬНАЯ НИША: СЕРАЯ СТЕНА
 * ────────────────────────────
 * Температуры остальных экранов заняты: терминальный зелёный (Разработка),
 * тёплая глина (3D), петроль (Моушн), почти-белая швейцарская бумага
 * с ультрамарином (Веб-дизайн), тёмная тёплая (главная). Все они —
 * либо очень светлые, либо очень тёмные.
 *
 * Свободной осталась середина шкалы, и для брендинга она не «оставшийся
 * вариант», а единственно верный: айдентику показывают на нейтральном
 * сером фоне — так снимают влияние подложки на восприятие цвета. Ровно
 * поэтому в студиях стоит серый циклорама-фон, а в брендбуках развороты
 * кладут на серую плашку. Экран — это стена, а знак, палитра и носители —
 * артефакты, разложенные на ней.
 *
 * Побочный эффект ниши работает на смысл услуги: на среднем сером фоне
 * единственный источник цвета — сама бренд-система. Переключение палитры
 * видно во всю силу, потому что спорить с ним нечему.
 *
 * ЧТО ЗДЕСЬ ДОКАЗЫВАЕТ КОМПЕТЕНЦИЮ
 * ────────────────────────────────
 * Не «красивый логотип» — его может показать кто угодно. Экран показывает
 * то, из чего состоит бренд-система и что заказчик обычно не видит:
 *   1. построение знака — модульная сетка, охранное поле, минимальный размер;
 *   2. палитра в контекстах с посчитанным контрастом (математика, не мнение);
 *   3. типографическая пара с распределением ролей;
 *   4. носители, перекрашивающиеся синхронно с системой;
 *   5. правила использования — раздел, из-за отсутствия которого бренды и «плывут».
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Смена палитры — это смена состояния, а не анимация: цвета применяются
 * мгновенно, без transition по background-color (paint убил бы плавность
 * на десятке носителей сразу). Ощущение перехода даёт keyed-перерисовка
 * сцены по opacity. Слой построения знака существует всегда и включается
 * прозрачностью, а не монтированием. Кривые и длительности — из design/motion.
 */

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Reveal, SplitText } from '../design/primitives'
import { cssEase, duration, ease, stagger, prefersReducedMotion } from '../design/motion'
import { IDENTITY } from '../data/content'

/* ── Стена. Постоянная часть палитры экрана ──────────────────────────
   Средний тёплый серый: достаточно тёмный, чтобы светлая бумага носителей
   читалась как объект, и достаточно светлый, чтобы тёмные чернила давали
   контраст выше 6:1 для основного текста. */
const SCREEN_VARS = {
  '--br-wall': '#9a968e',
  '--br-wall-deep': '#8d8981',
  '--br-wall-line': 'rgba(20, 18, 15, 0.16)',
  '--br-wall-line-soft': 'rgba(20, 18, 15, 0.09)',
  '--br-wall-ink': '#141210',
  '--br-wall-ink-70': 'rgba(20, 18, 15, 0.7)',
  '--br-wall-ink-50': 'rgba(20, 18, 15, 0.5)',
  // Instrument Serif не имеет кириллицы (только latin/latin-ext) — на русских
  // заголовках он молча деградировал в Georgia. Cormorant Infant — единственный
  // свободный сериф с подтверждённой кириллицей, тянущий дисплейный кегль.
  // Вес берём 600: тонкие штрихи 300–400 в крупном кегле выглядят рыхло.
  '--br-serif': "'Cormorant Infant', Georgia, 'Times New Roman', serif",
  '--br-sans': "'Onest', 'MTS Wide', system-ui, sans-serif",
} as unknown as CSSProperties

/* ── Демонстрационные системы ────────────────────────────────────────
   Пять разных регистров, а не оттенки одного цвета. Заметка к каждой —
   про поведение палитры, а не про несуществующего клиента. */
type Palette = {
  id: string
  name: string
  note: string
  paper: string
  ink: string
  accent: string
  soft: string
}

const PALETTES: Palette[] = [
  {
    id: 'terra',
    name: 'Терракота',
    note: 'Тёплый регистр. Земляной акцент держит крупные плоскости и не бликует в печати.',
    paper: '#f3efe6',
    ink: '#17130f',
    accent: '#ef4a23',
    soft: '#d8c3a5',
  },
  {
    id: 'indigo',
    name: 'Индиго',
    note: 'Холодный регистр. Высокий контраст на экране, спокойное поведение в мелком кегле.',
    paper: '#edf0f7',
    ink: '#0f1420',
    accent: '#2f4fd8',
    soft: '#b3c0e8',
  },
  {
    id: 'pine',
    name: 'Хвоя',
    note: 'Природный регистр. Зелёный работает как цвет плоскости, а не только как акцент.',
    paper: '#edf3ee',
    ink: '#0f1a14',
    accent: '#1f7a4d',
    soft: '#a9cbb6',
  },
  {
    id: 'plum',
    name: 'Слива',
    note: 'Насыщенный регистр. Требует дисциплины: один акцент на носитель, не больше.',
    paper: '#f3eef5',
    ink: '#190f18',
    accent: '#7a2f8f',
    soft: '#cfaeda',
  },
  {
    id: 'coal',
    name: 'Уголь',
    note: 'Ахроматический регистр. Знак обязан работать без цвета — это проверка формы.',
    paper: '#ededea',
    ink: '#0b0b0b',
    accent: '#1a1a1a',
    soft: '#9a9a95',
  },
]

/* ── Контраст по WCAG ────────────────────────────────────────────────
   Считается, а не заявляется. Единственная «цифра» на экране, которую
   можно проверить прямо здесь — и потому единственная, которую уместно
   показывать. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const parts = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]
}

function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

/** Порог AA для основного текста — 4.5, для крупного набора — 3. */
function grade(r: number): string {
  if (r >= 7) return 'AAA'
  if (r >= 4.5) return 'AA'
  if (r >= 3) return 'AA · крупный'
  return 'только плашки'
}

/* ── Шрифты грузим при открытии экрана ───────────────────────────── */
function useBrandingFonts() {
  useEffect(() => {
    const id = 'branding-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,500;0,600;0,700;1,600&family=Onest:wght@300;400;500;600;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ── Технический голос экрана ────────────────────────────────────── */
const mono: CSSProperties = {
  fontSize: '0.6875rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontWeight: 500,
}

/* ══════════════════════════════════════════════════════════════════
   ЗНАК
   Не буква в квадрате, а геометрия на модульной сетке: контур собран
   из тех же модулей, что и охранное поле. Именно это отличает знак
   от «набранной в шрифте литеры» — и именно это можно показать.
   ══════════════════════════════════════════════════════════════════ */

/** 12 модулей по 20 — знак занимает внутренние 8, поле — по 2 с каждой стороны. */
const MODULE = 20
const BOX = 240

const N_PATH = 'M40 200 V40 H70 L170 148 V40 H200 V200 H170 L70 92 V200 Z'

function MarkGlyph({
  size = 120,
  fill = 'var(--br-accent)',
  construction = false,
}: {
  size?: number
  fill?: string
  construction?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${BOX} ${BOX}`}
      aria-hidden
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d={N_PATH} fill={fill} />

      {/* Слой построения существует всегда и гасится прозрачностью:
          монтирование десятка линий на клик стоило бы кадра. */}
      <g
        style={{
          opacity: construction ? 1 : 0,
          transition: `opacity ${duration.base}s ${cssEase.standard}`,
        }}
      >
        {Array.from({ length: BOX / MODULE + 1 }).map((_, i) => (
          <g key={i} stroke="var(--br-ink)" strokeWidth={0.5} opacity={0.35}>
            <line x1={i * MODULE} y1={0} x2={i * MODULE} y2={BOX} />
            <line x1={0} y1={i * MODULE} x2={BOX} y2={i * MODULE} />
          </g>
        ))}
        {/* Охранное поле — два модуля. Ниже этого знак ставить нельзя. */}
        <rect
          x={MODULE * 2}
          y={MODULE * 2}
          width={BOX - MODULE * 4}
          height={BOX - MODULE * 4}
          fill="none"
          stroke="var(--br-accent)"
          strokeWidth={1.4}
          strokeDasharray="7 6"
        />
        <circle
          cx={BOX / 2}
          cy={BOX / 2}
          r={BOX / 2 - MODULE}
          fill="none"
          stroke="var(--br-ink)"
          strokeWidth={0.9}
          opacity={0.4}
        />
      </g>
    </svg>
  )
}

/** Лок-ап: знак и словесная часть. Отбивка между ними — ровно один модуль. */
function Lockup({
  scale = 1,
  markFill = 'var(--br-accent)',
  wordColor = 'var(--br-ink)',
  dotColor = 'var(--br-accent)',
}: {
  scale?: number
  markFill?: string
  wordColor?: string
  dotColor?: string
}) {
  const s = 44 * scale
  return (
    <span className="inline-flex items-center" style={{ gap: s * 0.34 }}>
      <MarkGlyph size={s} fill={markFill} />
      <span
        style={{
          color: wordColor,
          fontSize: s * 0.56,
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {IDENTITY.name}
        <span style={{ color: dotColor }}>.</span>
      </span>
    </span>
  )
}

/* ── Заголовок раздела ───────────────────────────────────────────── */
function SectionHead({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <header style={{ marginBottom: 'var(--s-12)' }}>
      <Reveal y={16}>
        <div
          className="flex items-baseline gap-5 pb-4"
          style={{ borderBottom: '1px solid var(--br-wall-line)' }}
        >
          <span style={{ ...mono, color: 'var(--br-accent)' }}>{n}</span>
          <h2
            style={{
              fontFamily: 'var(--br-serif)',
              fontWeight: 600,
              fontSize: 'clamp(1.9rem, 5vw, 3.6rem)',
              // Трекинг на крупном кегле обязан быть отрицательным: у дисплейной
              // антиквы широкие апроши, и без сжатия заголовок распадается.
              letterSpacing: '-0.03em',
              lineHeight: 1.04,
            }}
          >
            {title}
          </h2>
        </div>
      </Reveal>
      {lead && (
        <Reveal y={14} delay={0.06}>
          <p
            className="font-light"
            style={{
              marginTop: 'var(--s-6)',
              maxWidth: '54ch',
              color: 'var(--br-wall-ink-70)',
              fontSize: 'clamp(0.98rem, 1.6vw, 1.18rem)',
              lineHeight: 1.62,
              letterSpacing: '-0.005em',
            }}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </header>
  )
}

/** Плашка-артефакт на стене: бумага текущей системы. */
function Sheet({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--br-paper)',
        color: 'var(--br-ink)',
        borderRadius: 'var(--r-lg)',
        // Тень статична: «подъём» на этом экране не анимируется.
        boxShadow: '0 26px 50px -34px rgba(0,0,0,0.55)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ПРАВИЛА ИСПОЛЬЗОВАНИЯ
   Раздел, которого чаще всего нет, — и из-за отсутствия которого
   бренд расходится через полгода после сдачи.
   ══════════════════════════════════════════════════════════════════ */
type Rule = { ok: boolean; title: string; note: string; transform?: string; wrongFill?: string }

const RULES: Rule[] = [
  { ok: true, title: 'Пропорции знака', note: 'Масштабируется только пропорционально, из угла.' },
  { ok: false, title: 'Растяжение', note: 'Непропорциональный масштаб ломает толщину штриха.', transform: 'scaleX(1.45)' },
  { ok: true, title: 'Монохром', note: 'Один цвет системы. Обязательный вариант для тиснения и гравировки.' },
  { ok: false, title: 'Произвольный цвет', note: 'Цвета вне палитры не применяются даже «на один макет».', wrongFill: '#d8b400' },
  { ok: true, title: 'Контраст к фону', note: 'Не ниже 4.5:1. Ниже — знак теряет форму на печати.' },
  { ok: false, title: 'Поворот', note: 'Знак стоит горизонтально. Наклон — это уже другой знак.', transform: 'rotate(-14deg)' },
]

/* ── Содержание услуги ───────────────────────────────────────────── */
const DELIVERABLES = [
  { t: 'Знак и лок-апы', d: 'Основной, компактный и монохромный варианты, построение на сетке, охранное поле, минимальный размер.' },
  { t: 'Палитра', d: 'Основные и вспомогательные цвета с ролями и посчитанным контрастом для экрана и печати.' },
  { t: 'Типографика', d: 'Пара гарнитур с распределением ролей, шкала кеглей, правила набора и переносов.' },
  { t: 'Носители', d: 'Деловая документация, соцсети, вывеска, мерч — в макетах, а не в описании.' },
  { t: 'Правила использования', d: 'Что с системой делать нельзя. Раздел, из-за отсутствия которого бренды и расходятся.' },
  { t: 'Гайдлайн и исходники', d: 'Документ и файлы, по которым бренд соберёт любой подрядчик без звонка мне.' },
]

const STEPS = [
  { n: '01', t: 'Разбор', d: 'Задача бизнеса, аудитория, поле конкурентов, ограничения носителей.' },
  { n: '02', t: 'Территория', d: 'Где в этом поле можно стоять и быть отличимым, а не похожим на соседа.' },
  { n: '03', t: 'Концепции', d: 'Две-три разные идеи знака с обоснованием — не вариации одной формы.' },
  { n: '04', t: 'Система', d: 'Палитра, гарнитуры, сетка, носители. Выбранная идея разворачивается целиком.' },
  { n: '05', t: 'Гайдлайн', d: 'Правила, исходники, передача. Дальше бренд живёт без меня.' },
]

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function BrandingScreen({ onClose }: { onClose: () => void }) {
  useBrandingFonts()
  const [pi, setPi] = useState(0)
  const [construction, setConstruction] = useState(false)
  const p = PALETTES[pi]
  const reduce = prefersReducedMotion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  /* Кастомный курсор живёт в корне документа, а не в дереве этого экрана,
     поэтому переопределить его цвет через переменную на <main> нельзя —
     она туда не каскадируется. Ставим --cursor на documentElement на время
     жизни экрана: тёмные чернила читаются на серой стене, где общий
     оранжевый акцент сливался. На размонтировании возвращаем как было. */
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--cursor', '#141210')
    return () => {
      root.style.removeProperty('--cursor')
    }
  }, [])

  /* Палитра выбранной системы уезжает в CSS-переменные корня: ниже по
     дереву цвет берётся только через var(), хексов в разметке нет. */
  const paletteVars = {
    '--br-paper': p.paper,
    '--br-ink': p.ink,
    '--br-accent': p.accent,
    '--br-soft': p.soft,
  } as unknown as CSSProperties

  const swatches = [
    { label: 'Акцент', role: 'Действие, один на носитель', c: p.accent, on: p.paper },
    { label: 'Чернила', role: 'Текст и плоскости', c: p.ink, on: p.paper },
    { label: 'Мягкий', role: 'Фоны и разделители', c: p.soft, on: p.ink },
    { label: 'Бумага', role: 'Основная поверхность', c: p.paper, on: p.ink },
  ]

  return (
    <main
      data-screen="branding"
      className="animate-screen-in relative"
      style={{
        ...SCREEN_VARS,
        ...paletteVars,
        background: 'var(--br-wall)',
        color: 'var(--br-wall-ink)',
        fontFamily: 'var(--br-sans)',
        // Место под нижнюю панель системы, которая живёт поверх контента.
        paddingBottom: 'var(--s-32)',
      }}
    >
      <button
        onClick={onClose}
        className="fixed top-5 left-5 rounded-full px-4 py-2 text-sm backdrop-blur"
        style={{
          zIndex: 'var(--z-nav)',
          border: '1px solid var(--br-wall-line)',
          color: 'var(--br-wall-ink)',
          background: 'rgba(154,150,142,0.78)',
        }}
      >
        ← Назад
      </button>

      {/* ══ ГЕРОЙ ══════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full flex flex-col justify-center min-h-screen"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingTop: 'var(--s-32)', paddingBottom: 'var(--s-24)' }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-12 items-end">
          <div className="lg:col-span-7">
            <Reveal y={14}>
              <span style={{ ...mono, color: 'var(--br-accent)' }}>Компетенция · Брендинг</span>
            </Reveal>

            <h1
              className="optical-left"
              style={{
                marginTop: 'var(--s-6)',
                fontFamily: 'var(--br-serif)',
                fontWeight: 600,
                fontSize: 'clamp(3.2rem, 12vw, 9.5rem)',
                letterSpacing: '-0.045em',
                // 0.92, а не 0.86: в кириллице «б» и «д» выходят за прописную
                // высоту, и на плотном интерлиньяже строка их срезает.
                lineHeight: 0.92,
              }}
            >
              <SplitText text="Брендинг" by="char" delay={0.1} />
            </h1>

            <Reveal y={18} delay={0.35}>
              <p
                className="font-light"
                style={{
                  marginTop: 'var(--s-8)',
                  maxWidth: '46ch',
                  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.012em',
                }}
              >
                Логотип — это верхушка. Узнаваемость держит система: построение
                знака, роли цветов, пара гарнитур и правила, по которым бренд
                собирается одинаково у любого подрядчика.
              </p>
            </Reveal>
          </div>

          {/* Знак сразу на бумаге системы — экран начинается с артефакта,
              а не с описания артефакта. */}
          <div className="lg:col-span-5">
            <motion.div
              key={p.id}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, ease: ease.entrance }}
            >
              <Sheet
                className="flex flex-col justify-between"
                style={{ padding: 'var(--s-8)', minHeight: 300 }}
              >
                <span style={{ ...mono, color: 'var(--br-ink)', opacity: 0.5 }}>
                  Основной лок-ап
                </span>
                {/* 1.5, а не крупнее: при большем масштабе лок-ап перестаёт
                    помещаться в 390px вместе с полями плашки. */}
                <div className="flex justify-center" style={{ paddingBlock: 'var(--s-8)' }}>
                  <Lockup scale={1.5} />
                </div>
                <span
                  className="font-light"
                  style={{ fontSize: '0.85rem', lineHeight: 1.55, opacity: 0.66 }}
                >
                  Демонстрационная система «{p.name}». {p.note}
                </span>
              </Sheet>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 01 · ПОСТРОЕНИЕ ЗНАКА ═════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="01"
          title="Знак строится, а не рисуется"
          lead="Контур собран на сетке из двенадцати модулей. Из тех же модулей считается охранное поле — два по каждой стороне. Поэтому знак одинаково стоит на визитке и на вывеске: пропорция задана правилом, а не глазом."
        />

        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, ease: ease.entrance }}
          >
            <Sheet className="flex flex-col items-center" style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem)' }}>
              <MarkGlyph size={260} construction={construction} />
              <button
                onClick={() => setConstruction((v) => !v)}
                aria-pressed={construction}
                className="rounded-full px-5 py-2.5"
                style={{
                  ...mono,
                  marginTop: 'var(--s-8)',
                  border: '1px solid var(--br-soft)',
                  color: construction ? 'var(--br-accent)' : 'var(--br-ink)',
                  background: 'transparent',
                }}
              >
                Построение
              </button>
            </Sheet>
          </motion.div>

          <div>
            {[
              { k: 'Модуль', v: '1/12 стороны знака. Все толщины и отбивки кратны ему.' },
              { k: 'Охранное поле', v: 'Два модуля. Ни один посторонний элемент в это поле не заходит.' },
              { k: 'Минимальный размер', v: '24 px по высоте на экране, 8 мм в печати. Ниже диагональ смыкается.' },
              { k: 'Отбивка в лок-апе', v: 'Ровно один модуль между знаком и словесной частью — не «на глаз».' },
            ].map((r, i) => (
              <Reveal key={r.k} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-1.5 sm:gap-8"
                  style={{ paddingBlock: 'var(--s-6)', borderBottom: '1px solid var(--br-wall-line-soft)' }}
                >
                  <span style={{ ...mono, minWidth: '15ch', paddingTop: 3, color: 'var(--br-wall-ink-50)' }}>
                    {r.k}
                  </span>
                  <p className="font-light" style={{ lineHeight: 1.6, letterSpacing: '-0.005em' }}>
                    {r.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 02 · ПАЛИТРА ══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="02"
          title="У цвета есть роль и есть контраст"
          lead="Палитра — это не набор понравившихся оттенков, а распределение ролей с проверенным контрастом. Соотношения ниже посчитаны по WCAG прямо на странице: их можно перепроверить, а не поверить на слово."
        />

        <motion.div
          key={p.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, ease: ease.entrance }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {swatches.map((s) => {
            const r = contrast(s.c, s.on)
            return (
              <div
                key={s.label}
                className="flex flex-col justify-between"
                style={{
                  background: s.c,
                  color: s.on,
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--s-6)',
                  minHeight: 190,
                  boxShadow: '0 26px 50px -34px rgba(0,0,0,0.55)',
                }}
              >
                <div>
                  <span style={{ ...mono, opacity: 0.75 }}>{s.label}</span>
                  <p className="font-light" style={{ marginTop: 'var(--s-3)', fontSize: '0.85rem', lineHeight: 1.5, opacity: 0.78 }}>
                    {s.role}
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-3" style={{ marginTop: 'var(--s-8)' }}>
                  <span style={{ ...mono, letterSpacing: '0.08em' }}>{s.c.toUpperCase()}</span>
                  <span style={{ ...mono, letterSpacing: '0.08em', opacity: 0.75 }}>
                    {r.toFixed(1)}:1
                  </span>
                </div>
              </div>
            )
          })}
        </motion.div>

        <Reveal y={14} delay={0.1}>
          <p
            className="font-light"
            style={{ marginTop: 'var(--s-6)', maxWidth: '60ch', color: 'var(--br-wall-ink-70)', fontSize: '0.9rem', lineHeight: 1.6 }}
          >
            Контраст указан к соседнему цвету пары: акцент и чернила — к бумаге,
            мягкий и бумага — к чернилам. Текущая пара «акцент на бумаге» —{' '}
            {contrast(p.accent, p.paper).toFixed(1)}:1, уровень{' '}
            {grade(contrast(p.accent, p.paper))}.
          </p>
        </Reveal>
      </section>

      {/* ══ 03 · ТИПОГРАФИЧЕСКАЯ ПАРА ═════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="03"
          title="Пара строится на контрасте класса"
          lead="Две похожие гарнитуры читаются как ошибка вёрстки. Работает контраст: антиква с выраженной модуляцией штриха на заголовках и нейтральный гротеск на всём остальном. Роли распределены жёстко — «иногда наоборот» не бывает."
        />

        <motion.div
          key={p.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, ease: ease.entrance }}
          className="grid gap-5 md:grid-cols-2"
        >
          <Sheet style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div className="flex items-baseline justify-between gap-4">
              <span style={{ ...mono, opacity: 0.5 }}>Заголовки</span>
              <span style={{ ...mono, color: 'var(--br-accent)' }}>Cormorant Infant</span>
            </div>
            <p
              style={{
                fontFamily: 'var(--br-serif)',
                fontWeight: 600,
                fontSize: 'clamp(3.2rem, 9vw, 5.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
                marginBlock: 'var(--s-6)',
              }}
            >
              Аа Бб Ff
            </p>
            <p className="font-light" style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.68 }}>
              Контраст штриха и высокая ось превращают заголовок в событие.
              Только крупный кегль: от 28 px и выше, трекинг от −0.03em.
            </p>
          </Sheet>

          <Sheet style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <div className="flex items-baseline justify-between gap-4">
              <span style={{ ...mono, opacity: 0.5 }}>Текст и интерфейс</span>
              <span style={{ ...mono, color: 'var(--br-accent)' }}>Onest</span>
            </div>
            <p
              style={{
                fontSize: 'clamp(3.2rem, 9vw, 5.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
                marginBlock: 'var(--s-6)',
              }}
            >
              Аа Бб Ff
            </p>
            <p className="font-light" style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.68 }}>
              Открытые формы и ровный ритм. Держит и подпись в 12 px, и
              подзаголовок; четыре начертания закрывают все состояния интерфейса.
            </p>
          </Sheet>
        </motion.div>
      </section>

      {/* ══ 04 · НОСИТЕЛИ ═════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="04"
          title="Одно правило, много применений"
          lead="Носители собраны из тех же четырёх ролей цвета и той же пары гарнитур. Смена системы в панели внизу перекрашивает их одновременно — потому что решение принимается один раз, на уровне правила, а не отдельно для каждого макета."
        />

        <motion.div
          key={p.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, ease: ease.entrance }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Визитка */}
          <div>
            <Sheet className="aspect-[1.6] flex flex-col justify-between" style={{ padding: 'var(--s-6)' }}>
              <Lockup scale={0.62} />
              <div className="font-light" style={{ fontSize: '0.72rem', lineHeight: 1.5, opacity: 0.7 }}>
                {IDENTITY.name}
                <br />
                {IDENTITY.roleRu}
              </div>
            </Sheet>
            <p style={{ ...mono, marginTop: 'var(--s-3)', color: 'var(--br-wall-ink-50)' }}>Визитка</p>
          </div>

          {/* Аватар */}
          <div>
            <div
              className="aspect-[1.6] flex items-center justify-center"
              style={{
                background: 'var(--br-ink)',
                borderRadius: 'var(--r-lg)',
                boxShadow: '0 26px 50px -34px rgba(0,0,0,0.55)',
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{ width: 92, height: 92, borderRadius: '50%', background: 'var(--br-accent)' }}
              >
                <MarkGlyph size={44} fill="var(--br-ink)" />
              </span>
            </div>
            <p style={{ ...mono, marginTop: 'var(--s-3)', color: 'var(--br-wall-ink-50)' }}>Аватар</p>
          </div>

          {/* Вывеска */}
          <div>
            <div
              className="aspect-[1.6] flex items-end"
              style={{
                background: 'var(--br-accent)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--s-6)',
                boxShadow: '0 26px 50px -34px rgba(0,0,0,0.55)',
              }}
            >
              <Lockup scale={0.72} markFill="var(--br-paper)" wordColor="var(--br-paper)" dotColor="var(--br-paper)" />
            </div>
            <p style={{ ...mono, marginTop: 'var(--s-3)', color: 'var(--br-wall-ink-50)' }}>Вывеска</p>
          </div>

          {/* Обложка */}
          <div>
            <div
              className="aspect-[1.6] flex flex-col justify-between"
              style={{
                background: 'var(--br-soft)',
                color: 'var(--br-ink)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--s-6)',
                boxShadow: '0 26px 50px -34px rgba(0,0,0,0.55)',
              }}
            >
              <span style={{ ...mono, opacity: 0.7 }}>Портфолио</span>
              <span
                style={{
                  fontFamily: 'var(--br-serif)',
                  fontWeight: 600,
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                Объём
                <br />и характер
              </span>
            </div>
            <p style={{ ...mono, marginTop: 'var(--s-3)', color: 'var(--br-wall-ink-50)' }}>Обложка</p>
          </div>
        </motion.div>
      </section>

      {/* ══ 05 · ПРАВИЛА ══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead
          n="05"
          title="Правила важнее знака"
          lead="Бренд расходится не в момент сдачи, а через полгода — когда очередной подрядчик растянул знак и подобрал «похожий» цвет. Раздел ограничений отвечает на это заранее и стоит в гайдлайне рядом с исходниками."
        />

        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--br-wall-line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {RULES.map((r, i) => (
            <Reveal key={r.title} y={16} delay={i * stagger.item}>
              <div
                className="h-full flex flex-col justify-between"
                style={{ background: 'var(--br-wall-deep)', padding: 'var(--s-6)', gap: 'var(--s-6)' }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span style={{ ...mono, color: 'var(--br-wall-ink-50)' }}>{r.title}</span>
                  <span
                    aria-hidden
                    style={{ ...mono, letterSpacing: 0, color: r.ok ? 'var(--br-wall-ink)' : 'var(--br-accent)' }}
                  >
                    {r.ok ? 'Да' : 'Нет'}
                  </span>
                </div>

                <div
                  className="flex items-center justify-center"
                  style={{
                    background: 'var(--br-paper)',
                    borderRadius: 'var(--r-md)',
                    height: 104,
                    // Опасный вариант физически показан искажением, а не подписан.
                    opacity: r.ok ? 1 : 0.92,
                  }}
                >
                  <span style={{ display: 'block', transform: r.transform }}>
                    <MarkGlyph size={44} fill={r.wrongFill ?? 'var(--br-accent)'} />
                  </span>
                </div>

                <p className="font-light" style={{ fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--br-wall-ink-70)' }}>
                  {r.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ 06 · ЧТО ВХОДИТ ═══════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead n="06" title="Что остаётся у заказчика" />
        <div className="grid lg:grid-cols-12 gap-x-8">
          <div className="lg:col-span-8 lg:col-start-5">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.t} y={16} delay={i * stagger.item}>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:gap-8"
                  style={{ paddingBlock: 'var(--s-6)', borderBottom: '1px solid var(--br-wall-line-soft)' }}
                >
                  <span style={{ ...mono, color: 'var(--br-accent)', minWidth: 36, paddingTop: 4 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 6 }}>
                      {d.t}
                    </h3>
                    <p className="font-light" style={{ maxWidth: '48ch', color: 'var(--br-wall-ink-70)', lineHeight: 1.6 }}>
                      {d.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 07 · ПРОЦЕСС ══════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <SectionHead n="07" title="Как идёт работа" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} y={18} delay={i * stagger.item}>
              <div style={{ borderTop: '1px solid var(--br-wall-line)', paddingTop: 'var(--s-6)' }}>
                <span style={{ ...mono, color: 'var(--br-accent)' }}>{s.n}</span>
                <h3
                  style={{
                    marginTop: 'var(--s-4)',
                    marginBottom: 'var(--s-3)',
                    fontFamily: 'var(--br-serif)',
                    fontWeight: 600,
                    fontSize: '1.6rem',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.1,
                  }}
                >
                  {s.t}
                </h3>
                <p className="font-light" style={{ color: 'var(--br-wall-ink-70)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ФИНАЛ ═════════════════════════════════════════════════ */}
      <section
        className="mx-auto w-full"
        style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--gutter)', paddingBlock: 'var(--section-y)' }}
      >
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="lg:col-span-8">
            <h2
              className="optical-left"
              style={{
                fontFamily: 'var(--br-serif)',
                fontWeight: 600,
                fontSize: 'clamp(2.2rem, 7vw, 5.2rem)',
                letterSpacing: '-0.042em',
                lineHeight: 1.0,
              }}
            >
              <SplitText text="Бренд собирается один раз" by="word" />
            </h2>
            <Reveal y={16} delay={0.2}>
              <p
                className="font-light"
                style={{ marginTop: 'var(--s-6)', maxWidth: '52ch', color: 'var(--br-wall-ink-70)', lineHeight: 1.65 }}
              >
                Дальше он либо держится правилами, либо расходится по подрядчикам.
                Разница закладывается на этом этапе, а не на следующем редизайне.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Reveal y={16} delay={0.28}>
              <button
                onClick={onClose}
                className="group relative overflow-hidden rounded-full"
                style={{
                  border: '1px solid var(--br-wall-ink)',
                  color: 'var(--br-wall-ink)',
                  paddingInline: 'var(--s-8)',
                  paddingBlock: 'var(--s-4)',
                  ...mono,
                }}
              >
                {/* Заливка — scaleY отдельного слоя. Переход по background
                    стоил бы paint на каждом кадре наведения. */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
                  style={{
                    background: 'var(--br-accent)',
                    transition: `transform ${duration.base}s ${cssEase.standard}`,
                  }}
                />
                <span className="relative">← Вернуться к услугам</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ ПАНЕЛЬ СИСТЕМЫ ════════════════════════════════════════
          Переключатель остаётся с посетителем на всём экране, а не живёт
          в одной секции: смысл в том, что одно решение перекрашивает знак,
          палитру, типографику и носители одновременно — а увидеть это можно
          только если управление доступно в любом контексте. */}
      <div
        className="fixed left-1/2 bottom-4 sm:bottom-6"
        style={{ zIndex: 'var(--z-nav)', transform: 'translateX(-50%)' }}
      >
        <div
          className="flex items-center gap-3 sm:gap-4 rounded-full backdrop-blur"
          style={{
            border: '1px solid var(--br-wall-line)',
            background: 'rgba(154,150,142,0.86)',
            paddingInline: 'var(--s-4)',
            paddingBlock: 'var(--s-3)',
            boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6)',
          }}
        >
          <span className="hidden sm:inline" style={{ ...mono, color: 'var(--br-wall-ink-50)' }}>
            Система
          </span>
          <div className="flex items-center gap-2">
            {PALETTES.map((pal, i) => {
              const active = i === pi
              return (
                <button
                  key={pal.id}
                  onClick={() => setPi(i)}
                  aria-pressed={active}
                  aria-label={`Система «${pal.name}»`}
                  title={pal.name}
                  className="rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    // Половинка акцента и половинка мягкого: свотч показывает
                    // не один цвет, а отношение внутри системы.
                    backgroundImage: `linear-gradient(105deg, ${pal.accent} 0 50%, ${pal.soft} 50% 100%)`,
                    boxShadow: active ? `0 0 0 2px var(--br-wall), 0 0 0 3.5px ${pal.ink}` : 'none',
                    transform: active ? 'scale(1.12)' : 'scale(1)',
                    transition: `transform ${duration.fast}s ${cssEase.standard}`,
                  }}
                />
              )
            })}
          </div>
          <span
            className="hidden sm:inline"
            style={{ ...mono, minWidth: '9ch', color: 'var(--br-wall-ink)' }}
          >
            {p.name}
          </span>
        </div>
      </div>
    </main>
  )
}
