import React, { useState, useCallback } from 'react'
import Card from './components/Card'
import ThemeToggle from './components/ThemeToggle'
import SparkleCanvas from './components/SparkleCanvas'

export default function App() {
  const [isWood, setIsWood] = useState(true)

  const bgColor = isWood ? '#F5F0E8' : '#0b0d14'
  const textColor = isWood ? '#5D4E3A' : '#4b5068'
  const subtextColor = isWood ? '#8B7355' : '#2d3148'

  const { canvasRef, particleCount, burst } = SparkleCanvas({
    theme: isWood ? 'wood' : 'dark'
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
        backgroundColor: bgColor,
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
        <ThemeToggle isWood={isWood} onToggle={() => setIsWood(!isWood)} />
      </div>

      {/* radial glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'min(480px, 100vw)',
          height: 'min(480px, 100vw)',
          background: isWood 
            ? 'radial-gradient(circle, rgba(139,115,85,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
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
          top: 'clamp(15%, 45%, 50%)',  // mobile 25%, tablet 35%, desktop 45%
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <p className="text-sm tracking-widest select-none font-mono" style={{ color: textColor }}>
          apps
        </p>

        <Card title="Pickleball" onClick={handlePickleClick} isWood={isWood} />

        <p className="text-xs tracking-wide select-none" style={{ color: subtextColor }}>
          {particleCount} particles
        </p>
      </div>
    </div>
  )
}
