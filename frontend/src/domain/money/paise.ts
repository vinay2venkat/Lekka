import { z } from 'zod';

/** Money is always an integer number of paise (03 Money rules). Direction comes from the type. */
export type Paise = number;

export const PAISE_PER_RUPEE = 100;
/** 1 paise. */
export const MIN_AMOUNT: Paise = 1;
/** ₹10 crore = 10^8 rupees = 10^10 paise. */
export const MAX_AMOUNT: Paise = 10_000_000_000;

/** A single transaction amount: a whole number of paise between 1 paise and ₹10 crore. */
export const amountSchema = z.number().int().min(MIN_AMOUNT).max(MAX_AMOUNT);

export function isAmount(value: unknown): value is Paise {
  return amountSchema.safeParse(value).success;
}

/** Sum of paise values. Throws if any input or the total is not a safe integer. */
export function sumPaise(values: Iterable<Paise>): Paise {
  let total = 0;
  for (const value of values) {
    if (!Number.isSafeInteger(value))
      throw new RangeError(`Not an integer paise value: ${String(value)}`);
    total += value;
    if (!Number.isSafeInteger(total)) throw new RangeError('Sum exceeds the safe integer range');
  }
  return total;
}
