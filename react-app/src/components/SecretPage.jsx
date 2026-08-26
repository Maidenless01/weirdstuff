import React from 'react'
import PilingConfetti from './PilingConfetti.jsx'
import Fireworks from './Fireworks.jsx'
import '../styles.css'
import './SecretPage.css'

export default function SecretPage({ onBack, onLockClick }) {
  return (
    <div className="secret-page">
      <PilingConfetti />
      <Fireworks />

      {/* Record Player Side Element */}
      <div className="record-player-vessel">
        <div className="compact-disc">
          <div className="cd-inner-ring"></div>
        </div>
      </div>

      {/* Revealing Text (Jug Fill) */}
      <div className="reveal-text-container" onClick={onLockClick} title="Click to unlock something special...">
        <div className="clickable-reveal-text" style={{ position: 'relative', display: 'inline-block' }}>
          <h1 className="outline-text">
            To you i come home
          </h1>
          <h1 className="confetti-filled-text">
            To you i come home
          </h1>
        </div>
      </div>

      <button className="shake-button go-back-btn" onClick={onBack}>
        Go Back
      </button>
    </div>
  )
}
