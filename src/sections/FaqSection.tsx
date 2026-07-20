/**
 * Вопросы.
 *
 * Роль секции — снять возражения до того, как они прозвучат. Главное из них
 * всегда одно: цена. Уходить от него — терять доверие ровно в тот момент,
 * когда клиент готов был спросить.
 *
 * Ритм относительно соседей: двухколоночная раскладка со «залипающим»
 * заголовком слева и списком справа. Процесс — одна колонка с таймлайном,
 * отзывы — сетка плоскостей, здесь — асимметричная пара. Три секции подряд
 * не читаются как один и тот же блок.
 *
 * ПОЧЕМУ РАСКРЫТИЕ СДЕЛАНО НА grid-template-rows: 0fr → 1fr
 * ─────────────────────────────────────────────────────────
 * height: auto анимировать нельзя — браузеру не к чему интерполировать.
 * Обходные пути и их цена:
 *  • max-height с запасом — рваная кривая: анимация «пролетает» пустоту,
 *    длительность перестаёт соответствовать реальной высоте;
 *  • измерение scrollHeight и height в px через JS — ломается при смене
 *    ширины, шрифта и зуме, требует ResizeObserver и всё равно даёт layout
 *    на каждый кадр;
 *  • grid-template-rows 0fr → 1fr — единственный вариант, который знает
 *    настоящую высоту, работает на любом контенте и не требует JS.
 * Layout здесь неизбежен по природе задачи — это осознанное исключение
 * из правила «только transform и opacity».
 *
 * ИСПРАВЛЕННЫЕ НАРУШЕНИЯ АУДИТА (.design-research/homepage-2026.md, разд. 3)
 * ────────────────────────────────────────────────────────────────────────
 *  №2  — на заголовке стоял кегль h3 при трекинге h2. Токены построены на
 *        обратной зависимости разрядки от кегля, и ручная подмена эту связь
 *        рвала. Инлайновый letterSpacing снят: класс .t-h3 уже несёт
 *        --tr-h3, дублировать его нечем.
 *  №6  — мера ответа больше не задаётся числом (62ch), а берётся от токена
 *        --max-w-text.
 *  №10 — раскладка приведена к общей: длинный контент span 7 от колонки 1,
 *        боковая колонка span 4 от колонки 9 — те же старты, что в
 *        AboutSection. Заголовок переехал в боковую колонку именно поэтому:
 *        он здесь подпись к списку (и по кеглю h3), а список — то, ради чего
 *        секция существует, значит основную колонку занимает список.
 *  Ещё: с секции снят overflow-hidden. Он делал ближайшим скроллпортом сам
 *  <section>, из-за чего lg:sticky у заголовка не залипал вообще — липкость
 *  была написана, но не работала.
 *  Длительность раскрытия взята из duration (motion.ts) вместо жёстких 450ms.
 *
 * ЧТО СОЗНАТЕЛЬНО НЕ СДЕЛАНО: пункт №9 отчёта (аккордеон → две открытые
 * колонки) — это смена формы подачи, а не исправление ошибки; отчёт сам
 * относит его в раздел «Новое». Механика раскрытия здесь корректна и
 * доступна, менять её без решения по содержанию нельзя.
 */

import { useState, useId } from 'react'
import { Plus } from 'lucide-react'
import { Reveal, SplitText } from '../design/primitives'
import { cssEase, duration, prefersReducedMotion } from '../design/motion'
import { FAQ } from '../data/content'

/** Мера ответа — от токена (нарушение №6), а не число по месту. */
const MEASURE_BODY = 'var(--max-w-text)'

type ItemProps = {
  q: string
  a: string
  index: number
  open: boolean
  onToggle: () => void
}

