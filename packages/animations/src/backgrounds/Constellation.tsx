import { useCallback, useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars, useHostPointer } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Max distance (px) between two nodes to draw a connection line. */
const LINK_DISTANCE = 120;
/** Radius (px) around the pointer where nodes light up and link to it. */
const POINTER_RADIUS = 170;

/**
 * Constellation: drifting nodes joined by proximity lines, with extra
 * links from the pointer to every node inside the pointer radius —
 * the classic "particles network" effect, canvas-driven and DPR-aware.
 */
export function Constellation({ effect, hostRef }: EffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  const track = useCallback((x: number, y: number, rect: DOMRect) => {
    pointer.current = { x: x - rect.left, y: y - rect.top };
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
    const densityPerPx = 0.000012 + effect.intensity * 0.000035;
    const linkAlpha = 0.2 + effect.intensity * 0.45;

    let width = 1;
    let height = 1;
    let frame = 0;
    let nodes: Node[] = [];

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

      const count = Math.min(Math.round(width * height * densityPerPx), 90);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45 * speed,
        vy: (Math.random() - 0.5) * 0.45 * speed,
      }));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0) node.x = width;
          else if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          else if (node.y > height) node.y = 0;
        }
      }

      // Lines between nearby nodes.
      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j]!;
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;
          context.globalAlpha = (1 - distance / LINK_DISTANCE) * linkAlpha;
          context.strokeStyle = color;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      // Nodes + links to the pointer.
      const px = pointer.current.x;
      const py = pointer.current.y;
      context.strokeStyle = color;
      context.fillStyle = color;
      for (const node of nodes) {
        const distance = Math.hypot(node.x - px, node.y - py);
        const near = distance < POINTER_RADIUS;
        if (near) {
          context.globalAlpha = (1 - distance / POINTER_RADIUS) * (linkAlpha + 0.3);
          context.lineWidth = 1.3;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(px, py);
          context.stroke();
        }
        context.globalAlpha = near ? 0.95 : 0.45;
        context.beginPath();
        context.arc(node.x, node.y, near ? 2.6 : 1.7, 0, Math.PI * 2);
        context.fill();
      }

      // Soft glow marker at the pointer itself.
      context.globalAlpha = 0.25;
      context.beginPath();
      context.arc(px, py, 16, 0, Math.PI * 2);
      context.stroke();
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
      data-effect="constellation"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
