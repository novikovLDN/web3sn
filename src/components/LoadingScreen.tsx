/**
 * Прелоадер.
 *
 * Три решения, которые отличают его от прежней версии.
 *
 * 1. Прогресс честный. Раньше это был таймер на 4200 мс: число росло
 *    независимо от того, загрузилось что-нибудь или нет. Такой счётчик —
 *    декорация, и пользователь это чувствует. Теперь шкала собрана из
 *    реальных сигналов: готовность шрифтов и событие window.load. Таймер
 *    остался только как страховка — потолок, за который ожидание не уйдёт.
 *
 * 2. Он короткий. 4.2 секунды — это не «премиально», это налог на визит.
 *    Дорогой сайт уважает время: держимся в 1.2–2 секундах, и если
 *    страница готова раньше — уходим раньше.
 *
 * 3. Выход — сигнатурный момент, а не затухание. Шторка уезжает вверх
 *    одним transform-ом, открывая первый экран, который уже смонтирован и
 *    ждёт под ней. Ощущение «занавес поднялся», а не «картинка исчезла».
 *
 * Ротация слов («3D», «Кодинг») убрана намеренно: на полутора секундах она
 * успевала бы мигнуть один-два раза и читалась как дёрганье, а не как ритм.
 */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ease, duration, prefersReducedMotion } from '../design/motion'
import { IDENTITY } from '../data/content'

/** Потолок ожидания. За ним уходим независимо от состояния загрузки. */
const MAX_MS = 1900
/** Пол: ниже него прелоадер мигнул бы и это выглядело бы как сбой. */
const MIN_MS = 900

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const reduce = prefersReducedMotion()
    if (reduce) {
      // Просивший меньше движения не должен смотреть на шторку вообще.
      setPct(100)
      const id = window.setTimeout(onComplete, 60)
      return () => window.clearTimeout(id)
    }

    const start = performance.now()
    // Вес каждого сигнала. Сумма — 100.
    let real = 0
    const add = (n: number) => {
      real = Math.min(100, real + n)
    }

    // Шрифты: до их готовности первый экран покажет подменный шрифт и
    // «прыгнет» — это худшее, что можно показать в первую секунду.
    document.fonts?.ready.then(() => add(45)).catch(() => add(45))

    if (document.readyState === 'complete') add(55)
    else window.addEventListener('load', () => add(55), { once: true })

    let raf = 0
    // Отображаемое значение догоняет реальное, а не прыгает к нему:
    // мгновенный скачок 0 → 100 читается как поломка счётчика.
    let shown = 0

    const tick = (now: number) => {
      const elapsed = now - start
      // Пока пол не выдержан, шкала не может показать больше своей доли
      // времени — иначе на быстром соединении цифра замирает на 100.
      const floor = Math.min(1, elapsed / MIN_MS) * 100
      const target = Math.min(real, floor)
      // Страховка: после потолка добираем принудительно.
      const forced = elapsed >= MAX_MS ? 100 : target

      shown += (forced - shown) * 0.12
      const value = Math.min(100, Math.round(shown))
      setPct(value)

      if (value >= 100 && !doneRef.current) {
        doneRef.current = true
        // Небольшая пауза на «100» — иначе цифра не успевает быть прочитанной.
        window.setTimeout(onComplete, 180)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  const reduce = prefersReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 flex flex-col justify-between overflow-hidden grain"
      style={{
        zIndex: 'var(--z-overlay)' as unknown as number,
        background: 'var(--n-0)',
        paddingInline: 'var(--gutter)',
        paddingBlock: 'var(--s-6)',
      }}
      initial={false}
      /* Шторка уезжает вверх: только transform, композитор, без перерисовки. */
      exit={reduce ? { opacity: 0 } : { y: '-100%' }}
      transition={{
        duration: reduce ? 0.001 : duration.slower,
        ease: ease.editorial,
      }}
    >
      {/* Верх: подпись автора. Без «загружаем портфолио» — служебная фраза
          занимает место, которое может занять имя. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.entrance }}
        className="flex items-baseline justify-between"
        style={{ gap: 'var(--s-6)' }}
      >
        <span
          className="font-bold uppercase leading-none"
          style={{ fontSize: 'var(--t-sm)', letterSpacing: '0.05em', color: 'var(--text)' }}
        >
          {IDENTITY.name}
          <span style={{ color: 'var(--a)' }}>.</span>
        </span>
        <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
          {IDENTITY.location}
        </span>
      </motion.div>

      {/* Центр: роль. Одна строка, которая должна остаться в памяти. */}
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.1 }}
        className="t-h3"
        style={{ color: 'var(--text-muted)', maxWidth: '20ch' }}
      >
        {IDENTITY.roleRu}
      </motion.p>

      {/* Низ: счётчик. Крупно — потому что это единственная информация,
          которую здесь вообще имеет смысл сообщать. */}
      <div className="flex items-end justify-between" style={{ gap: 'var(--s-6)' }}>
        <span className="t-mono" style={{ color: 'var(--text-faint)', marginBottom: '0.4em' }}>
          Загрузка
        </span>
        <span
          className="t-h1 tabular-nums"
          style={{ color: 'var(--text)', lineHeight: 0.8 }}
          aria-live="polite"
          aria-label={`Загружено ${pct} процентов`}
        >
          {String(pct).padStart(3, '0')}
        </span>
      </div>

      {/* Линия прогресса. scaleX по origin-left — ширина не анимируется. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 2, background: 'var(--n-200)' }}
      >
        <div
          className="h-full origin-left"
          style={{
            background: 'var(--a)',
            transform: `scaleX(${pct / 100})`,
            // Кадр приходит из rAF каждый тик — собственный transition
            // здесь только сгладил бы и без того плавное движение.
            willChange: 'transform',
          }}
        />
      </div>
    </motion.div>
  )
}
