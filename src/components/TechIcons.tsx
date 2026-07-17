/**
 * Набор анимированных «техно»-иконок из линий: несколько слоёв-SVG,
 * вращающихся с разной скоростью. Цвет задаётся пропом.
 */

type Props = { color?: string; className?: string }

const Layer = ({ children, spin }: { children: React.ReactNode; spin?: string }) => (
  <svg viewBox="0 0 200 200" className={`absolute inset-0 w-full h-full ${spin ?? ''}`}>
    {children}
  </svg>
)

/* ── Гироскоп: три кольца в разных плоскостях ─────────────────── */
export function IconGyro({ color = '#ef4a23', className = '' }: Props) {
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

/* ── Искра: лучи + вращающееся пунктирное кольцо + спутник ────── */
export function IconSpark({ color = '#ef4a23', className = '' }: Props) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Layer spin="animate-spin-slow-rev">
        <circle cx="100" cy="100" r="86" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 14" opacity="0.5" />
      </Layer>
      <Layer spin="animate-spin-med">
        <circle cx="100" cy="14" r="6" fill={color} />
        <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="90 40" opacity="0.6" />
      </Layer>
      <Layer>
        <g stroke={color} strokeWidth="4" strokeLinecap="round">
          <path d="M100 54v92M54 100h92" />
          <path d="M69 69l62 62M131 69l-62 62" opacity="0.45" />
        </g>
      </Layer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="block w-[16%] h-[16%] rounded-full animate-pulse-scale" style={{ background: color }} />
      </div>
    </div>
  )
}

/* ── Куб: изометрия внутри вращающихся колец ─────────────────── */
export function IconCube({ color = '#ef4a23', className = '' }: Props) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Layer spin="animate-spin-slow">
        <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="2" strokeDasharray="6 10" opacity="0.4" />
      </Layer>
      <Layer spin="animate-spin-med-rev">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 66}
              y1={100 + Math.sin(a) * 66}
              x2={100 + Math.cos(a) * 74}
              y2={100 + Math.sin(a) * 74}
              stroke={color}
              strokeWidth="2"
              opacity="0.6"
            />
          )
        })}
      </Layer>
      <Layer spin="animate-spin-med">
        <g fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round">
          <path d="M100 46 148 74v52L100 154 52 126V74z" />
          <path d="M100 46v54M100 100 52 74M100 100l48-26M100 100v54" opacity="0.7" />
        </g>
      </Layer>
    </div>
  )
}

/* ── Орбита: ядро + спутники на вращающихся эллипсах ──────────── */
export function IconOrbit({ color = '#ef4a23', className = '' }: Props) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Layer spin="animate-spin-med">
        <ellipse cx="100" cy="100" rx="88" ry="40" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="188" cy="100" r="7" fill={color} />
      </Layer>
      <Layer spin="animate-spin-med-rev">
        <ellipse cx="100" cy="100" rx="88" ry="40" fill="none" stroke={color} strokeWidth="2.5" transform="rotate(60 100 100)" opacity="0.7" />
      </Layer>
      <Layer spin="animate-spin-slow">
        <ellipse cx="100" cy="100" rx="88" ry="40" fill="none" stroke={color} strokeWidth="2.5" transform="rotate(120 100 100)" opacity="0.5" />
      </Layer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="block w-[20%] h-[20%] rounded-full animate-pulse-scale" style={{ background: color }} />
      </div>
    </div>
  )
}

/* ── Чип: процессор с ножками + вращающиеся уголки ────────────── */
export function IconChip({ color = '#ef4a23', className = '' }: Props) {
  const pins = [0, 1, 2].map((i) => 70 + i * 30)
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Layer spin="animate-spin-slow-rev">
        <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          {[0, 90, 180, 270].map((r) => (
            <path key={r} d="M60 40h-20v20" transform={`rotate(${r} 100 100)`} />
          ))}
        </g>
      </Layer>
      <Layer>
        <g fill="none" stroke={color} strokeWidth="3">
          <rect x="66" y="66" width="68" height="68" rx="6" />
          {pins.map((p) => (
            <g key={p}>
              <line x1={p} y1="66" x2={p} y2="52" />
              <line x1={p} y1="134" x2={p} y2="148" />
              <line x1="66" y1={p} x2="52" y2={p} />
              <line x1="134" y1={p} x2="148" y2={p} />
            </g>
          ))}
        </g>
      </Layer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="block w-[22%] h-[22%] rounded-[4px] animate-pulse-scale" style={{ background: color }} />
      </div>
    </div>
  )
}
