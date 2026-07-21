/**
 * Кастомный курсор: точка и кольцо.
 *
 * Что здесь важно и почему сделано именно так.
 *
 *  • Точка идёт за указателем один в один, кольцо — на пружине spring.cursor.
 *    Отставание кольца и есть весь эффект: оно сообщает инерцию и вес.
 *    Пружина, а не кривая, потому что движение мыши прерывается постоянно, и
 *    только пружина отрабатывает смену направления без рывка.
 *
 *  • Позиция задаётся исключительно translate3d. top/left вызывали бы layout
 *    на каждом кадре — это гарантированная потеря 120fps на курсоре, который
 *    двигается всегда.
 *
 *  • Размер кольца при наведении меняется через scale, а не width/height.
 *    Прежняя версия анимировала width и height с transition — то есть просила
 *    браузер пересчитывать геометрию 60 раз в секунду ради подсветки ссылки.
 *
 *  • Отключается там, где он вреден: тач-устройства (курсора нет, а элемент
 *    висит в DOM и ловит кадры) и prefers-reduced-motion (следящий за рукой
 *    объект — ровно то движение, от которого человек попросил избавить).
 *    В обоих случаях компонент возвращает null и системный курсор остаётся.
 */

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { spring, cssEase } from '../design/motion'

/** Селектор всего, что реагирует на курсор. Строка услуги — кликабельная. */
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-cursor]'

const DOT = 6
const RING = 34

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  // Точка: сырые координаты, без сглаживания — она должна быть «под пальцем».
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Кольцо: те же координаты через пружину. Отставание честное, не таймерное.
  const rx = useSpring(x, spring.cursor)
  const ry = useSpring(y, spring.cursor)

  // Решение о включении принимается один раз после монтирования: matchMedia
  // недоступен на этапе SSR/первого рендера, а мигать курсором нельзя.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !calm)
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Класс прячет системный курсор. Ставится только когда свой действительно
    // работает — иначе на тач-устройстве можно остаться вообще без указателя.
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
      // Проверяем цель самого события, а не elementFromPoint: последний
      // заставляет браузер синхронно пересчитать layout на каждом движении.
      const el = e.target as Element | null
      setHot(!!el?.closest?.(INTERACTIVE))
    }
    const onOut = (e: MouseEvent) => {
      // relatedTarget пуст только когда указатель ушёл за пределы окна.
      if (!e.relatedTarget) setVisible(false)
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled, visible, x, y])

  if (!enabled) return null

  // Общая часть позиционирования: элемент центрируется собственным
  // translate(-50%,-50%), поэтому смещение считается от левого верхнего угла.
  const base = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    borderRadius: 'var(--r-full)',
    pointerEvents: 'none' as const,
    zIndex: 100000,
    // Прозрачность — единственное, что переключается переходом: она
    // композитится и не трогает ни layout, ни paint.
    transition: `opacity var(--d-fast) ${cssEase.standard}`,
  }

  return (
    <>
      {/* Кольцо. Рисуется первым, чтобы точка оставалась поверх. */}
      <motion.div
        aria-hidden
        style={{
          ...base,
          width: RING,
          height: RING,
          marginLeft: -RING / 2,
          marginTop: -RING / 2,
          border: '1px solid var(--cursor)',
          opacity: visible ? (hot ? 1 : 0.62) : 0,
          x: rx,
          y: ry,
          translateZ: 0,
        }}
        animate={{ scale: down ? 0.8 : hot ? 1.65 : 1 }}
        transition={spring.snappy}
      />

      {/* Точка. Идёт без пружины — задержка здесь читалась бы как лаг ввода. */}
      <motion.div
        aria-hidden
        style={{
          ...base,
          width: DOT,
          height: DOT,
          marginLeft: -DOT / 2,
          marginTop: -DOT / 2,
          background: 'var(--cursor)',
          opacity: visible ? 1 : 0,
          x,
          y,
          translateZ: 0,
        }}
        animate={{ scale: hot ? 0.4 : 1 }}
        transition={spring.snappy}
      />
    </>
  )
}
