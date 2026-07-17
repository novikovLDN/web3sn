import type { IconName } from '../data/projects'

/** Простые статичные линейные иконки (единый набор для карточек и ленты). */
export default function StaticIcon({ name, color }: { name: IconName; color: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-full h-full',
  }
  switch (name) {
    case 'cube':
      return (
        <svg {...common}>
          <path d="M24 4 44 14v20L24 44 4 34V14z" />
          <path d="M24 4v20M24 24 4 14M24 24l20-10M24 24v20" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="6" fill={color} stroke="none" />
          <ellipse cx="24" cy="24" rx="20" ry="9" />
          <ellipse cx="24" cy="24" rx="20" ry="9" transform="rotate(60 24 24)" />
        </svg>
      )
    case 'chip':
      return (
        <svg {...common}>
          <rect x="16" y="16" width="16" height="16" rx="2" />
          <path d="M20 16v-6M28 16v-6M20 38v-6M28 38v-6M16 20h-6M16 28h-6M38 20h-6M38 28h-6" />
        </svg>
      )
    case 'gyro':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="4" fill={color} stroke="none" />
          <circle cx="24" cy="24" r="18" />
          <ellipse cx="24" cy="24" rx="18" ry="8" />
          <ellipse cx="24" cy="24" rx="8" ry="18" />
        </svg>
      )
    case 'spark':
    default:
      return (
        <svg {...common}>
          <path d="M24 4v14M24 30v14M4 24h14M30 24h14" />
          <path d="M12 12l8 8M28 28l8 8M36 12l-8 8M20 28l-8 8" opacity="0.5" />
        </svg>
      )
  }
}
