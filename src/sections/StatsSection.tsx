import FadeIn from '../components/FadeIn'

const STATS = [
  { value: '5+', label: 'лет в дизайне' },
  { value: '95+', label: 'проектов сдано' },
  { value: '200%', label: 'вовлечённости в задачу' },
]

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28 border-t border-[#1a1a1a]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {STATS.map((stat, i) => (
          <FadeIn
            key={stat.label}
            delay={i * 0.12}
            y={30}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <span
              className="hero-heading font-bold leading-none"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}
            >
              {stat.value}
            </span>
            <span className="mt-3 text-[#8b93a0] font-light uppercase tracking-widest text-sm md:text-base">
              {stat.label}
            </span>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
