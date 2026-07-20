import { useEffect, useRef, useState } from 'react'

/**
 * Спутник на линии прокрутки.
 *
 * ИСТОРИЯ. Сначала здесь был мультяшный робот-космонавт, ехавший по краю
 * экрана. Он ушёл по двум причинам: голубой персонаж вне палитры сообщал
 * «дружелюбно и весело» вместо «дорого», а двигался через `top`, то есть
 * заставлял браузер пересчитывать геометрию страницы каждый кадр.
 *
 * Потом это стал просто индикатор прогресса — честный, но неживой.
 *
 * ЧТО ЗДЕСЬ СЕЙЧАС. Спутник, который реагирует на скорость прокрутки:
 * растягивается по направлению движения и сжимается поперёк, а на
 * остановке возвращается в круг. Это squash-and-stretch — один из
 * двенадцати принципов анимации, и на сайте моушн-дизайнера он работает
 * дважды: как деталь, за которой интересно следить, и как незаметная
 * демонстрация того, что автор знает, откуда берётся ощущение веса.
 *
 * Тело сохраняет объём: во сколько раз растянули по одной оси, во столько
 * же сжали по другой. Без этого правила растяжение читается как ошибка
 * масштаба, а не как инерция.
 *
 * ВСЁ ДВИЖЕНИЕ — ТОЛЬКО `transform`. Ни одного layout-свойства в кадре,
 * геометрия секций измеряется один раз и кэшируется.
 */

// Разделы в порядке следования. Совпадает с порядком секций в App.tsx.
const SECTIONS = [
  { id: 'projects', label: 'Проекты' },
  { id: 'price', label: 'Услуги' },
  { id: 'about', label: 'Профиль' },
  { id: 'process', label: 'Процесс' },
  { id: 'chronicle', label: 'Хроника' },
  { id: 'faq', label: 'Вопросы' },
  { id: 'contact', label: 'Контакты' },
]

const RAIL_VH = 38

export default function ScrollBot() {
  const [current, setCurrent] = useState('')
  const [active, setActive] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Только десктоп: на тач-устройствах есть системный индикатор.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let offsets: { top: number; label: string }[] = []
    let maxScroll = 1
    let railPx = 0

    // Геометрия измеряется вне кадра: getBoundingClientRect в цикле
    // анимации — принудительный reflow на каждом кадре.
    const measure = () => {
      offsets = SECTIONS.flatMap((s) => {
        const el = document.getElementById(s.id)
        if (!el) return []
        let top = 0
        let node: HTMLElement | null = el
        while (node) {
          top += node.offsetTop
          node = node.offsetParent as HTMLElement | null
        }
        return [{ top, label: s.label }]
      })
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      railPx = (window.innerHeight * RAIL_VH) / 100
    }

    let target = 0 // 0..1 — куда должен приехать спутник
    let eased = 0 // сглаженная позиция
    let last = 0 // предыдущая позиция, для скорости
    let idleT: number | null = null
    let raf = 0

    const onScroll = () => {
      target = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      setActive(true)
      if (idleT) window.clearTimeout(idleT)
      idleT = window.setTimeout(() => setActive(false), 1500)

      const anchor = window.scrollY + window.innerHeight / 3
      let found = ''
      for (const o of offsets) if (o.top <= anchor) found = o.label
      setCurrent(found)
    }

    const tick = () => {
      // Спутник догоняет цель с запаздыванием — из этого запаздывания
      // и рождается скорость, а из скорости деформация.
      const prev = eased
      eased += (target - eased) * 0.12
      const velocity = eased - prev
      last = velocity

      const probe = probeRef.current
      const trail = trailRef.current
      const bar = progressRef.current

      if (bar) bar.style.transform = `scaleY(${eased})`

      if (probe) {
        const y = eased * railPx
        // Растяжение пропорционально скорости, с потолком: без него
        // резкий скачок прокрутки превращает спутник в полосу.
        const stretch = Math.min(Math.abs(velocity) * 26, 1.6)
        const sy = 1 + stretch
        // Сохранение объёма: сжали поперёк ровно во столько, во сколько
        // растянули вдоль. Иначе это не инерция, а смена масштаба.
        const sx = 1 / sy
        probe.style.transform = `translate3d(-50%, ${y}px, 0) scale(${sx}, ${sy})`
      }

      if (trail) {
        // След отстаёт сильнее и живёт только на скорости.
        const y = eased * railPx
        const op = Math.min(Math.abs(velocity) * 30, 0.5)
        trail.style.transform = `translate3d(-50%, ${y}px, 0) scaleY(${1 + Math.min(Math.abs(velocity) * 60, 5)})`
        trail.style.opacity = String(op)
      }

      raf = requestAnimationFrame(tick)
    }

    measure()
    onScroll()
    if (!reduce) raf = requestAnimationFrame(tick)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    // Шрифты и картинки меняют высоты уже после первого измерения.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      if (idleT) window.clearTimeout(idleT)
      cancelAnimationFrame(raf)
      void last
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
          opacity: active ? 1 : 0.3,
          transition: 'opacity var(--d-slow) var(--e-standard)',
        }}
      >
        {/* Подпись раздела — только на широких экранах: на 1440 контейнер
            контента доходит почти до края, и подпись легла бы на текст. */}
        <span
          className="t-mono whitespace-nowrap hidden 2xl:inline"
          style={{
            color: 'var(--n-600)',
            transform: active ? 'translateX(0)' : 'translateX(8px)',
            opacity: active ? 1 : 0,
            transition:
              'transform var(--d-slow) var(--e-standard), opacity var(--d-slow) var(--e-standard)',
          }}
        >
          {current}
        </span>

        <div ref={railRef} className="relative" style={{ height: `${RAIL_VH}vh`, width: 9 }}>
          {/* Рельс */}
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
          {/* Пройденная часть — scaleY по composited-слою */}
          <span
            ref={progressRef}
            className="absolute origin-top"
            style={{
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              marginLeft: -0.5,
              background: 'var(--a)',
              transform: 'scaleY(0)',
            }}
          />
          {/* След — вытягивается на скорости, гаснет в покое */}
          <span
            ref={trailRef}
            className="absolute origin-center"
            style={{
              left: '50%',
              top: 0,
              width: 2,
              height: 10,
              marginTop: -5,
              borderRadius: 'var(--r-full)',
              background: 'var(--a)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          />
          {/* Спутник */}
          <span
            ref={probeRef}
            className="absolute origin-center"
            style={{
              left: '50%',
              top: 0,
              width: 7,
              height: 7,
              marginTop: -3.5,
              borderRadius: 'var(--r-full)',
              background: 'var(--a)',
              boxShadow: '0 0 12px var(--a-32)',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </div>
  )
}
