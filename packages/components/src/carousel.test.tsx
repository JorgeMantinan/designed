import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { Carousel } from './carousel/Carousel';

const slides = [
  { src: 'https://example.com/1.jpg', alt: 'Uno', title: 'Proyecto uno' },
  { src: 'https://example.com/2.jpg', alt: 'Dos' },
  { src: 'https://example.com/3.jpg', alt: 'Tres' },
];

describe('Carousel', () => {
  const html = renderToStaticMarkup(<Carousel slides={slides} />);

  it('renderiza las diapositivas con sus imágenes', () => {
    expect((html.match(/<img/g) ?? []).length).toBe(3);
    expect(html).toContain('alt="Uno"');
    expect(html).toContain('Proyecto uno');
  });

  it('renderiza flechas con labels accesibles', () => {
    expect(html).toContain('aria-label="Diapositiva anterior"');
    expect(html).toContain('aria-label="Diapositiva siguiente"');
  });

  it('renderiza un punto por diapositiva', () => {
    expect((html.match(/Ir a la diapositiva/g) ?? []).length).toBe(3);
    expect(html).toContain('aria-current="true"');
  });

  it('aplica el overlay a todas las diapositivas', () => {
    const withOverlay = renderToStaticMarkup(
      <Carousel
        slides={slides}
        overlay={{ direction: 'to-left', intensity: 0.6, color: '#0B0B10' }}
      />,
    );

    expect((withOverlay.match(/dsg-overlay--to-left/g) ?? []).length).toBe(3);
  });

  it('omite flechas y puntos con una sola diapositiva', () => {
    const single = renderToStaticMarkup(<Carousel slides={[slides[0]!]} />);

    expect(single).not.toContain('Diapositiva siguiente');
    expect(single).not.toContain('Ir a la diapositiva');
  });

  it('respeta showDots=false', () => {
    const noDots = renderToStaticMarkup(<Carousel slides={slides} showDots={false} />);
    expect(noDots).not.toContain('Ir a la diapositiva');
    expect(noDots).toContain('Diapositiva siguiente');
  });
});
