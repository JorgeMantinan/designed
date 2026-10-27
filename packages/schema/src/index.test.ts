import { describe, expect, it } from 'vitest';

import { DESIGN_SPEC_VERSION } from './index';

describe('DESIGN_SPEC_VERSION', () => {
  it('es un número de versión positivo', () => {
    expect(DESIGN_SPEC_VERSION).toBe(1);
    expect(DESIGN_SPEC_VERSION).toBeGreaterThan(0);
  });
});
