'use client';

import { useMotion } from '@designed/animations';
import type { AnimationInput, ImageOverlayInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cx } from '../cx';
import { Icon } from '../icons';

import s from './Carousel.module.scss';

export interface CarouselSlideData {
  src: string;
  alt?: string;
  title?: string;
  text?: string;
  overlay?: ImageOverlayInput;
}

export interface CarouselProps {
  id?: string;
  slides: CarouselSlideData[];
  /** Overlay applied to slides without their own. */
  overlay?: ImageOverlayInput;
  autoplay?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  showArrows?: boolean;
  ratio?: '16:9' | '4:3' | '3:2' | '21:9';
  animation?: AnimationInput;
  className?: string;
}

function overlayStyle(overlay: ImageOverlayInput): CSSProperties {
  return {
    '--overlay-color': overlay.color ?? '#000000',
    '--overlay-color-to': overlay.colorTo ?? overlay.color ?? '#000000',
    '--overlay-intensity': String(overlay.intensity ?? 0.5),
  } as CSSProperties;
}

/** Image carousel with autoplay, arrows, dots and shading overlays. */
export function Carousel({
  id,
  slides,
  overlay,
  autoplay = true,
  intervalMs = 5000,
  showDots = true,
  showArrows = true,
  ratio = '16:9',
  animation,
  className,
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoplay, intervalMs, count]);

  const goTo = (target: number): void => {
    setIndex(((target % count) + count) % count);
  };

  const aspectRatio = ratio.replace(':', ' / ');

  return (
    <div
      id={id}
      ref={ref}
      className={cx(s.carousel, motion.className, className)}
      style={motion.style}
      data-hover={motion.hoverType}
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
    >
      <div className={s.viewport}>
        <div
          className={s.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            const effectiveOverlay = slide.overlay ?? overlay;
            return (
              <div
                key={`${slide.src}-${slideIndex}`}
                className={s.slide}
                style={{ aspectRatio }}
                aria-hidden={!active}
              >
                <img className={s.img} src={slide.src} alt={slide.alt ?? ''} loading="lazy" />
                {effectiveOverlay && (
                  <span
                    className={cx(
                      'dsg-overlay',
                      `dsg-overlay--${effectiveOverlay.direction}`,
                      effectiveOverlay.type !== 'gradient' &&
                        `dsg-overlay--${effectiveOverlay.type}`,
                    )}
                    style={overlayStyle(effectiveOverlay)}
                  />
                )}
                {(slide.title || slide.text) && (
                  <figcaption className={s.caption}>
                    {slide.title && <h3 className={s.captionTitle}>{slide.title}</h3>}
                    {slide.text && <p className={s.captionText}>{slide.text}</p>}
                  </figcaption>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            className={cx(s.arrow, s.arrowLeft)}
            onClick={() => goTo(index - 1)}
            aria-label="Diapositiva anterior"
          >
            <Icon name="chevron-left" size={22} />
          </button>
          <button
            type="button"
            className={cx(s.arrow, s.arrowRight)}
            onClick={() => goTo(index + 1)}
            aria-label="Diapositiva siguiente"
          >
            <Icon name="chevron-right" size={22} />
          </button>
        </>
      )}

      {showDots && count > 1 && (
        <div className={s.dots} role="group" aria-label="Seleccionar diapositiva">
          {slides.map((slide, dotIndex) => (
            <button
              key={`dot-${slide.src}-${dotIndex}`}
              type="button"
              className={cx(s.dot, dotIndex === index && s.dotActive)}
              onClick={() => goTo(dotIndex)}
              aria-label={`Ir a la diapositiva ${dotIndex + 1}`}
              aria-current={dotIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
