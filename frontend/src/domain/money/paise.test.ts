import fc from 'fast-check';

import { amountSchema, isAmount, MAX_AMOUNT, sumPaise } from './paise';

describe('amount validation', () => {
  it.each([1, 6000, MAX_AMOUNT])('accepts %d paise', (value) => {
    expect(isAmount(value)).toBe(true);
  });

  it.each([0, -1, 0.5, 60.25, MAX_AMOUNT + 1, Number.NaN, Number.POSITIVE_INFINITY, '100'])(
    'rejects %p',
    (value) => {
      expect(isAmount(value)).toBe(false);
      expect(amountSchema.safeParse(value).success).toBe(false);
    },
  );
});

describe('sumPaise', () => {
  it('adds integer paise exactly', () => {
    expect(sumPaise([3334, 3333, 3333])).toBe(10_000);
    expect(sumPaise([])).toBe(0);
  });

  it('throws instead of losing precision past the safe integer range', () => {
    expect(() => sumPaise([Number.MAX_SAFE_INTEGER, 1])).toThrow(RangeError);
  });

  it('rejects non-integers', () => {
    expect(() => sumPaise([1, 0.5])).toThrow(RangeError);
  });

  it('stays a safe integer for 20,000 transactions at the ₹10 crore cap (E6)', () => {
    const total = sumPaise(Array.from({ length: 20_000 }, () => MAX_AMOUNT));
    expect(total).toBe(20_000 * MAX_AMOUNT);
    expect(Number.isSafeInteger(total)).toBe(true);
  });

  it('property: any 20,000 valid amounts sum to a safe integer equal to the BigInt sum', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: MAX_AMOUNT }), { maxLength: 20_000 }),
        (values) => {
          const total = sumPaise(values);
          expect(Number.isSafeInteger(total)).toBe(true);
          expect(BigInt(total)).toBe(values.reduce((s, v) => s + BigInt(v), 0n));
        },
      ),
      { numRuns: 50 },
    );
  });
});
