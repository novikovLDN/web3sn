/**
 * Система подсказок и акцентов.
 *
 * Задача, которую решает этот файл, звучит противоречиво: сайт должен
 * «подсвечивать акценты, уведомлять и подсказывать» и при этом читаться
 * дорого и недоступно. Противоречие снимается одним правилом:
 *
 *   насыщенность — можно, громкость — нельзя.
 *
 * «Множество элементов» здесь реализовано как плотность РЕАКЦИИ, а не
 * плотность объектов. Ни один примитив ниже не добавляет на страницу нового
 * визуального объекта: они меняют прозрачность, чертят линию, показывают
 * факт о мире или отвечают на уже совершённое действие пользователя.
 *
 * Каждая подсказка проходит три проверки (иначе её здесь нет):
 *   1. инициатор — пользователь, а не сайт;
 *   2. написана голосом автора, а не голосом справки;
 *   3. сообщает о ремесле, а не компенсирует непонятный интерфейс.
 *
 * Поэтому здесь нет и не может быть: тултипов «нажмите сюда», онбординга,
 * тостов «добро пожаловать», баннеров, счётчиков и всплывающих предложений.
 *
 * Технические правила файла:
 *   • анимируются только transform и opacity;
 *   • кривые и длительности — из design/motion.ts;
 *   • цвет и метрики — только токены, ни одного нового хекса;
 *   • prefersReducedMotion() уважается везде, где есть движение.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  ease,
  duration,
  spring,
  inView as inViewCfg,
  prefersReducedMotion,
} from '../design/motion'

// ── Среда ─────────────────────────────────────────────────────────────

/**
 * Точный указатель. От этого зависит всё, что связано с клавиатурой и
 * курсором: анонсировать горячие клавиши на телефоне — значит показать
 * подсказку к устройству ввода, которого у человека нет.
 */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)
  // matchMedia недоступен на первом проходе рендера — решаем после монтирования.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return fine
}

// ── Приём 1. Акцент прозрачностью, а не цветом ────────────────────────

/**
 * Фокус задаётся гашением соседей, а не подсветкой активного.
 *
 * Это приём из печати: он не двигает текст, который человек в этот момент
 * читает, и не требует ни одного дополнительного цвета — палитра остаётся
 * дисциплинированной. Подсветка активного элемента цветом превращает список
 * в светофор; гашение соседей превращает его в набор.
 *
 * Возвращает стиль, а не класс: opacity композитится, transition по ней
 * не трогает ни layout, ни paint.
 */
export function dimmed(active: boolean, dim = 0.32): CSSProperties {
  return {
    opacity: active ? 1 : dim,
    transition: 'opacity var(--d-fast) var(--e-standard)',
  }
}

// ── Приём 2. Акцент прочерком по scaleX, а не заливкой ────────────────

/**
 * Линия, прочерченная от левого края при появлении в кадре.
 *
 * Заливка сообщает «состояние изменилось». Прочерк сообщает «это отметили
 * рукой» — то есть жест, а не индикатор. Плюс это одна композиторская
 * операция вместо перерисовки рамки.
 */
export function DrawnRule({
  delay = 0,
  color = 'var(--a)',
  thickness = 1,
  className,
}: {
  delay?: number
  color?: string
  thickness?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, inViewCfg)
  const reduce = prefersReducedMotion()

  return (
    <span
      ref={ref}
      aria-hidden
      className={className}
      style={{ display: 'block', height: thickness, background: color, transformOrigin: 'left' }}
    >
      <motion.span
        style={{ display: 'block', height: '100%', background: color, transformOrigin: 'left' }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : reduce ? undefined : { scaleX: 0 }}
        transition={{ duration: reduce ? 0 : duration.cinematic, delay, ease: ease.editorial }}
      />
    </span>
  )
}

// ── Приём 3. Клавиатура: объявление ровно один раз ────────────────────

/** Клавиша в тексте. Регистр взят с экрана веб-дизайна, где это уже сделано. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <span
      className="t-mono inline-flex items-center justify-center"
      style={{
        letterSpacing: 0,
        minWidth: 22,
        padding: '2px 6px',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--border-strong)',
        color: 'var(--text)',
      }}
    >
      {children}
    </span>
  )
}

type HotkeyOptions = {
  /** Выключает обработчик целиком (тач-устройства, закрытые состояния). */
  enabled?: boolean
}

