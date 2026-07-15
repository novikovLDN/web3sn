import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import ContactButton from '../components/ContactButton'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'О себе', href: '#about' },
  { label: 'Услуги', href: '#price' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Контакты', href: '#contact' },
]

const PORTRAIT_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip' }}
    >
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
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      {/* Главный заголовок */}
      <div className="relative z-0 flex flex-col items-center mt-6 sm:mt-4 md:mt-2">
        <FadeIn
          as="span"
          delay={0.1}
          y={20}
          className="accent-text font-medium uppercase tracking-[0.35em] text-xs sm:text-sm md:text-lg mb-1 sm:mb-2 md:mb-3"
        >
          Привет, я
        </FadeIn>
        <div className="overflow-hidden w-full">
          <FadeIn
            as="h1"
            delay={0.15}
            y={40}
            className="hero-heading font-bold uppercase tracking-tighter leading-[0.82] text-center whitespace-nowrap w-full text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw]"
          >
            Максим
            <br />
            Новиков
          </FadeIn>
        </div>
      </div>

      {/* Портрет */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={PORTRAIT_URL}
              alt="Максим Новиков, 3D-креатор"
              className="w-full h-auto select-none pointer-events-none"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* Нижняя строка */}
      <div className="relative z-20 mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          3d-креатор, создаю яркие и запоминающиеся проекты
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
