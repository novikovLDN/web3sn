import { useEffect, useRef, useState } from 'react'
import { bgLuminance } from '../lib/color'

// Авто-обнаружение всех треков из папки src/tracks (просто кидайте файлы туда).
const modules = import.meta.glob('../tracks/*.{mp3,ogg,wav,m4a,flac}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const TRACKS: string[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url as string)

const BARS = [0, 0.18, 0.36, 0.12, 0.28]

/**
 * Мини-плеер справа вверху: автозапуск после загрузки, переключение треков
 * вперёд/назад, авто-переход к следующему по окончании. Цвет подстраивается
 * под фон (тёмный на светлых секциях, светлый на тёмных).
 */
export default function MiniPlayer({ start }: { start: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const manual = useRef(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [onLight, setOnLight] = useState(false)
  const multi = TRACKS.length > 1

  // Автозапуск после загрузки + фолбэк на первый жест.
  useEffect(() => {
    if (!start || TRACKS.length === 0) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.45
    let cleaned = false
    const tryPlay = () =>
      audio.play().then(() => {
        setPlaying(true)
        removeGestures()
      }).catch(() => {})
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

  // Смена трека — загрузить и (если играли/переключили вручную) продолжить.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (manual.current || playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
    manual.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Контраст под плеером.
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
  const step = (dir: number) => {
    if (!multi) return
    manual.current = true
    setIndex((i) => (i + dir + TRACKS.length) % TRACKS.length)
  }

  const fg = onLight ? '#0c0b0a' : '#ece7db'
  const dim = onLight ? 'rgba(12,11,10,0.55)' : 'rgba(167,161,150,0.9)'
  const border = onLight ? 'rgba(12,11,10,0.25)' : 'rgba(236,231,219,0.15)'
  const bg = onLight ? 'rgba(236,231,219,0.6)' : 'rgba(12,11,10,0.4)'

  if (TRACKS.length === 0) return null

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACKS[index]}
        loop={!multi}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => step(1)}
      />
      <div
        ref={pillRef}
        className="fixed top-16 sm:top-20 right-5 md:right-10 z-50 flex items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md transition-[opacity,background-color,border-color] duration-300"
        style={{ background: bg, border: `1px solid ${border}`, opacity: start ? 1 : 0, pointerEvents: start ? 'auto' : 'none' }}
      >
        {multi && (
          <button onClick={() => step(-1)} aria-label="Предыдущий трек" className="flex items-center justify-center w-5 h-5 transition-colors" style={{ color: fg }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h2v14H6zM20 5v14L9 12z" />
            </svg>
          </button>
        )}

        <button onClick={toggle} aria-label={playing ? 'Пауза' : 'Играть'} className="flex items-center justify-center w-6 h-6 transition-colors" style={{ color: fg }}>
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

        {multi && (
          <button onClick={() => step(1)} aria-label="Следующий трек" className="flex items-center justify-center w-5 h-5 transition-colors" style={{ color: fg }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 5h2v14h-2zM4 5l11 7-11 7z" />
            </svg>
          </button>
        )}

        {/* Эквалайзер */}
        <div className="flex items-end gap-[3px] h-4 ml-1">
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

        <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] pr-1 tabular-nums" style={{ color: dim }}>
          {multi ? `${index + 1}/${TRACKS.length}` : playing ? 'Играет' : 'Звук'}
        </span>
      </div>
    </>
  )
}
