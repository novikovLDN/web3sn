/**
 * Экран услуги — Моушн-дизайн.
 *
 * ТЕЗИС
 * ─────
 * Моушн-портфолио обычно устроено как витрина результатов: ролик, второй ролик,
 * подпись «Explainer для клиента». Зритель видит, что получилось, и не видит ни
 * одного решения, которое к этому привело, — поэтому такая витрина не отличает
 * автора от монтажёра. Этот экран построен наоборот: он не показывает работы,
 * он отдаёт инструменты, которыми работа делается, и каждый из них можно взять
 * в руки и перепроверить прямо здесь.
 *
 * ГЛАВНОЕ РЕШЕНИЕ: КРИВАЯ КАК СОСТОЯНИЕ ЭКРАНА
 * ────────────────────────────────────────────
 * У экрана одно персистентное состояние, которым управляет посетитель, — кривая.
 * Панель внизу пишет её в --m-ease на корне <main> и в контекст framer-motion,
 * и по ней начинает идти всё движение страницы: появления секций, наведения,
 * прогоны инструментов, кнопки. Посетитель не рассматривает график easing —
 * он находится внутри выбранной кривой. Выбрав ease.exit, он получает экран,
 * который отвечает с задержкой, и понимает про кривую больше, чем из описания.
 *
 * Это прямой аналог дока палитры в «Брендинге», но с важным отличием: там
 * переключается цвет, здесь — характер движения. Каждый экран должен иметь
 * ровно одну переключаемую величину, и на моушн-экране ею обязана быть кривая,
 * а не цвет.
 *
 * ВИЗУАЛЬНАЯ НИША
 * ───────────────
 * Температуры остальных экранов заняты: терминальный зелёный (Разработка),
 * тёплая глина (3D), швейцарская бумага с ультрамарином (Веб-дизайн), средний
 * серый циклорама-фон (Брендинг), тёмная тёплая (главная). Моушну остаётся
 * глубокая петроль — цвет затемнённой аппаратной, где свет идёт от экрана.
 * Один тёплый акцент работает как лампа записи: появляется там, где что-то
 * происходит прямо сейчас. Обоснование гарнитуры и проверка кириллицы —
 * в motion/palette.ts.
 *
 * ЧТО ЗДЕСЬ СЧИТАЕТСЯ, А НЕ ЗАЯВЛЯЕТСЯ
 * ────────────────────────────────────
 *   • длительность как функция расстояния — по настоящим пикселям дорожки
 *     и по настоящей ширине окна посетителя;
 *   • частота обновления экрана и бюджет кадра — замер rAF на его машине;
 *   • отрисовки против событий прокрутки в покадровой протяжке.
 * Ни одной цифры о человеке: ни клиентов, ни наград, ни результатов. Все
 * композиции демонстрационные и помечены как демонстрационные.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * ──────────────────
 * Анимируются только transform и opacity — исключений нет ни одного.
 * Смены цвета и подсветки применяются мгновенно как смена состояния, а не
 * как переход: анимация цвета стоила бы paint каждый кадр, то есть нарушала
 * бы правило, которое экран доказывает. rAF работает только на время замера
 * и только когда его раздел в кадре. Кривые, длительности и шаги стаггера —
 * из design/motion.ts.
 */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { duration, stagger } from '../design/motion'
import { useMotionFonts } from './motion/useMotionFonts'
import { MOTION_VARS, T, mono, monoNum } from './motion/palette'
import {
  CURVES,
  EaseProvider,
  Reveal,
  curveCss,
  usePrefersReducedMotion,
  useScreenCurve,
  type Curve,
} from './motion/primitives'
import CurveDock from './motion/CurveDock'
import CurveSection from './motion/CurveSection'
import DistanceLaw from './motion/DistanceLaw'
import SyncDuel from './motion/SyncDuel'
import ScrollSequence from './motion/ScrollSequence'
import FrameBudget from './motion/FrameBudget'

/* ── Что остаётся у заказчика ─────────────────────────────────────
   Раздел, которого чаще всего нет у моушн-подрядчика: отдаётся ролик,
   а спецификация движения остаётся в голове исполнителя. Через полгода
   продукт обрастает переходами, придуманными разработкой на ходу. */
