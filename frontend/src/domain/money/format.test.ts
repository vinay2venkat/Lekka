import fc from 'fast-check';

import { formatPaise } from './format';
import { parseAmount } from './parse';
import { MAX_AMOUNT } from './paise';

describe('formatPaise (en-IN)', () => {
  it.each([
    [6_000, '₹60'],
    [6_050, '₹60.50'],
    [1, '₹0.01'],
    [15_000_000, '₹1,50,000'],
    [12_345_678_90, '₹1,23,45,678.90'],
    [MAX_AMOUNT, '₹10,00,00,000'],
    [-6_050, '-₹60.50'],
  ])('formats %d paise as %s', (paise, expected) => {
    expect(formatPaise(paise)).toBe(expected);
  });

  it('rejects non-integers instead of rounding silently', () => {
    expect(() => formatPaise(60.5)).toThrow(RangeError);
  });

  it('is exact at the safe integer limit (no float rounding)', () => {
    expect(formatPaise(Number.MAX_SAFE_INTEGER)).toBe('₹9,00,71,99,25,47,409.91');
  });

  it('property: formatting then parsing returns the same paise', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: MAX_AMOUNT }), (paise) => {
        expect(parseAmount(formatPaise(paise))).toEqual({ ok: true, paise });
      }),
    );
  });
});
