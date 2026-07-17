type ContactButtonProps = {
  className?: string
  label?: string
}

// Контактный адрес настраивается через env (VITE_CONTACT_EMAIL), запекается при сборке.
const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? 'founder@atlassecure.uk'

export default function ContactButton({
  className = '',
  label = 'Связаться',
}: ContactButtonProps) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className={
        'inline-block rounded-full font-medium uppercase tracking-widest ' +
        'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 ' +
        'text-xs sm:text-sm md:text-base transition-transform duration-200 hover:scale-[1.03] ' +
        className
      }
      style={{
        background: 'var(--accent)',
        color: 'var(--ink)',
        boxShadow: '0px 6px 20px -6px rgba(239,74,35,0.6)',
        willChange: 'transform',
      }}
    >
      {label}
    </a>
  )
}
