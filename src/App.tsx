import React, { useCallback } from 'react'
import Card from './components/Card'
import SparkleCanvas from './components/SparkleCanvas'
import { ThemeToggle, useTheme } from '@gqz/theme'

export default function App() {
  const { activeTheme, themeColors: theme } = useTheme()

  const { canvasRef, particleCount, burst } = SparkleCanvas({
    theme: activeTheme,
  })

  const handlePickleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2)
      setTimeout(() => {
        window.location.href = 'https://pickleball.gqz.app'
      }, 160)
    },
    [burst]
  )

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }}
    >
      <div
        className="absolute z-30"
        style={{
          top: 'max(24px, calc(env(safe-area-inset-top) + 24px))',
          right: 'max(24px, calc(env(safe-area-inset-right) + 24px))',
        }}
      >
        <ThemeToggle />
      </div>

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'min(480px, 100vw)',
          height: 'min(480px, 100vw)',
          background: theme.glow,
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} />

      <div
        className="relative flex flex-col items-center gap-6 px-6"
        style={{
          zIndex: 20,
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <p className="text-sm tracking-widest select-none font-mono" style={{ color: theme.text }}>
          apps
        </p>

        <Card title="Pickleball" onClick={handlePickleClick} theme={activeTheme} />

        <p className="text-xs tracking-wide select-none" style={{ color: theme.subtext }}>
          {particleCount} particles
        </p>
      </div>
    </div>
  )
}