/**
 * Одна горячая клавиша.
 *
 * Главная обязанность здесь — не сломать ввод. Если фокус стоит в поле,
 * буква обязана попасть в поле, а не в шорткат: клавиатурная система,
 * съедающая печатаемый текст, — это не признак инструмента, а баг.
 * Поэтому проверяется target события, contentEditable и модификаторы
 * (Cmd+C пользователя мы не перехватываем никогда).
 */
export function useHotkey(
  key: string,
  handler: () => void,
  { enabled = true }: HotkeyOptions = {}
) {
  // Держим обработчик в ref, чтобы не переподписывать слушатель на каждый
  // рендер: слушатель на window должен быть ровно один за жизнь компонента.
  const saved = useRef(handler)
  saved.current = handler

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      const t = e.target as HTMLElement | null
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement ||
        t?.isContentEditable
      ) {
        return
      }
      e.preventDefault()
      saved.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, enabled])
}

const HINT_STORE_PREFIX = 'novikov.hint.'

/**
 * Однократное объявление.
 *
 * Подсказка о клавише показывается, пока ею не воспользовались, и после
 * первого использования не показывается больше никогда. Это и есть разница
 * между инструментом и онбордингом: инструмент представляется один раз.
 *
 * localStorage может быть недоступен (приватный режим, отключённые куки) —
 * тогда подсказка просто останется видимой. Это мягкая деградация: хуже
 * потерять функциональность, чем показать одну строку лишний раз.
 */
export function useOnceHint(id: string): { visible: boolean; retire: () => void } {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_STORE_PREFIX + id) === 'seen') setVisible(false)
    } catch {
      /* хранилище недоступно — оставляем как есть */
    }
  }, [id])

  const retire = useCallback(() => {
    setVisible(false)
    try {
      localStorage.setItem(HINT_STORE_PREFIX + id, 'seen')
    } catch {
      /* см. выше */
    }
  }, [id])

  return { visible, retire }
}

// ── Приём 4. Инструкция голосом автора, в скобках ─────────────────────

/**
 * Авторская ремарка.
 *
 * Разница между «Нажмите сюда, чтобы скопировать» и «(Адрес копируется
 * клавишей C — так быстрее, чем выделять.)» не в вежливости, а в ролях.
 * Первое — просьба к пользователю от лица интерфейса. Второе — утверждение
 * автора о собственной работе, которое функционально работает как подсказка.
 *
 * Скобки здесь не украшение: они переводят строку из интерфейсного регистра
 * в литературный, и подсказка перестаёт читаться как справка.
 */
export function AuthorNote({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <p
      className={`t-body ${className ?? ''}`}
      style={{ color: 'var(--text-faint)', maxWidth: '46ch', ...style }}
    >
      ({children})
    </p>
  )
}

// ── Приём 5. Уведомление только как подтверждение действия ────────────

/**
 * Копирование в буфер с эфемерным подтверждением.
 *
 * Единственный тип уведомления, допустимый на этой странице: инициатор —
 * пользователь, содержание — факт о том, что он только что сделал.
 * Ни рамки, ни иконки, ни крестика: подтверждение, которое надо закрывать,
 * — это уже диалог.
 */
export function useCopy(resetMs = 1600): { copied: boolean; copy: (text: string) => void } {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    (text: string) => {
      const done = () => {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetMs)
      }
      // clipboard API недоступен на http и в старых движках — тогда честно
      // ничего не сообщаем: ложное «Скопировано» хуже отсутствия ответа.
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => undefined)
      }
    },
    [resetMs]
  )

  return { copied, copy }
}

/**
 * Сам текст подтверждения. Всегда в DOM, управляется только opacity —
 * появление и исчезновение не двигают соседей.
 * role="status" + aria-live: событие озвучивается и без экрана.
 */
