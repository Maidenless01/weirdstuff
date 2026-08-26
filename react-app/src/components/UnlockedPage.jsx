import React, { useEffect, useState, useRef } from 'react';
import { lettersData } from '../data/lettersData.js';
import './UnlockedPage.css';

// Pre-calculated pentatonic scale frequencies for chime synthesis
const PENTATONIC_FREQS = [
  261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
  523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
  1046.50, 1174.66, 1318.51, 1567.98, 1760.00, // Octave 6
  2093.00, 2349.32, 2637.02, 3135.96, 3520.00, // Octave 7
  4186.01, 4698.63
];

// Sunflower golden spiral layout coordinates for 22 blooms (resized for larger flower blooms)
const BLOOM_COORDINATES = Array.from({ length: 22 }).map((_, idx) => {
  const cx = 150; // Center X of cluster area
  const cy = 100; // Center Y of cluster area
  
  if (idx === 0) return { x: cx - 30, y: cy - 30, size: 60 }; // Center bloom is 60px
  
  // Golden spiral formula:
  const angle = idx * 137.5 * (Math.PI / 180);
  const radius = Math.sqrt(idx) * 27 + 10; // Spaced out further for larger blooms
  const size = Math.max(38, 54 - idx * 0.4); // Larger sizes: 38px to 54px
  
  return {
    x: cx + Math.cos(angle) * radius - size / 2,
    y: cy + Math.sin(angle) * radius - size / 2,
    size
  };
});

// Statically calculate a gentle 6-petal polygon clip path for flowers (makes images highly visible)
const generateFlowerClipPath = () => {
  const points = [];
  const numPetals = 6;
  const numPoints = 80;
  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * Math.PI * 2;
    // Shallow grooves (0.41 base radius + 0.09 petal amplitude) to keep photos fully readable in the center
    const r = 0.41 + 0.09 * Math.cos(numPetals * theta);
    const x = 0.5 + r * Math.cos(theta);
    const y = 0.5 + r * Math.sin(theta);
    points.push(`${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`);
  }
  return `polygon(${points.join(', ')})`;
};
const FLOWER_CLIP_PATH = generateFlowerClipPath();

