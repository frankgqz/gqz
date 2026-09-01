import { useState } from 'react'

type Theme = 'wood' | 'dark' | 'sky' | 'matcha'

interface ThemeToggleProps {
  currentTheme: Theme
  onToggle: () => void
}

const themeOrder: Theme[] = ['wood', 'dark', 'sky', 'matcha']

const themeConfig = {
  wood: {
    bg: '#E8E0D5',
    accent: '#8B7355',
    icon: '🍂',
    label: 'Wood',
  },
  dark: {
    bg: '#1a1d2e',
    accent: '#6366f1',
    icon: '🌙',
    label: 'Dark',
  },
  sky: {
    bg: '#E8EBF5',
    accent: '#8090B5',
    icon: '🌤️',
    label: 'Sky',
  },
  matcha: {
    bg: '#E0DDD5',
    accent: '#7A8B75',
    icon: '🍵',
    label: 'Matcha',
  },
}

export default function ThemeToggle({ currentTheme, onToggle }: ThemeToggleProps) {
  const config = themeConfig[currentTheme]

  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg overflow-hidden"
      style={{ backgroundColor: config.bg }}
      aria-label={`Current theme: ${config.label}. Click to change.`}
    >
      {/* Pill background fill */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: currentTheme === 'dark' ? '#2a2d3e' : 'transparent',
          opacity: currentTheme === 'dark' ? 1 : 0,
        }}
      />

      {/* Moving knob with icon */}
      <div
        className="absolute top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center text-xs"
        style={{
          left: 4,
          backgroundColor: config.accent,
        }}
      >
        {config.icon}
      </div>
    </button>
  )
}
 