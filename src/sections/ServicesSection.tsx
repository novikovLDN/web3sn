/**
 * Услуги.
 *
 * Что изменилось против прежней версии и почему:
 *  • Ушли две вертикальные бегущие строки с названиями программ. Список софта
 *    сбоку — это резюме джуна, а не аргумент лида: он сообщает, чем человек
 *    пользуется, вместо того чтобы сообщать, что клиент получит. Плюс они
 *    физически конкурировали с главным контентом за внимание.
 *  • Ушёл «эффект лупы» (scale по скроллу на каждой строке). Приём заметный,
 *    но грубый: он двигает текст, который человек в этот момент читает.
 *    Фокус теперь задаётся тем, чем его задают в печати, — прозрачностью
 *    соседей, а не размером активного элемента.
 *  • Из описаний убраны инструкции «нажмите — покажу пайплайн». Интерфейсная
 *    подсказка внутри продающего абзаца сбивает тон; аффорданс клика несут
 *    стрелка и hover-состояние, а не текст.
 *
 * Главный приём секции — превью, следующее за курсором. Оно не декоративное:
 * в нём лежит состав работ, то есть ответ на «что конкретно я получу».
 * На тач-устройствах курсора нет, поэтому там тот же состав отдаётся
 * инлайн-строкой под описанием — контент не теряется.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../design/primitives'
import { ease, duration, spring, prefersReducedMotion } from '../design/motion'
import { SERVICES_COPY } from '../data/content'

type Service = {
  number: string
  name: string
  description: string
  /** Состав работ. Короткие существительные — это опись, а не буллеты. */
  deliverables: string[]
  screen?: string
}

const SERVICES: Service[] = [
  {
    number: '01',
    name: '3D-моделинг',
    description:
      'Объекты, персонажи и окружения, готовые к рендеру и к движку. Топология, развёртка и текстуры приходят в состоянии, которое не придётся переделывать под задачу.',
    deliverables: ['Хайполи и геймреди', 'Развёртка и текстуры', 'Рендер-сетапы'],
    screen: 'modeling',
  },
  {
    number: '02',
    name: 'Разработка',
    description:
      'Сайт или веб-приложение, доведённое до продакшена: вёрстка, логика, движение, 3D. В браузере результат выглядит так же, как в макете, — на этом строится вся работа.',
    deliverables: ['React и TypeScript', 'WebGL и анимация', 'Сборка и деплой'],
    screen: 'development',
  },
  {
    number: '03',
    name: 'Motion-дизайн',
    description:
      'Анимация, которая объясняет продукт быстрее текста: ролики для запуска, интерфейсная моторика, графика для презентаций и площадок.',
    deliverables: ['Ролики и тизеры', 'Моторика интерфейса', 'Исходники проектов'],
    screen: 'motion',
  },
  {
    number: '04',
    name: 'Брендинг',
    description:
      'Бренд-система целиком: знак, типографика, палитра, носители. С гайдлайном, по которому систему сможет вести ваша команда без меня.',
    deliverables: ['Знак и айдентика', 'Типографика и палитра', 'Гайдлайн'],
    screen: 'branding',
  },
  {
    number: '05',
    name: 'Веб-дизайн',
    description:
      'Макеты, из которых продукт собирается без домысливания: сетка, типографика, состояния, поведение на всех размерах экрана.',
    deliverables: ['Сетка и типографика', 'Компоненты и состояния', 'Адаптив и хендофф'],
    screen: 'webdesign',
  },
]

/**
 * Панель, живущая у курсора. Одна на всю секцию, а не по штуке на строку:
 * пять пружин, считающихся параллельно, — это пять лишних rAF-подписок.
 *
 * position: fixed снимает необходимость пересчитывать координаты
 * относительно секции при скролле — курсорные координаты уже в видовых.
 */
