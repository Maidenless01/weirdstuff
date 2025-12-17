import React, { useRef, useState, useEffect } from 'react'

let highestZ = 10

export default function Paper({ className = 'paper', children, ariaLabel, initialX = 0, initialY = 0, initialRotation }) {
  const ref = useRef(null)
  const [holding, setHolding] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [prev, setPrev] = useState({ x: 0, y: 0 })
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [adjustedPos, setAdjustedPos] = useState({ x: initialX, y: initialY })
  const [rotation] = useState(() => (typeof initialRotation === 'number' ? initialRotation : (Math.random() * 8 - 4)))
  const [z, setZ] = useState(() => { highestZ += 1; return highestZ })

  // Adjust position based on actual element dimensions to truly center it
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setAdjustedPos({
        x: pos.x - rect.width / 2,
        y: pos.y - rect.height / 2,
      })
    }
  }, [pos])

  const onPointerDown = (e) => {
    const el = ref.current
    if (!el) return
    setHolding(true)
    el.setPointerCapture?.(e.pointerId)
    setZ(() => ++highestZ)
    
    // Calculate offset from paper center
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setDragOffset({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
    })
    setPrev({ x: e.clientX, y: e.clientY })
  }

  const onPointerMove = (e) => {
    if (!holding) return
    const dx = e.clientX - prev.x
    const dy = e.clientY - prev.y
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }))
    setPrev({ x: e.clientX, y: e.clientY })
  }

  const endDrag = () => setHolding(false)

  const style = {
    transform: `translateX(${adjustedPos.x}px) translateY(${adjustedPos.y}px) rotateZ(${rotation}deg)`,
    zIndex: z,
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  )
}
