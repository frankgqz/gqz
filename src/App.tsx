import React, { useState, useCallback } from 'react'
import Card from './components/Card'
import ThemeToggle from './components/ThemeToggle'
import SparkleCanvas from './components/SparkleCanvas'

type Theme = 'wood' | 'dark' | 'sky' | 'matcha'

const themeOrder: Theme[] = ['wood', 'dark', 'sky', 'matcha']

const themeGlows = {
  wood: 'radial-gradient(circle, rgba(139,115,85,0.15) 0%, transparent 70%)',
  dark: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
  sky: 'radial-gradient(circle, rgba(180,190,220,0.12) 0%, transparent 70%)',
  matcha: 'radial-gradient(circle, rgba(122,139,117,0.12) 0%, transparent 70%)',
}

const themeBg = {
  wood: '#F5F0E8',
  dark: '#0D0E14',
  sky: '#FAFBFD',
  matcha: '#EBE8E0',
}

const themeText = {
  wood: '#5D4E3A',
  dark: '#4b5068',
  sky: '#5D7090',
  matcha: '#5D6855',
}

const themeSubtext = {
  wood: '#8B7355',
  dark: '#2d3148',
  sky: '#8090A8',
  matcha: '#7A8B75',
}

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('wood')

  const { canvasRef, particleCount, burst } = SparkleCanvas({
    theme: currentTheme
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

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(currentTheme)
    setCurrentTheme(themeOrder[(idx + 1) % themeOrder.length])
  }

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" 
      style={{ 
        backgroundColor: themeBg[currentTheme],
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }}
    >
      {/* Theme toggle - top right */}
      <div 
        className="absolute z-30"
        style={{ 
          top: 'max(24px, calc(env(safe-area-inset-top) + 24px))',
          right: 'max(24px, calc(env(safe-area-inset-right) + 24px))'
        }}
      >
        <ThemeToggle currentTheme={currentTheme} onToggle={cycleTheme} />
      </div>

      {/* radial glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'min(480px, 100vw)',
          height: 'min(480px, 100vw)',
          background: themeGlows[currentTheme],
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} />

      {/* Content - positioned higher */}
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
        <p className="text-sm tracking-widest select-none font-mono" style={{ color: themeText[currentTheme] }}>
          apps
        </p>

        <Card title="Pickleball" onClick={handlePickleClick} theme={currentTheme} />

        <p className="text-xs tracking-wide select-none" style={{ color: themeSubtext[currentTheme] }}>
          {particleCount} particles
        </p>
      </div>
    </div>
  )
}
