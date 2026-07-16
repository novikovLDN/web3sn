import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'lean' | 'type' | 'return'

const DURATIONS: Record<Phase, number> = {
  idle: 10000,
  lean: 1250,
  type: 5000,
  return: 1250,
}

const NEXT: Record<Phase, Phase> = {
  idle: 'lean',
  lean: 'type',
  type: 'return',
  return: 'idle',
}

/**
 * Уютная IT-сцена: разработчик в кресле за столом с MacBook.
 * Плавно покачивается (idle), каждые 10 c наклоняется к ноуту и печатает 5 c,
 * затем возвращается. Всё на transform/opacity — максимально гладко.
 */
export default function ITWorkspaceScene({
  className = '',
}: {
  className?: string
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return // без больших движений — только тихая сцена

    const id = window.setTimeout(
      () => setPhase((p) => NEXT[p]),
      DURATIONS[phase]
    )
    return () => window.clearTimeout(id)
  }, [phase])

  const leaned = phase === 'lean' || phase === 'type'
  const typing = phase === 'type'
  const still = leaned // покачивание замирает во время наклона/печати

  const bodyLeanTransform = leaned ? 'rotate(8.5deg)' : 'rotate(0deg)'

  return (
    <svg
      viewBox="0 0 720 470"
      className={`${className} ${still ? 'scene-still' : ''} ${
        typing ? 'scene-typing' : ''
      }`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Разработчик работает за ноутбуком"
    >
      <defs>
        <radialGradient id="ambient" cx="55%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#1c2029" />
          <stop offset="100%" stopColor="#0c0c0c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="screenGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d7f0ff" />
          <stop offset="45%" stopColor="#84c4f0" />
          <stop offset="100%" stopColor="#84c4f0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screenPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdeaff" />
          <stop offset="100%" stopColor="#6aa8dd" />
        </linearGradient>
        <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2f3d" />
          <stop offset="100%" stopColor="#181c25" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd79a" />
          <stop offset="100%" stopColor="#ffd79a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="softSm" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Фон / атмосфера */}
      <rect x="0" y="0" width="720" height="470" fill="url(#ambient)" />
      <ellipse
        className="scene-lamp-glow"
        cx="606"
        cy="150"
        rx="120"
        ry="110"
        fill="url(#lampGlow)"
        filter="url(#soft)"
      />

      {/* Тень на полу */}
      <ellipse
        cx="360"
        cy="440"
        rx="230"
        ry="26"
        fill="#000000"
        opacity="0.5"
        filter="url(#soft)"
      />

      {/* Кресло */}
      <rect x="212" y="168" width="42" height="168" rx="20" fill="#232834" />
      <rect x="210" y="300" width="130" height="18" rx="9" fill="#232834" />
      <rect x="248" y="336" width="12" height="96" rx="6" fill="#1a1e27" />

      {/* Ноги персонажа (за столом) */}
      <path d="M282,296 Q300,286 344,290 L350,310 Q306,314 282,314 Z" fill="#262b38" />
      <rect x="300" y="308" width="16" height="112" rx="8" fill="#1f2430" />
      <ellipse cx="312" cy="428" rx="24" ry="9" fill="#14171e" />

      {/* Корпус персонажа: наклон + покачивание */}
      <g className="scene-body-lean" style={{ transform: bodyLeanTransform }}>
        <g className="scene-body-rock">
          {/* Торс — худи */}
          <path
            d="M286,302 C280,255 285,219 307,207 L335,205 C351,236 353,273 349,302 Z"
            fill="url(#hoodie)"
          />
          {/* Свет экрана по правому краю торса */}
          <path
            d="M335,205 C351,236 353,273 349,302"
            fill="none"
            stroke="#6aa8dd"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.25"
          />
          {/* Молния/центральная линия */}
          <path
            d="M320,214 L322,300"
            stroke="#12151c"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Рука на колене (видна в покое, прячется при печати) */}
          <g className="scene-arm" style={{ opacity: leaned ? 0 : 1 }}>
            <path
              d="M312,216 C310,244 322,272 350,286 L364,296 C346,301 328,297 320,281 C310,258 308,236 310,218 Z"
              fill="url(#hoodie)"
            />
            <ellipse cx="366" cy="293" rx="12" ry="9" fill="#d3a181" />
          </g>

          {/* Шея */}
          <rect x="330" y="186" width="15" height="26" rx="7" fill="#c79574" />

          {/* Голова */}
          <ellipse cx="353" cy="161" rx="25" ry="29" fill="#d9ac88" />
          {/* Свет экрана на лице */}
          <ellipse
            cx="372"
            cy="166"
            rx="15"
            ry="20"
            fill="url(#screenGrad)"
            opacity="0.22"
          />
          {/* Причёска / шапочка худи */}
          <path
            d="M327,152 Q328,130 353,128 Q378,130 379,152 Q366,146 353,146 Q340,146 327,152 Z"
            fill="#20242e"
          />
          <path d="M327,152 Q325,172 333,182 L330,150 Z" fill="#20242e" />
          {/* Глаз и лёгкая улыбка */}
          <circle cx="369" cy="159" r="2.1" fill="#2a2018" />
          <path
            d="M366,172 Q372,175 377,171"
            fill="none"
            stroke="#b07d5c"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Уютные наушники */}
          <path
            d="M330,150 Q353,120 376,150"
            fill="none"
            stroke="#2b303c"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="322" y="152" width="12" height="24" rx="6" fill="#2b303c" />
          <rect
            x="324"
            y="156"
            width="4"
            height="16"
            rx="2"
            fill="#6aa8dd"
            opacity="0.5"
          />
        </g>
      </g>

      {/* Стол */}
      <rect x="330" y="300" width="366" height="15" rx="4" fill="#16181e" />
      <rect x="332" y="315" width="360" height="6" fill="#0e0f14" />
      <rect x="360" y="315" width="14" height="112" rx="4" fill="#101116" />
      <rect x="650" y="315" width="14" height="112" rx="4" fill="#101116" />

      {/* MacBook — задняя крышка (свет виден по краям) */}
      <g>
        <ellipse
          className="scene-screen-glow"
          cx="516"
          cy="256"
          rx="78"
          ry="60"
          fill="url(#screenGrad)"
          filter="url(#soft)"
        />
        <path d="M540,300 L527,236 L556,232 L571,299 Z" fill="#2c313d" />
        <path
          d="M540,300 L527,236 L556,232 L571,299 Z"
          fill="none"
          stroke="#3d4552"
          strokeWidth="1.5"
        />
        {/* Эмблема-свечение на крышке */}
        <circle
          className="scene-screen-glow"
          cx="549"
          cy="266"
          r="7"
          fill="url(#screenGrad)"
          filter="url(#softSm)"
        />
        {/* Клавиатурная база */}
        <path d="M424,300 L556,300 L540,317 L408,317 Z" fill="#313743" />
        <path d="M408,317 L540,317 L539,321 L407,321 Z" fill="#20252f" />
      </g>

      {/* Печатающая рука (появляется во время печати), кисти на клавиатуре */}
      <g className="scene-arm" style={{ opacity: typing ? 1 : 0 }}>
        <path
          d="M340,214 C362,226 402,250 452,278 L470,286 C476,290 470,299 460,297 C410,287 372,268 344,246 C330,236 327,221 331,214 Z"
          fill="url(#hoodie)"
        />
        <path
          d="M340,214 C362,226 402,250 452,278"
          fill="none"
          stroke="#6aa8dd"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* Левая кисть */}
        <g className="scene-hand-l">
          <ellipse cx="466" cy="292" rx="13" ry="8" fill="#d3a181" />
          <rect x="458" y="292" width="3" height="8" rx="1.5" fill="#c79574" />
          <rect x="464" y="293" width="3" height="9" rx="1.5" fill="#c79574" />
          <rect x="470" y="292" width="3" height="8" rx="1.5" fill="#c79574" />
        </g>
        {/* Правая кисть */}
        <g className="scene-hand-r">
          <ellipse cx="500" cy="294" rx="13" ry="8" fill="#d9ac88" />
          <rect x="492" y="294" width="3" height="8" rx="1.5" fill="#d3a181" />
          <rect x="498" y="295" width="3" height="9" rx="1.5" fill="#d3a181" />
          <rect x="504" y="294" width="3" height="8" rx="1.5" fill="#d3a181" />
        </g>
      </g>
    </svg>
  )
}
