/**
 * Кнопка сайта. Одна на все случаи, три варианта оформления.
 *
 * Что делает её «дорогой», а не просто скруглённым прямоугольником:
 *  • заливка приходит шторкой снизу, а не сменой background-color —
 *    цвет нельзя анимировать на композиторе, а transform можно;
 *  • подпись при наведении сдвигается вверх и её дублёр приходит снизу,
 *    так что кнопка читается как механизм, а не как ссылка;
 *  • магнитное притяжение к курсору на десктопе.
 */

import { type ReactNode, type MouseEvent } from 'react'
import { Magnetic } from '../design/primitives'
import './Button.css'

type Variant = 'primary' | 'ghost' | 'quiet'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: (e: MouseEvent) => void
  variant?: Variant
  className?: string
  /** Иконка справа от подписи — стрелка, плюс и т.п. */
  icon?: ReactNode
  magnetic?: boolean
  ariaLabel?: string
}

const VARIANTS: Record<Variant, { base: string; fill: string; text: string; border: string }> = {
  // Основное действие. Одно на экран — иначе ни одно не главное.
  primary: {
    base: 'var(--a)',
    fill: 'var(--n-950)',
    text: 'var(--n-950)',
    border: 'transparent',
  },
  // Вторичное: контур, заливается акцентом при наведении.
  ghost: {
    base: 'transparent',
    fill: 'var(--a)',
    text: 'var(--n-900)',
    border: 'var(--border-strong)',
  },
  // Третичное: почти текст. Для «смотреть все», «назад».
  quiet: {
    base: 'transparent',
    fill: 'var(--n-200)',
    text: 'var(--n-700)',
    border: 'transparent',
  },
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  icon,
  magnetic = true,
  ariaLabel,
}: ButtonProps) {
  const v = VARIANTS[variant]
  const Tag = href ? 'a' : 'button'

  const inner = (
    <Tag
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className={`btn btn--${variant} ${className}`}
      style={
        {
          '--btn-base': v.base,
          '--btn-fill': v.fill,
          '--btn-text': v.text,
          '--btn-border': v.border,
        } as React.CSSProperties
      }
    >
      {/* Шторка заливки. Растёт от нижнего края — scaleY по composited-слою. */}
      <span className="btn__fill" aria-hidden />

      {/* Две копии подписи: верхняя уезжает, нижняя приходит на её место. */}
      <span className="btn__label">
        <span className="btn__label-in">
          {children}
          {icon && <span className="btn__icon">{icon}</span>}
        </span>
        <span className="btn__label-out" aria-hidden>
          {children}
          {icon && <span className="btn__icon">{icon}</span>}
        </span>
      </span>
    </Tag>
  )

  return magnetic ? <Magnetic strength={0.28} radius={48}>{inner}</Magnetic> : inner
}
