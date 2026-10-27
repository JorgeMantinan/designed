import { describe, expect, it } from 'vitest';

import { ANIMATION_FAMILIES } from './index';

describe('ANIMATION_FAMILIES', () => {
  it('incluye las 5 familias del catálogo', () => {
    expect(ANIMATION_FAMILIES).toHaveLength(5);
    expect(ANIMATION_FAMILIES).toContain('entrance');
    expect(ANIMATION_FAMILIES).toContain('hover');
    expect(ANIMATION_FAMILIES).toContain('background');
    expect(ANIMATION_FAMILIES).toContain('scroll');
    expect(ANIMATION_FAMILIES).toContain('ambient');
  });
});
