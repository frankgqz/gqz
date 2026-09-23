import type { Theme } from './theme'

export const STORAGE_KEY = 'gqz-theme'

const VALID_THEMES: Theme[] = ['wood', 'dark', 'sky', 'matcha']

export function getStoredTheme(): Theme | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === STORAGE_KEY && value && VALID_THEMES.includes(value as Theme)) {
      return value as Theme
    }
  }
  return null
}

export function setStoredTheme(theme: Theme): void {
  document.cookie = `${STORAGE_KEY}=${theme}; Domain=.gqz.app; Path=/; Max-Age=31536000; SameSite=Lax`
}
