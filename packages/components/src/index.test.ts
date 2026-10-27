import { describe, expect, it } from 'vitest';

import { PRIMITIVE_KINDS } from './index';

describe('PRIMITIVE_KINDS', () => {
  it('cataloga todas las categorías de primitivas', () => {
    expect(PRIMITIVE_KINDS).toHaveLength(9);
    expect(PRIMITIVE_KINDS).toContain('layout');
    expect(PRIMITIVE_KINDS).toContain('navigation');
    expect(PRIMITIVE_KINDS).toContain('card');
    expect(PRIMITIVE_KINDS).toContain('background');
  });
});
