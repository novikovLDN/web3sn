/**
 * Финальная секция: контакт и футер.
 *
 * Главное решение — порядок блоков.
 *
 * Было: заголовок → 3D мини-игра во всю ширину → форма. Игра вставала ровно
 * между «я решил написать» и «поле, куда написать». Любая пауза в этом месте
 * стоит заявки: посетитель, дошедший до контакта, уже принял решение, и
 * задерживать его — значит торговать конверсией за эффект.
 *
 * Стало: заголовок → форма → отдельная полоса с игрой → футер.
 * Игра никуда не делась, но переехала за форму и получила честную подпись:
 * теперь она не препятствие на пути, а награда после действия — то, что
 * человек открывает, когда основное дело уже сделано. Дополнительно это
 * снимает риск, что тяжёлая сцена подгружается ровно в тот момент, когда
 * пользователь печатает: IntersectionObserver внутри GameLazy сработает
 * ниже по странице, а не под формой.
 *
 * Второе решение — мёртвые ссылки. LinkedIn и Instagram стояли с href="#".
 * Ссылка, которая никуда не ведёт, читается как незаконченная работа и
 * обесценивает соседние настоящие. Удалены: остались GitHub и почта.
 */

import { useMemo, useState, type FormEvent, type ChangeEvent } from 'react'
import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import { Reveal, SplitText } from '../design/primitives'
import { ease, duration, prefersReducedMotion } from '../design/motion'
import { HERO, CONTACT, IDENTITY } from '../data/content'
import GameLazy from '../island/GameLazy'

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? IDENTITY.email

/** Только адреса, которые реально существуют. Заглушек здесь быть не может. */
const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/novikovLDN', Icon: Github },
  { label: 'Почта', href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
]

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
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

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
      `Имя: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const invalidCount = Object.keys(errors).filter((k) => touched[k as Field]).length

  return (
    <section id="contact" className="relative overflow-hidden grain" style={{ background: 'var(--surface)' }}>
      {/* ── Заголовок и форма ───────────────────────────────────────── */}
      <div className="shell section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">
          {/* Левая колонка: заявление и условия. */}
          <div className="lg:col-span-5">
            <Reveal y={12}>
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                {CONTACT.label}
              </span>
            </Reveal>

            <h2
              className="t-h2 optical-left"
              style={{ color: 'var(--text)', marginBlock: 'var(--s-6)' }}
            >
              <SplitText text={CONTACT.title} by="word" />
            </h2>

            <Reveal delay={0.15} y={20}>
              <p className="t-body" style={{ color: 'var(--text-muted)', maxWidth: '42ch' }}>
                {CONTACT.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.25} y={16} className="flex flex-col" style={{ marginTop: 'var(--s-12)', gap: 'var(--s-4)' }}>
              {/* Прямая почта рядом с формой: часть людей никогда не заполнит
                  форму и уйдёт, если альтернативы не видно. */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-2 self-start"
                style={{ color: 'var(--text)' }}
              >
                <span className="t-body">{CONTACT_EMAIL}</span>
                <ArrowUpRight size={16} style={{ color: 'var(--a)' }} />
              </a>
              <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
                {IDENTITY.location}
              </span>
            </Reveal>
          </div>

          {/* Правая колонка: форма. */}
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
                      placeholder="Что нужно сделать, к какому сроку и в каком бюджете"
                      value={values.message}
                      error={errors.message}
                      touched={!!touched.message}
                      multiline
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Сводка для скринридера: отдельные ошибки полей он озвучит
                      при фокусе, но общее состояние формы после submit должно
                      быть объявлено один раз и вслух. */}
                  <span
                    aria-live="polite"
                    className="sr-only"
                  >
                    {invalidCount > 0
                      ? `Форма не отправлена: незаполненных или неверных полей — ${invalidCount}.`
                      : ''}
                  </span>

                  <div
                    className="flex flex-col sm:flex-row sm:items-center"
                    style={{ marginTop: 'var(--s-6)', gap: 'var(--s-6)' }}
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

      {/* ── Полоса с мини-игрой ─────────────────────────────────────────
          Отдельная лента после формы, со своим фоном и честной подписью.
          Это не «фича продукта» и не кейс — это то, что человек делает
          руками, чтобы понять, как здесь относятся к деталям. */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="shell" style={{ paddingBlock: 'var(--s-16)' }}>
          <Reveal y={16} className="flex flex-col sm:flex-row sm:items-end sm:justify-between" >
            <div>
              <span className="t-mono" style={{ color: 'var(--a)' }}>
                Пока вы здесь
              </span>
              <p className="t-h3" style={{ color: 'var(--text)', marginTop: 'var(--s-3)' }}>
                Остров
              </p>
            </div>
            <p
              className="t-body"
              style={{ color: 'var(--text-muted)', maxWidth: '46ch', marginTop: 'var(--s-4)' }}
            >
              Небольшая 3D-сцена, собранная здесь же. Запускается по кнопке — грузить её
              просто за прокрутку было бы неуважением к вашему трафику.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            y={24}
            className="relative w-full overflow-hidden"
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
          </Reveal>
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
              структурный, а не временный. Плюс дату пришлось бы обновлять
              руками, а забытая дата хуже отсутствующей. */}
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
        поведение только этих полей, и в глобальном файле были бы мусором.
        Анимируется исключительно scaleX — рамка не перерисовывается.
      */}
      <style>{`
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
        @media (prefers-reduced-motion: reduce) {
          #contact .field-underline { transition-duration: 1ms; }
        }
      `}</style>
    </section>
  )
}