export function Ephemeral({
  on,
  children,
  className,
  style,
}: {
  on: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`t-mono ${className ?? ''}`}
      style={{
        color: 'var(--a)',
        opacity: on ? 1 : 0,
        transition: 'opacity var(--d-fast) var(--e-standard)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {on ? children : ''}
    </span>
  )
}

// ── Приём 6. Живые данные — четвёртый канал ───────────────────────────

/**
 * Часовой пояс автора. Он же — единственный факт, из которого выводятся
 * и время, и координаты, поэтому он объявлен один раз.
 *
 * ЗАМЕТКА: строку места и координаты стоит перенести в data/content.ts,
 * когда файл освободится — здесь они локальные, чтобы не править чужой файл.
 */
const PLACE = {
  timeZone: 'Europe/London',
  /** Координаты Гринвича — того самого нуля, по которому считают пояса. */
  coords: "N 51° 28' 40\" · W 0° 00' 05\"",
} as const

/**
 * Живое локальное время и координаты.
 *
 * Почему это читается дорого, хотя стоит почти ноль: это факт о мире, а не
 * утверждение о себе. Счётчик «90+ проектов» требует доверия — координаты
 * не требуют ничего. Время тихо отвечает на вопрос «какой у вас пояс» и
 * показывает, что страница живая, ничего при этом не обещая и не протухая.
 *
 * Обновление раз в секунду: интервал живёт только в этом листе дерева,
 * перерисовывается одна строка. Пока вкладка скрыта, таймер снимается —
 * фоновая работа ради невидимых секунд не нужна.
 */
export function LiveTime({ className, style }: { className?: string; style?: CSSProperties }) {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('ru-RU', {
      timeZone: PLACE.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    let id = 0
    const tick = () => setNow(fmt.format(new Date()))
    const start = () => {
      tick()
      id = window.setInterval(tick, 1000)
    }
    const stop = () => window.clearInterval(id)
    const onVisibility = () => (document.hidden ? stop() : start())

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <span className={`t-mono ${className ?? ''}`} style={{ color: 'var(--text-faint)', ...style }}>
      {/* tabular-nums: без табличных цифр строка дёргается на каждой секунде,
          потому что «1» уже остальных. Это дрожание видно и оно дешевит. */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{now ?? '--:--:--'}</span>
      {' · '}
      {PLACE.coords}
    </span>
  )
}

// ── Приём 7. Курсор, который сообщает, а не следует ───────────────────

/**
 * Подпись у курсора.
 *
 * Курсор-кружок, просто следующий за рукой, — узнаваемый boilerplate.
 * Курсор становится интерфейсной работой ровно тогда, когда несёт
 * информацию о том, что под ним: не «я здесь», а «здесь можно вот это».
 *
 * Читает атрибут data-cursor-note ближайшего предка цели события. Не
 * elementFromPoint: тот заставляет браузер синхронно пересчитывать layout
 * на каждом движении мыши.
 *
 * Отключается на тач-устройствах (курсора нет) и при reduced-motion
 * (следящий за рукой объект — ровно то, от чего человек попросил избавить).
 */
export function CursorNote({ scope }: { scope?: string }) {
  const fine = useFinePointer()
  const [note, setNote] = useState<string | null>(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, spring.cursor)
  const sy = useSpring(y, spring.cursor)

  useEffect(() => {
    if (!fine || prefersReducedMotion()) return
    const onMove = (e: MouseEvent) => {
      const el = e.target as Element | null
      const holder = el?.closest?.('[data-cursor-note]') as HTMLElement | null
      // Ограничение областью секции: подпись не должна всплывать над
      // элементами других секций, за которые этот файл не отвечает.
      const inScope = !scope || !!holder?.closest(scope)
      const next = holder && inScope ? holder.dataset.cursorNote ?? null : null
      setNote((prev) => (prev === next ? prev : next))
      if (next) {
        x.set(e.clientX)
        y.set(e.clientY)
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [fine, scope, x, y])

  if (!fine) return null

  return (
    <motion.span
      aria-hidden
      className="t-mono fixed"
      style={{
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        // Смещение от точки курсора задаётся translate внутри, а не отступами:
        // так внешний x/y остаётся чистой позицией указателя.
        translateX: 22,
        translateY: 18,
        zIndex: 'var(--z-cursor)',
        pointerEvents: 'none',
        color: 'var(--a)',
        opacity: note ? 1 : 0,
        transition: 'opacity var(--d-fast) var(--e-standard)',
        whiteSpace: 'nowrap',
      }}
    >
      {note ?? ''}
    </motion.span>
  )
}
