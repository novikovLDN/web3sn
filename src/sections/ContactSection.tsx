/**
 * Финальная секция: контакт и футер. Кульминация страницы.
 *
 * Драматургия длинной страницы требует, чтобы последнее, что человек видит,
 * было самым крупным. Поэтому здесь три решения.
 *
 * 1. Полный вьюпорт. Контактный блок занимает 100svh и ничем не делится с
 *    соседями. Экран, отданный под одно действие, — это самый прямой способ
 *    сказать, что за место здесь не борются.
 *
 * 2. Почта — главный типографический объект секции, а не строчка под формой.
 *    Она набрана по верхней ступени шкалы и разбита по «@» на две строки:
 *    так адрес читается как заголовок, а не как поле данных, и при этом
 *    помещается на 390px без переносов посреди слова.
 *
 * 3. Мини-игра осталась, но перестала быть препятствием. Раньше она стояла
 *    полосой во всю ширину сразу после формы и разрывала кульминацию своим
 *    весом. Теперь это прогрессивное раскрытие: одна строка и глагол, сцена
 *    монтируется только по клику. Раскрытие инициирует пользователь — то же
 *    правило, по которому здесь живут все остальные подсказки.
 *
 * Уведомлений на секции ровно два, и оба — подтверждение уже совершённого
 * действия: «Скопировано» после копирования адреса и состояние отправки
 * формы. Ничего, инициированного сайтом, здесь нет и быть не должно.
 */

import { useMemo, useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import { Reveal, SplitText } from '../design/primitives'
import { ease, duration, prefersReducedMotion } from '../design/motion'
import {
  AuthorNote,
  CursorNote,
  DrawnRule,
  Ephemeral,
  Kbd,
  LiveTime,
  dimmed,
  useCopy,
  useFinePointer,
  useHotkey,
  useOnceHint,
} from '../components/Hints'
import { HERO, CONTACT, IDENTITY } from '../data/content'
import GameLazy from '../island/GameLazy'

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? IDENTITY.email

/** Только адреса, которые реально существуют. Заглушек здесь быть не может. */
const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/novikovLDN', Icon: Github },
  { label: 'Почта', href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
]

/**
 * Вилки бюджета.
 *
 * Квалификация бюджетом прямо в форме — приём премиальных студий. Он делает
 * работу прайс-страницы без прайс-страницы: отсеивает до разговора и при этом
 * повышает статус, потому что вопрос задаёт автор, а не клиент.
 *
 * Подано вилками, а не полем для суммы: точную цифру на этом этапе никто не
 * знает, а строгий ввод превращает тактичный вопрос в допрос. Последний
 * вариант оставлен намеренно — без него форма стала бы фильтром на входе,
 * а она должна быть вопросом.
 *
 * ЗАМЕТКА: вилки стоит перенести в data/content.ts и подтвердить с автором —
 * здесь они локальные только потому, что тот файл сейчас правят параллельно.
 */
const BUDGETS = ['до £10k', '£10–25k', '£25–60k', '£60k+', 'Ещё не считали'] as const

// ── Валидация ─────────────────────────────────────────────────────────
// Намеренно мягкая: задача проверки — поймать опечатку, а не отфильтровать
// пользователя. Каждое сообщение говорит, что сделать, а не что не так.

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Record<Field, string>): Errors {
  const e: Errors = {}
  if (values.name.trim().length < 2) e.name = 'Напишите, как к вам обращаться'
  if (!EMAIL_RE.test(values.email.trim())) e.email = 'Проверьте адрес — на него придёт ответ'
  if (values.message.trim().length < 12) e.message = 'Пары предложений о задаче будет достаточно'
  return e
}

// ── Поле формы ────────────────────────────────────────────────────────

type FieldProps = {
  id: Field
  label: string
  placeholder: string
  value: string
  error?: string
  /** Поле было покинуто — до этого момента ошибку не показываем. */
  touched: boolean
  multiline?: boolean
  type?: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (id: Field) => void
}

/**
 * Подсветка активного поля — не смена border-color (это paint по всей рамке),
 * а линия под полем, растущая по scaleX на своём слое. Тот же приём, что у
 * навигационных ссылок: движение читается как прочерк, а не как подсветка.
 */
