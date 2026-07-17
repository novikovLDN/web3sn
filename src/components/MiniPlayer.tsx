import { useEffect, useRef, useState } from 'react'

// Путь к аудиофайлу. Положите трек сюда: public/audio/track.mp3
const AUDIO_SRC = '/audio/track.mp3'
const BARS = [0, 0.18, 0.36, 0.12, 0.28]

/**
 * Ненавязчивый мини-плеер: полупрозрачная плашка справа вверху с кнопкой
 * play/pause и плавным эквалайзером. Пытается запустить трек автоматически
 * после загрузки; если браузер блокирует автоплей — стартует при первом
 * действии пользователя.
 */
export default function MiniPlayer({ start }: { start: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  // Попытка автозапуска после загрузки + фолбэк на первый жест.
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
        .catch(() => {
          /* заблокировано — ждём жеста */
        })

    const gestureOnce = () => tryPlay()
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    const removeGestures = () => {
      if (cleaned) return
      cleaned = true
      events.forEach((e) => window.removeEventListener(e, gestureOnce))
    }

    tryPlay()
    events.forEach((e) => window.addEventListener(e, gestureOnce, { once: false, passive: true }))
    return removeGestures
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
        className="fixed top-16 sm:top-20 right-5 md:right-10 z-50 flex items-center gap-3 rounded-full px-3.5 py-2 backdrop-blur-md transition-opacity duration-500"
        style={{
          background: 'rgba(12,11,10,0.35)',
          border: '1px solid rgba(236,231,219,0.15)',
          opacity: start ? 1 : 0,
          pointerEvents: start ? 'auto' : 'none',
        }}
      >
        <button
          onClick={toggle}
          aria-label={playing ? 'Пауза' : 'Играть'}
          className="flex items-center justify-center w-6 h-6 text-[var(--cream)] hover:text-[var(--accent)] transition-colors"
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

        {/* Эквалайзер */}
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
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-[var(--cream-dim)] pr-1">
          {ready ? (playing ? 'Играет' : 'Пауза') : 'Звук'}
        </span>
      </div>
    </>
  )
}