const BOOK_CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1: Fruit Basket",
    question: "whats the centre fruit flavour that grew over you",
    answers: ["watermelon", "watermelon gum", "water melon"],
    letterText: "It was just a random day in that old building when, suddenly, a plan came to life—leaving both of them confused, excited, and sensing that something was about to change.\n\nThe woman arrived first.\nThe man was left to wait.\n\"Hi,\" he said.\nShe smiled.\nHe sat down, acting as if he were completely unaware of what was happening, or why he had a piece of watermelon gum in his mouth.\n\nSuddenly, her hands folded over him, and his hands began to tremble. It was so sudden, hitting both of them like a strike of lightning. In that moment, everything was about the breath, the touch, and the intense sensitivity that followed.\n\nShe tasted flavors she had never expected. The gum split in their mouths, and a thin string of it connected their lips. Their faces flushed red, their eyes tensed with anticipation, and with that spark, they went ahead.\n\n***\n\nTheir tongues fought for dominance—she wanted control, and he wanted it too, which only made it more endearing. Neither of them wanted to let go; they only wanted more. Afterward, he gently cleaned her face while she, completely flustered, asked him to go first, as if he would ever want to leave her like that. Oh, never.\n\nBut that sweet, lingering taste? It stayed."
  },
  {
    id: 2,
    title: "Chapter 2: Hot-Cold",
    question: "what is something you called him",
    answers: ["aanu", "anu"],
    letterText: "The day seemed ordinary, but it was exam season. She was out of her hostel, going with him for coffee. She felt scared and cold in her ways, but as for him—his hands were always hot for her, as if he knew what would happen if they let the cold in. She sat closer, eating noodles with him.\n\nHe ate the noodles left on her face, and held her waist. His warm hand sat against her cold waist. Suddenly, a kid randomly appeared; he seemed hesitant, but in the end, she was always the tease.\n\nHe always held her waist, even if it was just a side hug in front of the sports complex. She hated when anyone mentioned her waist, but she melted in his touch. Even when her hands grew sweaty from the cold, his hands remained warm, and she held them tightly, as if she were not ready to let go...\n\nHe never wanted to let go of her, and he still won't. Somewhere, he still has his warm hands ready for her..."
  },
  {
    id: 3,
    title: "Chapter 3: Marked",
    question: "What is a drink you always love",
    answers: ["blackcoffee", "black coffee", "black-coffee"],
    letterText: "She looked at him, and he looked at her. They both understood what it was for. She was seated there, and he was there for her. She had her intentions, and he had his. The second her hands touched his neck, the boy felt everything he needed to feel.\n\n***\n\nThe kisses were intense, as if the pull between them was too close. She was in him, and he was in her. The constants were there, and the pull was too—the lips, the tongue, the voices, and even their hands.\n\nShe unbuttoned her shirt while he was there with her. She started to bite, marking him; he was marked by her. Her intentions were etched onto him.\n\nAs if that was only the beginning, he stopped kissing her lips and went down—down her neck. She moaned, then tried to put a mark on him. She giggled because he was scared of hurting her, but the mark was somewhere only she knew, somewhere only she was aware of.\n\nBoth of them stayed like that for a while, and then went ahead with the same trick they always do. He still didn't want to go."
  },
  {
    id: 4,
    title: "Chapter 4: Red Dress",
    question: "what is something between us that no one knows",
    answers: ["touch"],
    letterText: "He was waiting, as if someone new were waiting for him. But it was just her—or was it? You see, both characters were going on a date; a mini one, but it was what it was.\n\nShe arrived in a red dress with those eyes. He felt as if they were somehow married, but it wasn't the dress—it was the feeling, hitting him and her, this time only.\n\nThey walked and talked. They loved that. She held his hand, let go, but came back and laughed. They went ahead and stopped to eat something—a sandwich and a lemonade. She sat close to him, and everyone was looking at them. He was skeptical, and why not? He loved her.\n\nHe took her back, but before that, she walked close to him, held his hand, and gave him a soft peck on his cheek. He tried to do the same, but failed.\n\nEnding their story on this chapter does not mean that nothing happened afterward. It is something they both have to figure out—whether the book should be written with more chapters, or if it should end here.\n\nUntil then...\n\nHope the characters have more chapters."
  }
];

