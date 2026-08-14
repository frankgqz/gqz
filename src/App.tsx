import { useEffect, useRef, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: numbera
  size: number
  hue: number
  saturation: number
}

let nextId = 0

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const isHoveringRef = useRef(false)
  const cursorRef = useRef({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(false)

  const spawnParticles = useCallback((x: number, y: number, burst = false) => {
    const count = burst ? 18 : 2
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = burst
        ? 1.5 + Math.random() * 4
        : 0.4 + Math.random() * 1.2
      particlesRef.current.push({
        id: nextId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0 : 0.6),
        life: 1,
        maxLife: burst ? 0.018 + Math.random() * 0.012 : 0.022 + Math.random() * 0.014,
        size: burst ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
        hue: burst ? 200 + Math.random() * 160 : 220 + Math.random() * 120,
        saturation: 70 + Math.random() * 30,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isHoveringRef.current) {
        spawnParticles(cursorRef.current.x, cursorRef.current.y)
      }

      particlesRef.current = particlesRef.current.filter(p => p.life > 0)

      for (const p of particlesRef.current) {
        p.life -= p.maxLife
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.04
        p.vx *= 0.97

        const alpha = Math.max(0, p.life) ** 0.5
        const radius = p.size * (0.5 + p.life * 0.5)

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        grad.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, 75%, ${alpha})`)
        grad.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, 60%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawnParticles])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    cursorRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const handlePointerLeave = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    spawnParticles(e.clientX, e.clientY, true)
    setPressed(true)
    setTimeout(() => setPressed(false), 150)
    
    // Redirect to pickleball app
    window.location.href = 'https://pickleball.gqz.app'
  }, [spawnParticles])

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0b0d14] overflow-hidden">
      {/* Subtle radial glow behind button */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />

      <div className="relative flex flex-col items-center gap-6" style={{ zIndex: 20 }}>
        <p className="text-[#4b5068] text-sm tracking-widest uppercase select-none font-mono">
          gqz's apps
        </p>

        <button
          ref={buttonRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          className="group relative select-none outline-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Outer glow ring */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'transparent',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.35), 0 0 32px 8px rgba(99,102,241,0.18)',
              borderRadius: 9999,
            }}
          />

          {/* Button body */}
          <span
            className="relative flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-base tracking-wide transition-all duration-150"
            style={{
              background: pressed
                ? 'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
              color: '#fff',
              boxShadow: pressed
                ? '0 2px 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 8px 32px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
              transform: pressed ? 'scale(0.96)' : 'scale(1)',
              letterSpacing: '0.08em',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '0.95rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-90">
              <path d="M8 1.5L9.8 6.2H14.5L10.8 9.1L12.3 14L8 11.1L3.7 14L5.2 9.1L1.5 6.2H6.2L8 1.5Z" fill="currentColor"/>
            </svg>
            pickleball
          </span>
        </button>

        <p className="text-[#2d3148] text-xs tracking-wide select-none">
          {particlesRef.current.length} particles
        </p>
      </div>
    </div>
  )
}
