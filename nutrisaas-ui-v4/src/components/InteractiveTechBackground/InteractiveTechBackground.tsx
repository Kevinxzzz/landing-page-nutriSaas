import { useRef, useEffect } from 'react'
import './InteractiveTechBackground.css'

// ─── Configuration ───────────────────────────────────────────────
export interface TechBgConfig {
  cellSize?: number
  primaryColor?: [number, number, number]
  accentColor?: [number, number, number]
  bgColor?: [number, number, number]
  clusterCount?: number
  gridOpacity?: number
  sweepOpacity?: number
  noiseIntensity?: number
  intensity?: number
  mouseRadius?: number
  mouseForce?: number
  mouseDamping?: number
  mouseSpring?: number
  mouseLimit?: number
}

const DEFAULTS: Required<TechBgConfig> = {
  cellSize: 4,
  primaryColor: [34, 197, 94],    // #22c55e
  accentColor: [16, 185, 129],    // emerald-500
  bgColor: [249, 250, 251],       // #f9fafb (light default)
  clusterCount: 14,
  gridOpacity: 0.035,
  sweepOpacity: 0.04,
  noiseIntensity: 0.012,
  intensity: 1.15,
  mouseRadius: 200,
  mouseForce: 1.0,
  mouseDamping: 0.88,
  mouseSpring: 0.04,
  mouseLimit: 40,
}

// ─── Pixel Cluster ───────────────────────────────────────────────
interface PixelCluster {
  bx: number; by: number // base normalized
  x: number; y: number   // current canvas pos
  vx: number; vy: number // velocity
  px: number; py: number // phase for drift
  sx: number; sy: number // speed for drift
  radius: number
  shapeSeed: number[]
  alpha: number
  phase: number
}

// ─── Utility ─────────────────────────────────────────────────────
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function generateClusterShape(seed: number): number[] {
  const shape: number[] = []
  for (let i = 0; i < 12; i++) {
    shape.push(0.5 + seededRandom(seed + i * 13.37) * 0.5)
  }
  return shape
}

function createCluster(cW: number, cH: number, i: number): PixelCluster {
  const s = i * 7.31
  const bx = 0.1 + seededRandom(s + 1) * 0.8
  const by = 0.1 + seededRandom(s + 2) * 0.8
  return {
    bx, by,
    x: bx * cW, y: by * cH,
    vx: 0, vy: 0,
    px: seededRandom(s + 3) * Math.PI * 2,
    py: seededRandom(s + 4) * Math.PI * 2,
    sx: 0.08 + seededRandom(s + 5) * 0.15,
    sy: 0.06 + seededRandom(s + 6) * 0.12,
    radius: 20 + seededRandom(s + 7) * 60,
    shapeSeed: generateClusterShape(s + 8),
    alpha: 0.09 + seededRandom(s + 9) * 0.13,
    phase: seededRandom(s + 10) * Math.PI * 2,
  }
}

