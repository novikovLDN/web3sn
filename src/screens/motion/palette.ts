/**
 * Палитра и типографика Motion-экрана.
 *
 * Экран намеренно не наследует цвет главной: он должен читаться как отдельная
 * работа. Но движение он наследует целиком — кривые и длительности приходят
 * из src/design/motion.ts, а не задаются здесь заново. Разный визуал, один
 * почерк движения — это и есть системная работа.
 *
 * `C` остаётся объектом хексов, потому что WebGL-материал (MotionShader)
 * принимает THREE.Color, а не CSS-переменную. В JSX хексы напрямую не пишем:
 * для разметки есть MOTION_VARS ниже.
 */
import type { CSSProperties } from 'react'
import { ease } from '../../design/motion'

/** Петроль WGSN 2026 + один тёплый акцент. Значения для WebGL и для var(). */
export const C = {
  abyss: '#071316',
  panel: '#0E2226',
  border: 'rgba(127,178,174,0.16)',
  petrol: '#1F5C63',
  deepOcean: '#003B5C',
  seaGlass: '#7FB2AE',
  chalk: '#E3E6E4',
  dim: 'rgba(227,230,228,0.6)',
  ember: '#E2725B',
} as const

/**
 * Те же цвета как локальные CSS-переменные корня экрана.
 * Ставятся один раз на <main data-screen="motion">, дальше разметка обращается
 * к var(--m-*) — так палитру можно менять в одном месте, а не искать хексы
 * по восьми файлам.
 */
export const MOTION_VARS: CSSProperties = {
  '--m-abyss': C.abyss,
  '--m-panel': C.panel,
  '--m-border': C.border,
  '--m-petrol': C.petrol,
  '--m-sea': C.seaGlass,
  '--m-chalk': C.chalk,
  '--m-dim': C.dim,
  '--m-ember': C.ember,
} as CSSProperties

/**
 * Кривые экрана — псевдонимы системных. Оставлены под старыми именами,
 * чтобы не переписывать восемь модулей ради переименования, но значение
 * теперь одно с остальным сайтом.
 */
export const EASE = ease.standard
/** Появление контента: почти без входного разгона, длинный выход. */
export const EXPO = ease.entrance

export const DISPLAY = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const
export const MONO = { fontFamily: "'Geist Mono', ui-monospace, monospace" } as const

/**
 * Типографические ступени экрана.
 *
 * Трекинг обязателен и обязан быть отрицательным на всём, что крупнее
 * основного текста: на кегле 3—7rem дефолтные апроши разваливают строку.
 * Значения зеркалят --tr-* из tokens.css.
 */
export const T = {
  /** Заголовок героя. */
  hero: {
    fontSize: 'clamp(2.6rem, 9vw, 7rem)',
    lineHeight: 0.88,
    letterSpacing: '-0.04em',
  },
  /** Заголовок секции. */
  h2: {
    fontSize: 'clamp(1.9rem, 4.6vw, 3.6rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.03em',
  },
  /** Заголовок карточки/подраздела. */
  h3: {
    fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)',
    lineHeight: 1.06,
    letterSpacing: '-0.025em',
  },
  /** Крупное заявление на всю ширину колонки. */
  statement: {
    fontSize: 'clamp(1.5rem, 3.4vw, 2.9rem)',
    lineHeight: 1.14,
    letterSpacing: '-0.02em',
  },
} as const satisfies Record<string, CSSProperties>
