import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Game = lazy(() => import('./Game'))

/** Грузит тяжёлую 3D-сцену только когда блок появляется во вьюпорте. */
export default function GameLazy({ className = '' }: { className?: string }) {
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
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense fallback={<Poster />}>
          <Game />
        </Suspense>
      ) : (
        <Poster />
      )}
    </div>
  )
}

function Poster() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#12202c_0%,#0b1016_70%)]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-[#4e85bf]/30 border-t-[#4e85bf] animate-spin" />
        <span className="text-[#7c8494] text-xs uppercase tracking-[0.3em]">Загрузка острова</span>
      </div>
    </div>
  )
}