// ─── Component ───────────────────────────────────────────────────
interface Props extends TechBgConfig {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export default function InteractiveTechBackground({
  className = '',
  style,
  children,
  ...configOverrides
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  const cfg = { ...DEFAULTS, ...configOverrides }

  // Handle Mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animId: number
    let clusters: PixelCluster[] = []
    const [bgR, bgG, bgB] = cfg.bgColor
    const [pR, pG, pB] = cfg.primaryColor
    const [aR, aG, aB] = cfg.accentColor

    const initClusters = (cW: number, cH: number) => {
      clusters = []
      for (let i = 0; i < cfg.clusterCount; i++) {
        clusters.push(createCluster(cW, cH, i))
      }
    }

    let lastCW = 0, lastCH = 0

    const render = (now: number) => {
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      const rect = container.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const cW = Math.ceil(W / cfg.cellSize)
      const cH = Math.ceil(H / cfg.cellSize)
      
      // Map mouse to canvas grid scale
      const mX = mouseRef.current.x / cfg.cellSize
      const mY = mouseRef.current.y / cfg.cellSize
      const mRadius = cfg.mouseRadius / cfg.cellSize
      const mLimit = cfg.mouseLimit / cfg.cellSize

      if (canvas.width !== cW || canvas.height !== cH) {
        canvas.width = cW
        canvas.height = cH
      }

      if (cW !== lastCW || cH !== lastCH) {
        initClusters(cW, cH)
        lastCW = cW
        lastCH = cH
      }
      const t = now * 0.001

      // ─── 1. Clear to background ─────────────────────────────
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
      ctx.fillRect(0, 0, cW, cH)

      // ─── 2. Subtle Grid ─────────────────────────────────────
      if (cfg.gridOpacity > 0) {
        ctx.strokeStyle = `rgba(${pR},${pG},${pB},${cfg.gridOpacity})`
        ctx.lineWidth = 0.5
        const gridSpacing = Math.round(cW / 28)
        for (let gx = 0; gx < cW; gx += gridSpacing) {
          ctx.beginPath()
          ctx.moveTo(gx + 0.5, 0)
          ctx.lineTo(gx + 0.5, cH)
          ctx.stroke()
        }

        const gridSpacingY = Math.round(cH / 18)
        for (let gy = 0; gy < cH; gy += gridSpacingY) {
          ctx.beginPath()
          ctx.moveTo(0, gy + 0.5)
          ctx.lineTo(cW, gy + 0.5)
          ctx.stroke()
        }

        ctx.fillStyle = `rgba(${pR},${pG},${pB},${cfg.gridOpacity * 1.5})`
        for (let gx = 0; gx < cW; gx += gridSpacing) {
          for (let gy = 0; gy < cH; gy += gridSpacingY) {
            ctx.fillRect(gx, gy, 1, 1)
          }
        }
      }

      // ─── 3. Physics & Ambient Pixel Clusters ────────────────
      clusters.forEach(cluster => {
        // Target autonomous drift position
        const targetX = cluster.bx * cW
          + Math.sin(t * cluster.sx + cluster.px) * cW * 0.12
          + Math.sin(t * cluster.sx * 0.7 + cluster.py) * cW * 0.05

        const targetY = cluster.by * cH
          + Math.cos(t * cluster.sy + cluster.py) * cH * 0.10
          + Math.cos(t * cluster.sy * 0.6 + cluster.px) * cH * 0.04

        // Mouse Repulsion
        const dx = cluster.x - mX
        const dy = cluster.y - mY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < mRadius && dist > 0) {
          const force = (1 - dist / mRadius) * cfg.mouseForce
          cluster.vx += (dx / dist) * force
          cluster.vy += (dy / dist) * force
        }

        // Spring back to target
        const springX = (targetX - cluster.x) * cfg.mouseSpring
        const springY = (targetY - cluster.y) * cfg.mouseSpring
        cluster.vx += springX
        cluster.vy += springY

        // Damping
        cluster.vx *= cfg.mouseDamping
        cluster.vy *= cfg.mouseDamping

        // Apply velocity
        cluster.x += cluster.vx
        cluster.y += cluster.vy

        // Limit offset from target to prevent extreme scattering
        const ox = cluster.x - targetX
        const oy = cluster.y - targetY
        const odist = Math.sqrt(ox * ox + oy * oy)
        if (odist > mLimit) {
          cluster.x = targetX + (ox / odist) * mLimit
          cluster.y = targetY + (oy / odist) * mLimit
        }

        const pulse = 0.8 + Math.sin(t * 0.5 + cluster.phase) * 0.2
        const r = cluster.radius * pulse * cfg.intensity

        const steps = cluster.shapeSeed.length
        for (let ix = -r; ix <= r; ix++) {
          for (let iy = -r; iy <= r; iy++) {
            const pDist = Math.sqrt(ix * ix + iy * iy)
            if (pDist > r) continue

            const angle = Math.atan2(iy, ix)
            const angleIdx = ((angle / (Math.PI * 2)) * steps + steps) % steps
            const idx0 = Math.floor(angleIdx) % steps
            const idx1 = (idx0 + 1) % steps
            const frac = angleIdx - Math.floor(angleIdx)
            const shapeR = lerp(cluster.shapeSeed[idx0], cluster.shapeSeed[idx1], frac)

            if (pDist > r * shapeR) continue

            const px = Math.round(cluster.x + ix)
            const py = Math.round(cluster.y + iy)
            if (px < 0 || px >= cW || py < 0 || py >= cH) continue

            const falloff = 1 - (pDist / (r * shapeR))
            const alpha = cluster.alpha * (falloff * falloff * 1.25) * cfg.intensity

            const colorMix = seededRandom(px * 0.1 + py * 0.13 + cluster.phase)
            const cr = Math.round(lerp(pR, aR, colorMix))
            const cg = Math.round(lerp(pG, aG, colorMix))
            const cb = Math.round(lerp(pB, aB, colorMix))

            ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
            ctx.fillRect(px, py, 1, 1)
          }
        }
      })

      // ─── 4. Holographic Sweep ───────────────────────────────
      if (cfg.sweepOpacity > 0) {
        const sweepY = ((t * 0.06) % 1.4 - 0.2) * cH
        const sweepH = cH * 0.08
        const grad = ctx.createLinearGradient(0, sweepY, 0, sweepY + sweepH)
        grad.addColorStop(0, `rgba(${pR},${pG},${pB},0)`)
        grad.addColorStop(0.5, `rgba(${pR},${pG},${pB},${cfg.sweepOpacity})`)
        grad.addColorStop(1, `rgba(${pR},${pG},${pB},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, sweepY, cW, sweepH)
      }

      // ─── 5. Film Grain (noise) ──────────────────────────────
      if (cfg.noiseIntensity > 0) {
        const noiseCount = Math.floor(cW * cH * 0.04)
        for (let n = 0; n < noiseCount; n++) {
          const nx = Math.floor(Math.random() * cW)
          const ny = Math.floor(Math.random() * cH)
          const brightness = Math.random() > 0.5 ? 255 : 0
          ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},${cfg.noiseIntensity})`
          ctx.fillRect(nx, ny, 1, 1)
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [cfg])

  return (
    <div
      ref={containerRef}
      className={`itb ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="itb__canvas"
        aria-hidden="true"
      />
      {children && <div className="itb__content">{children}</div>}
    </div>
  )
}