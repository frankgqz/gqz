import { useState } from 'react'
import { Theme, themes } from './theme'

export interface ThemeToggleProps {
  currentTheme: Theme
  onToggle: () => void
}

const themeIcons: Record<Theme, string> = {
  wood: '🍂',
  dark: '🌙',
  sky: '🌤️',
  matcha: '🍵',
}

const toggleBg: Record<Theme, string> = {
  wood: '#E8E0D5',
  dark: '#1a1d2e',
  sky: '#E8EBF5',
  matcha: '#E0DDD5',
}

export default function ThemeToggle({ currentTheme, onToggle }: ThemeToggleProps) {
  const [pop, setPop] = useState(false)

  const handleClick = () => {
    setPop(true)
    setTimeout(() => setPop(false), 220)
    onToggle()
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle theme"
      className="relative rounded-full"
      style={{
        width: 56,
        height: 28,
        backgroundColor: toggleBg[currentTheme],
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.06)',
        transition: 'background-color 320ms ease',
      }}
    >
      <div
        key={currentTheme}
        style={{
          position: 'absolute',
          top: 4,
          left: pop ? '32px' : '4px',
          width: 20,
          height: 20,
          borderRadius: '9999px',
          backgroundColor: themes[currentTheme].accent,
          boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          transform: pop ? 'scale(1.08)' : 'scale(1)',
          transition: 'left 320ms cubic-bezier(.34,1.56,.64,1), transform 220ms ease, background-color 320ms ease',
        }}
      >
        <span style={{ display: 'inline-block', animation: 'theme-icon-spin 380ms ease-out' }}>
          {themeIcons[currentTheme]}
        </span>
      </div>
    </button>
  )
}
