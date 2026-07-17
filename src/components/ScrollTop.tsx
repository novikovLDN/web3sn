import { useEffect, useState } from 'react'
import { scrollToTarget } from '../lib/scroll'

/**
 * Кнопка «наверх» справа снизу. Появляется после первого экрана,
 * по клику плавно возвращает к началу страницы.
 */
export default function ScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => scrollToTarget(0)}
      aria-label="Наверх"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: 'var(--accent)',
        color: 'var(--ink)',
        boxShadow: '0 8px 24px -6px rgba(239,74,35,0.55)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
