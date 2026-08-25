import React, { useEffect, useRef, useState, useCallback } from 'react'
import Card from './components/Card'
import ThemeToggle from './components/ThemeToggle'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
  saturation: number
}

let nextId = 0

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)
  // cursor and hold state
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const holdingRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastSpawnRef = useRef<number>(0)
  // small UI state (pressed effect)
  const [pressed, setPressed] = useState(false)

  // PARTICLE COUNT state (updates periodically)
  const [particleCount, setParticleCount] = useState(0)
  const lastCountUpdateRef = useRef<number>(0)
  const COUNT_UPDATE_INTERVAL = 100 // ms

  // spawn particles
  const spawnParticles = useCallback((x: number, y: number, burst = false) => {
    const count = burst ? 18 : 3
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = burst ? 1.5 + Math.random() * 4 : 0.4 + Math.random() * 1.2
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

  // canvas loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr))
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)
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

      // update particle count state at a controlled interval
      const now = performance.now()
      if (now - lastCountUpdateRef.current >= COUNT_UPDATE_INTERVAL) {
        lastCountUpdateRef.current = now
        setParticleCount(particlesRef.current.length)
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current != null) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawnParticles])

  // SPAWN interval for continuous spray (ms)
  const SPAWN_INTERVAL = 60

  // rAF-driven spawn loop while holding
  const rafSpawnLoop = (timestamp: number) => {
    if (!holdingRef.current) {
      rafRef.current = null
      return
    }
    const last = lastSpawnRef.current || 0
    if (timestamp - last >= SPAWN_INTERVAL) {
      const { x, y } = cursorRef.current
      spawnParticles(x, y, false)
      lastSpawnRef.current = timestamp
    }
    rafRef.current = requestAnimationFrame(rafSpawnLoop)
  }

  // start hold
  const startHold = (x: number, y: number) => {
    cursorRef.current = { x, y }
    if (!holdingRef.current) {
      holdingRef.current = true
      lastSpawnRef.current = performance.now()
      spawnParticles(x, y, false)
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(rafSpawnLoop)
    }
  }

  // stop hold
  const stopHold = () => {
    holdingRef.current = false
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  // pointer handlers attached to window
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      startHold(e.clientX, e.clientY)
    }
    const onPointerMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }
    const onPointerUp = () => stopHold()
    const onPointerCancel = () => stopHold()

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [spawnParticles])

  // card click: big burst then navigate
  const handlePickleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      // center of button: calculate bounding rect center so burst looks centered
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      spawnParticles(x, y, true)
      setPressed(true)
      setTimeout(() => setPressed(false), 150)
      setTimeout(() => {
        window.location.href = 'https://pickleball.gqz.app'
      }, 160)
    },
    [spawnParticles]
  )

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0b0d14] overflow-hidden">
      {/* radial glow behind content */}
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
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} />
      <div className="relative flex flex-col items-center gap-6" style={{ zIndex: 20 }}>
        <p className="text-[#4b5068] text-sm tracking-widest uppercase select-none font-mono">
          gqz's apps
        </p>

        {/* Use modular Card component here */}
        <Card title="Pickleball" onClick={handlePickleClick} />

        <p className="text-[#2d3148] text-xs tracking-wide select-none">
          {particleCount} particles
        </p>
      </div>
    </div>
  )
}
