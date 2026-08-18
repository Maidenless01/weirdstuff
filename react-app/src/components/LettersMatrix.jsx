import React, { useState, useRef, useEffect } from 'react';
import { lettersData } from '../data/lettersData.js';
import './LettersMatrix.css';

export default function LettersMatrix({ onLetterOpen, onLetterClose }) {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Deterministic tilt angle based on ID to maintain clean rendering while looking organic
  const getTilt = (id) => {
    const tilts = [-3, 2.5, -1.5, 4, -4, 2, -2.5, 3.5, -2, 5, -5, 1.5];
    return tilts[id % tilts.length];
  };

  const handleOpenLetter = (letter) => {
    // Notify parent to pause background music
    if (onLetterOpen) onLetterOpen();

    setSelectedLetter(letter);

    // Clean up any existing specific song
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Initialize audio for the new song
    const audio = new Audio(letter.song);
    audio.volume = 0.5;
    audio.loop = true;
    audioRef.current = audio;

    setIsPlaying(true);
    
    // Play with fallback if the specific song file is missing/error
    audio.play().catch((err) => {
      console.warn(`Could not play specific song: ${letter.song}. Falling back to default track.`, err.message);
      if (audioRef.current === audio) {
        audio.src = "/Rakhlo Tum Chupaake.mp3";
        audio.play().catch((e) => console.error("Playback of fallback failed", e));
      }
    });
  };

  const handleCloseLetter = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setSelectedLetter(null);

    // Notify parent to resume background music
    if (onLetterClose) onLetterClose();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play:", err);
      });
      setIsPlaying(true);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="letters-matrix-container">
      <h1 className="matrix-title">Letters for You</h1>
      <p className="matrix-subtitle">Click on any picture to open a special note and play a song</p>

      <div className="letters-grid">
        {lettersData.map((letter) => (
          <div
            key={letter.id}
            className="letter-polaroid"
            style={{ transform: `rotate(${getTilt(letter.id)}deg)` }}
            onClick={() => handleOpenLetter(letter)}
          >
            <img 
              src={letter.image} 
              alt={letter.title} 
              loading="lazy" 
              onError={(e) => {
                // Image fallback in case custom images fail to load
                e.target.src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400";
              }}
            />
            <div className="letter-caption">Letter #{letter.id}</div>
          </div>
        ))}
      </div>

      {selectedLetter && (
        <div className="letter-modal-overlay" onClick={handleCloseLetter}>
          <div className="letter-paper-modal" onClick={(e) => e.stopPropagation()}>
            <button className="letter-close-btn" onClick={handleCloseLetter}>
              ✕
            </button>

            <div className="letter-content-wrapper">
              <h2 className="letter-modal-title">{selectedLetter.title}</h2>
              <p className="letter-modal-text">{selectedLetter.message}</p>

              {/* Custom spinning record player widget */}
              <div className="vinyl-player-widget">
                <div 
                  className={`vinyl-disc ${isPlaying ? 'playing' : ''}`}
                  onClick={togglePlayback}
                >
                  <div className="vinyl-label">
                    <div className="vinyl-center-hole"></div>
                  </div>
                </div>
                
                <div className="player-info">
                  <span className="song-status-text">{isPlaying ? 'Playing' : 'Paused'}</span>
                  <span className="song-title-text" title={selectedLetter.songTitle || `Song ${selectedLetter.id}`}>
                    {selectedLetter.songTitle || `Song ${selectedLetter.id}`}
                  </span>
                </div>

                <button className="player-controls-btn" onClick={togglePlayback}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
