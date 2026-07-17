import FadeIn from '../components/FadeIn'

// Термины и программы для боковых бегущих строк.
const TERMS = [
  '3D', 'MOTION', 'VFX', 'BLENDER', 'MAYA', 'CINEMA 4D', 'AFTER EFFECTS',
  'HOUDINI', 'ZBRUSH', 'SUBSTANCE', 'UNREAL', 'WEBGL', 'THREE.JS', 'REACT',
  'GO', 'XCODE', 'FIGMA', 'GLSL', 'NUKE', 'DAVINCI', 'БРЕНДИНГ', 'UI/UX',
  'RENDER', 'RIGGING', 'SHADER',
]

const MASK = 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)'

/** Вертикальная бегущая строка (вверх/вниз) сбоку от блока. */
function SideMarquee({ dir, className }: { dir: 'up' | 'down'; className: string }) {
  const list = dir === 'up' ? TERMS : [...TERMS].reverse()
  const doubled = [...list, ...list]
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none absolute top-0 h-full overflow-hidden hidden lg:block ${className}`}
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
    >
      <div className={`flex flex-col items-center gap-7 ${dir === 'up' ? 'animate-my-up' : 'animate-my-down'}`}>
        {doubled.map((t, i) => (
          <span
            key={i}
            className="font-bold uppercase tracking-tight whitespace-nowrap"
            style={{ fontSize: '1.15rem', color: i % 3 === 0 ? 'var(--accent)' : 'rgba(12,11,10,0.32)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

const SERVICES = [
  {
    number: '01',
    name: '3D-моделинг',
    description:
      'Создание детализированных объектов, персонажей и окружений под конкретные задачи клиента — для игр, продуктов и визуализаций.',
  },
  {
    number: '02',
    name: 'Рендеринг',
    description:
      'Качественные фотореалистичные рендеры: настройка света, текстур и материалов, которые оживляют концепт.',
  },
  {
    number: '03',
    name: 'Motion-дизайн',
    description:
      'Динамичная анимация и моушн-графика, которые добавляют энергию и сторителлинг брендам, продуктам и цифровым продуктам.',
  },
  {
    number: '04',
    name: 'Брендинг',
    description:
      'Создание цельного визуального стиля — от логотипа до полноценной бренд-системы с ясным и запоминающимся образом.',
  },
  {
    number: '05',
    name: 'Веб-дизайн',
    description:
      'Чистые, современные и конверсионные сайты с вниманием к вёрстке, типографике и пользовательскому опыту.',
  },
]

export default function ServicesSection() {
  return (
    <section
      id="price"
      className="relative overflow-hidden bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      {/* Боковые вертикальные бегущие строки */}
      <SideMarquee dir="up" className="left-0 w-[130px] xl:w-[180px]" />
      <SideMarquee dir="down" className="right-0 w-[130px] xl:w-[180px]" />

      <h2
        className="relative z-10 text-[#0c0b0a] font-bold uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Услуги
      </h2>

      <div className="relative z-10 max-w-5xl mx-auto">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            y={30}
            className="flex items-start gap-6 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
            style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}
          >
            <span
              className="text-[#0C0C0C] font-bold leading-none shrink-0"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {service.number}
            </span>

            <div className="flex flex-col gap-3 pt-1">
              <h3
                className="text-[#0C0C0C] font-medium uppercase leading-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {service.name}
              </h3>
              <p
                className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl"
                style={{
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                  opacity: 0.6,
                }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
