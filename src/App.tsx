import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import MiniPlayer from './components/MiniPlayer'
import ScrollTop from './components/ScrollTop'
import useSmoothScroll from './hooks/useSmoothScroll'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import ProjectsSection from './sections/ProjectsSection'
import StatsSection from './sections/StatsSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  useSmoothScroll()

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <MiniPlayer start={!isLoading} />
      <ScrollTop />

      <main className="bg-[#0c0b0a]" style={{ overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <StatsSection />
        <ContactSection />
      </main>
    </>
  )
}
