/**
 * Хроника.
 *
 * Пришла на место двух удалённых секций — счётчиков достижений и отзывов.
 * Обоснование по данным лежит в content.ts у массива CHRONICLE; здесь —
 * только про форму.
 *
 * ЧТО ЭТО ЗА ЭЛЕМЕНТ В РИТМЕ СТРАНИЦЫ
 * ───────────────────────────────────
 * Соседи — «Процесс» сверху и пауза снизу: плотный блок абзацев и пустой
 * экран. Между ними нужен пульс, а не третий абзацный блок и не таблица.
 * Поэтому строка здесь предельно короткая, такт появления вдвое быстрее
 * обычного (stagger.line вместо stagger.item), а вся секция набрана на
 * два уровня мельче соседних заголовков. Хроника должна пробегать под
 * глазом, а не читаться построчно — ощущение регулярности создаётся
 * количеством одинаковых коротких тактов, а не содержанием каждого.
 *
 * ПОЧЕМУ НЕ ТАБЛИЦА
 * ─────────────────
 * Таблица сообщает «данные для сверки». Список с датой слева и линией
 * сверху сообщает «издание». Разница только в том, что колонка даты не
 * выровнена по правому краю и не отбита рамкой, — но читается она как
 * смена жанра.
 *
 * ФОКУС — ПРОЗРАЧНОСТЬЮ, А НЕ ПОДСВЕТКОЙ
 * ──────────────────────────────────────
 * Тот же приём, что в ServicesSection: при наведении гаснут соседи, а не
 * подсвечивается активная строка. Приём из печати; он не двигает текст,
 * который человек в этот момент читает, и не требует ни одного лишнего
 * цвета. Анимируется только opacity.
 *
 * МАЛОЕ ЧИСЛО ЗАПИСЕЙ
 * ───────────────────
 * Секция обязана держаться достойно на двух записях. Поэтому она не
 * строится на сетке (сетка с двумя ячейками выглядит недозаполненной) и
 * не имеет ни счётчика записей, ни кнопки «показать все». Две строки в
 * колонке 8/12 читаются как начало хроники, а не как её нехватка.
 * Если заполненных записей нет вовсе — секции нет: заглушка на живом
 * сайте дороже отсутствующего блока.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, SplitText } from '../design/primitives'
import {
  ease,
  duration,
  stagger,
  inView as inViewCfg,
  prefersReducedMotion,
} from '../design/motion'
import {
  CHRONICLE,
  CHRONICLE_KINDS,
  CHRONICLE_COPY,
  type ChronicleEntry,
} from '../data/content'

// Заглушки видны только в разработке — владельцу надо видеть, что он
// заполняет. В собранный сайт import.meta.env.DEV подставляется как false,
// и ветка вырезается минификатором целиком.
const ENTRIES: ChronicleEntry[] = CHRONICLE.filter((e) => e.filled || import.meta.env.DEV)

function Row({
  entry,
  index,
  dimmed,
  onHover,
}: {
  entry: ChronicleEntry
  index: number
  dimmed: boolean
  onHover: (i: number | null) => void
}) {
  const reduce = prefersReducedMotion()
  const isLink = !!entry.href

  const body = (
    <>
      {/*
        Левая колонка — дата и тип. Ширина зафиксирована, чтобы текст
        записей начинался по одной вертикали: именно эта линия и создаёт
        ощущение хроники. На мобильном колонка складывается над текстом —
        13ch даты рядом с текстом на 390px оставили бы ему четыре слова.
      */}
      <div
        className="flex flex-row sm:flex-col shrink-0"
        style={{ gap: 'var(--s-3)', width: 'auto', minWidth: '11ch' }}
      >
        <time
          className="t-mono"
          dateTime={entry.iso}
          style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}
        >
          {entry.date}
        </time>
        <span className="t-mono" style={{ color: 'var(--a)' }}>
          {CHRONICLE_KINDS[entry.kind]}
        </span>
      </div>

      {/* Само событие. 62ch — верхняя граница читаемости для t-body; длиннее
          строка перестаёт пробегаться и начинает читаться, а это уже другой
          ритм. */}
      <p className="t-body" style={{ color: 'var(--text)', maxWidth: '62ch' }}>
        {entry.text}
        {!entry.filled && (
          // Видимая метка заглушки. Существует только в dev-сборке, но
          // помечена явно: заглушка, не отличимая от записи, однажды уедет
          // в прод.
          <span className="t-mono" style={{ color: 'var(--a-bright)', marginLeft: 'var(--s-3)' }}>
            заглушка
          </span>
        )}
      </p>

      {/* Стрелка — единственный аффорданс ссылки. Подписи «читать» нет:
          она сообщала бы, что стрелка не читается. */}
      {isLink && (
        <span
          aria-hidden
          className="hidden sm:inline-flex shrink-0 ml-auto transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          style={{ color: 'var(--a)', paddingTop: '0.2em' }}
        >
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </span>
      )}
    </>
  )

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewCfg}
      transition={{
        duration: duration.base,
        // Шаг строки, а не элемента списка: хроника — самый быстрый такт
        // страницы, на stagger.item она бы «переваливалась».
        delay: index * stagger.line,
        ease: ease.entrance,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Затемнение соседей живёт на внутреннем слое: motion.li уже
          анимирует opacity при появлении, и два источника на одном
          свойстве дрались бы за него. */}
      <div
        className="group flex flex-col sm:flex-row"
        style={{
          gap: 'var(--s-3)',
          columnGap: 'var(--s-8)',
          paddingBlock: 'var(--s-6)',
          opacity: dimmed ? 0.32 : 1,
          transition: 'opacity var(--d-base) var(--e-standard)',
        }}
      >
        {isLink ? (
          <a
            href={entry.href}
            target={entry.href!.startsWith('http') ? '_blank' : undefined}
            rel={entry.href!.startsWith('http') ? 'noreferrer' : undefined}
            className="flex flex-col sm:flex-row w-full"
            style={{ gap: 'var(--s-3)', columnGap: 'var(--s-8)' }}
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </motion.li>
  )
}

export default function ChronicleSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const pointerFine = useRef(false)

  useEffect(() => {
    pointerFine.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion()
  }, [])

  // Наведение регистрируем только там, где курсор действительно есть:
  // на тач-устройстве «hover» залипает после тапа и соседние строки
  // остаются погашенными навсегда.
  const handleHover = useCallback((i: number | null) => {
    if (!pointerFine.current) return
    setHovered(i)
  }, [])

  if (ENTRIES.length === 0) return null

  return (
    <section
      id="chronicle"
      className="relative section-pad grain"
      style={{ background: 'var(--surface)' }}
    >
      <div className="shell">
        {/*
          Шапка и список стоят в одной колонке 8/12 с общим левым краем.
          Разные стартовые колонки от секции к секции — главная причина,
          по которой длинная страница теряет ощущение порядка: вертикальной
          линии, вдоль которой она выстроена, просто не существует.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <header className="lg:col-span-8 mb-[var(--s-12)] md:mb-[var(--s-16)]">
            <Reveal y={12} className="mb-[var(--s-4)]">
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                {CHRONICLE_COPY.label}
              </span>
            </Reveal>

            {/* t-h3, а не t-h2: хроника — пульс между двумя крупными
                блоками, и заголовок в полный рост превратил бы её в
                самостоятельную главу. */}
            <h2
              className="t-h3"
              style={{ color: 'var(--text)', letterSpacing: 'var(--tr-h3)' }}
            >
              <SplitText text={CHRONICLE_COPY.title} by="word" />
            </h2>

            <Reveal delay={0.12} y={14} className="mt-[var(--s-6)] max-w-[46ch]">
              <p className="t-body" style={{ color: 'var(--text-muted)' }}>
                {CHRONICLE_COPY.subtitle}
              </p>
            </Reveal>
          </header>

          <ul className="lg:col-span-8" style={{ borderBottom: '1px solid var(--border)' }}>
            {ENTRIES.map((entry, i) => (
              <Row
                key={entry.iso + entry.text}
                entry={entry}
                index={i}
                dimmed={hovered !== null && hovered !== i}
                onHover={handleHover}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
