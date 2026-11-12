import fc from 'fast-check';

import { allocateLargestRemainder, splitEvenly } from './allocate';
import { MAX_AMOUNT } from './paise';

describe('largest remainder', () => {
  it('splits ₹100 into ₹33.34, ₹33.33, ₹33.33 (03)', () => {
    expect(splitEvenly(10_000, 3)).toEqual([3_334, 3_333, 3_333]);
  });

  it('allocates by weight and gives leftovers to the largest remainders', () => {
    expect(allocateLargestRemainder(1_000, [1, 1, 2])).toEqual([250, 250, 500]);
    expect(allocateLargestRemainder(100, [3_333, 3_333, 3_334])).toEqual([33, 33, 34]);
    expect(allocateLargestRemainder(7, [0, 1, 1])).toEqual([0, 4, 3]);
  });

  it('returns the whole amount for one part (E7)', () => {
    expect(splitEvenly(12_345, 1)).toEqual([12_345]);
    expect(allocateLargestRemainder(12_345, [7])).toEqual([12_345]);
  });

  it('handles a zero total', () => {
    expect(splitEvenly(0, 3)).toEqual([0, 0, 0]);
  });

  it('throws for 0 parts, all-zero weights, negative or fractional input (E7)', () => {
    expect(() => splitEvenly(100, 0)).toThrow(RangeError);
    expect(() => allocateLargestRemainder(100, [])).toThrow(RangeError);
    expect(() => allocateLargestRemainder(100, [0, 0])).toThrow(RangeError);
    expect(() => allocateLargestRemainder(100, [1, -1])).toThrow(RangeError);
    expect(() => allocateLargestRemainder(100, [0.5, 0.5])).toThrow(RangeError);
    expect(() => allocateLargestRemainder(-100, [1])).toThrow(RangeError);
    expect(() => allocateLargestRemainder(10.5, [1])).toThrow(RangeError);
  });

  const total = fc.integer({ min: 0, max: MAX_AMOUNT });
  const weights = fc
    .array(fc.integer({ min: 0, max: 10_000 }), { minLength: 1, maxLength: 12 })
    .filter((ws) => ws.some((w) => w > 0));

  it('property: parts are integers that sum exactly to the total', () => {
    fc.assert(
      fc.property(total, weights, (t, ws) => {
        const parts = allocateLargestRemainder(t, ws);
        expect(parts).toHaveLength(ws.length);
        expect(parts.every(Number.isSafeInteger)).toBe(true);
        expect(parts.reduce((s, p) => s + p, 0)).toBe(t);
      }),
    );
  });

  it('property: each part is within 1 paise of its exact share, and zero weight gets zero', () => {
    fc.assert(
      fc.property(total, weights, (t, ws) => {
        const sum = BigInt(ws.reduce((s, w) => s + w, 0));
        allocateLargestRemainder(t, ws).forEach((part, i) => {
          const w = BigInt(ws[i] ?? 0);
          const floor = (BigInt(t) * w) / sum;
          expect(BigInt(part) === floor || BigInt(part) === floor + 1n).toBe(true);
          if (w === 0n) expect(part).toBe(0);
        });
      }),
    );
  });

  it('property: an even split differs by at most 1 paise, larger parts first', () => {
    fc.assert(
      fc.property(total, fc.integer({ min: 1, max: 50 }), (t, n) => {
        const parts = splitEvenly(t, n);
        expect(Math.max(...parts) - Math.min(...parts)).toBeLessThanOrEqual(1);
        expect([...parts].sort((a, b) => b - a)).toEqual(parts);
      }),
    );
  });
});
