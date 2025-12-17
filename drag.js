let highestZ = 1;

class DraggablePaper {
  holding = false;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 16 - 8; // slight tilt for vibe
  currentX = 0;
  currentY = 0;

  init(paper) {
    // Place randomly within viewport (after layout)
    const place = () => {
      const rect = paper.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = Math.min(40, Math.floor(vw * 0.06));
      const maxX = Math.max(margin, vw - rect.width - margin);
      const maxY = Math.max(margin, vh - rect.height - margin);
      this.currentX = Math.floor(Math.random() * maxX);
      this.currentY = Math.floor(Math.random() * maxY);
      paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
      paper.style.zIndex = highestZ++;
    };

    // Run placement once the element has dimensions
    if (document.readyState === 'complete') {
      place();
    } else {
      window.addEventListener('load', place, { once: true });
    }

    paper.addEventListener('pointerdown', (e) => {
      this.holding = true;
      paper.setPointerCapture(e.pointerId);
      paper.style.zIndex = highestZ++;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });

    paper.addEventListener('pointermove', (e) => {
      if (!this.holding) return;
      this.velX = e.clientX - this.prevX;
      this.velY = e.clientY - this.prevY;
      this.currentX += this.velX;
      this.currentY += this.velY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
      paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
    });

    const endDrag = () => {
      this.holding = false;
    };
    paper.addEventListener('pointerup', endDrag);
    paper.addEventListener('pointercancel', endDrag);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new DraggablePaper();
  p.init(paper);
});
