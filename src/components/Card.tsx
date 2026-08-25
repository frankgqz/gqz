import React, { useState } from 'react'

type CardProps = {
  title: string
  subtitle?: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  isWood?: boolean
}

/**
 * Nicer pill-style button with theme support.
 */
export default function Card({ title, subtitle, href, onClick, isWood = false }: CardProps) {
  const [pressed, setPressed] = useState(false)

  const woodBg = pressed
    ? 'linear-gradient(135deg, #7A6353 0%, #8B7355 100%)'
    : 'linear-gradient(135deg, #6B5344 0%, #8B7355 100%)'

  const purpleBg = pressed
    ? 'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)'
    : 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)'

  const bg = isWood ? woodBg : purpleBg

  const woodShadow = pressed
    ? '0 2px 12px rgba(139,115,85,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 8px 32px rgba(139,115,85,0.36), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)'

  const purpleShadow = pressed
    ? '0 2px 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 8px 32px rgba(99,102,241,0.36), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)'

  const shadow = isWood ? woodShadow : purpleShadow

  const inner = (
    <span
      className="relative flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-base tracking-wide select-none"
      style={{
        background: bg,
        color: '#fff',
        boxShadow: shadow,
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
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
