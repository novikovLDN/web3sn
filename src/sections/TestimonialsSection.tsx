/**
 * Отзывы и клиенты.
 *
 * ГЛАВНОЕ ПРАВИЛО ЭТОЙ СЕКЦИИ: она не показывает ничего, кроме правды.
 *
 * Придуманный отзыв от несуществующего человека — это не «оформление»,
 * а фальшивая рекомендация. Она проверяется за минуту и обесценивает всё
 * остальное на странице, включая настоящие цифры. Отсутствие отзывов стоит
 * дешевле, чем один пойманный фальшивый.
 *
 * Поэтому:
 *  • секция целиком возвращает null, пока в TESTIMONIALS нет ни одной
 *    записи с filled: true. Никаких заглушек «здесь будет отзыв» на живом
 *    сайте — они выглядят как незаконченная работа;
 *  • строка логотипов рендерится только если CLIENTS непустой.
 *
 * Ритм: в отличие от таймлайна процесса и списка FAQ, здесь крупная
 * типографика цитаты работает как самостоятельная плоскость. Одна цитата —
 * одна карточка во всю ширину; несколько — сетка. Так секция не превращается
 * в третий подряд «заголовок + список».
 */

import { ArrowUpRight } from 'lucide-react'
import { Reveal, SplitText } from '../design/primitives'
import { stagger } from '../design/motion'
import { TESTIMONIALS, CLIENTS, type Testimonial } from '../data/content'

/**
 * Карточка отзыва.
 *
 * Порядок чтения задан намеренно: сначала цитата крупно, потом атрибуция.
 * Обратный порядок превратил бы отзыв в визитку — вес несёт утверждение,
 * а имя лишь подтверждает, что за ним стоит живой человек.
 */
function QuoteCard({ item, wide }: { item: Testimonial; wide: boolean }) {
  return (
    <figure
      className="relative flex flex-col justify-between h-full overflow-hidden"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-2xl)',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
      }}
    >
      {/* Кавычка как графический элемент, а не знак препинания: крупная,
          приглушённая, уведена в фон. Aria-hidden — она декоративна. */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none t-h1 leading-none"
        style={{
          top: '-0.18em',
          right: '0.06em',
          color: 'var(--a-08)',
          fontWeight: 700,
        }}
      >
        “
      </span>

      <blockquote
        className={wide ? 't-h3' : 't-lead'}
        style={{ color: 'var(--text)', maxWidth: wide ? '28ch' : undefined }}
      >
        {item.quote}
      </blockquote>

      <figcaption
        className="flex items-center gap-4"
        style={{ marginTop: 'var(--s-12)' }}
      >
        {/* Тонкая акцентная засечка вместо аватара-заглушки: подставлять
            стоковое лицо к реальному имени нельзя. */}
        <span
          aria-hidden
          className="shrink-0"
          style={{ width: 'var(--s-8)', height: '1px', background: 'var(--a)' }}
        />
        <div className="min-w-0">
          <div className="t-body" style={{ color: 'var(--text)', fontWeight: 500 }}>
            {item.author}
          </div>
          <div className="t-mono mt-1.5" style={{ color: 'var(--text-faint)' }}>
            {item.role} · {item.company}
          </div>
        </div>

        {/* Ссылка опциональна: проверяемость отзыва — его главный актив,
            но выдумывать URL, если его нет, нельзя. */}
        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="nav-link ml-auto shrink-0 inline-flex items-center gap-1.5 t-mono"
            aria-label={`Профиль: ${item.author}`}
          >
            Профиль
            <ArrowUpRight size={13} />
          </a>
        )}
      </figcaption>
    </figure>
  )
}

export default function TestimonialsSection() {
  // Фильтр — единственный источник правды о том, показывать ли секцию.
  const items = TESTIMONIALS.filter((t) => t.filled)
  if (items.length === 0) return null

  // Одна цитата занимает всю ширину и подаётся крупным кеглем: единственный
  // отзыв в сетке из трёх колонок выглядел бы как потеря, а не как сила.
  const single = items.length === 1

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden grain section-pad"
      style={{ background: 'var(--surface-raised)' }}
    >
      <div className="shell relative z-10">
        <header className="mb-12 md:mb-20">
          <Reveal y={16}>
            <span className="t-mono" style={{ color: 'var(--a)' }}>
              Отзывы
            </span>
          </Reveal>
          <h2 className="t-h2 optical-left mt-5" style={{ color: 'var(--text)' }}>
            <SplitText text="Что говорят" by="char" />
          </h2>
        </header>

        <div
          className={
            single
              ? 'grid grid-cols-1'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }
          style={{ gap: 'var(--s-6)' }}
        >
          {items.map((item, i) => (
            <Reveal
              key={`${item.author}-${i}`}
              delay={i * stagger.item}
              y={28}
              className="h-full"
            >
              <QuoteCard item={item} wide={single} />
            </Reveal>
          ))}
        </div>

        {/* ── Клиенты ─────────────────────────────────────────────────
            Отдельная плоскость под цитатами. Рендерится только при наличии
            реальных записей: логотип компании, с которой не было работы, —
            это ложное утверждение, а не декор. */}
        {CLIENTS.length > 0 && (
          <div
            className="border-t"
            style={{ borderColor: 'var(--border)', marginTop: 'var(--s-24)', paddingTop: 'var(--s-12)' }}
          >
            <Reveal y={12}>
              <span className="t-mono" style={{ color: 'var(--text-faint)' }}>
                Клиенты
              </span>
            </Reveal>

            <ul
              className="flex flex-wrap items-center"
              style={{ gap: 'var(--s-8)', marginTop: 'var(--s-6)' }}
            >
              {CLIENTS.map((c, i) => (
                <Reveal key={c.name} as="li" delay={i * stagger.letter} y={12}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="nav-link t-h3"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {c.name}
                    </a>
                  ) : (
                    <span className="t-h3" style={{ color: 'var(--text-muted)' }}>
                      {c.name}
                    </span>
                  )}
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