function FaqItem({ q, a, index, open, onToggle }: ItemProps) {
  // Стабильный уникальный id — нужен для связки aria-controls с панелью.
  // useId вместо счётчика: иначе два экземпляра секции дали бы дубли id.
  const uid = useId()
  const panelId = `faq-panel-${uid}`
  const buttonId = `faq-button-${uid}`
  const reduce = prefersReducedMotion()

  // Длительность из motion.ts, а не число по месту (были жёсткие 450ms).
  // duration.base, а не slow: действие повторяемое — по разбору Ковальского
  // такие места сокращают движение, а не удлиняют.
  const motionMs = reduce ? '1ms' : `${duration.base * 1000}ms`

  return (
    <li className="border-b" style={{ borderColor: 'var(--border)' }}>
      {/* Reveal внутри <li>, а не снаружи: список должен остаться списком
          для скринридера — обёртка-div между ul и li ломает семантику. */}
      <Reveal delay={index * 0.05} y={18}>
      {/* Настоящий <button>: получает фокус, реагирует на Enter/Space и
          читается скринридером как раскрывающийся элемент. div с onClick
          не даёт ничего из этого. */}
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group w-full flex items-start gap-5 sm:gap-8 text-left"
        style={{ paddingBlock: 'var(--s-6)', color: 'var(--text)' }}
      >
        <span
          aria-hidden
          className="t-mono shrink-0"
          style={{
            color: open ? 'var(--a)' : 'var(--text-faint)',
            transition: `color var(--d-fast) var(--e-standard)`,
            paddingTop: '0.45em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className="t-h3 flex-1"
          style={{
            color: open ? 'var(--text)' : 'var(--n-800)',
            transition: `color var(--d-fast) var(--e-standard)`,
          }}
        >
          {q}
        </span>

        {/* Плюс поворачивается в крестик. Rotate — transform, значит
            композитор; смена иконки по состоянию дала бы перерисовку. */}
        <span
          aria-hidden
          className="shrink-0 inline-flex items-center justify-center rounded-full border"
          style={{
            width: 'var(--s-8)',
            height: 'var(--s-8)',
            marginTop: '0.15em',
            borderColor: open ? 'var(--a)' : 'var(--border-strong)',
            color: open ? 'var(--a)' : 'var(--text-muted)',
            transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
            transition: `transform ${motionMs} ${cssEase.standard}, border-color var(--d-fast) var(--e-standard), color var(--d-fast) var(--e-standard)`,
            willChange: 'transform',
          }}
        >
          <Plus size={16} />
        </span>
      </button>

      {/* Внешний грид — единственное, что анимируется по высоте.
          Внутренний слой обязан быть overflow: hidden, иначе текст
          вылезет за пределы схлопнутой строки. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: `grid-template-rows ${motionMs} ${cssEase.standard}`,
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* Прозрачность гасится чуть быстрее высоты — иначе на закрытии
              текст «срезается» на глазах вместо того, чтобы уйти. */}
          <div
            className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity ${motionMs} ${cssEase.standard}`,
              paddingBottom: 'var(--s-8)',
            }}
          >
            {/* Пустая колонка выравнивает ответ по левому краю вопроса. */}
            <span aria-hidden className="t-mono invisible">
              00
            </span>
            <p className="t-body" style={{ color: 'var(--text-muted)', maxWidth: MEASURE_BODY }}>
              {a}
            </p>
          </div>
        </div>
      </div>
      </Reveal>
    </li>
  )
}

export default function FaqSection() {
  // Один открытый пункт за раз: аккордеон, где раскрыто всё, перестаёт быть
  // инструментом сканирования и превращается в простыню текста.
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    // overflow-hidden снят намеренно: он превращал секцию в собственный
    // скроллпорт и полностью отключал lg:sticky у заголовка ниже.
    <section
      id="faq"
      className="relative grain section-pad"
      style={{ background: 'var(--surface)' }}
    >
      <div className="shell relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-8">
        {/* ── Заголовок ───────────────────────────────────────────────
            Стоит в боковой колонке (span 4 от колонки 9) — той же, что
            держит мету в AboutSection. Это и есть общая раскладка страницы
            (нарушение №10): длинный контент всегда слева от колонки 1,
            короткая сопроводительная материя всегда справа от колонки 9.
            В DOM заголовок идёт первым, поэтому на мобильном он читается
            до списка; на десктопе его ставит на место явный col/row-start,
            а не порядок разметки.

            Липкий на десктопе: пока читаются ответы, контекст секции
            остаётся в кадре. На мобильном sticky отключён — там он бы
            съедал и без того дефицитную высоту экрана. */}
        <header
          className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:sticky lg:self-start"
          style={{ top: 'var(--s-24)' }}
        >
          <Reveal y={16}>
            <span className="t-mono" style={{ color: 'var(--a)' }}>
              {FAQ.label}
            </span>
          </Reveal>
          {/* Кегль t-h3, а не t-h2: заголовок стоит в колонке 4/12 (~400px),
              и шкала h2 (до 96px) там физически не помещается — длинные слова
              вылезали в соседнюю колонку и наезжали на список вопросов.
              Размер подчинён ширине контейнера, а не желанию сделать крупнее.
              Трекинг не переопределяется (нарушение №2): .t-h3 несёт --tr-h3,
              и связь «крупнее кегль — плотнее разрядка» остаётся системной. */}
          <h2
            className="t-h3 optical-left mt-5"
            style={{ color: 'var(--text)', fontWeight: 700 }}
          >
            <SplitText text={FAQ.title} by="word" />
          </h2>
        </header>

        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <ul className="border-t" style={{ borderColor: 'var(--border)' }}>
            {FAQ.items.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
