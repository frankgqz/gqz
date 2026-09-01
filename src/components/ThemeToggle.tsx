import { useState } from 'react'

interface ThemeToggleProps {
  isWood: boolean
    onToggle: () => void
    }

    type Theme = 'wood' | 'dark' | 'pink' | 'blue'

    interface ThemeConfig {
      bg: string
        accent: string
          icon: string
          }

          const themes: Record<Theme, ThemeConfig> = {
            wood: { bg: '#E8E0D5', accent: '#8B7355', icon: '🍂' },
              dark: { bg: '#2d3148', accent: '#6366f1', icon: '🌙' },
                pink: { bg: '#FFE4EB', accent: '#FF91A4', icon: '🌸' },
                  blue: { bg: '#E4F0F5', accent: '#4A90A4', icon: '🌊' },
                  }

                  const themeOrder: Theme[] = ['wood', 'dark', 'pink', 'blue']

                  export default function ThemeToggle({ onToggle }: ThemeToggleProps) {
                    const [currentTheme, setCurrentTheme] = useState<Theme>('wood')

                      const handleCycle = () => {
                          const idx = themeOrder.indexOf(currentTheme)
                              const next = themeOrder[(idx + 1) % themeOrder.length]
                                  setCurrentTheme(next)
                                      onToggle()
                                        }

                                          const config = themes[currentTheme]

                                            return (
                                                <button
                                                      onClick={handleCycle}
                                                            className="relative w-14 h-7 rounded-full transition-all duration-300"
                                                                  style={{ backgroundColor: config.bg }}
                                                                        aria-label="Toggle theme"
                                                                            >
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
