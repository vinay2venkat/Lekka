import type { LocalDate } from './localDate';

/**
 * Today's date in the household's timezone, never the device's (E1). The clock is injected so
 * callers and tests control "now". Throws RangeError for an unknown timezone.
 */
export function todayIn(timeZone: string, now: Date): LocalDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
