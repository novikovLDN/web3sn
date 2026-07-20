import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import MiniPlayer from './components/MiniPlayer'
import ScrollTop from './components/ScrollTop'
import ScrollBot from './components/ScrollBot'
import useSmoothScroll from './hooks/useSmoothScroll'
import { jumpToTarget } from './lib/scroll'
import { INTERLUDES } from './data/content'
import { ease, duration, prefersReducedMotion } from './design/motion'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import ProjectsSection from './sections/ProjectsSection'
import AboutSection from './sections/AboutSection'
import StatsSection from './sections/StatsSection'
import ServicesSection from './sections/ServicesSection'
import ProcessSection from './sections/ProcessSection'
import TestimonialsSection from './sections/TestimonialsSection'
import FaqSection from './sections/FaqSection'
import ContactSection from './sections/ContactSection'
import Interlude from './sections/Interlude'
import DevelopmentScreen from './screens/DevelopmentScreen'
import Modeling3DScreen from './screens/Modeling3DScreen'
import MotionScreen from './screens/MotionScreen'
import BrandingScreen from './screens/BrandingScreen'
import WebDesignScreen from './screens/WebDesignScreen'

const SCREENS: Record<string, (props: { onClose: () => void }) => JSX.Element> = {
  development: DevelopmentScreen,
  modeling: Modeling3DScreen,
  motion: MotionScreen,
  branding: BrandingScreen,
  webdesign: WebDesignScreen,
}

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

  const Screen = screen ? SCREENS[screen] : null
  const reduce = prefersReducedMotion()

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <MiniPlayer start={!isLoading} />
      <ScrollBot />

      {/*
        Переход между главной и экраном услуги.

        Раньше экраны подменялись тернарником: старое дерево исчезало, новое
        появлялось в том же кадре. На сайте, который весь построен на движении,
        единственный мгновенный скачок был именно в самой заметной точке —
        при переходе, ради которого пользователь и кликнул.

        mode="wait" обязателен: без него старый и новый экран секунду живут
        одновременно, а два полноэкранных фона друг поверх друга дают вспышку.
        Уход быстрый (пользователь уже принял решение, задерживать его нельзя),
        приход длиннее — он и создаёт ощущение веса.
      */}
      <AnimatePresence mode="wait" initial={false}>
        {Screen ? (
          <motion.div
            key={screen}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{
              duration: reduce ? 0 : duration.slow,
              ease: ease.entrance,
            }}
          >
            <Screen onClose={closeScreen} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : duration.base, ease: ease.exit }}
          >
            <ScrollTop />
            {/*
              Порядок секций — это драматургия, а не список блоков.

              Projects стоит вторым, сразу после героя. Прежде он был шестым,
              после четырёх секций разговоров о себе, и это меняло смысл на
              противоположный: «портфолио по запросу» в конце длинного рассказа
              читается как оправдание за отсутствие работ, а сразу после имени —
              как условие доступа. Премиальные портфолио ведут работой, а не
              подводкой к ней.

              Дальше — обоснование (кто я, цифры), предложение (услуги),
              снятие риска (процесс), социальное доказательство, возражения
              и только в конце просьба. FAQ намеренно перед контактом: он
              гасит вопрос цены ровно перед тем, как человек решает написать.
            */}
            <main className="bg-[var(--surface)]" style={{ overflowX: 'clip' }}>
              <HeroSection />
              <MarqueeSection />
              <ProjectsSection />
              {/* Пауза после работ: даёт им осесть, прежде чем начнётся
                  разговор о себе. Без неё портфолио и профиль читаются
                  одним куском. */}
              <Interlude {...INTERLUDES.afterProjects} />
              <AboutSection />
              <StatsSection />
              <ServicesSection onOpenScreen={openScreen} />
              <ProcessSection />
              <TestimonialsSection />
              <FaqSection />
              {/* Вторая пауза — перед просьбой написать. Пустой экран здесь
                  работает как молчание перед вопросом: снимает ощущение,
                  что тебя ведут по воронке. */}
              <Interlude {...INTERLUDES.beforeContact} />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
