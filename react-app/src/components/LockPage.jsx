import React, { useState, useEffect } from 'react';
import './LockPage.css';

export default function LockPage({ onUnlock, onBack }) {
  const [digits, setDigits] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const correctCode = '050609';

  const handleKeyPress = (num) => {
    if (isShaking || isUnlocked) return;
    if (digits.length < 6) {
      setDigits([...digits, num]);
    }
  };

  const handleBackspace = () => {
    if (isShaking || isUnlocked) return;
    setDigits(digits.slice(0, -1));
  };

  const handleClear = () => {
    if (isShaking || isUnlocked) return;
    setDigits([]);
  };

  useEffect(() => {
    if (digits.length === 6) {
      const enteredCode = digits.join('');
      if (enteredCode === correctCode) {
        setIsUnlocked(true);
        // Delay slightly for nice UX before starting transition
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        // Trigger shake error
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setDigits([]); // Clear input on incorrect code
        }, 800);
      }
    }
  }, [digits, onUnlock]);

  // Support physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isShaking || isUnlocked) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, isShaking, isUnlocked, onBack]);

  return (
    <div className="lock-page-container">
      {/* Background decoration elements */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <button className="back-btn" onClick={onBack} title="Go back to Secret Garden">
        ← Back
      </button>

      <div className={`lock-card ${isShaking ? 'shake-err' : ''} ${isUnlocked ? 'unlocked-glow' : ''}`}>
        <div className="lock-icon-container">
          <div className={`padlock ${isUnlocked ? 'unlocked' : ''} ${isShaking ? 'denied' : ''}`}>
            <div className="shackle"></div>
            <div className="body">
              <div className="keyhole"></div>
            </div>
          </div>
        </div>

        <h2 className="lock-title">Enter Secret Code</h2>
        <p className="lock-subtitle">To reveal what lies ahead...</p>

        {/* Display slots */}
        <div className="slots-container">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`slot-dot ${i < digits.length ? 'filled' : ''} ${isShaking ? 'error' : ''} ${isUnlocked ? 'success' : ''}`}
            >
              {i < digits.length ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div className="keypad-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num} 
              className="keypad-btn" 
              onClick={() => handleKeyPress(num)}
            >
              {num}
            </button>
          ))}
          <button className="keypad-btn action-btn" onClick={handleClear}>
            C
          </button>
          <button className="keypad-btn" onClick={() => handleKeyPress(0)}>
            0
          </button>
          <button className="keypad-btn action-btn font-symbol" onClick={handleBackspace}>
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
