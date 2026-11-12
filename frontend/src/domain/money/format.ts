import { PAISE_PER_RUPEE, type Paise } from './paise';

export interface FormatPaiseOptions {
  locale?: string;
  currency?: string;
}

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(locale: string, currency: string, fractionDigits: 0 | 2): Intl.NumberFormat {
  const key = `${locale}|${currency}|${String(fractionDigits)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    formatters.set(key, cached);
  }
  return cached;
}

/**
 * ₹1,50,000 for whole rupees; ₹60.50 when there are paise (ADR-042). Lakh/crore grouping via
 * Intl en-IN. The value is passed to Intl as an exact decimal string, never as a float.
 */
export function formatPaise(
  paise: Paise,
  { locale = 'en-IN', currency = 'INR' }: FormatPaiseOptions = {},
): string {
  if (!Number.isSafeInteger(paise))
    throw new RangeError(`Not an integer paise value: ${String(paise)}`);
  const negative = paise < 0;
  const abs = BigInt(Math.abs(paise));
  const rupees = abs / BigInt(PAISE_PER_RUPEE);
  const rest = abs % BigInt(PAISE_PER_RUPEE);
  const decimal = `${negative ? '-' : ''}${rupees.toString()}.${rest.toString().padStart(2, '0')}`;
  // Intl.NumberFormat accepts exact decimal strings (ES2023); the cast satisfies older lib typings.
  return formatter(locale, currency, rest === 0n ? 0 : 2).format(decimal as unknown as number);
}
