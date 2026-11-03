import { describe, expect, it } from 'vitest';

import { componentSchema } from './components';

/** One valid sample per component type of the union. */
const validSamples = [
  { type: 'heading', id: 'c-titulo', text: 'Hola' },
  { type: 'text', id: 'c-texto', text: 'Un párrafo de ejemplo' },
  { type: 'buttonGroup', id: 'c-botones', buttons: [{ id: 'c-boton-1', label: 'Acción' }] },
  { type: 'badge', id: 'c-badge', label: 'Nuevo' },
  { type: 'image', id: 'c-imagen', src: 'https://example.com/imagen.jpg' },
  { type: 'featureCard', id: 'c-feature', title: 'Título', text: 'Descripción' },
  {
    type: 'pricingCard',
    id: 'c-precio',
    planName: 'Pro',
    price: '19',
    features: ['Función uno'],
  },
  { type: 'testimonialCard', id: 'c-testimonio', quote: '¡Genial!', author: 'Ana' },
  { type: 'stat', id: 'c-stat', value: '99%', label: 'Uptime' },
  { type: 'featureList', id: 'c-lista', items: [{ title: 'Uno', text: 'Detalle' }] },
  { type: 'faqList', id: 'c-faq', items: [{ question: '¿Pregunta?', answer: 'Respuesta.' }] },
  { type: 'logoCloud', id: 'c-logos', logos: [{ src: 'https://example.com/logo.svg' }] },
  { type: 'carousel', id: 'c-carrusel', slides: [{ src: 'https://example.com/slide.jpg' }] },
  { type: 'divider', id: 'c-separador' },
  { type: 'spacer', id: 'c-espaciador' },
  { type: 'contactForm', id: 'c-formulario' },
  { type: 'countdown', id: 'c-cuenta-atras', target: '2026-12-31T23:59' },
] as const;

describe('componentSchema', () => {
  it('tiene un sample válido por cada tipo del catálogo', () => {
    expect(validSamples).toHaveLength(17);
  });

  it.each(validSamples)('acepta el componente $type', (sample) => {
    expect(componentSchema.safeParse(sample).success).toBe(true);
  });

  it('rechaza un tipo desconocido', () => {
    const result = componentSchema.safeParse({ type: 'holograma', id: 'c-x' });
    expect(result.success).toBe(false);
  });

  it('rechaza ids que no son kebab-case', () => {
    const result = componentSchema.safeParse({ type: 'divider', id: 'Mi ID!' });
    expect(result.success).toBe(false);
  });

  it('aplica defaults a los botones anidados', () => {
    const parsed = componentSchema.parse({
      type: 'buttonGroup',
      id: 'c-group',
      buttons: [{ id: 'c-b', label: 'Ok' }],
    });

    expect(parsed.type).toBe('buttonGroup');
    if (parsed.type !== 'buttonGroup') return;
    expect(parsed.buttons[0]?.variant).toBe('solid');
    expect(parsed.buttons[0]?.size).toBe('md');
    expect(parsed.buttons[0]?.href).toBe('#');
    expect(parsed.buttons[0]?.newTab).toBe(false);
  });

  it('rellena los textos por defecto del formulario de contacto', () => {
    const parsed = componentSchema.parse({ type: 'contactForm', id: 'c-form' });

    expect(parsed.type).toBe('contactForm');
    if (parsed.type !== 'contactForm') return;
    expect(parsed.namePlaceholder).toBe('Tu nombre');
    expect(parsed.buttonText).toBe('Enviar mensaje');
    expect(parsed.successMessage).toContain('Gracias');
  });

  it('la cuenta atrás exige objetivo y texto de expiración', () => {
    expect(componentSchema.safeParse({ type: 'countdown', id: 'c-cd' }).success).toBe(false);

    const parsed = componentSchema.parse({
      type: 'countdown',
      id: 'c-cd',
      target: '2027-01-01T00:00',
    });
    expect(parsed.type).toBe('countdown');
    if (parsed.type !== 'countdown') return;
    expect(parsed.expiredText).toBe('¡Ha terminado!');
    expect(parsed.target).toBe('2027-01-01T00:00');
  });

  it('valida los límites del intervalo del carrusel (2s mínimo)', () => {
    const base = {
      type: 'carousel',
      id: 'c-c',
      slides: [{ src: 'https://example.com/s.jpg' }],
    };

    expect(componentSchema.safeParse({ ...base, intervalMs: 1000 }).success).toBe(false);
    expect(componentSchema.safeParse({ ...base, intervalMs: 2000 }).success).toBe(true);
    expect(componentSchema.safeParse({ ...base, intervalMs: 20000 }).success).toBe(false);
  });

  it('valida el rating de testimonios entre 0 y 5', () => {
    const base = { type: 'testimonialCard', id: 'c-t', quote: 'Hola', author: 'Ana' };

    expect(componentSchema.safeParse({ ...base, rating: 6 }).success).toBe(false);
    expect(componentSchema.safeParse({ ...base, rating: 5 }).success).toBe(true);
  });

  it('exige al menos una feature en pricingCard', () => {
    const result = componentSchema.safeParse({
      type: 'pricingCard',
      id: 'c-p',
      planName: 'Free',
      price: '0',
      features: [],
    });
    expect(result.success).toBe(false);
  });
});
