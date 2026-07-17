import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'О себе', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

/** Элегантный плавно-морфящийся градиентный «блоб» под именем. */
function HeroMark() {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] flex items-center justify-center animate-float-y">
      {/* мягкое внешнее свечение */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(239,74,35,0.30), transparent 66%)' }}
      />
      {/* тонкое элегантное кольцо-орбита */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <ellipse cx="100" cy="100" rx="94" ry="94" fill="none" stroke="var(--cream-dim)" strokeWidth="0.6" strokeDasharray="1 12" opacity="0.5" />
      </svg>
      {/* морфящийся градиентный блоб */}
      <div
        className="relative w-[62%] h-[62%] animate-blob overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, var(--accent-2), var(--accent) 55%, #b8360f 100%)',
          boxShadow: '0 40px 100px -22px rgba(239,74,35,0.55)',
        }}
      >
        {/* медленный глянцевый блик */}
        <div
          className="absolute inset-[-30%] animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.28) 60deg, transparent 140deg)',
            mixBlendMode: 'soft-light',
          }}
        />
        {/* световое пятно */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.5), transparent 45%)' }}
        />
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: 'clip' }}>
      {/* Навбар */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[var(--cream)] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-colors duration-200 hover:text-[var(--accent)]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      {/* Центральный анимированный знак */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0">
        <FadeIn delay={0.5} y={30}>
          <HeroMark />
        </FadeIn>
      </div>

      {/* Главный заголовок поверх знака */}
      <div className="relative z-10 flex flex-col items-center mt-6 sm:mt-4 md:mt-2 pointer-events-none">
        <FadeIn
          as="span"
          delay={0.1}
          y={20}
          className="accent-text font-medium uppercase tracking-[0.35em] text-xs sm:text-sm md:text-lg mb-1 sm:mb-2 md:mb-3"
        >
          3D-креатор · Motion · Брендинг
        </FadeIn>
        <div className="overflow-hidden w-full">
          <FadeIn
            as="h1"
            delay={0.15}
            y={40}
            className="hero-heading font-bold uppercase tracking-tighter leading-[0.82] text-center whitespace-nowrap w-full text-[19vw] sm:text-[17vw] md:text-[15vw]"
          >
            NOVIKOV<span className="text-[var(--accent)]">.</span>
          </FadeIn>
        </div>
      </div>

      {/* Нижняя строка */}
      <div className="relative z-20 mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="text-[var(--cream)] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          Создаю яркие и запоминающиеся 3D-проекты
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
