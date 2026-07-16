import { useState, type FormEvent } from 'react'
import { Send, ArrowUpRight, Github, Linkedin, Instagram, Mail } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import Workspace3DLazy from '../components/Workspace3DLazy'

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? 'founder@atlassecure.uk'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/novikovLDN', Icon: Github },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
]

const MARQUEE_TEXT = 'СОЗДАЁМ БУДУЩЕЕ'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Новая заявка от ${form.name || 'сайта'}`)
    const body = encodeURIComponent(
      `Имя: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="relative bg-[#0C0C0C] overflow-hidden">
      {/* ── 3D-стейдж во весь блок ─────────────────────────────── */}
      <div className="relative h-[78vh] min-h-[560px] w-full">
        <Workspace3DLazy className="absolute inset-0 w-full h-full" />

        {/* затемнение по краям для читаемости заголовка */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(12,12,12,0.65)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0C0C0C] to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Заголовок поверх сцены */}
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center text-center px-5 pt-16 sm:pt-20 md:pt-24 pointer-events-none">
          <FadeIn
            as="span"
            delay={0}
            y={20}
            className="text-xs text-[#9aa3af] uppercase tracking-[0.3em] mb-4"
          >
            Свяжитесь со мной
          </FadeIn>
          <FadeIn
            as="h2"
            delay={0.08}
            y={40}
            className="hero-heading font-bold uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
          >
            Создадим вместе
          </FadeIn>
        </div>

        {/* Подсказка внизу сцены */}
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center px-5 pointer-events-none">
          <span className="text-[#7c8494] text-[10px] sm:text-xs uppercase tracking-[0.25em]">
            наведите курсор — сцена откликается
          </span>
        </div>
      </div>

      {/* ── Форма на сплошном фоне ─────────────────────────────── */}
      <div className="relative z-10 px-5 sm:px-8 md:px-10 pt-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <FadeIn
            as="p"
            delay={0}
            y={20}
            className="text-[#c3cbd6] font-light max-w-xl mx-auto"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}
          >
            Расскажите про задачу — отвечу в течение суток и предложу, как её
            решить.
          </FadeIn>
        </div>

        {/* Форма */}
        <FadeIn delay={0} y={30} className="max-w-2xl mx-auto">
          {sent ? (
            <div className="rounded-3xl border border-[#D7E2EA]/20 bg-white/5 backdrop-blur-md p-10 text-center">
              <p className="accent-text font-bold text-2xl sm:text-3xl uppercase tracking-tight">
                Спасибо!
              </p>
              <p className="text-[#c3cbd6] font-light mt-3">
                Письмо открылось в вашей почте. Если нет — напишите на{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#D7E2EA]/15 bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-10 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#9aa3af]">
                    Имя
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Как к вам обращаться"
                    className="bg-[#0C0C0C]/60 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-[#D7E2EA] placeholder:text-[#5c636e] outline-none focus:border-[#B600A8] transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#9aa3af]">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="bg-[#0C0C0C]/60 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-[#D7E2EA] placeholder:text-[#5c636e] outline-none focus:border-[#B600A8] transition-colors"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-[#9aa3af]">
                  Сообщение
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Пара слов о проекте, сроках и бюджете"
                  className="bg-[#0C0C0C]/60 border border-[#D7E2EA]/15 rounded-xl px-4 py-3 text-[#D7E2EA] placeholder:text-[#5c636e] outline-none focus:border-[#B600A8] transition-colors resize-none"
                />
              </label>

              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 self-start rounded-full text-white font-medium uppercase tracking-widest px-8 py-3.5 text-sm transition-transform duration-200 hover:scale-[1.03]"
                style={{
                  background:
                    'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                  boxShadow:
                    '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                  outline: '2px solid #FFFFFF',
                  outlineOffset: '-3px',
                }}
              >
                Отправить
                <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </FadeIn>

        {/* Бегущая строка */}
        <div className="mt-20 sm:mt-24 md:mt-28 overflow-hidden">
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 2 }).map((_, blockIndex) => (
              <div key={blockIndex} className="flex shrink-0" aria-hidden={blockIndex === 1}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="hero-heading font-bold uppercase tracking-tight px-6 whitespace-nowrap"
                    style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
                  >
                    {MARQUEE_TEXT} •
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Футер */}
        <footer className="relative z-10 max-w-6xl mx-auto mt-16 md:mt-20 pb-8 md:pb-12 border-t border-[#1f1f1f] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 animate-soft-pulse" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[#c3cbd6] text-sm uppercase tracking-widest">
              Доступен для проектов
            </span>
          </div>

          <div className="flex items-center gap-5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="text-[#9aa3af] hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-1.5 text-[#c3cbd6] hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            {CONTACT_EMAIL}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </footer>

        <p className="relative z-10 text-center text-[#5c636e] text-xs pb-6">
          © {2026} Максим Новиков — 3D-креатор
        </p>
      </div>
    </section>
  )
}
