import { describe, expect, it } from 'vitest';

import { PALETTE_ROLES, PALETTE_SIZE } from './index';

describe('PALETTE_ROLES', () => {
  it('define exactamente 5 roles', () => {
    expect(PALETTE_SIZE).toBe(5);
    expect(PALETTE_ROLES).toHaveLength(5);
  });

  it('incluye los roles semánticos esperados', () => {
    expect(PALETTE_ROLES).toContain('primary');
    expect(PALETTE_ROLES).toContain('background');
    expect(PALETTE_ROLES).toContain('surface');
  });
});
