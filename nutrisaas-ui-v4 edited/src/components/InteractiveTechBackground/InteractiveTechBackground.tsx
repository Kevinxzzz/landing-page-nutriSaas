import React, { useEffect, useRef } from 'react';
import './InteractiveTechBackground.css';

interface InteractiveTechBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const InteractiveTechBackground: React.FC<InteractiveTechBackgroundProps> = ({ 
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    // Constantes de personalização
    const BG_COLOR = '#fafafa';
    const GRID_COLOR = 'rgba(0, 0, 0, 0.03)';
    const PIXEL_SIZE = 4;
    const NUM_STATIC_CLUSTERS = 30; 
    const COLORS = ['34, 197, 94', '0, 255, 136', '16, 185, 129']; // Tons de verde premium

    class StaticPixel {
      x: number;
      y: number;
      alpha: number;
      size: number;
      blinkSpeed: number;
      baseAlpha: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseAlpha = Math.random() * 0.3 + 0.05; // 0.05 to 0.35
        this.alpha = this.baseAlpha;
        this.size = PIXEL_SIZE * (Math.floor(Math.random() * 2) + 1);
        this.blinkSpeed = (Math.random() * 0.005) + 0.002;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        // Pulsação suave com onda senoidal
        const currentAlpha = this.baseAlpha + Math.sin(time * this.blinkSpeed + this.x) * 0.15;
        const finalAlpha = Math.max(0, Math.min(1, currentAlpha));
        
        ctx.fillStyle = `rgba(${this.color}, ${finalAlpha})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    class TrailPixel {
      x: number;
      y: number;
      alpha: number;
      size: number;
      decay: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 8; // Reduzido de 20 para 8 (raio menor)
        this.x = x + Math.cos(angle) * radius;
        this.y = y + Math.sin(angle) * radius;
        
        this.alpha = Math.random() * 0.5 + 0.1; // Ligeiramente mais transparente
        this.size = PIXEL_SIZE * (Math.random() > 0.85 ? 2 : 1); // Maioria é 1x, raramente 2x
        this.decay = Math.random() * 0.02 + 0.01; // Fade out mais rápido
        
        // Movimento muito leve flutuando
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3 - 0.2; // tendência sutil de subir
        
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    let staticPixels: StaticPixel[] = [];
    let trailPixels: TrailPixel[] = [];

    const initStaticClusters = () => {
      staticPixels = [];
      for (let i = 0; i < NUM_STATIC_CLUSTERS; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const clusterDensity = Math.floor(Math.random() * 15) + 5; 
        
        for (let j = 0; j < clusterDensity; j++) {
          const r1 = Math.random();
          const r2 = Math.random();
          const radius = 50 * Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI * r2);
          const angle = Math.random() * Math.PI * 2;
          
          const px = cx + Math.cos(angle) * (Math.abs(radius) + 5);
          const py = cy + Math.sin(angle) * (Math.abs(radius) + 5);
          
          // Snap ao grid de pixels
          const snappedX = Math.round(px / PIXEL_SIZE) * PIXEL_SIZE;
          const snappedY = Math.round(py / PIXEL_SIZE) * PIXEL_SIZE;
          staticPixels.push(new StaticPixel(snappedX, snappedY));
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        initStaticClusters();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Checa se o mouse está minimamente dentro ou próximo da área da seção
      if (
        e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50
      ) {
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
        
        if (mouseX === -1000) {
            mouseX = targetMouseX;
            mouseY = targetMouseY;
        }
      } else {
        targetMouseX = -1000;
        targetMouseY = -1000;
        mouseX = -1000; 
      }
    };

    // Usar capture phase para garantir que o evento seja pego mesmo se algum filho der stopPropagation
    window.addEventListener('mousemove', handleMouseMove, { capture: true });

    let scanlineY = 0;
    let time = 0;

    const drawGrid = () => {
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 1;
      const gridSize = 32; 
      
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      
      // Crosshairs tecnológicos
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 1;
      for (let x = gridSize * 2; x < width; x += gridSize * 6) {
        for (let y = gridSize * 2; y < height; y += gridSize * 6) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
      }
    };

    const render = () => {
      time += 1;
      
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // Sweep Holográfico (scanline lenta)
      scanlineY += 0.5;
      if (scanlineY > height + 200) scanlineY = -200;
      
      const gradient = ctx.createLinearGradient(0, scanlineY, 0, scanlineY + 150);
      gradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.02)'); // Muito sutil
      gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanlineY, width, 150);

      // Rastros do mouse (Trail)
      if (targetMouseX !== -1000) {
        const dx = targetMouseX - mouseX;
        const dy = targetMouseY - mouseY;
        
        mouseX += dx * 0.15;
        mouseY += dy * 0.15;
        
        const moveDist = Math.sqrt(dx * dx + dy * dy);
        
        if (moveDist > 1) { 
          const spawnCount = Math.min(Math.floor(moveDist * 0.05) + 1, 3); // Reduzindo quantidade (max 3)
          
          for (let i = 0; i < spawnCount; i++) {
            if (Math.random() > 0.2) {
              const snappedX = Math.round(mouseX / PIXEL_SIZE) * PIXEL_SIZE;
              const snappedY = Math.round(mouseY / PIXEL_SIZE) * PIXEL_SIZE;
              trailPixels.push(new TrailPixel(snappedX, snappedY));
            }
          }
        }
      }

      staticPixels.forEach(p => p.draw(ctx, time));

      for (let i = trailPixels.length - 1; i >= 0; i--) {
        const p = trailPixels[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          trailPixels.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`interactive-tech-bg-container ${className}`} style={style}>
      <canvas ref={canvasRef} className="interactive-tech-canvas" />
      <div className="interactive-tech-noise" />
    </div>
  );
};

export default InteractiveTechBackground;
