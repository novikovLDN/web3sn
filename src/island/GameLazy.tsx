import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { QUALITY } from './quality'

const Game = lazy(() => import('./Game'))

/**
 * Грузит тяжёлую 3D-сцену:
 * — на десктопе автоматически, когда блок появляется во вьюпорте;
 * — на мобильных/слабых устройствах только по тапу (чтобы не зависало при скролле).
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
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Десктоп: монтируем автоматически при появлении. Мобилки: ждём тап.
  useEffect(() => {
    if (inView && !QUALITY.mobile) setMounted(true)
  }, [inView])

  return (
    <div ref={ref} className={className}>
      {mounted ? (
        <Suspense fallback={<Poster />}>
          <Game />
        </Suspense>
      ) : (
        <Poster onStart={QUALITY.mobile && inView ? () => setMounted(true) : undefined} />
      )}
    </div>
  )
}

function Poster({ onStart }: { onStart?: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#12202c_0%,#0b1016_70%)]">
      {onStart ? (
        <button
          onClick={onStart}
          className="rounded-full px-8 py-4 font-medium uppercase tracking-widest"
          style={{ background: 'var(--accent)', color: 'var(--ink)', boxShadow: '0 6px 20px -6px rgba(239,74,35,0.6)' }}
        >
          ▶ Запустить мир
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-[#4e85bf]/30 border-t-[#4e85bf] animate-spin" />
          <span className="text-[#7c8494] text-xs uppercase tracking-[0.3em]">Загрузка острова</span>
        </div>
      )}
    </div>
  )
}
