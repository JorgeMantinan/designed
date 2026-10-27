import { z } from 'zod';

import { durationMsSchema, easingSchema, intensitySchema } from './common';

/**
 * Animation specs: entrance (scroll/load), hover (buttons, menus, cards).
 *
 * These are pure data: the renderer maps each type to CSS keyframes +
 * transitions (exported as SCSS) or to a small React hook for JS-driven ones.
 */

/** Entrance animations, triggered on scroll or on load. */
export const ENTRANCE_ANIMATION_TYPES = [
  'fade-in',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'zoom-in',
  'blur-in',
  'reveal-up',
] as const;

export const entranceAnimationSchema = z.object({
  type: z.enum(ENTRANCE_ANIMATION_TYPES),
  durationMs: durationMsSchema.default(600),
  delayMs: z.number().int().min(0).max(5000).default(0),
  easing: easingSchema.default('ease-out'),
  /** `scroll` = when the element enters the viewport; `load` = on page load. */
  trigger: z.enum(['scroll', 'load']).default('scroll'),
  /** Play only the first time the element is seen. */
  once: z.boolean().default(true),
});

/** Hover animations for interactive elements (buttons, menu items, cards). */
export const HOVER_ANIMATION_TYPES = [
  'none',
  'lift',
  'scale',
  'glow',
  'tilt',
  'shine',
  'underline',
  'border-draw',
] as const;

export const hoverAnimationSchema = z.object({
  type: z.enum(HOVER_ANIMATION_TYPES),
  durationMs: z.number().int().min(0).max(2000).default(200),
  easing: easingSchema.default('ease'),
  /** Strength of the effect (lift height, glow radius, tilt angle...). */
  intensity: intensitySchema.default(0.5),
});

/** Combined animation slot attached to a component or a section. */
export const animationSchema = z.object({
  entrance: entranceAnimationSchema.optional(),
  hover: hoverAnimationSchema.optional(),
});

export type EntranceAnimationSpec = z.infer<typeof entranceAnimationSchema>;
export type HoverAnimationSpec = z.infer<typeof hoverAnimationSchema>;
export type AnimationSpec = z.infer<typeof animationSchema>;
export type EntranceAnimationType = (typeof ENTRANCE_ANIMATION_TYPES)[number];
export type HoverAnimationType = (typeof HOVER_ANIMATION_TYPES)[number];

/** Input variants (partial-friendly) for building animations by hand. */
export type EntranceAnimationInput = z.input<typeof entranceAnimationSchema>;
export type HoverAnimationInput = z.input<typeof hoverAnimationSchema>;
export type AnimationInput = z.input<typeof animationSchema>;
