import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { FaqList } from './cards/FaqList';
import { FeatureCard } from './cards/FeatureCard';
import { FeatureList } from './cards/FeatureList';
import { LogoCloud } from './cards/LogoCloud';
import { PricingCard } from './cards/PricingCard';
import { Stat } from './cards/Stat';
import { TestimonialCard } from './cards/TestimonialCard';

describe('FeatureCard', () => {
  it('renderiza artículo, título y descripción', () => {
    const html = renderToStaticMarkup(
      <FeatureCard title="Plantillas" text="Filas y columnas listas." />,
    );

    expect(html).toContain('<article');
    expect(html).toContain('Plantillas');
    expect(html).toContain('Filas y columnas listas.');
  });

  it('hace toda la tarjeta clicable cuando hay href', () => {
    const html = renderToStaticMarkup(<FeatureCard title="Ver más" text="..." href="#servicios" />);

    expect(html).toContain('href="#servicios"');
    expect(html).toContain('aria-label="Ver más"');
  });
});

describe('PricingCard', () => {
  it('renderiza plan, precio y todas las features', () => {
    const html = renderToStaticMarkup(
      <PricingCard
        planName="Pro"
        price="19"
        currency="€"
        period="/mes"
        features={['Ilimitado', 'Soporte', 'Hooks']}
      />,
    );

    expect(html).toContain('Pro');
    expect(html).toContain('€');
    expect(html).toContain('19');
    expect(html).toContain('/mes');
    expect((html.match(/<li/g) ?? []).length).toBe(3);
  });

  it('incluye el CTA cuando se define', () => {
    const html = renderToStaticMarkup(
      <PricingCard
        planName="Free"
        price="0"
        features={['1 diseño']}
        cta={{ id: 'cta', label: 'Empezar' }}
      />,
    );

    expect(html).toContain('Empezar');
  });
});

describe('TestimonialCard', () => {
  it('renderiza5 estrellas y la valoración', () => {
    const html = renderToStaticMarkup(
      <TestimonialCard quote="Genial" author="Ana Ruiz" rating={4} />,
    );

    expect((html.match(/<svg/g) ?? []).length).toBe(5);
    expect(html).toContain('4 de 5 estrellas');
  });

  it('usa iniciales cuando no hay avatar', () => {
    const html = renderToStaticMarkup(<TestimonialCard quote="Hola" author="Ana Ruiz" />);

    expect(html).toContain('AR');
    expect(html).not.toContain('<img');
  });

  it('renderiza el avatar cuando existe', () => {
    const html = renderToStaticMarkup(
      <TestimonialCard quote="Hola" author="Ana" avatarUrl="https://example.com/ana.jpg" />,
    );

    expect(html).toContain('https://example.com/ana.jpg');
  });
});

describe('Stat', () => {
  it('renderiza valor, sufijo y etiqueta', () => {
    const html = renderToStaticMarkup(<Stat value="99" suffix="%" label="Uptime" />);

    expect(html).toContain('>99<');
    expect(html).toContain('%');
    expect(html).toContain('Uptime');
  });
});

describe('FeatureList', () => {
  it('renderiza todos los items y las columnas como variable CSS', () => {
    const html = renderToStaticMarkup(
      <FeatureList
        columns={2}
        items={[
          { title: 'Uno', text: 'Detalle uno' },
          { title: 'Dos', text: 'Detalle dos' },
        ]}
      />,
    );

    expect((html.match(/<li/g) ?? []).length).toBe(2);
    expect(html).toContain('--feature-columns:2');
  });
});

describe('FaqList', () => {
  it('renderiza acordeón nativo details/summary', () => {
    const html = renderToStaticMarkup(
      <FaqList
        items={[
          { question: '¿Pregunta?', answer: 'Respuesta.' },
          { question: '¿Otra?', answer: 'Otra respuesta.' },
        ]}
      />,
    );

    expect((html.match(/<details/g) ?? []).length).toBe(2);
    expect((html.match(/<summary/g) ?? []).length).toBe(2);
    expect(html).toContain('Respuesta.');
  });
});

describe('LogoCloud', () => {
  it('renderiza un logo por entrada', () => {
    const html = renderToStaticMarkup(
      <LogoCloud
        logos={[
          { src: 'https://example.com/1.svg', alt: 'Uno' },
          { src: 'https://example.com/2.svg', alt: 'Dos' },
        ]}
      />,
    );

    expect((html.match(/<img/g) ?? []).length).toBe(2);
    expect(html).toContain('alt="Uno"');
  });
});
