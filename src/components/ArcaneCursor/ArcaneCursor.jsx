import { useEffect, useRef } from 'react';
import './ArcaneCursor.css';

export default function ArcaneCursor() {
  const canvasRef   = useRef(null);
  const outerRef    = useRef(null);
  const dotRef      = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const outer  = outerRef.current;
    const dot    = dotRef.current;
    if (!canvas || !outer || !dot) return;

    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const PALETTE = [
      [245, 200, 66],
      [0, 229, 255],
      [255, 63, 164],
      [255, 255, 255],
      [180, 120, 255],
    ];

    const particles = [];
    const trail     = [];
    const TRAIL_LEN = 10;
    let mx = -200, my = -200;
    let ox = -200, oy = -200;
    let vx = 0,    vy = 0;
    let lastSpawn = 0;
    let rafId;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function drawStar(c, cx, cy, spikes, outerR, innerR) {
      let rot  = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      c.beginPath();
      c.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        c.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR); rot += step;
        c.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
      }
      c.lineTo(cx, cy - outerR);
      c.closePath();
      c.fill();
    }

    class Particle {
      constructor(x, y, pvx, pvy, color, type) {
        this.x = x; this.y = y;
        this.vx = pvx; this.vy = pvy;
        this.life  = 1;
        this.decay = Math.random() * 0.03 + 0.02;
        this.color = color;
        this.size  = Math.random() * 3.5 + 1;
        this.type  = type || 'circle';
        this.gravity = type === 'spark' ? 0.12 : 0.04;
        this.spin  = (Math.random() - 0.5) * 0.2;
        this.angle = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += this.gravity; this.vx *= 0.98;
        this.angle += this.spin;
        this.life  -= this.decay;
      }
      draw(c) {
        const [r, g, b] = this.color;
        c.save();
        c.globalAlpha = Math.max(0, this.life);
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        if (this.type === 'star') {
          c.fillStyle   = `rgb(${r},${g},${b})`;
          c.shadowBlur  = 10;
          c.shadowColor = `rgb(${r},${g},${b})`;
          drawStar(c, 0, 0, 4, this.size * 1.4, this.size * 0.55);
        } else if (this.type === 'spark') {
          c.strokeStyle = `rgb(${r},${g},${b})`;
          c.lineWidth   = this.life * 1.5;
          c.shadowBlur  = 6;
          c.shadowColor = `rgb(${r},${g},${b})`;
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(-this.vx * 3, -this.vy * 3);
          c.stroke();
        } else {
          const grad = c.createRadialGradient(0,0,0,0,0,this.size*2);
          grad.addColorStop(0, `rgba(${r},${g},${b},${this.life})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          c.beginPath();
          c.arc(0, 0, this.size * 2, 0, Math.PI * 2);
          c.fillStyle = grad;
          c.fill();
        }
        c.restore();
      }
    }

    const onMouseMove = e => {
      const prev = { x: mx, y: my };
      mx = e.clientX; my = e.clientY;
      vx = mx - prev.x; vy = my - prev.y;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';

      const now = performance.now();
      if (now - lastSpawn > 16) {
        lastSpawn = now;
        const speed = Math.sqrt(vx*vx + vy*vy);
        const count = Math.min(Math.floor(speed / 5) + 1, 6);
        for (let i = 0; i < count; i++) {
          const col  = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          const type = Math.random() < 0.25 ? 'star' : (Math.random() < 0.4 ? 'spark' : 'circle');
          particles.push(new Particle(
            mx + (Math.random()-.5)*8, my + (Math.random()-.5)*8,
            (Math.random()-.5)*3 + vx*0.15, (Math.random()-.5)*3 + vy*0.15,
            col, type
          ));
        }
      }
      trail.push({ x: mx, y: my });
      if (trail.length > TRAIL_LEN) trail.shift();
    };

    const onMouseDown = () => {
      document.body.classList.add('arcane-clicking');
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const col   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const type  = Math.random() < 0.5 ? 'star' : 'spark';
        particles.push(new Particle(mx, my, Math.cos(angle)*speed, Math.sin(angle)*speed, col, type));
      }
    };
    const onMouseUp = () => document.body.classList.remove('arcane-clicking');

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

    /* hover detection on interactive elements */
    const addHover = () => {
      document.querySelectorAll('a, button, .pill, .skill-card, .project-card, .exp-card, .about-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('arcane-hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('arcane-hovering'));
      });
    };
    addHover();

    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('resize',       onResize);

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ox = lerp(ox, mx, 0.14);
      oy = lerp(oy, my, 0.14);
      outer.style.left = ox + 'px';
      outer.style.top  = oy + 'px';

      /* comet trail */
for (let i = 1; i < trail.length; i++) {
  const t   = i / trail.length;
  const a   = t * t * 0.28;          // fade older points harder
  const w   = t * 2.5;
  const p   = trail[i-1], q = trail[i];
  const hue = (240 + t * 120) % 360;

  ctx.save();                         // ← save before shadow
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.strokeStyle = `hsla(${hue},100%,75%,${a})`;
  ctx.lineWidth   = w;
  ctx.lineCap     = 'round';
  ctx.shadowBlur  = 6 * t;
  ctx.shadowColor = `hsla(${hue},100%,75%,${a})`;
  ctx.stroke();
  ctx.restore();                      // ← restore clears shadow
}

      /* particles */
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      rafId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('resize',       onResize);
      document.body.classList.remove('arcane-clicking', 'arcane-hovering');
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="arcane-canvas" />
      <div ref={outerRef}  className="arcane-cursor-outer" />
      <div ref={dotRef}    className="arcane-cursor-dot"   />
    </>
  );
}