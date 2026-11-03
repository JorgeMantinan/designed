import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { Badge } from './primitives/Badge';
import { BodyText } from './primitives/BodyText';
import { Button } from './primitives/Button';
import { ButtonGroup } from './primitives/ButtonGroup';
import { ContactForm } from './primitives/ContactForm';
import { Countdown } from './primitives/Countdown';
import { Divider } from './primitives/Divider';
import { Heading } from './primitives/Heading';
import { Icon } from './icons';
import { Image } from './primitives/Image';
import { Spacer } from './primitives/Spacer';

describe('Button', () => {
  it('renderiza enlace, etiqueta y atributos por defecto', () => {
    const html = renderToStaticMarkup(<Button label="Empezar" />);

    expect(html).toContain('href="#"');
    expect(html).toContain('>Empezar<');
    expect(html).not.toContain('target=');
  });
  it('abre en nueva pestaña con rel seguro', () => {
    const html = renderToStaticMarkup(<Button label="Docs" href="https://example.com" newTab />);

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('aplica el atributo data-hover para la animación', () => {
    const html = renderToStaticMarkup(
      <Button label="Glow" animation={{ hover: { type: 'glow', intensity: 0.8 } }} />,
    );

    expect(html).toContain('data-hover="glow"');
    expect(html).toContain('--hover-intensity:0.8');
  });

  it('omite data-hover cuando el hover es none', () => {
    const html = renderToStaticMarkup(
      <Button label="Quiet" animation={{ hover: { type: 'none' } }} />,
    );

    expect(html).not.toContain('data-hover');
  });

  it('renderiza el icono incorporado cuando se pide', () => {
    const html = renderToStaticMarkup(<Button label="Seguir" icon="arrow-right" />);

    expect(html).toContain('<svg');
    expect(html).toContain('M5 12h14');
  });
});

describe('ButtonGroup', () => {
  it('renderiza todos los botones en orden', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup
        buttons={[
          { id: 'b1', label: 'Primario', href: '#a' },
          { id: 'b2', label: 'Secundario', href: '#b', variant: 'outline' },
        ]}
      />,
    );

    expect(html).toContain('Primario');
    expect(html).toContain('Secundario');
    expect(html.indexOf('Primario')).toBeLessThan(html.indexOf('Secundario'));
  });
});

describe('Badge', () => {
  it('renderiza la etiqueta', () => {
    expect(renderToStaticMarkup(<Badge label="Nuevo" />)).toContain('>Nuevo<');
  });
});

describe('Heading', () => {
  it('usa el tag HTML del nivel', () => {
    expect(renderToStaticMarkup(<Heading level={1} text="Título" />)).toContain('<h1');
    expect(renderToStaticMarkup(<Heading level={3} text="Sub" />)).toContain('<h3');
    expect(renderToStaticMarkup(<Heading text="Por defecto" />)).toContain('<h2');
  });

  it('respeta el nivel fuera de rango sin explotar', () => {
    expect(renderToStaticMarkup(<Heading level={99} text="Tope" />)).toContain('<h6');
    expect(renderToStaticMarkup(<Heading level={0} text="Suelo" />)).toContain('<h1');
  });

  it('aplica clases de entrada al animar', () => {
    const html = renderToStaticMarkup(
      <Heading text="Hola" animation={{ entrance: { type: 'slide-up' } }} />,
    );

    expect(html).toContain('dsg-reveal');
    expect(html).toContain('dsg-entrance--slide-up');
  });
});

describe('BodyText', () => {
  it('limita el ancho cuando se indica', () => {
    const html = renderToStaticMarkup(<BodyText text="Párrafo" maxWidthPx={520} />);

    expect(html).toContain('max-width:520px');
  });
});

describe('Image', () => {
  it('renderiza img con alt y ratio', () => {
    const html = renderToStaticMarkup(
      <Image src="https://example.com/foto.jpg" alt="Vista" ratio="16:9" />,
    );

    expect(html).toContain('src="https://example.com/foto.jpg"');
    expect(html).toContain('alt="Vista"');
    expect(html).toContain('aspect-ratio');
    expect(html).toContain('loading="lazy"');
  });

  it('renderiza la capa de sombreado con dirección e intensidad', () => {
    const html = renderToStaticMarkup(
      <Image
        src="https://example.com/f.jpg"
        overlay={{ direction: 'to-bottom-right', intensity: 0.7, color: '#0B0B10' }}
      />,
    );

    expect(html).toContain('dsg-overlay');
    expect(html).toContain('dsg-overlay--to-bottom-right');
    expect(html).toContain('--overlay-intensity:0.7');
    expect(html).toContain('--overlay-color:#0B0B10');
  });

  it('omite la capa de sombreado sin overlay', () => {
    const html = renderToStaticMarkup(<Image src="https://example.com/f.jpg" />);

    expect(html).not.toContain('dsg-overlay');
  });
});

describe('Divider / Spacer', () => {
  it('divider lleva el grosor indicado', () => {
    expect(renderToStaticMarkup(<Divider thicknessPx={3} />)).toContain('height:3px');
  });

  it('spacer expone data-size', () => {
    expect(renderToStaticMarkup(<Spacer size="xl" />)).toContain('data-size="xl"');
    expect(renderToStaticMarkup(<Spacer />)).toContain('data-size="md"');
  });
});

describe('Icon', () => {
  it('renderiza svg para iconos conocidos', () => {
    expect(renderToStaticMarkup(<Icon name="check" />)).toContain('<svg');
  });

  it('no renderiza nada con nombres desconocidos', () => {
    expect(renderToStaticMarkup(<Icon name="no-existe" />)).toBe('');
  });
});

describe('ContactForm', () => {
  it('renderiza los tres campos con validación nativa y el botón', () => {
    const html = renderToStaticMarkup(<ContactForm />);

    expect(html).toContain('<form');
    expect(html).toContain('type="text"');
    expect(html).toContain('type="email"');
    expect(html).toContain('<textarea');
    expect(html).toContain('required');
    expect(html).toContain('>Enviar mensaje<');
    // Sin enviar: todavía no aparece la confirmación.
    expect(html).not.toContain('role="status"');
  });

  it('respeta los textos personalizados', () => {
    const html = renderToStaticMarkup(
      <ContactForm
        namePlaceholder="Nombre"
        emailPlaceholder="Email"
        messagePlaceholder="Mensaje"
        buttonText="Reservar"
        successMessage="¡Recibido!"
      />,
    );

    expect(html).toContain('Reservar');
    expect(html).toContain('placeholder="Nombre"');
    expect(html).toContain('placeholder="Email"');
    expect(html).toContain('placeholder="Mensaje"');
    expect(html).not.toContain('¡Recibido!');
  });
});

describe('Countdown', () => {
  it('renderiza el reloj con las cuatro unidades para una fecha futura', () => {
    const target = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    const html = renderToStaticMarkup(<Countdown target={target} label="Quedan" />);

    expect(html).toContain('role="timer"');
    expect(html).toContain('Quedan');
    expect(html).toContain('Días');
    expect(html).toContain('Horas');
    expect(html).toContain('Min');
    expect(html).toContain('Seg');
    expect(html).not.toContain('role="status"');
  });

  it('muestra el texto de expiración con fechas pasadas o inválidas', () => {
    const past = renderToStaticMarkup(<Countdown target="2020-01-01T00:00" expiredText="Fin" />);
    expect(past).toContain('role="status"');
    expect(past).toContain('Fin');

    const invalid = renderToStaticMarkup(<Countdown target="mañana sin hora" />);
    expect(invalid).toContain('¡Ha terminado!');
  });
});
