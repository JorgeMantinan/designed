import { describe, expect, it } from 'vitest';

import { TOKEN_CATEGORIES } from './index';

describe('TOKEN_CATEGORIES', () => {
  it('incluye las categorías básicas del sistema', () => {
    expect(TOKEN_CATEGORIES).toContain('color');
    expect(TOKEN_CATEGORIES).toContain('spacing');
    expect(TOKEN_CATEGORIES).toContain('radius');
    expect(TOKEN_CATEGORIES).toContain('shadow');
  });
});