function FormField({
  id,
  label,
  placeholder,
  value,
  error,
  touched,
  multiline,
  type = 'text',
  onChange,
  onBlur,
}: FieldProps) {
  const show = touched && !!error
  const shared = {
    id,
    name: id,
    value,
    placeholder,
    onChange,
    onBlur: () => onBlur(id),
    'aria-invalid': show || undefined,
    'aria-describedby': show ? `${id}-error` : undefined,
    className: 'w-full bg-transparent outline-none t-body',
    style: {
      color: 'var(--text)',
      paddingBlock: 'var(--s-3)',
      // Плейсхолдер и текст живут на одной сетке — без скачка при вводе.
      resize: 'none' as const,
    },
  }

  return (
    <div className="relative flex flex-col">
      <label
        htmlFor={id}
        className="t-mono"
        style={{ color: show ? 'var(--a)' : 'var(--text-faint)' }}
      >
        {label}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={4} />
        ) : (
          <input {...shared} type={type} autoComplete={id === 'email' ? 'email' : 'name'} />
        )}

        {/* Статичная линия основания. */}
        <span
          aria-hidden
          className="absolute left-0 right-0 bottom-0"
          style={{ height: 1, background: show ? 'var(--a-32)' : 'var(--border)' }}
        />
        {/* Активная линия. Всегда в DOM, управляется только scaleX. */}
        <span
          aria-hidden
          className="absolute left-0 right-0 bottom-0 origin-left field-underline"
          style={{ height: 1, background: 'var(--a)' }}
        />
      </div>

      {/* Место под ошибку зарезервировано всегда — иначе появление текста
          сдвигает соседние поля и форма «прыгает» под руками. */}
      <span
        id={`${id}-error`}
        className="t-mono"
        style={{
          color: 'var(--a)',
          minHeight: 'var(--s-4)',
          marginTop: 'var(--s-2)',
          opacity: show ? 1 : 0,
          transition: 'opacity var(--d-fast) var(--e-standard)',
        }}
      >
        {error ?? ''}
      </span>
    </div>
  )
}

// ── Секция ────────────────────────────────────────────────────────────

