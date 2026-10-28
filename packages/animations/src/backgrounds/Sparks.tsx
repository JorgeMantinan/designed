import { useCallback, useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars, useHostPointer } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Sparks: small bursts of particles flying out from the pointer as it
 * moves, with gravity and fading trails. Pure canvas — bursts are queued
 * from the pointer handler and consumed by the animation loop.
 */
export function Sparks({ effect, hostRef }: EffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const queue = useRef<Spark[]>([]);
  const last = useRef({ x: -9999, y: -9999, queued: false });

  const track = useCallback((x: number, y: number, rect: DOMRect) => {
    const localX = x - rect.left;
    const localY = y - rect.top;
    const previous = last.current;
    const moved = Math.hypot(localX - previous.x, localY - previous.y);
    last.current = { x: localX, y: localY, queued: true };
    // Burst only after real movement (avoid spamming while idle).
    if (moved < 6 || queue.current.length > 240) return;
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const force = 1 + Math.random() * 3;
      queue.current.push({
        x: localX,
        y: localY,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 1,
        life: 0,
        maxLife: 30 + Math.random() * 30,
        size: 1 + Math.random() * 2,
      });
    }
  }, []);
  useHostPointer(hostRef, track);

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

    let width = 1;
    let height = 1;
    let frame = 0;
    let ambient: Spark[] = [];

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

      // Gentle ambient sparks so the section is alive before any pointer move.
      ambient = Array.from({ length: 18 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.6,
        life: Math.random() * 60,
        maxLife: 60 + Math.random() * 60,
        size: 1 + Math.random() * 1.6,
      }));
    };

    const advance = (spark: Spark): void => {
      spark.life += 1;
      spark.x += spark.vx * speed;
      spark.y += spark.vy * speed;
      spark.vy += 0.06; // gravity
      spark.vx *= 0.98;
    };

    const paint = (spark: Spark): void => {
      const progress = spark.life / spark.maxLife;
      context.globalAlpha = Math.max(0, 1 - progress) * (0.4 + effect.intensity * 0.5);
      context.fillStyle = color;
      context.beginPath();
      context.arc(spark.x, spark.y, spark.size * (1 - progress * 0.5), 0, Math.PI * 2);
      context.fill();
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      // Consume pointer bursts.
      if (queue.current.length > 0) {
        ambient.push(...queue.current.splice(0, queue.current.length));
      }

      for (const spark of ambient) {
        if (!reduceMotion) {
          advance(spark);
          if (spark.life >= spark.maxLife) {
            // Pointer sparks die; ambient ones respawn elsewhere.
            spark.x = Math.random() * width;
            spark.y = height * (0.4 + Math.random() * 0.7);
            spark.vx = (Math.random() - 0.5) * 0.6;
            spark.vy = -0.3 - Math.random() * 0.6;
            spark.life = 0;
          }
        }
        paint(spark);
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
      data-effect="sparks"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
