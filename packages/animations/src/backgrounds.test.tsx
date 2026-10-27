import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { INTERACTIVE_BACKGROUND_EFFECTS } from '@designed/schema';

import { InteractiveBackground } from './backgrounds/InteractiveBackground';

const base = { type: 'interactive' as const, intensity: 0.6, speed: 0.4 };

describe('InteractiveBackground', () => {
  it('renderiza los7 efectos con su marca data-effect', () => {
    for (const effect of INTERACTIVE_BACKGROUND_EFFECTS) {
      const html = renderToStaticMarkup(<InteractiveBackground background={{ ...base, effect }} />);

      expect(html, effect).toContain(`data-effect="${effect}"`);
    }
  });

  it('aplica color, intensidad y velocidad como variables CSS', () => {
    const html = renderToStaticMarkup(
      <InteractiveBackground
        background={{ ...base, effect: 'spotlight', effectColor: '#FF0000' }}
      />,
    );

    expect(html).toContain('--effect-color:#FF0000');
    expect(html).toContain('--effect-intensity:0.6');
    expect(html).toContain('--effect-speed:0.4');
  });

  it('usa el primario del tema cuando no hay effectColor', () => {
    const html = renderToStaticMarkup(
      <InteractiveBackground background={{ ...base, effect: 'blobs' }} />,
    );

    expect(html).toContain('--effect-color:var(--color-primary)');
  });

  it('las partículas renderizan un canvas (SSR-safe, sin acceso a window)', () => {
    const html = renderToStaticMarkup(
      <InteractiveBackground background={{ ...base, effect: 'particles' }} />,
    );

    expect(html).toContain('<canvas');
    expect(html).toContain('data-effect="particles"');
  });

  it('los efectos CSS pintan sus capas (malla, puntos, grano, ondas)', () => {
    const render = (effect: string): string =>
      renderToStaticMarkup(<InteractiveBackground background={{ ...base, effect } as never} />);

    expect(render('gradient-mesh')).toContain('data-effect="gradient-mesh"');
    expect(render('dots')).toContain('data-effect="dots"');
    expect(render('noise')).toContain('data-effect="noise"');
    expect(render('waves')).toContain('data-effect="waves"');
    expect(render('waves')).toContain('<path');
  });

  it('devuelve null con un efecto desconocido', () => {
    const html = renderToStaticMarkup(
      <InteractiveBackground background={{ ...base, effect: 'telepatia' } as never} />,
    );

    expect(html).toBe('');
  });

  it('funciona sin hostRef (SSR o uso aislado)', () => {
    const html = renderToStaticMarkup(
      <InteractiveBackground background={{ ...base, effect: 'spotlight' }} />,
    );

    expect(html).toContain('data-effect="spotlight"');
  });
});
