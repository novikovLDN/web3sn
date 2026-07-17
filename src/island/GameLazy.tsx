import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Game = lazy(() => import('./Game'))

/**
 * Тяжёлая 3D-сцена монтируется и рендерится ТОЛЬКО после клика на постер —
 * чтобы не грузить устройство при простом скролле. «Выход» из игры
 * размонтирует сцену обратно к постеру.
 */
export default function GameLazy({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {mounted ? (
        <Suspense fallback={<Poster loading />}>
          <Game onExit={() => setMounted(false)} />
        </Suspense>
      ) : (
        <Poster onStart={inView ? () => setMounted(true) : undefined} />
      )}
    </div>
  )
}

function Poster({ onStart, loading }: { onStart?: () => void; loading?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_center,#12202c_0%,#0b1016_70%)]">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-[#4e85bf]/30 border-t-[#4e85bf] animate-spin" />
          <span className="text-[#7c8494] text-xs uppercase tracking-[0.3em]">Загрузка мира</span>
        </div>
      ) : (
        <>
          <p className="text-[#7c8494] text-xs sm:text-sm uppercase tracking-[0.3em] text-center px-6">
            Интерактивная 3D мини-игра
          </p>
          <button
            onClick={onStart}
            disabled={!onStart}
            className="rounded-full px-9 py-4 font-medium uppercase tracking-widest disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--ink)', boxShadow: '0 6px 20px -6px rgba(239,74,35,0.6)' }}
          >
            ▶ Запустить остров
          </button>
        </>
      )}
    </div>
  )
}
