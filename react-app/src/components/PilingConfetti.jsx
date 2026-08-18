import React, { useEffect, useRef } from 'react';

export default function PilingConfetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const colors = ['#ffeb3b', '#00bcd4', '#e91e63', '#4caf50', '#ff9a9e'];
    const particles = [];
    const maxParticles = 300;

    // We'll divide the screen into columns to track pile height
    const cols = 40;
    const colWidth = width / cols;
    const pileHeights = new Array(cols).fill(0);

    for (let i = 0; i < maxParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height - height,
            w: 8 + Math.random() * 6,
            h: 8 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 0.8 + Math.random() * 1.5,
            vx: -0.5 + Math.random() * 1,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 2,
            isPiled: false
        });
    }

    let animationFrameId;

    const render = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (!p.isPiled) {
               p.y += p.vy;
               p.x += p.vx;
               p.rot += p.rotSpeed;

               // Apply subtle wind
               p.x += Math.sin(p.y / 50) * 0.8;

               // Check if it reached the pile
               const colIdx = Math.max(0, Math.min(cols - 1, Math.floor(p.x / colWidth)));
               const currentPileHeight = pileHeights[colIdx];
               
               if (p.y >= height - currentPileHeight - p.h) {
                   p.isPiled = true;
                   p.y = height - currentPileHeight - p.h;
                   pileHeights[colIdx] += (p.h * 0.4); // Add to pile height, overlapping slightly
               }

               // Wrap around horizontally
               if (p.x > width) p.x = 0;
               if (p.x < 0) p.x = width;
            }

            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }

        // Add new particles if needed to keep it raining
        if (Math.random() < 0.1 && particles.filter(p => p.isPiled).length < maxParticles * 0.9) {
           particles.push({
                x: Math.random() * width,
                y: -20,
                w: 8 + Math.random() * 6,
                h: 8 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                vy: 0.8 + Math.random() * 1.5,
                vx: -0.5 + Math.random() * 1,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 2,
                isPiled: false
            });
        }

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 104, pointerEvents: 'none' }} />;
}
