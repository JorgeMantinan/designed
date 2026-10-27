import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Piece {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  sway: number;
  phase: number;
  alpha: number;
}

/**
 * Confetti: paper strips falling with sway, spin and varied opacity in
 * the palette color. Canvas-driven, DPR-aware, static frame under
 * prefers-reduced-motion.
 */
export function Confetti({ effect }: EffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const color =
      effect.effectColor?.trim() ||
      getComputedStyle(canvas).getPropertyValue('--color-primary').trim() ||
      '#6c5ce7';
    const speed = Math.max(effect.speed, 0.05);
    const densityPerPx = 0.000008 + effect.intensity * 0.00002;

    let width = 1;
    let height = 1;
    let frame = 0;
    let time = 0;
    let pieces: Piece[] = [];

    const makePiece = (randomY: boolean): Piece => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * (height + 60) : -20 - Math.random() * 80,
      width: 6 + Math.random() * 6,
      height: 10 + Math.random() * 10,
      vy: (1.4 + Math.random() * 2.4) * speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.12,
      sway: 20 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.45 + Math.random() * 0.55,
    });

    const resize = (): void => {
      const rect = host.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round(width * height * densityPerPx), 70);
      pieces = Array.from({ length: count }, () => makePiece(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      if (!reduceMotion) time += 0.02 * speed;

      for (const piece of pieces) {
        if (!reduceMotion) {
          piece.y += piece.vy;
          piece.rotation += piece.rotationSpeed;
          if (piece.y - 30 > height) Object.assign(piece, makePiece(false));
        }

        const swayX = Math.sin(time + piece.phase) * piece.sway;
        context.globalAlpha = piece.alpha;
        context.fillStyle = color;
        context.save();
        context.translate(piece.x + swayX, piece.y);
        context.rotate(piece.rotation);
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      }

      context.globalAlpha = 1;
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [effect]);

  return (
    <canvas
      ref={canvasRef}
      className={`${s.layer} ${s.canvas}`}
      data-effect="confetti"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
