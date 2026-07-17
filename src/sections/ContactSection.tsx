import { useState, type FormEvent } from 'react'
import { Send, ArrowUpRight, Github, Linkedin, Instagram, Mail } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import GameLazy from '../island/GameLazy'

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? 'founder@atlassecure.uk'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/novikovLDN', Icon: Github },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
]

const MARQUEE_TEXT = 'Давайте создадим что-то невероятное'

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
    <section id="contact" className="relative bg-[#0c0b0a] overflow-hidden">
      {/* ── Заголовок ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center px-5 pt-20 sm:pt-24 md:pt-28 pb-8">
        <FadeIn
          as="span"
          delay={0}
          y={20}
          className="text-xs text-[#a7a196] uppercase tracking-[0.3em] mb-4"
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

      {/* ── Мини-игра во весь блок ──────────────────────────────── */}
      <div className="relative w-full px-3 sm:px-6 md:px-10">
        <div className="relative mx-auto max-w-[1400px] h-[70vh] min-h-[520px] w-full overflow-hidden rounded-3xl border border-[#ece7db]/10">
          <GameLazy className="absolute inset-0 w-full h-full" />
        </div>
      </div>

      {/* ── Форма на сплошном фоне ─────────────────────────────── */}
      <div className="relative z-10 px-5 sm:px-8 md:px-10 pt-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <FadeIn
            as="p"
            delay={0}
            y={20}
            className="text-[#a7a196] font-light max-w-xl mx-auto"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}
          >
            Расскажите про задачу — отвечу в течение суток и предложу, как её
            решить.
          </FadeIn>
        </div>

        {/* Форма */}
        <FadeIn delay={0} y={30} className="max-w-2xl mx-auto">
          {sent ? (
            <div className="rounded-3xl border border-[#ece7db]/20 bg-white/5 backdrop-blur-md p-10 text-center">
              <p className="accent-text font-bold text-2xl sm:text-3xl uppercase tracking-tight">
                Спасибо!
              </p>
              <p className="text-[#a7a196] font-light mt-3">
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
              className="rounded-3xl border border-[#ece7db]/15 bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-10 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#a7a196]">
                    Имя
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Как к вам обращаться"
                    className="bg-[#0c0b0a]/60 border border-[#ece7db]/15 rounded-xl px-4 py-3 text-[#ece7db] placeholder:text-[#6b665c] outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#a7a196]">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="bg-[#0c0b0a]/60 border border-[#ece7db]/15 rounded-xl px-4 py-3 text-[#ece7db] placeholder:text-[#6b665c] outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-[#a7a196]">
                  Сообщение
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Пара слов о проекте, сроках и бюджете"
                  className="bg-[#0c0b0a]/60 border border-[#ece7db]/15 rounded-xl px-4 py-3 text-[#ece7db] placeholder:text-[#6b665c] outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
              </label>

              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 self-start rounded-full font-medium uppercase tracking-widest px-8 py-3.5 text-sm transition-transform duration-200 hover:scale-[1.03]"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--ink)',
                  boxShadow: '0px 6px 20px -6px rgba(239,74,35,0.6)',
                }}
              >
                Отправить
                <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </FadeIn>

        {/* Бегущая строка на всю ширину экрана (уходит ровно за край) */}
        <div className="mt-20 sm:mt-24 md:mt-28 overflow-hidden py-4 md:py-6 -mx-5 sm:-mx-8 md:-mx-10">
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 2 }).map((_, blockIndex) => (
              <div key={blockIndex} className="flex shrink-0" aria-hidden={blockIndex === 1}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className="hero-heading font-bold uppercase tracking-tight px-6 whitespace-nowrap inline-flex items-center gap-6"
                    style={{ fontSize: 'clamp(2rem, 6vw, 4.25rem)', lineHeight: 1.15 }}
                  >
                    {MARQUEE_TEXT}
                    <span style={{ color: 'var(--accent)' }}>✦</span>
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
            <span className="text-[#a7a196] text-sm uppercase tracking-widest">
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
                className="text-[#a7a196] hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-1.5 text-[#a7a196] hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            {CONTACT_EMAIL}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </footer>

        <p className="relative z-10 text-center text-[#6b665c] text-xs pb-6">
          © {2026} NOVIKOV. — 3D-креатор
        </p>
      </div>
    </section>
  )
}
