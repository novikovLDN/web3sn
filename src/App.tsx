import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import MiniPlayer from './components/MiniPlayer'
import ScrollTop from './components/ScrollTop'
import useSmoothScroll from './hooks/useSmoothScroll'
import { jumpToTarget } from './lib/scroll'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import ProjectsSection from './sections/ProjectsSection'
import StatsSection from './sections/StatsSection'
import ContactSection from './sections/ContactSection'
import DevelopmentScreen from './screens/DevelopmentScreen'
import Modeling3DScreen from './screens/Modeling3DScreen'
import MotionScreen from './screens/MotionScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [screen, setScreen] = useState<string | null>(null)
  const returnTo = useRef<string>('#price')
  useSmoothScroll()

  const openScreen = (id: string) => {
    returnTo.current = '#price'
    setScreen(id)
    requestAnimationFrame(() => jumpToTarget(0))
  }
  const closeScreen = () => {
    setScreen(null)
    // вернуть к блоку услуг после восстановления секций
    requestAnimationFrame(() => requestAnimationFrame(() => jumpToTarget(returnTo.current)))
  }

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <MiniPlayer start={!isLoading} />

      {screen === 'development' ? (
        <DevelopmentScreen onClose={closeScreen} />
      ) : screen === 'modeling' ? (
        <Modeling3DScreen onClose={closeScreen} />
      ) : screen === 'motion' ? (
        <MotionScreen onClose={closeScreen} />
      ) : (
        <>
          <ScrollTop />
          <main className="bg-[#0c0b0a]" style={{ overflowX: 'clip' }}>
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <ServicesSection onOpenScreen={openScreen} />
            <ProjectsSection />
            <StatsSection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  )
}
