/**
 * Medieval treasure & gold coin shower celebration
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'coin' | 'gem' | 'spark' | 'shield';
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
}

const MEDIEVAL_TREASURE_COLORS = [
  '#F59E0B', // Bright Gold
  '#D97706', // Deep Gold
  '#FCD34D', // Shimmer Gold
  '#DC2626', // Ruby Red
  '#2563EB', // Sapphire
  '#059669', // Emerald
  '#E0E7FF', // Silver Spark
  '#FEF3C7', // Coin Glow
];

export function launchPastelConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const particles: Particle[] = [];
  const count = 100;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) + Math.PI; // upwards explosion
    const speed = 5 + Math.random() * 10;
    const shapes: ('coin' | 'gem' | 'spark' | 'shield')[] = ['coin', 'gem', 'spark', 'shield'];

    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height * 0.45 + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * speed - 3,
      size: 7 + Math.random() * 8,
      color: MEDIEVAL_TREASURE_COLORS[Math.floor(Math.random() * MEDIEVAL_TREASURE_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      alpha: 1,
      decay: 0.006 + Math.random() * 0.005,
    });
  }

  let animationFrameId: number;

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;

      activeParticles++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'coin') {
        // Gold Coin with inner rim
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = '#FEF3C7';
        ctx.stroke();
      } else if (p.shape === 'gem') {
        // Rhombus Diamond Gem
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.7);
        ctx.lineTo(p.size * 0.5, 0);
        ctx.lineTo(0, p.size * 0.7);
        ctx.lineTo(-p.size * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (p.shape === 'shield') {
        // Medieval Heraldic Shield
        ctx.beginPath();
        const s = p.size * 0.6;
        ctx.moveTo(-s, -s);
        ctx.lineTo(s, -s);
        ctx.lineTo(s, s * 0.4);
        ctx.quadraticCurveTo(0, s * 1.2, 0, s * 1.2);
        ctx.quadraticCurveTo(0, s * 1.2, -s, s * 0.4);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // 4-pointed radiant spark
        ctx.beginPath();
        const r = p.size * 0.8;
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fillStyle = '#FEF08A';
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, width, height);
  };
}
