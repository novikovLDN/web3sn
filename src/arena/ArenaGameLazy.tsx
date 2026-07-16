import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const ArenaGame = lazy(() => import('./ArenaGame'))

export default function ArenaGameLazy({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
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
      { rootMargin: '250px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense fallback={<Poster />}>
          <ArenaGame />
        </Suspense>
      ) : (
        <Poster />
      )}
    </div>
  )
}

function Poster() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#1a1030_0%,#07080b_70%)]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-[#b600a8]/30 border-t-[#b600a8] animate-spin" />
        <span className="text-[#7c8494] text-xs uppercase tracking-[0.3em]">Загрузка арены</span>
      </div>
    </div>
  )
}
