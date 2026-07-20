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
import ProjectsSection from './sections/ProjectsSection'
import ServicesSection from './sections/ServicesSection'
import AboutSection from './sections/AboutSection'
import ProcessSection from './sections/ProcessSection'
import ChronicleSection from './sections/ChronicleSection'
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

              Партитура целиком:

                01 Hero          удар      имя во весь экран
                02 Проекты       удар      единственная инверсия света
                03 Пауза         тишина    100svh, одна фраза
                04 Услуги        плотно    пять равных дверей в экраны
                05 Профиль       средне    проза о себе
                06 Процесс       средне    как устроена работа
                07 Хроника       пульс     короткие датированные строки
                08 Пауза         тишина    100svh
                09 Вопросы       плотно    возражения
                10 Контакт       кульминация

              Почему именно так — по позициям, которые изменились.

              ПРОЕКТЫ ВТОРЫМИ, СРАЗУ ПОСЛЕ ИМЕНИ. Работа идёт до любого
              разговора о себе: доказательство раньше аргумента. Между
              героем и работой не стоит ничего — прежняя бегущая строка
              компетенций была второй подряд декларацией о себе до
              единственного доказательства, причём повторяла список
              дисциплин, уже стоящий в подвале героя. Удалена.

              УСЛУГИ ПЕРЕД ПРОФИЛЕМ. Сначала что можно получить, потом кто
              это делает: «обо мне» на дорогом сайте стоит низко или вообще
              заменяется ссылкой. Пять строк услуг — это пять дверей в
              отдельные экраны, то есть главный дифференциатор сайта, и он
              должен стоять до прозы, а не после неё.

              ХРОНИКА ВМЕСТО ЦИФР И ОТЗЫВОВ. Счётчик достижений требует
              веры, которой у человека, открывшего сайт минуту назад, нет;
              выдуманный отзыв проверяется за минуту. Обе секции удалены
              целиком (отзывы вдобавок всё равно возвращали null и просто
              занимали строку в композиции). На их месте — датированная
              хроника: она нефальсифицируема, не протухает и сообщает
              непрерывность работы. Стоит седьмой, между двумя плотными
              блоками, и работает как пульс — быстрый короткий такт после
              длинного «Процесса».

              FAQ СОХРАНЁН ПЕРЕД КОНТАКТОМ. Это единственное сознательное
              отступление от премиального канона: здесь соло-специалист,
              и вопрос цены больше некому снять вне сайта. Гасит его ровно
              перед тем, как человек решает написать.
            */}
            <main className="bg-[var(--surface)]" style={{ overflowX: 'clip' }}>
              <HeroSection />
              <ProjectsSection />
              {/* Пауза после работ: даёт им осесть, прежде чем начнётся
                  разговор о деле. Без неё портфолио и услуги читаются
                  одним куском. Плюс она гасит инверсию света — светлая
                  секция обязана уходить в полную темноту, иначе удар
                  тянется дальше, чем должен. */}
              <Interlude {...INTERLUDES.afterProjects} side="right" />
              <ServicesSection onOpenScreen={openScreen} />
              <AboutSection />
              <ProcessSection />
              <ChronicleSection />
              {/* Вторая пауза — перед просьбой написать. Пустой экран здесь
                  работает как молчание перед вопросом: снимает ощущение,
                  что тебя ведут по воронке. */}
              <Interlude {...INTERLUDES.beforeContact} side="left" />
              <FaqSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
