import { useEffect, useRef, useState } from 'react'

/**
 * Индикатор прогресса чтения на правом краю.
 *
 * Что здесь было раньше и почему заменено: мультяшный робот-космонавт,
 * едущий по краю экрана. Два независимых повода его убрать.
 *
 *  1. Позиционирование. Персонаж в голубых тонах вне палитры сообщает
 *     «дружелюбно и весело» — ровно противоположное тому, что должен
 *     сообщать сайт дорогого специалиста уровня руководителя.
 *  2. Производительность. Он двигался через `top: calc(...)` — это layout-
 *     свойство: каждый кадр прокрутки браузер пересчитывал геометрию
 *     страницы. Ниже — только `transform`, то есть работа на композиторе.
 *
 * Взамен — то, что делают на премиальных сайтах: тонкий рельс, засечки
 * разделов и подпись текущего раздела. Это не украшение, а ориентация:
 * на длинной странице человек должен понимать, где он и сколько осталось.
 */

// Разделы в порядке следования. Совпадает с порядком секций в App.tsx.
const SECTIONS = [
  { id: 'about', label: 'Профиль' },
  { id: 'stats', label: 'Цифры' },
  { id: 'price', label: 'Услуги' },
  { id: 'projects', label: 'Проекты' },
  { id: 'process', label: 'Процесс' },
  { id: 'faq', label: 'Вопросы' },
  { id: 'contact', label: 'Контакты' },
]

export default function ScrollBot() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)
  const [current, setCurrent] = useState('')
  const idle = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    // Только десктоп: на тач-устройствах есть системный индикатор прокрутки.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const read = () => {
      raf.current = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)

      // Текущий раздел — тот, чья верхняя граница ближе всего сверху к
      // трети экрана. Треть, а не край: раздел ощущается «текущим»
      // раньше, чем упирается в верх окна.
      const anchor = window.innerHeight / 3
      let found = ''
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= anchor) found = s.label
      }
      setCurrent(found)
    }

    const onScroll = () => {
      // Чтение геометрии — не чаще кадра. Без этого каждое событие
      // прокрутки вызывало бы принудительный reflow.
      if (raf.current == null) raf.current = requestAnimationFrame(read)

      setActive(true)
      if (idle.current) window.clearTimeout(idle.current)
      idle.current = window.setTimeout(() => setActive(false), 1600)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    read()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idle.current) window.clearTimeout(idle.current)
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed top-0 right-0 h-full pointer-events-none hidden lg:flex items-center"
      style={{ zIndex: 90, paddingRight: 'var(--s-6)' }}
    >
      <div
        className="flex items-center gap-4"
        style={{
          opacity: active ? 1 : 0.25,
          transition: 'opacity var(--d-slow) var(--e-standard)',
        }}
      >
        {/* Подпись текущего раздела. Уезжает вправо в покое —
            transform, не изменение ширины. */}
        {/* Подпись показывается только от 1536px: на более узких экранах
            контейнер контента (max-w 1440 + гаттеры) доходит почти до края,
            и подпись ложилась поверх текста. Рельс при этом остаётся всегда —
            он узкий и в поле контента не заходит. */}
        <span
          className="t-mono whitespace-nowrap hidden 2xl:inline"
          style={{
            color: 'var(--text-faint)',
            transform: active ? 'translateX(0)' : 'translateX(8px)',
            opacity: active ? 1 : 0,
            transition:
              'transform var(--d-slow) var(--e-standard), opacity var(--d-slow) var(--e-standard)',
          }}
        >
          {current}
        </span>

        {/* Рельс с засечками разделов */}
        <div className="relative flex flex-col justify-between" style={{ height: '38vh' }}>
          {/* Фоновая линия */}
          <span
            className="absolute"
            style={{
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              marginLeft: -0.5,
              background: 'var(--n-300)',
            }}
          />
          {/* Пройденная часть: scaleY от верха — чистый composited-слой. */}
          <span
            className="absolute origin-top"
            style={{
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              marginLeft: -0.5,
              background: 'var(--a)',
              transform: `scaleY(${progress})`,
              // Без перехода: значение и так меняется каждый кадр,
              // дополнительное сглаживание дало бы запаздывание.
            }}
          />
          {/* Засечки разделов */}
          {SECTIONS.map((s, i) => {
            const at = i / (SECTIONS.length - 1)
            const passed = progress >= at - 0.02
            return (
              <span
                key={s.id}
                className="relative block rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  background: passed ? 'var(--a)' : 'var(--n-400)',
                  transform: passed ? 'scale(1.6)' : 'scale(1)',
                  transition:
                    'transform var(--d-base) var(--e-standard), background-color var(--d-base) var(--e-standard)',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
