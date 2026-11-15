import { z } from 'zod';

/** A calendar date 'YYYY-MM-DD' in the household timezone, with no time part (03 Time rules). */
export type LocalDate = string;

export interface CivilDate {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
}

const PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function toLocalDate({ year, month, day }: CivilDate): LocalDate {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Parses and validates a LocalDate; throws on malformed or impossible dates such as 2026-02-30. */
export function parseLocalDate(value: LocalDate): CivilDate {
  const match = PATTERN.exec(value);
  const [, y, m, d] = match ?? [];
  if (!y || !m || !d) throw new RangeError(`Not a YYYY-MM-DD date: "${value}"`);
  const date = { year: Number(y), month: Number(m), day: Number(d) };
  if (
    date.year < 1 ||
    date.month < 1 ||
    date.month > 12 ||
    date.day < 1 ||
    date.day > daysInMonth(date.year, date.month)
  ) {
    throw new RangeError(`Not a real calendar date: "${value}"`);
  }
  return date;
}

export function isLocalDate(value: unknown): value is LocalDate {
  if (typeof value !== 'string') return false;
  try {
    parseLocalDate(value);
    return true;
  } catch {
    return false;
  }
}

export const localDateSchema = z.string().refine(isLocalDate, { message: 'Invalid date' });

/** Days since 1970-01-01 for a civil date; pure integer calendar maths via UTC. */
function epochDay(date: LocalDate): number {
  const { year, month, day } = parseLocalDate(date);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function fromEpochDay(days: number): LocalDate {
  const d = new Date(days * 86_400_000);
  return toLocalDate({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });
}

export function addDays(date: LocalDate, days: number): LocalDate {
  if (!Number.isSafeInteger(days)) throw new RangeError('days must be an integer');
  return fromEpochDay(epochDay(date) + days);
}

/** Whole days from a to b (positive when b is later). */
export function daysBetween(a: LocalDate, b: LocalDate): number {
  return epochDay(b) - epochDay(a);
}

/** LocalDate strings compare correctly as strings once validated. */
export function compareLocalDate(a: LocalDate, b: LocalDate): number {
  parseLocalDate(a);
  parseLocalDate(b);
  return a < b ? -1 : a > b ? 1 : 0;
}
