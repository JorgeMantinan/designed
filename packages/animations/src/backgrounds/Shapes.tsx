import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vy: number;
  /**3=triangle,4=square,6=hexagon,0=circle. */
  sides: number;
  alpha: number;
  filled: boolean;
}

const SIDES = [3, 4, 6, 0];

/**
 * Shapes: geometric outlines (triangles, squares, hexagons, circles)
 * floating up slowly and rotating, half of them faintly filled.
 * Canvas-driven.
 */
export function Shapes({ effect }: EffectProps) {
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
    const densityPerPx = 0.000006 + effect.intensity * 0.000012;

    let width = 1;
    let height = 1;
    let frame = 0;
    let shapes: Shape[] = [];

    const makeShape = (randomY: boolean): Shape => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * (height + 80) : height + 60 + Math.random() * 60,
      size: 12 + Math.random() * 26,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      vy: (0.25 + Math.random() * 0.7) * speed,
      sides: SIDES[Math.floor(Math.random() * SIDES.length)]!,
      alpha: 0.2 + Math.random() * 0.5,
      filled: Math.random() > 0.5,
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

      const count = Math.min(Math.round(width * height * densityPerPx), 46);
      shapes = Array.from({ length: count }, () => makeShape(true));
    };

    const trace = (shape: Shape): void => {
      context.beginPath();
      if (shape.sides === 0) {
        context.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        return;
      }
      for (let side = 0; side < shape.sides; side += 1) {
        const angle = (side / shape.sides) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(angle) * (shape.size / 2);
        const py = Math.sin(angle) * (shape.size / 2);
        if (side === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      for (const shape of shapes) {
        if (!reduceMotion) {
          shape.y -= shape.vy;
          shape.rotation += shape.rotationSpeed;
          if (shape.y < -80) Object.assign(shape, makeShape(false));
        }

        context.save();
        context.translate(shape.x, shape.y);
        context.rotate(shape.rotation);
        trace(shape);
        context.globalAlpha = shape.alpha * (0.4 + effect.intensity * 0.6);
        context.strokeStyle = color;
        context.lineWidth = 1.6;
        context.stroke();
        if (shape.filled) {
          context.globalAlpha = shape.alpha * 0.15 * effect.intensity;
          context.fillStyle = color;
          context.fill();
        }
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
      data-effect="shapes"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
