import { useState } from 'react'

interface CardProps {
  title: string
  subtitle?: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
}

export default function Card({ title, subtitle, href, onClick }: CardProps) {
  const [pressed, setPressed] = useState(false)

  const bg = 'linear-gradient(180deg, color-mix(in srgb, var(--theme-btn-start) 85%, #fff) 0%, var(--theme-btn-start) 46%, var(--theme-btn-end) 100%)'

  // skeu stack (Ania's recipe): top light · bottom shade · contact · own-colour glow
  const shadow = pressed
    ? 'inset 0 1px 0 #ffffff30, inset 0 -1px 0 #0002, 0 0 2px #0005, 0 3px 10px -6px var(--skeu-glow)'
    : 'inset 0 1px 0 #ffffff59, inset 0 -2px 0 #0003, 0 1px 2px #0006, 0 8px 24px -6px var(--skeu-glow)'

  const inner = (
    <span
      className="relative flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-base tracking-wide select-none"
      style={{
        background: bg,
        color: '#fff',
        boxShadow: shadow,
        transform: pressed ? 'translateY(2px) scale(0.98)' : 'scale(1)',
        transition: 'transform .12s ease, box-shadow .12s ease, background .12s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 9999,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-90">
        <path d="M8 1.5L9.8 6.2H14.5L10.8 9.1L12.3 14L8 11.1L3.7 14L5.2 9.1L1.5 6.2H6.2L8 1.5Z" fill="currentColor"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 16 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </span>
  )

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{ textDecoration: 'none', display: 'inline-block' }}
        aria-label={title}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}
      aria-label={title}
    >
      {inner}
    </button>
  )
}
