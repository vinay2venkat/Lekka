import { contrastRatio, relativeLuminance } from './contrast';

describe('contrast', () => {
  it('gives 21:1 for black on white and 1:1 for identical colours', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#0f5c57', '#0f5c57')).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#0f5c57', '#ffffff')).toBe(contrastRatio('#ffffff', '#0f5c57'));
  });

  it('matches the WCAG reference value for #777777 on white (4.48:1)', () => {
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
  });

  it('rejects malformed colours', () => {
    expect(() => relativeLuminance('teal')).toThrow();
  });
});