const DELIVERABLES = [
  {
    t: 'Мастер-файлы',
    d: 'Проект сборки с разложенными слоями и именованными композициями, а не только просчитанное видео.',
  },
  {
    t: 'Экспорты под площадки',
    d: 'Форматы, кодеки и хронометражи под каждую площадку, включая вертикаль и версию без звука.',
  },
  {
    t: 'Спецификация движения',
    d: 'Таблица переходов: слой, окно на таймлайне, кривая, свойства. То, из чего разработчик собирает переход, не угадывая.',
  },
  {
    t: 'Кривые и длительности',
    d: 'Именованный набор кривых и ступени шкалы в виде значений, которые кладутся прямо в код проекта — как это сделано на этом сайте.',
  },
  {
    t: 'Веб-сборка вместо видео',
    d: 'Там, где движение живёт в интерфейсе, — лёгкая сборка с проверенным поведением на слабых машинах, а не мегабайты ролика.',
  },
  {
    t: 'Правила движения',
    d: 'Что анимируется, что не анимируется никогда и что происходит при prefers-reduced-motion. Раздел, из-за отсутствия которого продукт и начинает дёргаться.',
  },
]

const STEPS = [
  { t: 'Разбор', d: 'Что должно стать понятно зрителю и за какое время. Формат выбирается после ответа, а не до него.' },
  { t: 'Сценарий', d: 'Текст и хронометраж по секундам. Дешевле переписать строку, чем пересобрать сцену.' },
  { t: 'Раскадровка', d: 'Ключевые кадры и стиль. Здесь фиксируется картинка — дальше правки идут внутри выбранного.' },
  { t: 'Аниматик', d: 'Тайминг в черновой графике. Ритм проверяется до того, как в него вложена отрисовка.' },
  { t: 'Сборка', d: 'Финальная графика, движение, звук. Спецификация пишется параллельно, а не после.' },
]

/* ══════════════════════════════════════════════════════════════════
   ГЕРОЙ
   Заголовок едет по выбранной кривой — экран начинается с того же самого
   доказательства, которым заканчивается. Аффорданса объявлена прямым
   текстом: посетитель не должен догадываться, что панель внизу рабочая.
   ══════════════════════════════════════════════════════════════════ */
function Hero() {
  const curve = useScreenCurve()
  const reduced = usePrefersReducedMotion()

  return (
    <section
      className="mx-auto w-full flex flex-col justify-center min-h-screen"
      style={{
        maxWidth: 'var(--max-w)',
        paddingInline: 'var(--gutter)',
        paddingTop: 'var(--s-32)',
        paddingBottom: 'var(--s-24)',
      }}
    >
      <div className="grid lg:grid-cols-12 gap-x-8 gap-y-12 items-end">
        <div className="lg:col-span-7">
          <Reveal y={12}>
            <span style={{ ...mono, color: 'var(--m-ember)' }}>Компетенция · Моушн-дизайн</span>
          </Reveal>

          {/* Интерлиньяж 0.95, а не 0.88 из токенов: «й» в «Тайминг»
              поднимается выше прописной высоты, и на плотном интерлиньяже
              её срезала бы вторая строка. Кириллице нужен больший запас
              сверху, чем латинице, — типографику нельзя настраивать
              на слове вроде MOTION. */}
          <motion.h1
            className="optical-left"
            style={{
              ...T.hero,
              marginTop: 'var(--s-6)',
              color: 'var(--m-chalk)',
              fontFamily: 'var(--m-display)',
            }}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slower, ease: curve.v }}
          >
            Тайминг —
            <br />
            это дизайн
          </motion.h1>

          <Reveal y={16} delay={0.28}>
            <p
              className="font-light"
              style={{
                marginTop: 'var(--s-8)',
                maxWidth: '46ch',
                color: 'var(--m-chalk)',
                fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
                lineHeight: 1.5,
                letterSpacing: '-0.012em',
              }}
            >
              Одни и те же кадры с разным расписанием — два разных сообщения.
              Ниже не работы, а инструменты, которыми расписание собирается:
              пять разделов, и каждый можно взять в руки.
            </p>
          </Reveal>
        </div>

        {/* Объявление аффордансы. Прямым текстом, как клавиша G в веб-дизайне
            и док палитры в брендинге: скрытый интерактив, о котором не сказали,
            для посетителя не существует. */}
        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal y={16} delay={0.4}>
            <div
              className="rounded-2xl"
              style={{
                background: 'var(--m-panel)',
                border: '1px solid var(--m-line)',
                padding: 'var(--s-6)',
              }}
            >
              <span style={{ ...mono, color: 'var(--m-sea)' }}>Панель внизу экрана</span>
              <p
                className="mt-4 font-light"
                style={{ color: 'var(--m-dim)', fontSize: '0.95rem', lineHeight: 1.6 }}
              >
                Переключает кривую, по которой движется <em>вся</em> страница —
                появления секций, наведения, кнопки, прогоны инструментов.
                Выберите другую, и экран сменит характер, не сменив ни одного
                пикселя оформления.
              </p>
              <p className="mt-5" style={{ ...monoNum, color: 'var(--m-ember)' }}>
                сейчас: {curve.name}
              </p>
              <p className="mt-1.5" style={{ ...monoNum, color: 'var(--m-faint)' }}>
                {curveCss(curve)}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ЭКРАН
   ══════════════════════════════════════════════════════════════════ */
