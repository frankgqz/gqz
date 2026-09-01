import { Theme, themes } from '../theme'

interface ThemeToggleProps {
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
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-all duration-300 shadow-lg"
      style={{ backgroundColor: toggleBg[currentTheme] }}
      aria-label="Toggle theme"
    >
      <div
        className="absolute top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center text-xs"
        style={{
          left: 4,
          backgroundColor: themes[currentTheme].accent,
        }}
      >
        {themeIcons[currentTheme]}
      </div>
    </button>
  )
}
