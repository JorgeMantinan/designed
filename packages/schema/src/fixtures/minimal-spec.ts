import { type z } from 'zod';

import { type designSpecSchema } from '../design-spec';

/**
 * Smallest valid design spec: everything else must be filled in by schema
 * defaults (header, footer, typography, animations of nav items...).
 *
 * This is what the builder produces when the user clicks "nuevo diseño".
 */
export const minimalDesignSpec = {
  version: 1,
  meta: {
    name: 'Mi web',
  },
  theme: {
    palette: {
      primary: '#6C5CE7',
      secondary: '#00CEC9',
      accent: '#FD79A8',
      background: '#FFFFFF',
      surface: '#F5F5F7',
    },
  },
  sections: [
    {
      id: 'seccion-principal',
      rows: [
        {
          id: 'fila-principal',
          columns: [
            {
              id: 'columna-principal',
              components: [{ type: 'heading', id: 'titulo-principal', text: 'Hola, mundo' }],
            },
          ],
        },
      ],
    },
  ],
} satisfies z.input<typeof designSpecSchema>;
