import { useEffect, useRef, useCallback, useState } from 'react'

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


type Theme = 'wood' | 'dark' | 'sky' | 'matcha'

interface SparkleCanvasProps {
  theme?: Theme
  burstCount?: number
  sprayCount?: number
  spawnInterval?: number
}

export default function SparkleCanvas({
  theme = 'dark',
  burstCount = 35,
  sprayCount = 8,
  spawnInterval = 20,
}: SparkleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)
  const loopRef = useRef<((timestamp: number) => void) | null>(null)

  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const holdingRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastSpawnRef = useRef<number>(0)

  const [particleCount, setParticleCount] = useState(0)
  const lastCountUpdateRef = useRef<number>(0)
  const COUNT_UPDATE_INTERVAL = 100

  let nextId = 0

  const random = () => Math.random()

  const spawnParticles = useCallback((x: number, y: number, burst = false) => {
    const count = burst ? burstCount : sprayCount
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2
      const speed = burst ? 1.5 + random() * 4 : 0.4 + random() * 1.2
      const r = random()

      let hue: number, saturation: number

      switch (theme) {
        case 'wood':
          // Browns, oranges, maples, yellows, greens
          if (r < 0.25) {
            hue = 15 + random() * 20
            saturation = 50 + random() * 30
          } else if (r < 0.5) {
            hue = 25 + random() * 20
            saturation = 70 + random() * 20
          } else if (r < 0.7) {
            hue = random() > 0.5 ? random() * 20 : 350 + random() * 10
            saturation = 65 + random() * 25
          } else if (r < 0.85) {
            hue = 45 + random() * 25
            saturation = 60 + random() * 30
          } else {
            hue = 80 + random() * 60
            saturation = 40 + random() * 40
          }
          break

        case 'dark':
          // Purple, indigo, violet, blue
          hue = burst ? 200 + random() * 160 : 220 + random() * 120
          saturation = 70 + random() * 30
          break

        case 'sky':
          // Pale blue, lavender, periwinkle
          if (r < 0.4) {
            hue = 200 + random() * 30
            saturation = 30 + random() * 30
          } else if (r < 0.7) {
            hue = 230 + random() * 40
            saturation = 25 + random() * 30
          } else {
            hue = 250 + random() * 30
            saturation = 30 + random() * 30
          }
          break

        case 'matcha':
          // Warm tan, moss, seafoam
          if (r < 0.35) {
            hue = 20 + random() * 25
            saturation = 30 + random() * 30
          } else if (r < 0.65) {
            hue = 90 + random() * 40
            saturation = 30 + random() * 30
          } else {
            hue = 140 + random() * 40
            saturation = 25 + random() * 30
          }
          break

        default:
          hue = 200 + random() * 160
          saturation = 70 + random() * 30
      }

      particlesRef.current.push({
        id: nextId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0 : 0.6),
        life: 1,
        maxLife: burst ? 0.016 + random() * 0.012 : 0.018 + random() * 0.014,
        size: burst ? 3 + random() * 5 : 2 + random() * 3,
        hue,
        saturation,
      })
    }
  }, [theme, burstCount, sprayCount])

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
      canvas.style.touchAction = 'none'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

      if (particlesRef.current.length === 0) {
        setParticleCount(0)
        animFrameRef.current = null
        return
      }

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

      const now = performance.now()
      if (now - lastCountUpdateRef.current >= COUNT_UPDATE_INTERVAL) {
        lastCountUpdateRef.current = now
        setParticleCount(particlesRef.current.length)
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    loopRef.current = loop
    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current != null) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const rafSpawnLoop = useCallback((timestamp: number) => {
    if (!holdingRef.current) {
      rafRef.current = null
      return
    }
    const last = lastSpawnRef.current || 0
    if (timestamp - last >= spawnInterval) {
      const { x, y } = cursorRef.current
      spawnParticles(x, y, false)
      lastSpawnRef.current = timestamp
    }
    rafRef.current = requestAnimationFrame(rafSpawnLoop)
  }, [spawnInterval, spawnParticles])

  const stopHold = useCallback(() => {
    holdingRef.current = false

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startHold = useCallback((x: number, y: number, target?: HTMLElement) => {
    if (target?.closest('button, a, [data-interactive]')) {
      return
    }

    cursorRef.current = { x, y }
    if (!holdingRef.current) {
      holdingRef.current = true
      lastSpawnRef.current = performance.now()
      spawnParticles(x, y, false)

      if (!animFrameRef.current && loopRef.current) {
        animFrameRef.current = requestAnimationFrame(loopRef.current)
      }

      if (rafRef.current == null) rafRef.current = requestAnimationFrame(rafSpawnLoop)
    }
  }, [spawnParticles, rafSpawnLoop])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      startHold(e.clientX, e.clientY, e.target as HTMLElement)
    }

    const onPointerMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = () => stopHold()
    const onPointerCancel = () => stopHold()
    const onPointerLeave = () => stopHold()

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('pointerleave', onPointerLeave)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [startHold, stopHold])

  const burst = useCallback((x: number, y: number) => {
    spawnParticles(x, y, true)
    if (!animFrameRef.current && loopRef.current) {
      animFrameRef.current = requestAnimationFrame(loopRef.current)
    }
  }, [spawnParticles])

  return { canvasRef, particleCount, burst }
}