export default function MotionScreen({ onClose }: { onClose: () => void }) {
  useMotionFonts()

  /* Единственное состояние экрана. По умолчанию — ease.standard: экран должен
     сначала показать себя в норме, иначе сравнивать выбор будет не с чем. */
  const [curve, setCurve] = useState<Curve>(CURVES[0])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <EaseProvider curve={curve}>
      <main
        data-screen="motion"
        className="animate-screen-in relative"
        style={{
          ...MOTION_VARS,
          // Кривая экрана переопределяет значение по умолчанию из MOTION_VARS.
          // Всё, что ниже по дереву использует var(--m-ease), переезжает на неё.
          ['--m-ease' as string]: curveCss(curve),
          background: 'var(--m-abyss)',
          color: 'var(--m-chalk)',
          fontFamily: 'var(--m-display)',
          // Место под панель кривой, которая живёт поверх контента.
          paddingBottom: 'var(--s-24)',
        }}
      >
        {/* Атмосфера: два очень слабых радиальных подсвета плюс зерно.
            .grain из tokens.css до сих пор не был подключён ни на одном экране —
            это готовая общая подпись сайта, которая просто не работала.
            Штатных 0.035 здесь достаточно: подложка почти плоская, и зерну
            нечего спасать от бэндинга сверх этого. */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none grain"
          style={{ background: 'var(--m-glow)' }}
        />

        <button
          onClick={onClose}
          className="fixed top-5 left-5 rounded-full backdrop-blur"
          style={{
            ...mono,
            zIndex: 'var(--z-nav)',
            border: '1px solid var(--m-line)',
            color: 'var(--m-sea)',
            background: 'var(--m-scrim)',
            paddingInline: 'var(--s-4)',
            paddingBlock: 'var(--s-2)',
            transition: 'transform var(--d-fast) var(--m-ease)',
          }}
          onPointerEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-3px)'
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          ← Услуги
        </button>

        {/* Контент поднят над атмосферным слоем явным z-index.
            Без этого позиционированный fixed-оверлей рисовался бы ПОВЕРХ
            статичных секций (позиционированные элементы всегда выше
            непозиционированных) и подкрашивал бы весь текст. Обёртка
            без overflow: она предок sticky-секции в ScrollSequence,
            а overflow на предке отключает прилипание. */}
        <div className="relative" style={{ zIndex: 'var(--z-raised)' }}>
          <Hero />

          {/* ── Разделы-законы. Маркируются именем параметра, а не порядковым
              номером — обоснование в SectionHead (motion/primitives.tsx). ── */}
          <CurveSection onPick={setCurve} />
          <DistanceLaw />
          <SyncDuel />
          <ScrollSequence />
          <FrameBudget />

        {/* ── ЧТО ОСТАЁТСЯ У ЗАКАЗЧИКА ──────────────────────────── */}
        <section
          className="mx-auto w-full"
          style={{
            maxWidth: 'var(--max-w)',
            paddingInline: 'var(--gutter)',
            paddingBlock: 'var(--section-y)',
          }}
        >
          <Reveal y={14}>
            <div className="pb-4" style={{ borderBottom: '1px solid var(--m-line)' }}>
              <h2 style={{ ...T.h2, color: 'var(--m-chalk)', fontFamily: 'var(--m-display)' }}>
                Ролик заканчивается, система остаётся
              </h2>
            </div>
          </Reveal>
          <Reveal y={12} delay={0.06}>
            <p
              className="mt-5 max-w-[58ch] font-light"
              style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
            >
              Отданное видео живёт до первого изменения продукта. Дальше движение
              либо продолжается по правилам, либо каждый следующий подрядчик
              придумывает своё. Разница закладывается на этом этапе, а не на
              следующем редизайне.
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-x-8">
            <div className="lg:col-span-8 lg:col-start-5">
              {DELIVERABLES.map((d, i) => (
                <Reveal key={d.t} y={16} delay={i * stagger.item}>
                  <div
                    className="flex flex-col sm:flex-row gap-2 sm:gap-8"
                    style={{
                      paddingBlock: 'var(--s-6)',
                      borderBottom: '1px solid var(--m-line-soft)',
                    }}
                  >
                    <span
                      className="shrink-0"
                      style={{ ...mono, color: 'var(--m-ember)', minWidth: 36, paddingTop: 4 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3
                        style={{
                          ...T.h3,
                          fontSize: '1.08rem',
                          color: 'var(--m-chalk)',
                          marginBottom: 6,
                        }}
                      >
                        {d.t}
                      </h3>
                      <p
                        className="font-light max-w-[48ch]"
                        style={{ color: 'var(--m-dim)', lineHeight: 1.6 }}
                      >
                        {d.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ПРОЦЕСС ───────────────────────────────────────────── */}
        <section
          className="mx-auto w-full"
          style={{
            maxWidth: 'var(--max-w)',
            paddingInline: 'var(--gutter)',
            paddingBlock: 'var(--section-y)',
          }}
        >
          <Reveal y={14}>
            <div className="pb-4" style={{ borderBottom: '1px solid var(--m-line)' }}>
              <h2 style={{ ...T.h2, color: 'var(--m-chalk)', fontFamily: 'var(--m-display)' }}>
                Тайминг проверяется до отрисовки
              </h2>
            </div>
          </Reveal>
          <Reveal y={12} delay={0.06}>
            <p
              className="mt-5 max-w-[58ch] font-light"
              style={{ color: 'var(--m-dim)', fontSize: 'var(--t-body)', lineHeight: 1.62 }}
            >
              Аниматик существует именно для этого: ритм проверяется в черновой
              графике, пока переделка стоит час, а не неделю. Порядок этапов
              здесь не бюрократия, а защита бюджета.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} y={18} delay={i * stagger.item}>
                <div style={{ borderTop: '1px solid var(--m-line)', paddingTop: 'var(--s-6)' }}>
                  <span style={{ ...mono, color: 'var(--m-ember)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    style={{
                      ...T.h3,
                      marginTop: 'var(--s-4)',
                      marginBottom: 'var(--s-3)',
                      color: 'var(--m-chalk)',
                    }}
                  >
                    {s.t}
                  </h3>
                  <p
                    className="font-light"
                    style={{ color: 'var(--m-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}
                  >
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── ЗАКРЫВАЮЩЕЕ УТВЕРЖДЕНИЕ ───────────────────────────── */}
        <section
          className="mx-auto w-full"
          style={{
            maxWidth: 'var(--max-w)',
            paddingInline: 'var(--gutter)',
            paddingBlock: 'var(--section-y)',
          }}
        >
          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
            <div className="lg:col-span-8">
              <Reveal y={22}>
                {/* Интерлиньяж 0.98: «й» здесь нет, но строка «объясняет»
                    даёт длинные свесы, а «интерфейса» — верхние выносные.
                    Ниже 0.95 на кириллице не опускаемся нигде на экране. */}
                <h2
                  className="optical-left"
                  style={{
                    ...T.hero,
                    fontSize: 'clamp(2.1rem, 7vw, 5rem)',
                    lineHeight: 0.98,
                    color: 'var(--m-chalk)',
                    fontFamily: 'var(--m-display)',
                  }}
                >
                  Движение — не слой
                  <br />
                  поверх интерфейса
                </h2>
              </Reveal>
              <Reveal y={16} delay={0.18}>
                <p
                  className="font-light"
                  style={{
                    marginTop: 'var(--s-6)',
                    maxWidth: '52ch',
                    color: 'var(--m-dim)',
                    lineHeight: 1.65,
                  }}
                >
                  Это то, как продукт объясняет себя: что с чем связано, что
                  только что произошло и куда смотреть дальше. Поэтому тайминг
                  решается раньше формы, а не подгоняется под неё в конце.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Reveal y={16} delay={0.26}>
                <button
                  onClick={onClose}
                  className="group relative overflow-hidden rounded-full"
                  style={{
                    ...mono,
                    border: '1px solid var(--m-sea-35)',
                    color: 'var(--m-chalk)',
                    paddingInline: 'var(--s-8)',
                    paddingBlock: 'var(--s-4)',
                  }}
                >
                  {/* Заливка — scaleY отдельного слоя, а не переход по
                      background: цветовой переход стоил бы paint на каждом
                      кадре наведения. Кривая — та, что выбрана на экране. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100"
                    style={{
                      // Приглушённая заливка, а не сплошной ember: на сплошном
                      // акценте меловой текст даёт слишком низкий контраст,
                      // а менять цвет текста переходом здесь нельзя — это paint.
                      background: 'var(--m-ember-16)',
                      transition: `transform var(--d-base) var(--m-ease)`,
                    }}
                  />
                  <span className="relative">← Вернуться к услугам</span>
                </button>
              </Reveal>
            </div>
          </div>
        </section>
        </div>

        <CurveDock curve={curve} onPick={setCurve} />
      </main>
    </EaseProvider>
  )
}
