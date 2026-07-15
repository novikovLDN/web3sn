import { useEffect, useRef } from 'react'

const IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const ROW_ONE = [...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11)]
const ROW_TWO = [...IMAGES.slice(11), ...IMAGES.slice(11), ...IMAGES.slice(11)]

function Tile({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      className="rounded-2xl object-cover shrink-0 select-none"
      style={{ width: 420, height: 270 }}
    />
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  const targetOffset = useRef(0)
  const currentOffset = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const computeTarget = () => {
      const section = sectionRef.current
      if (!section) return
      targetOffset.current =
        (window.scrollY - section.offsetTop + window.innerHeight) * 0.3
      startLoop()
    }

    const render = () => {
      // Плавное догоняющее сглаживание — движение остаётся мягким на любой частоте кадров.
      const diff = targetOffset.current - currentOffset.current
      currentOffset.current += diff * 0.12

      const off = currentOffset.current - 200
      if (row1Ref.current)
        row1Ref.current.style.transform = `translate3d(${off}px,0,0)`
      if (row2Ref.current)
        row2Ref.current.style.transform = `translate3d(${-off}px,0,0)`

      // Останавливаем цикл, когда движение практически завершено — бережём батарею.
      if (Math.abs(diff) > 0.3) {
        rafId.current = requestAnimationFrame(render)
      } else {
        rafId.current = null
      }
    }

    const startLoop = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(render)
    }

    computeTarget()
    window.addEventListener('scroll', computeTarget, { passive: true })
    window.addEventListener('resize', computeTarget, { passive: true })
    return () => {
      window.removeEventListener('scroll', computeTarget)
      window.removeEventListener('resize', computeTarget)
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        <div
          ref={row1Ref}
          className="flex gap-3"
          style={{ willChange: 'transform', transform: 'translate3d(-200px,0,0)' }}
        >
          {ROW_ONE.map((src, i) => (
            <Tile key={`r1-${i}`} src={src} />
          ))}
        </div>

        <div
          ref={row2Ref}
          className="flex gap-3"
          style={{ willChange: 'transform', transform: 'translate3d(200px,0,0)' }}
        >
          {ROW_TWO.map((src, i) => (
            <Tile key={`r2-${i}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  )
}
