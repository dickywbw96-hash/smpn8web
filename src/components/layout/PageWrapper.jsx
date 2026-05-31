import { useEffect, useRef } from 'react'

const COLORS = [
  { r: 80,  g: 160, b: 255 },
  { r: 100, g: 180, b: 255 },
  { r: 60,  g: 130, b: 220 },
  { r: 212, g: 175, b: 55  },
  { r: 240, g: 200, b: 80  },
  { r: 255, g: 215, b: 100 },
  { r: 180, g: 220, b: 255 },
]

class Firefly {
  constructor(W, H, init = false) {
    this.reset(W, H, init)
  }
  reset(W, H, init = false) {
    this.x = Math.random() * W
    this.y = init ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10)
    this.c = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.size = 1.2 + Math.random() * 2.2
    this.alpha = 0
    this.maxAlpha = 0.4 + Math.random() * 0.55
    this.speed = 0.12 + Math.random() * 0.28
    this.angle = Math.random() * Math.PI * 2
    this.drift = (Math.random() - 0.5) * 0.012
    this.pulse = Math.random() * Math.PI * 2
    this.pulseSpeed = 0.015 + Math.random() * 0.025
    this.glowR = this.size * (3 + Math.random() * 4)
    this.trail = []
    this.trailLen = Math.floor(3 + Math.random() * 6)
    this.life = 0
    this.maxLife = 300 + Math.random() * 400
    this.W = W
    this.H = H
  }
  update() {
    this.life++
    this.angle += this.drift
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed * 0.5 - 0.08
    this.pulse += this.pulseSpeed
    const fadeZone = 60
    if (this.life < fadeZone) {
      this.alpha = (this.life / fadeZone) * this.maxAlpha
    } else if (this.life > this.maxLife - fadeZone) {
      this.alpha = ((this.maxLife - this.life) / fadeZone) * this.maxAlpha
    } else {
      this.alpha = this.maxAlpha
    }
    this.trail.unshift({ x: this.x, y: this.y })
    if (this.trail.length > this.trailLen) this.trail.pop()
    if (this.life > this.maxLife) this.reset(this.W, this.H, false)
  }
  draw(ctx) {
    const { r, g, b } = this.c
    const pf = 0.85 + 0.15 * Math.sin(this.pulse)
    const a = this.alpha * pf
    this.trail.forEach((t, i) => {
      const ta = a * (1 - i / this.trail.length) * 0.35
      ctx.beginPath()
      ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${ta})`
      ctx.fill()
    })
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowR * pf)
    grd.addColorStop(0, `rgba(${r},${g},${b},${a * 0.9})`)
    grd.addColorStop(0.3, `rgba(${r},${g},${b},${a * 0.4})`)
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.glowR * pf, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * pf, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${Math.min(r+80,255)},${Math.min(g+80,255)},${Math.min(b+80,255)},${a})`
    ctx.fill()
  }
}

export default function PageWrapper({ children, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let flies = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      flies = Array.from({ length: 55 }, () =>
        new Firefly(canvas.width, canvas.height, true)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      flies.forEach(f => { f.update(); f.draw(ctx) })
      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      className={`min-h-screen w-full relative ${className}`}
      style={{
        backgroundImage: 'url(/bg1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay lebih gelap agar konten tetap terbaca */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Canvas kunang-kunang */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      />

      {/* Konten halaman */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}