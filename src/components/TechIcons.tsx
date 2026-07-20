/**
 * Анимированная «техно»-иконка из линий (несколько слоёв-SVG, вращающихся
 * с разной скоростью). Используется на экране загрузки.
 */
type Props = { color?: string; className?: string }

const Layer = ({ children, spin }: { children: React.ReactNode; spin?: string }) => (
  <svg viewBox="0 0 200 200" className={`absolute inset-0 w-full h-full ${spin ?? ''}`}>
    {children}
  </svg>
)

/** Гироскоп: три кольца в разных плоскостях + пульсирующее ядро. */
export function IconGyro({ color = 'var(--a)', className = '' }: Props) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Layer spin="animate-spin-slow">
        <circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 12" opacity="0.5" />
      </Layer>
      <Layer spin="animate-spin-med-rev">
        <ellipse cx="100" cy="100" rx="80" ry="34" fill="none" stroke={color} strokeWidth="3" />
      </Layer>
      <Layer spin="animate-spin-med">
        <ellipse cx="100" cy="100" rx="34" ry="80" fill="none" stroke={color} strokeWidth="3" opacity="0.8" />
      </Layer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="block w-[14%] h-[14%] rounded-full animate-pulse-scale" style={{ background: color }} />
      </div>
    </div>
  )
}
