import { useEffect, useRef, useState } from 'react'

/**
 * Мини-робот-компаньон, «висящий» на правом крае и едущий по вертикали
 * вместе с прогрессом прокрутки. Появляется во время скролла (цепляется за
 * рельс и покачивается), плавно исчезает в покое. Оригинальный персонаж.
 */
export default function ScrollBot() {
  const [p, setP] = useState(0)
  const [active, setActive] = useState(false)
  const idle = useRef<number | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return // только десктоп
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      setActive(true)
      if (idle.current) window.clearTimeout(idle.current)
      idle.current = window.setTimeout(() => setActive(false), 1300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idle.current) window.clearTimeout(idle.current)
    }
  }, [])

  return (
    <div className="fixed top-0 right-0 z-[90] pointer-events-none h-full hidden md:block">
      {/* робот «висит» вплотную к системному скроллбару — без отдельной линии */}
      <div
        className="absolute right-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          top: `calc(${p} * (100vh - 84px) + 6px)`,
          opacity: active ? 1 : 0,
          transform: active ? 'scale(1)' : 'scale(0.55)',
        }}
      >
        <div className="animate-bot-sway">
          <Bot />
        </div>
      </div>
    </div>
  )
}

/** Оригинальный робот-космонавт. */
function Bot() {
  return (
    <svg width="48" height="62" viewBox="0 0 48 62" fill="none">
      {/* руки-крюки вверх */}
      <path d="M17 22 C11 16 13 10 18 9" stroke="#d9dde6" strokeWidth="4" strokeLinecap="round" />
      <path d="M31 22 C37 16 35 10 30 9" stroke="#d9dde6" strokeWidth="4" strokeLinecap="round" />
      {/* ноги (болтаются) */}
      <g className="animate-bot-sway" style={{ transformOrigin: '24px 42px', animationDuration: '2s' }}>
        <rect x="18.5" y="42" width="4.5" height="14" rx="2.25" fill="#c8cdd8" />
        <rect x="25" y="42" width="4.5" height="14" rx="2.25" fill="#c8cdd8" />
        <circle cx="20.7" cy="57" r="3" fill="#eef1f6" />
        <circle cx="27.3" cy="57" r="3" fill="#eef1f6" />
      </g>
      {/* корпус */}
      <rect x="12" y="24" width="24" height="22" rx="11" fill="#eef1f6" />
      <circle cx="24" cy="35" r="3" fill="var(--accent)" />
      {/* голова */}
      <rect x="10" y="6" width="28" height="22" rx="11" fill="#eef1f6" />
      {/* визор */}
      <rect x="14" y="11" width="20" height="12" rx="6" fill="#141826" />
      {/* глаза */}
      <circle cx="20" cy="17" r="2.4" fill="#5ad1ff">
        <animate attributeName="r" values="2.4;0.6;2.4" dur="4s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="28" cy="17" r="2.4" fill="#5ad1ff">
        <animate attributeName="r" values="2.4;0.6;2.4" dur="4s" repeatCount="indefinite" begin="1s" />
      </circle>
      {/* антенна */}
      <line x1="24" y1="6" x2="24" y2="1.5" stroke="#c8cdd8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="1.5" r="2" fill="var(--accent)">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