function CursorPreview({ service, active }: { service: Service | null; active: boolean }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, spring.cursor)
  const sy = useSpring(y, spring.cursor)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none hidden lg:block"
      style={{ x: sx, y: sy, zIndex: 'var(--z-overlay)' as unknown as number }}
    >
      {/* Второй слой нужен, чтобы смещение «от курсора» и анимация появления
          не дрались за один и тот же transform. */}
      <AnimatePresence>
        {active && service && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: duration.fast, ease: ease.entrance }}
            className="flex flex-col"
            style={{
              position: 'absolute',
              left: 'var(--s-6)',
              top: 'var(--s-6)',
              width: '19rem',
              padding: 'var(--s-6)',
              gap: 'var(--s-4)',
              background: 'var(--n-50)',
              color: 'var(--n-900)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--sh-lg)',
            }}
          >
            <span className="t-mono" style={{ color: 'var(--a)' }}>
              Состав работ
            </span>
            <ul className="flex flex-col" style={{ gap: 'var(--s-2)' }}>
              {service.deliverables.map((d) => (
                <li
                  key={d}
                  className="t-body"
                  style={{ color: 'var(--n-800)', lineHeight: 'var(--lh-heading)' }}
                >
                  {d}
                </li>
              ))}
            </ul>
            <span className="t-mono" style={{ color: 'var(--n-600)' }}>
              Открыть экран
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ServiceRow({
  service,
  index,
  dimmed,
  onHover,
  onOpenScreen,
}: {
  service: Service
  index: number
  /** Затемняется, когда наведена соседняя строка. Фокус — прозрачностью. */
  dimmed: boolean
  onHover: (s: Service | null) => void
  onOpenScreen?: (id: string) => void
}) {
  const clickable = !!(service.screen && onOpenScreen)
  const open = () => clickable && onOpenScreen!(service.screen!)

  return (
    <Reveal
      as="div"
      y={20}
      delay={index * 0.06}
      style={{ borderTop: '1px solid var(--n-800)' }}
    >
      <div
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        onMouseEnter={() => onHover(service)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(service)}
        onBlur={() => onHover(null)}
        className={`group grid ${clickable ? 'cursor-pointer' : ''}`}
        style={{
          gridTemplateColumns: 'auto 1fr auto',
          columnGap: 'var(--s-6)',
          rowGap: 'var(--s-3)',
          paddingBlock: 'clamp(var(--s-8), 4vw, var(--s-16))',
          // Только opacity — layout при затемнении соседей не трогается.
          opacity: dimmed ? 0.32 : 1,
          transition: `opacity var(--d-base) var(--e-standard)`,
        }}
      >
        {/* Номер как элемент композиции: моноширинная колонка, не украшение */}
        <span
          className="t-mono"
          style={{
            color: 'var(--n-600)',
            paddingTop: '0.65em',
            transition: 'color var(--d-fast) var(--e-standard)',
          }}
        >
          {service.number}
        </span>

        <div className="flex flex-col" style={{ gap: 'var(--s-4)' }}>
          <h3
            className="t-h2"
            style={{ color: 'var(--n-50)' }}
          >
            {/* Сдвиг вправо при наведении — «строка подаётся навстречу» */}
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">
              {service.name}
            </span>
          </h3>

          <p
            className="t-body"
            style={{ color: 'var(--n-500)', maxWidth: '52ch' }}
          >
            {service.description}
          </p>

          {/* Тач-фолбэк состава работ: на десктопе он живёт в курсорном превью */}
          <ul
            className="flex flex-wrap lg:hidden"
            style={{ gap: 'var(--s-2) var(--s-4)', marginTop: 'var(--s-1)' }}
          >
            {/* Разделитель между пунктами обязателен: при разрядке t-mono
                пробел между словами почти равен пробелу между пунктами,
                и без точки список читался сплошным потоком. */}
            {service.deliverables.map((d, i) => (
              <li key={d} className="t-mono" style={{ color: 'var(--n-600)' }}>
                {d}
                {i < service.deliverables.length - 1 && (
                  <span aria-hidden style={{ color: 'var(--n-400)', marginLeft: 'var(--s-4)' }}>
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {clickable && (
          <span
            aria-hidden
            className="hidden sm:inline-flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            style={{
              color: 'var(--a)',
              paddingTop: '0.5em',
            }}
          >
            <ArrowUpRight size={28} strokeWidth={1.25} />
          </span>
        )}
      </div>
    </Reveal>
  )
}

export default function ServicesSection({ onOpenScreen }: { onOpenScreen?: (id: string) => void }) {
  const [hovered, setHovered] = useState<Service | null>(null)
  const pointerFine = useRef(false)

  useEffect(() => {
    pointerFine.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !prefersReducedMotion()
  }, [])

  // Наведение регистрируем только там, где курсор существует: иначе на тач
  // «hover» залипает после тапа и строки остаются затемнёнными.
  const handleHover = useCallback((s: Service | null) => {
    if (!pointerFine.current) return
    setHovered(s)
  }, [])

  return (
    <section
      id="price"
      className="relative rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] section-pad"
      style={{ background: 'var(--n-950)' }}
    >
      <CursorPreview service={hovered} active={!!hovered} />

      <div className="shell">
        {/* ── Шапка секции ─────────────────────────────────────────── */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between"
          style={{ gap: 'var(--s-8)', marginBottom: 'clamp(var(--s-12), 8vw, var(--s-24))' }}
        >
          <div className="flex flex-col" style={{ gap: 'var(--s-4)' }}>
            <Reveal y={12}>
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                {SERVICES_COPY.label}
              </span>
            </Reveal>
            <Reveal y={24} delay={0.08}>
              <h2 className="t-h1 optical-left" style={{ color: 'var(--n-50)' }}>
                {SERVICES_COPY.title}
              </h2>
            </Reveal>
          </div>

          {/* Подзаголовок задан локально: в content.ts он говорит про четыре
              направления, а их пять. Правка чужого файла тут не в моей зоне. */}
          <Reveal y={20} delay={0.16} className="lg:max-w-[36ch]">
            <p className="t-body" style={{ color: 'var(--n-500)' }}>
              Пять направлений, которые чаще всего нужны вместе. Беру их целиком —
              и отвечаю за результат на стыках, где обычно всё и рассыпается.
            </p>
          </Reveal>
        </div>

        {/* ── Список ───────────────────────────────────────────────── */}
        <div style={{ borderBottom: '1px solid var(--n-800)' }}>
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.number}
              service={service}
              index={i}
              dimmed={!!hovered && hovered.number !== service.number}
              onHover={handleHover}
              onOpenScreen={onOpenScreen}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
