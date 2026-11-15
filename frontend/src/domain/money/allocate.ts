import type { Paise } from './paise';

/**
 * Split an amount into parts proportional to integer weights using the largest-remainder method,
 * so the parts always sum exactly to the total (03 Money rules). Ties go to the earlier part:
 * ₹100 in three parts is ₹33.34, ₹33.33, ₹33.33.
 *
 * Weights must be non-negative safe integers (use basis points for percentages).
 */
export function allocateLargestRemainder(total: Paise, weights: readonly number[]): Paise[] {
  if (!Number.isSafeInteger(total) || total < 0)
    throw new RangeError('Total must be a non-negative integer');
  if (weights.length === 0) throw new RangeError('At least one part is required');
  for (const w of weights) {
    if (!Number.isSafeInteger(w) || w < 0)
      throw new RangeError('Weights must be non-negative integers');
  }
  const weightSum = weights.reduce((sum, w) => sum + BigInt(w), 0n);
  if (weightSum === 0n) throw new RangeError('Weights must not all be zero');

  const bigTotal = BigInt(total);
  const parts = weights.map((w) => {
    const exact = bigTotal * BigInt(w);
    return { base: exact / weightSum, remainder: exact % weightSum };
  });

  let leftover = bigTotal - parts.reduce((sum, p) => sum + p.base, 0n);
  const order = parts
    .map((p, index) => ({ index, remainder: p.remainder }))
    .sort((a, b) =>
      a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1,
    );

  const result = parts.map((p) => p.base);
  for (const { index } of order) {
    if (leftover === 0n) break;
    result[index] = (result[index] ?? 0n) + 1n;
    leftover -= 1n;
  }
  return result.map(Number);
}

/** Split an amount into n parts that differ by at most 1 paise. */
export function splitEvenly(total: Paise, parts: number): Paise[] {
  if (!Number.isSafeInteger(parts) || parts < 1)
    throw new RangeError('At least one part is required');
  return allocateLargestRemainder(
    total,
    Array.from({ length: parts }, () => 1),
  );
}
