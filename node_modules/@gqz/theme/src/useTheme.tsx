'use client'
import { createContext, useContext } from 'react'
import type { Theme, ThemeColors } from './theme'

export type { Theme, ThemeColors } from './theme'

export const STORAGE_KEY = 'gqz-theme'

export interface ThemeContextValue {
  activeTheme: Theme
  setActiveTheme: (theme: Theme) => void
  themeColors: ThemeColors
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const VALID_THEMES: Theme[] = ['wood', 'dark', 'sky', 'matcha']

export function getStoredTheme(): Theme | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === STORAGE_KEY && VALID_THEMES.includes(value as Theme)) {
      return value as Theme
    }
  }
  return null
}

export function setStoredTheme(theme: Theme): void {
  document.cookie = `${STORAGE_KEY}=${theme}; Domain=.gqz.app; Path=/; Max-Age=31536000; SameSite=Lax`
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
