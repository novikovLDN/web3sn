import { useEffect, useRef, useState } from 'react'

// Путь к аудиофайлу (лежит в public/audio/).
const AUDIO_SRC = '/audio/aer216head-shizuka.mp3'
const BARS = [0, 0.18, 0.36, 0.12, 0.28]

/** Яркость фона под элементом (0..255). */
function bgLuminance(el: Element | null): number {
  let node: Element | null = el
  let hops = 0
  while (node && hops < 12) {
    const c = getComputedStyle(node).backgroundColor
    if (c && c !== 'transparent' && !c.startsWith('rgba(0, 0, 0, 0')) {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (m) {
        const [r, g, b] = m[1].split(',').map((n) => parseFloat(n))
        return 0.299 * r + 0.587 * g + 0.114 * b
      }
    }
    node = node.parentElement
    hops++
  }
  return 0
}

/**
 * Ненавязчивый мини-плеер справа вверху. Автозапуск после загрузки (с фолбэком
 * на первый жест). Цвет подстраивается под фон: на светлых секциях становится
 * тёмным, на тёмных — светлым.
 */
export default function MiniPlayer({ start }: { start: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [onLight, setOnLight] = useState(false)

  // Автозапуск + фолбэк на первый жест.
  useEffect(() => {
    if (!start) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.45
    let cleaned = false
    const tryPlay = () =>
      audio
        .play()
        .then(() => {
          setPlaying(true)
          removeGestures()
        })
        .catch(() => {})
    const gestureOnce = () => tryPlay()
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    const removeGestures = () => {
      if (cleaned) return
      cleaned = true
      events.forEach((e) => window.removeEventListener(e, gestureOnce))
    }
    tryPlay()
    events.forEach((e) => window.addEventListener(e, gestureOnce, { passive: true }))
    return removeGestures
  }, [start])

  // Определение фона под плеером (для контраста).
  useEffect(() => {
    if (!start) return
    let raf = 0
    let scheduled = false
    const sample = () => {
      scheduled = false
      const pill = pillRef.current
      if (!pill) return
      const r = pill.getBoundingClientRect()
      const els = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      const behind = els.find((e) => !pill.contains(e))
      setOnLight(bgLuminance(behind ?? null) > 140)
    }
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true
        raf = requestAnimationFrame(sample)
      }
    }
    sample()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [start])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const fg = onLight ? '#0c0b0a' : '#ece7db'
  const dim = onLight ? 'rgba(12,11,10,0.55)' : 'rgba(167,161,150,0.9)'
  const border = onLight ? 'rgba(12,11,10,0.25)' : 'rgba(236,231,219,0.15)'
  const bg = onLight ? 'rgba(236,231,219,0.6)' : 'rgba(12,11,10,0.4)'

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div
        ref={pillRef}
        className="fixed top-16 sm:top-20 right-5 md:right-10 z-50 flex items-center gap-3 rounded-full px-3.5 py-2 backdrop-blur-md transition-[opacity,background-color,border-color] duration-300"
        style={{ background: bg, border: `1px solid ${border}`, opacity: start ? 1 : 0, pointerEvents: start ? 'auto' : 'none' }}
      >
        <button
          onClick={toggle}
          aria-label={playing ? 'Пауза' : 'Играть'}
          className="flex items-center justify-center w-6 h-6 transition-colors"
          style={{ color: fg }}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Эквалайзер (акцент виден на любом фоне) */}
        <div className="flex items-end gap-[3px] h-4">
          {BARS.map((delay, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full origin-bottom"
              style={{
                height: '100%',
                background: 'var(--accent)',
                animation: 'eq-bar 0.9s ease-in-out infinite',
                animationDelay: `-${delay}s`,
                animationPlayState: playing ? 'running' : 'paused',
                transform: playing ? undefined : 'scaleY(0.3)',
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] pr-1" style={{ color: dim }}>
          {ready ? (playing ? 'Играет' : 'Пауза') : 'Звук'}
        </span>
      </div>
    </>
  )
}
