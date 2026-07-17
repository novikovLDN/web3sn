import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'О себе', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

/** Крупный анимированный техно-эмблем вместо портрета. */
function HeroMark() {
  return (
    <div className="relative w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] md:w-[460px] md:h-[460px] animate-float-y">
      {/* внешнее пунктирное кольцо */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        <circle cx="100" cy="100" r="96" fill="none" stroke="var(--cream-dim)" strokeWidth="0.8" strokeDasharray="2 10" opacity="0.55" />
      </svg>
      {/* кольцо-дуги (акцент) в обратную сторону */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow-rev">
        <circle cx="100" cy="100" r="84" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="70 46" />
      </svg>
      {/* деления */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 66}
              y1={100 + Math.sin(a) * 66}
              x2={100 + Math.cos(a) * 72}
              y2={100 + Math.sin(a) * 72}
              stroke="var(--cream)"
              strokeWidth="1.2"
              opacity="0.45"
            />
          )
        })}
      </svg>
      {/* эллипс-орбиты со спутниками */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-med">
        <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.7" />
        <circle cx="190" cy="100" r="5" fill="var(--accent)" />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-med-rev">
        <ellipse cx="100" cy="100" rx="90" ry="40" fill="none" stroke="var(--cream-dim)" strokeWidth="1.2" transform="rotate(60 100 100)" opacity="0.5" />
        <circle cx="190" cy="100" r="4" fill="var(--cream)" transform="rotate(60 100 100)" />
      </svg>
      {/* вращающийся многоугольник */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-med">
        <polygon
          points="100,44 148,72 148,128 100,156 52,128 52,72"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="1.6"
          opacity="0.35"
        />
      </svg>
      {/* пульсирующее ядро с треугольником «showreel» */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center animate-soft-pulse"
          style={{
            background: 'radial-gradient(circle at 35% 30%, var(--accent-2), var(--accent) 60%, #b8360f 100%)',
            boxShadow: '0 20px 70px -8px rgba(239,74,35,0.55)',
          }}
        >
          <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none">
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
