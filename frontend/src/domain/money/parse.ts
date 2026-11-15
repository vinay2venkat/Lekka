import { MAX_AMOUNT, type Paise } from './paise';

export type ParseFailureReason =
  | 'empty'
  | 'invalid'
  | 'negative'
  | 'zero'
  | 'too_many_decimals'
  | 'out_of_range'
  | 'unsupported_digits';

export type ParseAmountResult =
  { ok: true; paise: Paise } | { ok: false; reason: ParseFailureReason };

/** Rupee multipliers for the words people type: "1.5k", "2 lakh", "1 cr". */
const MULTIPLIERS: Record<string, bigint> = {
  '': 1n,
  k: 1_000n,
  thousand: 1_000n,
  l: 100_000n,
  lac: 100_000n,
  lacs: 100_000n,
  lakh: 100_000n,
  lakhs: 100_000n,
  cr: 10_000_000n,
  crore: 10_000_000n,
  crores: 10_000_000n,
};

const TERM = /^(\d[\d,]*)(?:\.(\d+))?\s*([a-z]*)$/;
// Indian grouping (1,50,000) or international grouping (150,000); commas only between digits.
const GROUPED = /^\d{1,3}(?:(?:,\d{2})*,\d{3}|(?:,\d{3})+)$/;
const CURRENCY_PREFIX = /^(?:₹|rs\.?|inr)\s*/;

function fail(reason: ParseFailureReason): ParseAmountResult {
  return { ok: false, reason };
}

function parseTerm(raw: string): bigint | ParseFailureReason {
  const term = raw.trim().replace(CURRENCY_PREFIX, '');
  const match = TERM.exec(term);
  if (!match) return 'invalid';
  const [, intPart = '', fraction = '', suffix = ''] = match;

  const multiplier = MULTIPLIERS[suffix];
  if (multiplier === undefined) return 'invalid';
  if (intPart.includes(',') && !GROUPED.test(intPart)) return 'invalid';

  const digits = BigInt(intPart.replaceAll(',', '') + fraction);
  const scale = 10n ** BigInt(fraction.length);
  const numerator = digits * multiplier * 100n;
  if (numerator % scale !== 0n) return 'too_many_decimals';
  return numerator / scale;
}

/**
 * Parse what someone types into an amount field into exact paise, using integer arithmetic only.
 * Accepts "60", "60.5", "₹1,50,000", "1.5k", "2 lakh", "1 cr" and keypad sums like "120+80".
 */
export function parseAmount(input: string): ParseAmountResult {
  const text = input.trim().toLowerCase();
  if (text === '') return fail('empty');
  // Only ASCII digits are accepted in v1; Indic digits arrive with the Phase 6 languages.
  if (/[^\P{Nd}0-9]/u.test(text)) return fail('unsupported_digits');
  if (/[-−]/.test(text)) return fail('negative');

  let total = 0n;
  for (const part of text.split('+')) {
    const value = parseTerm(part);
    if (typeof value === 'string') return fail(value);
    total += value;
  }

  if (total === 0n) return fail('zero');
  if (total > BigInt(MAX_AMOUNT)) return fail('out_of_range');
  return { ok: true, paise: Number(total) };
}
