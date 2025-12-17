import React, { useMemo } from 'react'
import Paper from './components/Paper.jsx'

export default function App() {
  const layout = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600
    const isMobile = vw < 640
    
    // Stack offset (smaller for mobile)
    const offset = isMobile ? 20 : 40
    
    // Build raw positions (relative, not centered yet)
    const rawPositions = [
      { x: -offset * 1.2, y: -offset, rot: -4 }, // heart
      { x: -offset * 0.9, y: -offset * 0.5, rot: -3 }, // img 1
      { x: -offset * 0.6, y: 0, rot: -2 }, // img 2
      { x: -offset * 0.3, y: offset * 0.5, rot: 0 }, // img 3
      { x: 0, y: offset, rot: 2 }, // red text
      { x: offset * 0.3, y: offset * 1.5, rot: 3 }, // cute
      { x: offset * 0.6, y: offset * 2, rot: 4 }, // drag hint
    ]
    
    // Calculate bounding box of the stack
    const xs = rawPositions.map(p => p.x)
    const ys = rawPositions.map(p => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    
    // Center of the entire stack
    const stackCenterX = (minX + maxX) / 2
    const stackCenterY = (minY + maxY) / 2
    
    // Viewport center (shift left and upward)
    const viewportCenterX = vw / 2 - vw * 0.45
    const viewportCenterY = vh / 2 - vh * 0.15
    
    // Adjustment to center the entire stack
    const adjustX = viewportCenterX - stackCenterX
    const adjustY = viewportCenterY - stackCenterY
    
    // Apply adjustment to all positions
    return rawPositions.map(p => ({
      x: Math.floor(p.x + adjustX),
      y: Math.floor(p.y + adjustY),
      rot: p.rot,
    }))
  }, [])

  return (
    <div className="app-root">
      <Paper className="paper heart" aria-label="Heart Paper" initialX={layout[0].x} initialY={layout[0].y} initialRotation={layout[0].rot}>
        {/* Decorative heart paper */}
      </Paper>

      <Paper className="paper image" initialX={layout[1].x} initialY={layout[1].y} initialRotation={layout[1].rot}>
        <p>and I fallen in</p>
        <p>Love with You 😍</p>
        <img src="https://picsum.photos/seed/1/400/260" alt="Cute" />
      </Paper>

      <Paper className="paper image" initialX={layout[2].x} initialY={layout[2].y} initialRotation={layout[2].rot}>
        <p></p>
        <img src="https://picsum.photos/seed/2/400/260" alt="Smile" />
      </Paper>

      <Paper className="paper image" initialX={layout[3].x} initialY={layout[3].y} initialRotation={layout[3].rot}>
        <p>How can be</p>
        <p>someone so cute ❤️</p>
        <img src="https://picsum.photos/seed/3/400/260" alt="Sweet" />
      </Paper>

      <Paper className="paper red" initialX={layout[4].x} initialY={layout[4].y} initialRotation={layout[4].rot}>
        <p className="p1">and My Favorite</p>
        <p className="p2">Person 😍</p>
      </Paper>

      <Paper className="paper" initialX={layout[5].x} initialY={layout[5].y} initialRotation={layout[5].rot}>
        <p className="p1">You are Cute</p>
        <p className="p1">Amazing <span style={{ color: 'red' }}>❤️</span></p>
      </Paper>

      <Paper className="paper" initialX={layout[6].x} initialY={layout[6].y} initialRotation={layout[6].rot}>
        <p className="p1">Drag the papers to move!</p>
      </Paper>
    </div>
  )
}
