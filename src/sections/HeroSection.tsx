import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'О себе', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

/** Анимированный центральный знак вместо портрета — вращающиеся кольца + ядро. */
function HeroMark() {
  return (
    <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] animate-float-y">
      {/* внешнее пунктирное кольцо */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="var(--cream-dim)"
          strokeWidth="1"
          strokeDasharray="2 10"
          opacity="0.6"
        />
      </svg>
      {/* среднее кольцо в обратную сторону */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow-rev">
        <circle cx="100" cy="100" r="72" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="60 30" />
      </svg>
      {/* внутренний медленный круг с делениями */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          const x1 = 100 + Math.cos(a) * 50
          const y1 = 100 + Math.sin(a) * 50
          const x2 = 100 + Math.cos(a) * 56
          const y2 = 100 + Math.sin(a) * 56
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--cream)" strokeWidth="1.4" opacity="0.5" />
        })}
      </svg>
      {/* пульсирующее ядро с треугольником «showreel» */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center animate-soft-pulse"
          style={{
            background: 'radial-gradient(circle at 35% 30%, var(--accent-2), var(--accent) 60%, #b8360f 100%)',
            boxShadow: '0 20px 60px -10px rgba(239,74,35,0.5)',
          }}
        >
          <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7z" fill="var(--ink)" />
          </svg>
        </div>
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
