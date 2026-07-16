import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Workspace3D = lazy(() => import('./Workspace3D'))

/**
 * Ленивая обёртка: тяжёлый three.js-чанк грузится и монтируется только когда
 * секция подходит к вьюпорту — страница остаётся лёгкой.
 */
export default function Workspace3DLazy({
  className = '',
}: {
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
          <Workspace3D />
        </Suspense>
      ) : (
        <Poster />
      )}
    </div>
  )
}

function Poster() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#15171d_0%,#0b0c10_70%)]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-[#8fc8ff]/30 border-t-[#8fc8ff] animate-spin" />
        <span className="text-[#7c8494] text-xs uppercase tracking-[0.3em]">
          Загрузка 3D-сцены
        </span>
      </div>
    </div>
  )
}
