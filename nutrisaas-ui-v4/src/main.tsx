import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import App from './App.tsx'

// Initialize the engine once at the root level
initParticlesEngine(async (engine) => {
  await loadSlim(engine)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
