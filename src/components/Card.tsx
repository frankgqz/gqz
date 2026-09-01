import React, { useState } from 'react'

type Theme = 'wood' | 'dark' | 'sky' | 'matcha'

interface CardProps {
  title: string
  subtitle?: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  theme?: Theme
}

export default function Card({ title, subtitle, href, onClick, theme = 'wood' }: CardProps) {
  const [pressed, setPressed] = useState(false)

  const cardBg = {
    wood: pressed
      ? 'linear-gradient(135deg, #7A6353 0%, #8B7355 100%)'
      : 'linear-gradient(135deg, #6B5344 0%, #8B7355 100%)',
    dark: pressed
      ? 'linear-gradient(135deg, #5B52CC 0%, #7C7FF2 100%)'
      : 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
    sky: pressed
      ? 'linear-gradient(135deg, #7A90B5 0%, #9AB0D5 100%)'
      : 'linear-gradient(135deg, #6080A8 0%, #90B0D5 100%)',
    matcha: pressed
      ? 'linear-gradient(135deg, #6A7B65 0%, #8B9B85 100%)'
      : 'linear-gradient(135deg, #5A6B55 0%, #7A8B70 100%)',
  }

  const cardShadow = {
    wood: pressed
      ? '0 2px 12px rgba(139,115,85,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 8px 32px rgba(139,115,85,0.36), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
    dark: pressed
      ? '0 2px 16px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.12)'
      : '0 8px 40px rgba(99,102,241,0.5), 0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
    sky: pressed
      ? '0 2px 12px rgba(96,128,168,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
      : '0 8px 32px rgba(96,128,168,0.3), 0 2px 8px rgba(96,128,168,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
    matcha: pressed
      ? '0 2px 12px rgba(90,107,85,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 8px 32px rgba(90,107,85,0.3), 0 2px 8px rgba(90,107,85,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
  }

  const bg = cardBg[theme]
  const shadow = cardShadow[theme]

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

