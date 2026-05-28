import React, { useMemo, useRef, useEffect } from 'react'
import Paper from './components/Paper.jsx'

const pages = [
  
  {
    title: 'Page 3',
    lines: ['Happy Birthday, baby 🎂❤️'],
  },
  {
    title: 'Photo 1',
    image: '/images/IMG-20260516-WA0008.jpg',
  },
  {
    title: 'Page 4',
    lines: [
      'I feel the need to be with you.',
      'I\' cherish you and I\' miss you every day.',
      'I love you and I\' always will.',
    ],
  },
  {
    title: 'Photo 2',
    image: '/images/IMG-20260516-WA0012.jpg',
  },
  
  {
    title: 'Page 5',
    lines: [
      'You bring back what I loved most in my life.',
      'It’s like you came into my dreariness',
      'and made it all worth it.',
      'The thought of spending a lifetime with you',
      'seems so perfect!',
    ],
  },
  {
    title: 'Photo 4',
    image: '/images/IMG-20260516-WA0020.jpg',
  },
 
  {
    title: 'Page 6',
    lines: [
      'The day when we had our first kiss.',
      'I was not able to sleep without you being in my arms.',
      'You make my heart feel at home.',
    ],
  },
  {
    title: 'Photo 3',
    image: '/images/IMG-20260516-WA0017.jpg',
  },
  {
    title: 'Page 7',
    lines: [
      'Thank you for being my happiness,',
      'my comfort, and my favorite person.',
      'I’m so lucky to love you.',
    ],
  },
  {
    title: 'Page 8',
    lines: ['Happy Birthday, Chunmun 💕'],
  },
   {
    title: 'Photo 5',
    image: '/images/IMG-20260516-WA0030.jpg',
  },
  {
    title: 'Page 9',
    lines: ['Drag the papers to move!'],
  }
  
  
]

export default function App() {
  const audioRef = useRef(null)
  const audioStartedRef = useRef(false)

  useEffect(() => {
    // Try to play audio automatically from 31 seconds
    const playAudio = async () => {
      if (audioRef.current && !audioStartedRef.current) {
        try {
          audioRef.current.currentTime = 31 // Start from 31 seconds
          await audioRef.current.play()
          audioStartedRef.current = true
        } catch (err) {
          // Autoplay blocked by browser; will play on first user interaction
          console.warn('Autoplay blocked:', err.message)
        }
      }
    }
    
    playAudio()
  }, [])

  // Play audio on first user interaction (click, touch, etc.)
  const handleUserInteraction = async () => {
    if (audioRef.current && !audioStartedRef.current) {
      try {
        audioRef.current.currentTime = 31
        await audioRef.current.play()
        audioStartedRef.current = true
      } catch (err) {
        console.error('Failed to play audio:', err)
      }
    }
  }

  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 31
    }
  }

  const layout = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800
    const vh = typeof window !== 'undefined' ? window.innerHeight : 600
    const isMobile = vw < 640

    // Stack offset (smaller for mobile)
    const offset = isMobile ? 18 : 36

    // Build raw positions equal to number of pages
    const rawPositions = pages.map((_, idx) => ({
      x: -offset * 1.2 + idx * offset * 0.6,
      y: -offset + idx * offset * 0.6,
      rot: -4 + idx * 1.5,
    }))

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
    <div className="app-root" onClick={handleUserInteraction} onTouchStart={handleUserInteraction} style={{ cursor: 'grab' }}>
      <audio ref={audioRef} loop onEnded={handleAudioEnd} volume={0.3} style={{ display: 'none' }}>
        <source src="/Rakhlo Tum Chupaake.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {pages.map((page, idx) => (
        <Paper
          key={page.title}
          className={page.image ? 'paper image' : 'paper'}
          aria-label={page.title}
          initialX={layout[idx].x}
          initialY={layout[idx].y}
          initialRotation={layout[idx].rot}
        >
          {page.image ? (
            <img src={page.image} alt={page.title} draggable={false} />
          ) : (
            page.lines.map((line, i) => (
              <p key={i} className="p1">{line}</p>
            ))
          )}
        </Paper>
      ))}
    </div>
  )
}
