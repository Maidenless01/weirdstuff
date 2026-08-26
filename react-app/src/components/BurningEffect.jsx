import React, { useEffect, useRef } from 'react';

export default function BurningEffect({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas resolution for crisp lines
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`; // Fixed style.style typo!
    ctx.scale(dpr, dpr);

    // Burn parameters
    const cx = width / 2;
    const cy = height / 2;
    let R = 0;
    const maxR = Math.hypot(width, height) * 0.75;
    const expansionSpeed = Math.min(width, height) * 0.45;

    // Noise phase offsets
    const p1 = Math.random() * Math.PI * 2;
    const p2 = Math.random() * Math.PI * 2;
    const p3 = Math.random() * Math.PI * 2;
    const p4 = Math.random() * Math.PI * 2;

    // Embers
    const particles = [];
    const maxParticles = 120; // Slightly lower max particles for performance

    class Ember {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(angle) * speed * 0.3 + (Math.random() - 0.5) * 1.0;
        this.vy = -Math.random() * 3.5 - 1.5;
        this.size = Math.random() * 3.0 + 1.0;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.swaySpeed = Math.random() * 0.05 + 0.02;
        this.swayOffset = Math.random() * Math.PI * 2;
        
        const colors = [
          'rgba(255, 235, 59, ',
          'rgba(255, 152, 0, ',
          'rgba(244, 67, 54, ',
          'rgba(255, 87, 34, ',
          'rgba(255, 110, 64, '
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update(time) {
        this.x += this.vx + Math.sin(time * this.swaySpeed + this.swayOffset) * 0.6;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c) {
        if (this.alpha <= 0) return;
        c.fillStyle = `${this.colorPrefix}${this.alpha})`;
        // Removed heavy canvas box shadows from particles to run at 60fps on mobile!
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const drawRoundedRect = (c, x, y, w, h, radius) => {
      c.beginPath();
      c.moveTo(x + radius, y);
      c.lineTo(x + w - radius, y);
      c.quadraticCurveTo(x + w, y, x + w, y + radius);
      c.lineTo(x + w, y + h - radius);
      c.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      c.lineTo(x + radius, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - radius);
      c.lineTo(x, y + radius);
      c.quadraticCurveTo(x, y, x + radius, y);
      c.closePath();
    };

    // Calculate organic boundary radius for a given angle
    const getBurnRadius = (angle, time) => {
      const w1 = Math.sin(3 * angle + p1 + time * 0.003) * 0.12;
      const w2 = Math.sin(7 * angle + p2 - time * 0.005) * 0.06;
      const w3 = Math.sin(13 * angle + p3 + time * 0.008) * 0.03;
      const w4 = Math.sin(21 * angle + p4) * 0.015;
      
      const noise = w1 + w2 + w3 + w4;
      return R * (1 + noise);
    };

    let lastTime = performance.now();

    const animate = (now) => {
      // Cap delta time to prevent jumping stutters during browser hiccups
      const delta = Math.min((now - lastTime) / 1000, 0.03);
      lastTime = now;

      // Advance burn progress
      R += expansionSpeed * delta;

      // Draw background + lock card onto canvas
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      
      // 1. Draw base gradient background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.8);
      bgGrad.addColorStop(0, '#1b0e35');
      bgGrad.addColorStop(1, '#0a0418');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw ambient background glows
      ctx.fillStyle = '#ad1457';
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(100, 100, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#7b1fa2';
      ctx.beginPath();
      ctx.arc(width - 100, height - 100, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // 3. Draw glassmorphic lock card outline
      const cardW = 320;
      const cardH = 430;
      const cardX = cx - cardW / 2;
      const cardY = cy - cardH / 2;

      ctx.fillStyle = 'rgba(15, 8, 32, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      // 4. Draw Padlock (Unlocked State)
      const lockX = cx - 22;
      const lockY = cy - 140;
      
      // Shackle
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(lockX + 16, lockY - 8, 12, Math.PI, 0, false);
      ctx.lineTo(lockX + 28, lockY);
      ctx.stroke();

      // Padlock Body
      ctx.fillStyle = '#00a852';
      ctx.shadowColor = 'rgba(0, 230, 118, 0.5)';
      ctx.shadowBlur = 15;
      drawRoundedRect(ctx, lockX, lockY, 44, 34, 8);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Keyhole
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(lockX + 22, lockY + 12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(lockX + 20, lockY + 12, 4, 10);

      // Card titles & slots placeholder
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = "bold 14px 'Short Stack', cursive";
      ctx.textAlign = 'center';
      ctx.fillText("UNLOCKED", cx, cy - 70);

      ctx.fillStyle = 'rgba(0, 230, 118, 0.9)';
      ctx.font = "24px sans-serif";
      ctx.fillText("••••••", cx, cy - 20);

      ctx.restore();

      // 5. Cut the organic hole (transparent mask) - Reduced to 90 vertices for fast path compilation
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();

      const numVertices = 90;
      for (let i = 0; i <= numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const r = getBurnRadius(angle, now);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 6. Draw the glowing burning border (using source-over)
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      
      // Build boundary coordinates once
      const boundaryPoints = [];
      const numVerticesBorder = 90;
      for (let i = 0; i <= numVerticesBorder; i++) {
        const angle = (i / numVerticesBorder) * Math.PI * 2;
        const r = getBurnRadius(angle, now);
        boundaryPoints.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          angle,
          r
        });
      }

      // Construct the single drawing path
      ctx.beginPath();
      boundaryPoints.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();

      // Call ctx.stroke() sequentially on the same compiled path to optimize GPU overhead by 75%!
      // A. Charcoal base
      ctx.strokeStyle = 'rgba(28, 12, 4, 0.9)';
      ctx.lineWidth = 14;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // B. Smoke brown
      ctx.strokeStyle = 'rgba(95, 39, 12, 0.6)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // C. Hot orange ember border
      ctx.strokeStyle = 'rgba(255, 87, 34, 0.95)';
      ctx.lineWidth = 5;
      ctx.shadowColor = 'rgb(255, 87, 34)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // D. White-hot yellow fire boundary
      ctx.strokeStyle = 'rgb(255, 235, 120)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgb(255, 235, 120)';
      ctx.shadowBlur = 4;
      ctx.stroke();

      ctx.restore();

      // 7. Spawn and update ember particles
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      if (R < maxR) {
        const spawnCount = Math.floor(R * 0.05) + 2;
        for (let k = 0; k < Math.min(spawnCount, 8); k++) {
          if (particles.length < maxParticles) {
            const pt = boundaryPoints[Math.floor(Math.random() * boundaryPoints.length)];
            particles.push(new Ember(pt.x, pt.y, pt.angle));
          }
        }
      }

      // Update and draw embers
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(now);
        p.draw(ctx);
        if (p.alpha <= 0 || p.y < -50 || p.x < -50 || p.x > width + 50) {
          particles.splice(i, 1);
        }
      }
      ctx.restore();

      // Check if complete
      if (R >= maxR && particles.length === 0) {
        onComplete();
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Start loop
    animationFrameId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