export default function ContactSection() {
  const reduce = prefersReducedMotion()
  // Год не может быть константой: захардкоженная дата протухает молча.
  const year = useMemo(() => new Date().getFullYear(), [])

  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    message: '',
  })
  const [budget, setBudget] = useState<string>('')
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [island, setIsland] = useState(false)

  // ── Копирование адреса и клавиша ────────────────────────────────────
  // Единственный шорткат на главной. Он не заменяет ничего кликабельного —
  // он просто быстрее, и в этом всё сообщение: сайт сделан человеком,
  // который пользуется клавиатурой.
  const { copied, copy } = useCopy()
  const fine = useFinePointer()
  const keyHint = useOnceHint('contact.copy-key')

  useHotkey('c', () => {
    copy(CONTACT_EMAIL)
    // Клавиша представлена один раз: после первого использования подсказка
    // уходит навсегда. Инструмент, который продолжает объяснять себя, —
    // это уже онбординг.
    keyHint.retire()
  })

  // Адрес как типографический объект: разрыв по «@» — единственное место,
  // где почту можно перенести, не сломав её чтение.
  const [mailLocal, mailDomain] = useMemo(() => {
    const at = CONTACT_EMAIL.indexOf('@')
    return at < 0 ? [CONTACT_EMAIL, ''] : [CONTACT_EMAIL.slice(0, at + 1), CONTACT_EMAIL.slice(at + 1)]
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const id = e.target.name as Field
    const next = { ...values, [id]: e.target.value }
    setValues(next)
    // Пока поле не покинуто, ошибку не показываем; но если она уже показана —
    // гасим её сразу, как только ввод стал валидным. Иначе форма выглядит
    // так, будто она не замечает, что человек уже всё исправил.
    if (touched[id]) setErrors(validate(next))
  }

  const handleBlur = (id: Field) => {
    setTouched((t) => ({ ...t, [id]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(found).length > 0) {
      // Фокус на первое проблемное поле — иначе на длинной форме
      // пользователь не понимает, куда смотреть.
      const first = (['name', 'email', 'message'] as Field[]).find((f) => found[f])
      if (first) document.getElementById(first)?.focus()
      return
    }

    const subject = encodeURIComponent(`Проект — ${values.name.trim()}`)
    const body = encodeURIComponent(
      `Имя: ${values.name.trim()}\nEmail: ${values.email.trim()}\n` +
        // Бюджет не обязателен: если человек его не выбрал, строки в письме
        // просто нет — пустое поле в письме выглядит как незаполненная анкета.
        (budget ? `Бюджет: ${budget}\n` : '') +
        `\n${values.message.trim()}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const invalidCount = Object.keys(errors).filter((k) => touched[k as Field]).length

  return (
    <section id="contact" className="relative overflow-hidden grain" style={{ background: 'var(--surface)' }}>
      {/* Подпись у курсора живёт только внутри этой секции. */}
      <CursorNote scope="#contact" />

      {/* ── Кульминация: полный вьюпорт ─────────────────────────────── */}
      <div
        className="shell flex flex-col"
        style={{
          // svh, а не vh: на мобильных адресная строка меняет высоту окна,
          // и на vh секция дёргается при каждой прокрутке.
          minHeight: '100svh',
          paddingBlock: 'var(--s-24)',
          gap: 'var(--s-16)',
        }}
      >
        {/* Верхняя строка: лейбл и живые данные.
            Время и координаты — четвёртый канал секции. Это факт о мире,
            а не утверждение о себе: он ничего не обещает и не протухает. */}
        <Reveal y={12} className="flex flex-wrap items-baseline justify-between" style={{ gap: 'var(--s-4)' }}>
          <span className="t-mono" style={{ color: 'var(--a)' }}>
            {CONTACT.label}
          </span>
          <LiveTime />
        </Reveal>

        {/* Центр: адрес. Главный типографический объект секции. */}
        <div className="flex flex-col" style={{ gap: 'var(--s-6)' }}>
          <h2 className="t-h3" style={{ color: 'var(--text-muted)' }}>
            <SplitText text={CONTACT.title} by="word" />
          </h2>

          <Reveal delay={0.1} y={20} className="flex flex-col" style={{ gap: 'var(--s-4)' }}>
            {/*
              Кнопка, а не ссылка: действие здесь — копирование, а не переход.
              Ссылка, ведущая в почтовый клиент, стоит отдельной строкой ниже,
              потому что это другое действие и оно не должно быть случайным.
            */}
            <button
              type="button"
              onClick={() => copy(CONTACT_EMAIL)}
              data-cursor-note="Скопировать"
              aria-label={`Скопировать адрес ${CONTACT_EMAIL}`}
              className="mail optical-left text-left self-start"
              style={{ color: 'var(--text)' }}
            >
              <span style={{ display: 'block' }}>{mailLocal}</span>
              {mailDomain && <span style={{ display: 'block' }}>{mailDomain}</span>}
            </button>

            {/* Прочерк под адресом: акцент линией, а не заливкой. Растёт по
                scaleX от левого края — читается как жест, а не как рамка. */}
            <DrawnRule color="var(--a-32)" />

            <div className="flex flex-wrap items-center" style={{ gap: 'var(--s-6)' }}>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="nav-link t-mono inline-flex items-center"
                style={{ gap: 'var(--s-2)' }}
                data-cursor-note="Откроет почтовый клиент"
              >
                Написать письмом
                <ArrowUpRight size={14} aria-hidden style={{ color: 'var(--a)' }} />
              </a>
              {/* Единственное уведомление, инициированное пользователем.
                  Без рамки, без иконки, без крестика: подтверждение, которое
                  надо закрывать, — это уже диалог. */}
              <Ephemeral on={copied}>Скопировано</Ephemeral>
            </div>

            {/* Однократное объявление клавиши. На тач-устройствах не
                показывается вовсе: подсказка к устройству ввода, которого
                у человека нет, — это шум. */}
            {fine && keyHint.visible && (
              <p className="t-body" style={{ color: 'var(--text-faint)', maxWidth: '46ch' }}>
                (Адрес копируется клавишей <Kbd>C</Kbd> — быстрее, чем выделять мышью.)
              </p>
            )}
          </Reveal>
        </div>

        {/* Низ: условия и форма. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12" style={{ marginTop: 'auto' }}>
          <div className="lg:col-span-5 flex flex-col" style={{ gap: 'var(--s-6)' }}>
            <Reveal delay={0.15} y={20}>
              <p className="t-body" style={{ color: 'var(--text-muted)', maxWidth: '42ch' }}>
                {CONTACT.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.2} y={16}>
              <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
                {IDENTITY.location}
              </span>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1} y={24}>
              {sent ? (
                /* Успех не «спасибо!», а инструкция: письмо ещё не отправлено,
                   оно открылось в почтовом клиенте. Врать об этом нельзя. */
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.slow, ease: ease.entrance }}
                  role="status"
                  aria-live="polite"
                  className="flex flex-col"
                  style={{
                    gap: 'var(--s-4)',
                    padding: 'var(--s-8)',
                    borderRadius: 'var(--r-lg)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--surface-raised)',
                  }}
                >
                  <span className="t-mono" style={{ color: 'var(--a)' }}>
                    Письмо готово
                  </span>
                  <p className="t-body" style={{ color: 'var(--text)' }}>
                    Оно открылось в вашем почтовом клиенте — осталось нажать «Отправить».
                  </p>
                  <p className="t-body" style={{ color: 'var(--text-muted)' }}>
                    Если клиент не открылся, напишите напрямую на{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--a)' }}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <div style={{ marginTop: 'var(--s-2)' }}>
                    <Button variant="ghost" onClick={() => setSent(false)}>
                      Написать ещё раз
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--s-8)' }}>
                    <FormField
                      id="name"
                      label="Имя"
                      placeholder="Как к вам обращаться"
                      value={values.name}
                      error={errors.name}
                      touched={!!touched.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormField
                      id="email"
                      label="Почта"
                      type="email"
                      placeholder="you@company.com"
                      value={values.email}
                      error={errors.email}
                      touched={!!touched.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div style={{ marginTop: 'var(--s-4)' }}>
                    <FormField
                      id="message"
                      label="Задача"
                      placeholder="Что нужно сделать и к какому сроку"
                      value={values.message}
                      error={errors.message}
                      touched={!!touched.message}
                      multiline
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* ── Бюджет ─────────────────────────────────────────
                      Радиогруппа, а не select: пять вариантов, которые видно
                      целиком, отвечают на вопрос быстрее, чем список, который
                      надо открыть. Выбранный не подсвечивается цветом —
                      гаснут невыбранные. Тот же приём фокуса прозрачностью,
                      что и на активной строке практик: он не добавляет в
                      палитру ни одного цвета и не двигает текст. */}
                  <fieldset style={{ marginTop: 'var(--s-8)' }}>
                    <legend className="t-mono" style={{ color: 'var(--text-faint)' }}>
                      Бюджет
                    </legend>
                    <div
                      className="flex flex-wrap"
                      style={{ gap: 'var(--s-2)', marginTop: 'var(--s-4)' }}
                    >
                      {BUDGETS.map((b) => {
                        const active = budget === b
                        return (
                          <label
                            key={b}
                            className="t-mono budget-chip"
                            style={{
                              ...dimmed(active || budget === ''),
                              color: active ? 'var(--a)' : 'var(--text-muted)',
                              border: `1px solid ${active ? 'var(--a-32)' : 'var(--border)'}`,
                              borderRadius: 'var(--r-full)',
                              padding: 'var(--s-3) var(--s-6)',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="radio"
                              name="budget"
                              value={b}
                              checked={active}
                              onChange={() => setBudget(b)}
                              className="sr-only"
                            />
                            {b}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  {/* Сводка для скринридера: отдельные ошибки полей он озвучит
                      при фокусе, но общее состояние формы после submit должно
                      быть объявлено один раз и вслух. */}
                  <span aria-live="polite" className="sr-only">
                    {invalidCount > 0
                      ? `Форма не отправлена: незаполненных или неверных полей — ${invalidCount}.`
                      : ''}
                  </span>

                  <div
                    className="flex flex-col sm:flex-row sm:items-center"
                    style={{ marginTop: 'var(--s-8)', gap: 'var(--s-6)' }}
                  >
                    <Button variant="primary" icon={<ArrowUpRight size={15} />}>
                      Отправить
                    </Button>
                    <p className="t-mono" style={{ color: 'var(--text-faint)', maxWidth: '38ch', lineHeight: 1.7 }}>
                      {CONTACT.formNote}
                    </p>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Остров: прогрессивное раскрытие ─────────────────────────────
          Сцена больше не занимает полосу во всю ширину сразу после формы:
          там она перебивала кульминацию собственным весом. Осталась строка,
          глагол и авторская ремарка — сцена монтируется по действию
          пользователя, и до этого момента ничего не грузится. */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="shell" style={{ paddingBlock: 'var(--s-16)' }}>
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between"
            style={{ gap: 'var(--s-6)' }}
          >
            <div className="flex flex-col" style={{ gap: 'var(--s-3)' }}>
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                Пока вы здесь
              </span>
              <p className="t-h3" style={{ color: 'var(--text)' }}>
                Остров
              </p>
              {/* Инструкция голосом автора, а не голосом справки: это
                  утверждение о работе, а не просьба к пользователю. */}
              <AuthorNote>
                Небольшая 3D-сцена, собранная здесь же. Грузить её просто за прокрутку было бы
                неуважением к вашему трафику — поэтому она ждёт вашего слова
              </AuthorNote>
            </div>

            <button
              type="button"
              onClick={() => setIsland((v) => !v)}
              aria-expanded={island}
              aria-controls="island-panel"
              data-cursor-note={island ? 'Свернуть сцену' : 'Загрузит ~несколько МБ'}
              className="nav-link t-mono self-start md:self-auto"
            >
              {island ? 'Свернуть' : 'Открыть остров'}
            </button>
          </div>

          {/* Панель монтируется только после клика: до этого ни канваса,
              ни загрузки чанка three.js. */}
          {island && (
            <div
              id="island-panel"
              className="relative w-full overflow-hidden island-panel"
              style={{
                marginTop: 'var(--s-8)',
                borderRadius: 'var(--r-2xl)',
                border: '1px solid var(--border)',
                // Высота через aspect-ratio, а не vh: на мобильных vh скачет
                // вместе с адресной строкой и роняет вёрстку.
                aspectRatio: '16 / 10',
                maxHeight: '70vh',
              }}
            >
              <GameLazy className="absolute inset-0 w-full h-full" />
            </div>
          )}
        </div>
      </div>

      {/* ── Футер ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="shell flex flex-col md:flex-row md:items-center md:justify-between"
          style={{ paddingBlock: 'var(--s-8)', gap: 'var(--s-6)' }}
        >
          {/* Здесь был пульсирующий индикатор «принимаю проекты с марта».
              Убран вместе с датой: датированная доступность сообщает, что
              слоты есть и вопрос лишь в календаре. Нужно обратное — что отбор
              структурный, а не временный. */}
          <p className="t-body" style={{ color: 'var(--text-muted)', maxWidth: '46ch' }}>
            {HERO.selectivity}
          </p>

          <div className="flex items-center" style={{ gap: 'var(--s-6)' }}>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="inline-flex items-center nav-link t-mono"
                style={{ gap: 'var(--s-2)' }}
              >
                <Icon size={15} aria-hidden />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div
          className="shell flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{
            paddingBlock: 'var(--s-6)',
            gap: 'var(--s-3)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
            © {year} {IDENTITY.name}
          </span>
          <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
            {IDENTITY.role}
          </span>
        </div>
      </footer>

      {/*
        Локальные стили секции. Держим здесь, а не в index.css: они описывают
        поведение только этих элементов, и в глобальном файле были бы мусором.
        Анимируется исключительно scaleX и opacity — рамка не перерисовывается.
      */}
      <style>{`
        /* Адрес. Кегль берётся из шкалы: на узком экране — ступень h2,
           с 768px — верхняя ступень h1. Разбитый по «@» адрес на 390px
           умещается в две строки без переноса внутри слова.
           Интерлиньяж 0.95 (--lh-tight), а не 0.88: ниже 0.88 срезаются
           «й» и «ё», и хотя в латинском адресе их нет, шкала на сайте
           одна и исключений в ней быть не должно. */
        #contact .mail {
          font-size: var(--t-h2);
          line-height: var(--lh-tight);
          letter-spacing: var(--tr-h2);
          font-weight: 700;
          overflow-wrap: anywhere;
        }
        @media (min-width: 768px) {
          #contact .mail {
            font-size: var(--t-h1);
            letter-spacing: var(--tr-h1);
          }
        }
        /* Нажатие отзывается сдвигом на композиторе, а не сменой цвета. */
        #contact .mail:active { transform: translateY(1px); }

        #contact .field-underline {
          transform: scaleX(0);
          transition: transform var(--d-base) var(--e-standard);
        }
        #contact input:focus ~ .field-underline,
        #contact textarea:focus ~ .field-underline {
          transform: scaleX(1);
        }
        #contact input::placeholder,
        #contact textarea::placeholder {
          color: var(--text-faint);
        }
        /* Клавиатурный фокус на вилке бюджета: сам input визуально скрыт,
           поэтому кольцо рисует подпись. Без этого группа непроходима
           с клавиатуры — а она обязана быть проходимой. */
        #contact .budget-chip:focus-within {
          outline: 1px solid var(--a);
          outline-offset: 2px;
        }
        #contact .island-panel {
          animation: contact-panel-in var(--d-slow) var(--e-entrance) both;
        }
        @keyframes contact-panel-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          #contact .field-underline { transition-duration: 1ms; }
          #contact .island-panel { animation-duration: 1ms; }
        }
      `}</style>
    </section>
  )
}
