import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFXZ$#*+=<>';
const FONT_SIZE = 14;

interface Stream {
  /** Y position of the head (px). */
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

/**
 * Matrix rain: columns of glyphs falling with a bright head and a fading
 * tail. Canvas-driven, capped by column count, static frame under
 * prefers-reduced-motion.
 */
export function Matrix({ effect }: EffectProps) {
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

    let width = 1;
    let height = 1;
    let frame = 0;
    let streams: Stream[] = [];

    const newChars = (length: number): string[] =>
      Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!);

    const makeStream = (spread: boolean): Stream => {
      const length = 8 + Math.floor(Math.random() * 14);
      return {
        y: spread ? Math.random() * (height + 200) - 100 : -40 - Math.random() * 200,
        speed: (2.5 + Math.random() * 4) * speed * (FONT_SIZE / 14),
        length,
        chars: newChars(length),
      };
    };

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
      context.font = `700 ${FONT_SIZE}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      context.textAlign = 'center';

      const columns = Math.max(1, Math.floor(width / FONT_SIZE));
      streams = Array.from({ length: columns }, () => makeStream(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;

      streams.forEach((stream, index) => {
        if (!reduceMotion) {
          stream.y += stream.speed;
          if (stream.y - stream.length * FONT_SIZE > height) {
            Object.assign(stream, makeStream(false));
          }
        }

        const x = index * FONT_SIZE + FONT_SIZE / 2;
        for (let k = 0; k < stream.length; k += 1) {
          const charY = stream.y - k * FONT_SIZE;
          if (charY < -FONT_SIZE || charY > height + FONT_SIZE) continue;
          context.globalAlpha =
            k === 0 ? 1 : (1 - k / stream.length) * (0.35 + effect.intensity * 0.5);
          context.fillText(stream.chars[k] ?? '0', x, charY);
        }
      });

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
      data-effect="matrix"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
