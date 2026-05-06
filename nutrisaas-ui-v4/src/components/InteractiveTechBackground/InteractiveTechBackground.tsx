import { useEffect, useState, useMemo, useId, memo } from 'react'
import Particles from "@tsparticles/react"
import type { ISourceOptions } from "@tsparticles/engine"
import './InteractiveTechBackground.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  // For backwards compatibility
  clusterCount?: number
  cellSize?: number
  gridOpacity?: number
  sweepOpacity?: number
  noiseIntensity?: number
  intensity?: number
  bgColor?: number[]
  primaryColor?: number[]
  accentColor?: number[]
}

const InteractiveTechBackground = memo(({
  className = '',
  style,
  children,
}: Props) => {
  
  const [init, setInit] = useState(false)
  const id = useId()

  useEffect(() => {
    // The engine is already being initialized in main.tsx
    // We just wait a bit or check if it's ready. 
    // Actually, initParticlesEngine is safe to call multiple times,
    // but moving it to main.tsx was for global stability.
    setInit(true)
  }, [])

  const options: ISourceOptions = useMemo(() => ({
    autoPlay: true,
    background: {
      color: {
        value: "transparent",
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.8,
          factor: 1.5,
          speed: 0.5,
        },
      },
    },
    particles: {
      color: {
        value: ["#22c55e", "#00ff88", "#10b981"],
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: { min: 0.1, max: 0.3 },
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: 120,
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.2,
          sync: false,
        },
      },
      shape: {
        type: "square",
      },
      size: {
        value: { min: 1, max: 5 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shadow: {
        enable: true,
        blur: 10,
        color: "#00ff88",
      }
    },
    detectRetina: true,
  }), [])

  return (
    <div className={`tech-bg-container ${className}`} style={style}>
      <div className="tech-bg-overlays">
        <div className="tech-bg-grid"></div>
        <div className="tech-bg-noise"></div>
      </div>
      
      {init && (
        <Particles
          id={id}
          options={options}
          className="tech-bg-canvas"
        />
      )}
      
      {children && <div className="tech-bg-content">{children}</div>}
    </div>
  )
})

InteractiveTechBackground.displayName = 'InteractiveTechBackground'
export default InteractiveTechBackground