export default function UnlockedPage({ onBack }) {
  const [stars, setStars] = useState([]);
  
  // Bloom states (true means transformed into butterfly)
  const [memoryTransformed, setMemoryTransformed] = useState(Array(22).fill(false));
  const [melodyTransformed, setMelodyTransformed] = useState(Array(22).fill(false));
  
  // Transformation animation status
  const [isMemoryRunning, setIsMemoryRunning] = useState(false);
  const [isMelodyRunning, setIsMelodyRunning] = useState(false);
  
  // Active flying butterflies
  const [butterflies, setButterflies] = useState([]);
  
  // Interactive modal details
  const [activePhoto, setActivePhoto] = useState(null);
  const [activeSongPlaying, setActiveSongPlaying] = useState(null);
  
  // Reference for active audio preview
  const audioPreviewRef = useRef(null);

  // States for interactive Book of Memories
  const [bookOpen, setBookOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [enteredAnswers, setEnteredAnswers] = useState({ 1: '', 2: '', 3: '', 4: '' });
  const [shakingChapterId, setShakingChapterId] = useState(null);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [isFastFlip, setIsFastFlip] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  const handleAnswerChange = (id, value) => {
    setEnteredAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleVerifyAnswer = (id) => {
    const chapter = BOOK_CHAPTERS.find(c => c.id === id);
    if (!chapter) return;

    const currentInput = (enteredAnswers[id] || '').trim().toLowerCase();
    const isCorrect = chapter.answers.some(ans => ans.trim().toLowerCase() === currentInput);

    if (isCorrect) {
      playChime(id + 10); // Play a sweet chime!
      setUnlockedChapters(prev => [...prev, id]);
    } else {
      setShakingChapterId(id);
      setTimeout(() => {
        setShakingChapterId(null);
      }, 600);
    }
  };

  const handleRelockChapter = (id) => {
    setUnlockedChapters(prev => prev.filter(item => item !== id));
    setEnteredAnswers(prev => ({
      ...prev,
      [id]: ''
    }));
  };

  const handleRelockBook = () => {
    setUnlockedChapters([]);
    setEnteredAnswers({ 1: '', 2: '', 3: '', 4: '' });
    setBookOpen(false);
    setCurrentChapter(1);
  };

  const turnToChapter = (id) => {
    if (id < 1 || id > BOOK_CHAPTERS.length || id === currentChapter || isPageTurning) return;
    
    const distance = Math.abs(id - currentChapter);
    if (distance === 1) {
      // Single page turn
      setIsPageTurning(true);
      setIsFastFlip(false);
      setFlipKey(prev => prev + 1);
      playChime(id + 2);
      playPageFlipSound(false); // Play realistic slow paper flip sound!
      setTimeout(() => {
        setCurrentChapter(id);
        setIsPageTurning(false);
      }, 650);
    } else {
      // Multi-page skip sequence! Plays quick successive page flips.
      setIsPageTurning(true);
      setIsFastFlip(true);
      
      let stepChapter = currentChapter;
      const direction = id > currentChapter ? 1 : -1;
      
      const doNextFlip = () => {
        stepChapter += direction;
        setFlipKey(prev => prev + 1);
        playChime(stepChapter + 2);
        playPageFlipSound(true); // Play quick successive paper flip sound!
        setCurrentChapter(stepChapter);
        
        if (stepChapter !== id) {
          setTimeout(doNextFlip, 240); // 240ms duration for intermediate flips
        } else {
          setTimeout(() => {
            setIsPageTurning(false);
            setIsFastFlip(false);
          }, 240);
        }
      };
      
      doNextFlip();
    }
  };

  useEffect(() => {
    // Generate twinkling background stars
    const newStars = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 4 + 3}s`
    }));
    setStars(newStars);

    return () => {
      // Clean up audio on unmount
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
    };
  }, []);

  // Web Audio Synth to create bell-chimes
  const playChime = (index) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle'; // Flute/bell character
      const freq = PENTATONIC_FREQS[index % PENTATONIC_FREQS.length];
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      // Pitch envelope slide
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Chime synth audio blocked or failed:", e);
    }
  };

  // Web Audio Synth to create a realistic page rustling sound
  const playPageFlipSound = (isFast = false) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      const duration = isFast ? 0.22 : 0.48;
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate pinkish-filtered white noise for a soft rustling sound
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = 0.75 * lastOut + 0.25 * white; // Pink filter coefficients
        lastOut = data[i];
      }
      
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(isFast ? 1.5 : 2.2, audioCtx.currentTime);
      
      // Sweep frequency to mimic pages brushing against each other
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1300, audioCtx.currentTime + duration * 0.4);
      filter.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + duration * 0.9);
      
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(isFast ? 0.08 : 0.14, audioCtx.currentTime + duration * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 0.98);
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      noiseSource.start();
      noiseSource.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Paper flip synthesis failed:", e);
    }
  };

  // Play audio preview on click
  const handlePlaySong = (songUrl, title) => {
    try {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      
      setActiveSongPlaying(title);
      const audio = new Audio(songUrl);
      audio.volume = 0.15;
      audio.currentTime = 30; // Jump to middle / chorus
      audioPreviewRef.current = audio;
      
      audio.play().then(() => {
        // Play for 3.5 seconds and fade out
        setTimeout(() => {
          let fade = setInterval(() => {
            if (audio.volume > 0.02) {
              audio.volume -= 0.02;
            } else {
              audio.pause();
              clearInterval(fade);
              setActiveSongPlaying(current => current === title ? null : current);
            }
          }, 100);
        }, 3500);
      }).catch(e => {
        console.warn("Autoplay block or audio load fail:", e);
        setActiveSongPlaying(null);
      });
    } catch (err) {
      console.warn("Audio failure:", err);
      setActiveSongPlaying(null);
    }
  };

  // Spawn butterfly helper
  const spawnButterfly = (x, y, data, isMelody) => {
    // Generate random values for windswept path calculations
    const d10 = (Math.random() - 0.5) * 60;
    const d50 = (Math.random() - 0.5) * 160 + (isMelody ? 100 : -100);
    const d90 = (Math.random() - 0.5) * 260 + (isMelody ? 200 : -200);
    const d100 = (Math.random() - 0.5) * 320 + (isMelody ? 250 : -250);

    const newButterfly = {
      id: Date.now() + Math.random(),
      x,
      y,
      d10,
      d50,
      d90,
      d100,
      isMelody,
      image: data.image,
      song: data.song,
      songTitle: data.songTitle
    };

    setButterflies(prev => [...prev, newButterfly]);

    // Remove butterfly after animation ends to free up resources
    setTimeout(() => {
      setButterflies(prev => prev.filter(b => b.id !== newButterfly.id));
    }, 4500);
  };

  // Transform an individual memory bloom to a butterfly on click
  const transformIndividualMemory = (index) => {
    if (memoryTransformed[index] || isMemoryRunning) return;
    setMemoryTransformed(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const coords = BLOOM_COORDINATES[index];
    const absoluteX = coords.x + coords.size / 2;
    const absoluteY = coords.y + coords.size / 2;
    
    spawnButterfly(absoluteX, absoluteY, lettersData[index], false);
    playChime(index);
  };

  // Transform an individual melody bloom to a butterfly on click (and preview song)
  const transformIndividualMelody = (index) => {
    if (melodyTransformed[index] || isMelodyRunning) return;
    setMelodyTransformed(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    const coords = BLOOM_COORDINATES[index];
    const absoluteX = coords.x + coords.size / 2;
    const absoluteY = coords.y + coords.size / 2;
    
    spawnButterfly(absoluteX, absoluteY, lettersData[index], true);
    playChime(index);
    // Play preview of this specific song immediately
    handlePlaySong(lettersData[index].song, lettersData[index].songTitle);
  };

  // Trigger Memory Bouquet Sequential Transformation (skipping already transformed ones)
  const handleMemoryClick = () => {
    if (isMemoryRunning) return;
    
    // Reset if all are already transformed
    if (memoryTransformed.every(val => val === true)) {
      setMemoryTransformed(Array(22).fill(false));
      return;
    }

    setIsMemoryRunning(true);
    
    // Get list of indices not yet transformed
    const remainingIndices = [];
    memoryTransformed.forEach((val, idx) => {
      if (!val) remainingIndices.push(idx);
    });

    let step = 0;
    const interval = setInterval(() => {
      if (step < remainingIndices.length) {
        const idx = remainingIndices[step];
        setMemoryTransformed(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });

        const coords = BLOOM_COORDINATES[idx];
        const absoluteX = coords.x + coords.size / 2;
        const absoluteY = coords.y + coords.size / 2;
        
        spawnButterfly(absoluteX, absoluteY, lettersData[idx], false);
        playChime(idx);
        step++;
      } else {
        clearInterval(interval);
        setIsMemoryRunning(false);
      }
    }, 320);
  };

  // Trigger Melody Bouquet Sequential Transformation (skipping already transformed ones)
  const handleMelodyClick = () => {
    if (isMelodyRunning) return;
    
    // Reset if all are already transformed
    if (melodyTransformed.every(val => val === true)) {
      setMelodyTransformed(Array(22).fill(false));
      return;
    }

    setIsMelodyRunning(true);

    const remainingIndices = [];
    melodyTransformed.forEach((val, idx) => {
      if (!val) remainingIndices.push(idx);
    });

    let step = 0;
    const interval = setInterval(() => {
      if (step < remainingIndices.length) {
        const idx = remainingIndices[step];
        setMelodyTransformed(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });

        const coords = BLOOM_COORDINATES[idx];
        const absoluteX = coords.x + coords.size / 2;
        const absoluteY = coords.y + coords.size / 2;
        
        spawnButterfly(absoluteX, absoluteY, lettersData[idx], true);
        playChime(idx);
        step++;
      } else {
        clearInterval(interval);
        setIsMelodyRunning(false);
      }
    }, 320);
  };

  const isAllMemoryTransformed = memoryTransformed.every(val => val === true);
  const isAllMelodyTransformed = melodyTransformed.every(val => val === true);

  return (
    <div className="unlocked-page-container">
      {/* Star Field Background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}

      <div className="unlocked-card">
        <div className="unlocked-icon">🕊️</div>
        <h1 className="unlocked-title">The Inner Chamber</h1>
        <p className="unlocked-status">Unlocked Successfully</p>
        
        <div className="divider"></div>
        
        <p className="unlocked-description">
          "I have found in you my home, my peace, and my sanctuary."
        </p>

        {/* Bouquets Area */}
        <div className="bouquets-grid">
          {/* Memory (Photo) Bouquet */}
          <div className="bouquet-wrapper">
            <h3 className="bouquet-title">Memory Bouquet (Photos)</h3>
            
            <div className="bouquet-display-area" onClick={handleMemoryClick}>
              <div className="bloom-cluster">
                {lettersData.map((data, idx) => {
                  const coords = BLOOM_COORDINATES[idx];
                  return (
                    <div
                      key={`memory-${idx}`}
                      className={`bloom photo-bloom ${memoryTransformed[idx] ? 'transformed' : ''}`}
                      style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        width: `${coords.size}px`,
                        height: `${coords.size}px`,
                        backgroundImage: `url(${data.image})`,
                        zIndex: 22 - idx,
                        clipPath: FLOWER_CLIP_PATH,
                        WebkitClipPath: FLOWER_CLIP_PATH
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        transformIndividualMemory(idx);
                      }}
                      title={`Photo: ${data.title}`}
                    />
                  );
                })}
              </div>
              <div className="stems-wrapper">
                <div className="stems-lines">
                  <div className="stem"></div>
                  <div className="stem"></div>
                  <div className="stem"></div>
                  <div className="stem"></div>
                </div>
                <div className="ribbon-wrap"></div>
              </div>
            </div>

            <p className="bouquet-action-hint">
              {isAllMemoryTransformed 
                ? "✨ All memories floating! Tap to re-gather." 
                : isMemoryRunning 
                  ? "🌸 Transforming..." 
                  : "Tap Bouquet to release Butterflies"}
            </p>
          </div>

          {/* Melody (Song) Bouquet */}
          <div className="bouquet-wrapper">
            <h3 className="bouquet-title">Melody Bouquet (Songs)</h3>
            
            <div className="bouquet-display-area" onClick={handleMelodyClick}>
              <div className="bloom-cluster">
                {lettersData.map((data, idx) => {
                  const coords = BLOOM_COORDINATES[idx];
                  return (
                    <div
                      key={`melody-${idx}`}
                      className={`bloom record-bloom ${melodyTransformed[idx] ? 'transformed' : ''}`}
                      style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        width: `${coords.size}px`,
                        height: `${coords.size}px`,
                        zIndex: 22 - idx,
                        clipPath: FLOWER_CLIP_PATH,
                        WebkitClipPath: FLOWER_CLIP_PATH
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        transformIndividualMelody(idx);
                      }}
                      title={`Song: ${data.songTitle}`}
                    >
                      <div className="record-bloom-label"></div>
                    </div>
                  );
                })}
              </div>
              <div className="stems-wrapper">
                <div className="stems-lines">
                  <div className="stem"></div>
                  <div className="stem"></div>
                  <div className="stem"></div>
                  <div className="stem"></div>
                </div>
                <div className="ribbon-wrap"></div>
              </div>
            </div>

            <p className="bouquet-action-hint">
              {isAllMelodyTransformed 
                ? "✨ All melodies released! Tap to re-gather." 
                : isMelodyRunning 
                  ? "🎵 Transforming..." 
                  : "Tap Bouquet to release Butterflies"}
            </p>
          </div>
        </div>

        {/* Book of Memories Section */}
        <div className="book-section">
          <h2 className="book-section-title">The Book of Memories</h2>
          
          {!bookOpen ? (
            /* Closed Book Cover */
            <div className="book-outer-container">
              <div 
                className="book-cover-wrapper"
                onClick={() => {
                  playChime(5);
                  setBookOpen(true);
                }}
              >
                <div className="book-cover">
                  <div className="book-cover-ornament ornament-tl"></div>
                  <div className="book-cover-ornament ornament-tr"></div>
                  <div className="book-cover-ornament ornament-bl"></div>
                  <div className="book-cover-ornament ornament-br"></div>
                  
                  <div className="cover-heart-seal">❤</div>
                  <h3 className="cover-title">Book of Memories</h3>
                  <p className="cover-subtitle">Locked Behind 4 Chapters</p>
                  <button className="open-book-prompt">Open Book</button>
                </div>
              </div>
            </div>
          ) : (
            /* Open Book Layout */
            <>
              <div className="book-outer-container">
                <div className="book-inner">
                  {/* Central Spine */}
                  <div className="book-spine-spine"></div>
                  <div className="book-bookmark-ribbon"></div>
                  
                  {/* Page Turning Flip Leaf Overlay (Always mounted to compile styles and prevent rendering lag) */}
                  <div key={flipKey} className={`book-flip-page ${isPageTurning ? (isFastFlip ? 'turning-left-fast' : 'turning-left') : ''}`}></div>

                  {/* LEFT PAGE: Table of Contents / Index (Hidden on Mobile) */}
                  <div className="book-page-leaf left-leaf">
                    <h3 className="index-title">Table of Contents</h3>
                    <ul className="index-list">
                      {BOOK_CHAPTERS.map((chap) => {
                        const isUnlocked = unlockedChapters.includes(chap.id);
                        const isActive = currentChapter === chap.id;
                        return (
                          <li 
                            key={chap.id}
                            className={`index-item ${isActive ? 'active' : ''}`}
                            onClick={() => turnToChapter(chap.id)}
                          >
                            <span className="index-item-title">{chap.title}</span>
                            <span className="index-item-status">
                              {isUnlocked ? "🌸" : "🔒"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <button className="relock-book-btn" onClick={handleRelockBook}>
                      Close & Lock Book
                    </button>
                  </div>

                  {/* RIGHT PAGE: Active Chapter Content */}
                  {(() => {
                    const activeChap = BOOK_CHAPTERS.find(c => c.id === currentChapter);
                    if (!activeChap) return null;
                    
                    const isUnlocked = unlockedChapters.includes(activeChap.id);
                    const isShaking = shakingChapterId === activeChap.id;
                    const inputValue = enteredAnswers[activeChap.id] || '';
                    
                    return (
                      <div className={`book-page-leaf right-leaf ${isShaking ? 'shake' : ''}`}>
                        <div className="chapter-header">
                          <h4 className="chapter-number-title">{activeChap.title}</h4>
                          <span className={`chapter-badge ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}>
                            {isUnlocked ? "Unlocked" : "Locked"}
                          </span>
                        </div>

                        {!isUnlocked ? (
                          /* Chapter Q&A Lock Form */
                          <div className="book-lock-container">
                            <div className="book-lock-icon">🔒</div>
                            <p className="book-lock-prompt">{activeChap.question}</p>
                            <form 
                              className="book-lock-form"
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleVerifyAnswer(activeChap.id);
                              }}
                            >
                              <input
                                type="text"
                                className="book-lock-input"
                                placeholder="Your answer..."
                                value={inputValue}
                                onChange={(e) => handleAnswerChange(activeChap.id, e.target.value)}
                              />
                              <button type="submit" className="book-lock-submit-btn">
                                Verify & Open
                              </button>
                            </form>
                          </div>
                        ) : (
                          /* Chapter Handwritten Letter Content */
                          <div className="book-chapter-content">
                            <p className="book-letter-text">{activeChap.letterText}</p>
                            <button 
                              className="book-relock-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRelockChapter(activeChap.id);
                              }}
                            >
                              Re-lock Chapter
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Responsive Navigation Controls */}
              <div className="book-nav-controls">
                <button 
                  className="book-nav-btn"
                  disabled={currentChapter === 1 || isPageTurning}
                  onClick={() => turnToChapter(currentChapter - 1)}
                >
                  ◀ Prev
                </button>
                <span className="book-nav-page-num">
                  Chapter {currentChapter} of 4
                </span>
                <button 
                  className="book-nav-btn"
                  disabled={currentChapter === 4 || isPageTurning}
                  onClick={() => turnToChapter(currentChapter + 1)}
                >
                  Next ▶
                </button>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Butterflies Render List */}
        {butterflies.map((b) => (
          <div
            key={b.id}
            className="butterfly-container"
            style={{
              left: `${b.x + (b.isMelody ? 440 : 40)}px`, // offsets relative to card wrapper
              top: `${b.y + 110}px`,
              '--drift-x-10': `${b.d10}px`,
              '--drift-x-50': `${b.d50}px`,
              '--drift-x-90': `${b.d90}px`,
              '--drift-x-100': `${b.d100}px`
            }}
          >
            <div 
              className="butterfly-wings-wrapper"
              onClick={(e) => {
                e.stopPropagation();
                if (b.isMelody) {
                  handlePlaySong(b.song, b.songTitle);
                } else {
                  setActivePhoto(b.image);
                }
              }}
              style={{ cursor: 'pointer' }}
              title={b.isMelody ? `Play preview: ${b.songTitle}` : "Click to view photo"}
            >
              <div className="butterfly-body"></div>
              <div 
                className={`butterfly-wing left-wing ${b.isMelody ? 'glowing-melody-left' : ''}`}
                style={b.isMelody ? {} : { backgroundImage: `url(${b.image})` }}
              />
              <div 
                className={`butterfly-wing right-wing ${b.isMelody ? 'glowing-melody-right' : ''}`}
                style={b.isMelody ? {} : { backgroundImage: `url(${b.image})` }}
              />
              {b.isMelody && (
                <div className="song-floating-banner">
                  ♫ {b.songTitle}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Feedback Alert for Playing Music Preview */}
        {activeSongPlaying && (
          <div className="active-player-alert">
            <span className="music-pulse">🎵</span> Playing Preview: <strong>{activeSongPlaying}</strong>
          </div>
        )}

        <div className="next-steps-info">
          <span className="info-icon">✨</span>
          <p>
            You've unlocked the magic chambers. Click the butterflies as they fly to catch a memory photo or play a song preview!
          </p>
        </div>

        <button className="lock-again-btn" onClick={onBack}>
          Return to Garden
        </button>
      </div>

      {/* Lightbox Photo Modal */}
      {activePhoto && (
        <div className="photo-lightbox-overlay" onClick={() => setActivePhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActivePhoto(null)}>×</button>
            <img src={activePhoto} alt="Unlocked Memory" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
