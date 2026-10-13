import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'heart' | 'star';
  opacity: number;
}

interface ConfettiCanvasProps {
  triggerKey?: number;
}

const COLORS = [
  '#38bdf8', // sky-400
  '#0284c7', // sky-600
  '#7dd3fc', // sky-300
  '#bae6fd', // sky-200
  '#ffffff', // soft white
  '#fef08a', // delicate gold/sunshine
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ triggerKey = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const spawnBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const count = 90;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      // Launch from bottom corners or mid-screen
      const startX = width * (0.2 + Math.random() * 0.6);
      const startY = height * 0.4 + (Math.random() * height * 0.2);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = 4 + Math.random() * 9;

      const shapes: Particle['shape'][] = ['rect', 'rect', 'circle', 'heart', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      newParticles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        shape,
        opacity: 1,
      });
    }

    particlesRef.current.push(...newParticles);
    if (!animFrameRef.current) {
      animate();
    }
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    const d = size * 0.8;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
    ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
        -Math.sin(((18 + i * 72) * Math.PI) / 180) * size
      );
      ctx.lineTo(
        Math.cos(((54 + i * 72) * Math.PI) / 180) * (size * 0.45),
        -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size * 0.45)
      );
    }
    ctx.closePath();
    ctx.fill();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.985; // friction
      p.rotation += p.vRot;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.8);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'heart') {
        drawHeart(ctx, p.size);
      } else if (p.shape === 'star') {
        drawStar(ctx, p.size * 0.8);
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      animFrameRef.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (triggerKey > 0) {
      spawnBurst();
    }
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};
