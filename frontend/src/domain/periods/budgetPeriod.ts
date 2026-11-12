import { z } from 'zod';

import {
  addDays,
  daysBetween,
  daysInMonth,
  parseLocalDate,
  toLocalDate,
  type LocalDate,
} from './localDate';

/** Budget month start day, 1–28 so every month has it (01 India-specific requirements). */
export const budgetStartDaySchema = z.number().int().min(1).max(28);

/** A budget period is named by the month in which it starts: 'YYYY-MM' (03 Time rules). */
export type PeriodId = string;

export interface BudgetPeriod {
  id: PeriodId;
  start: LocalDate;
  /** Inclusive last day. */
  end: LocalDate;
}

function assertStartDay(startDay: number): void {
  if (!budgetStartDaySchema.safeParse(startDay).success) {
    throw new RangeError(
      `Budget start day must be an integer from 1 to 28, got ${String(startDay)}`,
    );
  }
}

function periodIdOf(year: number, month: number): PeriodId {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
}

function parsePeriodId(id: PeriodId): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(id);
  const [, y, m] = match ?? [];
  const month = Number(m);
  if (!y || month < 1 || month > 12) throw new RangeError(`Not a period id: "${id}"`);
  return { year: Number(y), month };
}

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** The period id a date belongs to. Start day 25: 24 Nov → '2026-10', 25 Nov → '2026-11'. */
export function periodIdFor(date: LocalDate, startDay: number): PeriodId {
  assertStartDay(startDay);
  const { year, month, day } = parseLocalDate(date);
  if (day >= startDay) return periodIdOf(year, month);
  const prev = shiftMonth(year, month, -1);
  return periodIdOf(prev.year, prev.month);
}

export function periodById(id: PeriodId, startDay: number): BudgetPeriod {
  assertStartDay(startDay);
  const { year, month } = parsePeriodId(id);
  const next = shiftMonth(year, month, 1);
  const start = toLocalDate({ year, month, day: startDay });
  const nextStart = toLocalDate({ year: next.year, month: next.month, day: startDay });
  return { id, start, end: addDays(nextStart, -1) };
}

export function periodFor(date: LocalDate, startDay: number): BudgetPeriod {
  return periodById(periodIdFor(date, startDay), startDay);
}

export function shiftPeriodId(id: PeriodId, delta: number): PeriodId {
  const { year, month } = parsePeriodId(id);
  const shifted = shiftMonth(year, month, delta);
  return periodIdOf(shifted.year, shifted.month);
}

export function daysInPeriod(period: BudgetPeriod): number {
  return daysBetween(period.start, period.end) + 1;
}

/** Days left including today; 0 once the period has ended, the full length before it starts. */
export function daysLeftInPeriod(period: BudgetPeriod, today: LocalDate): number {
  if (today > period.end) return 0;
  if (today < period.start) return daysInPeriod(period);
  return daysBetween(today, period.end) + 1;
}

/** Calendar months ('YYYY-MM') a period touches, for loading record `month` buckets (ADR-024). */
export function monthsCovered(period: BudgetPeriod): string[] {
  const startMonth = period.start.slice(0, 7);
  const endMonth = period.end.slice(0, 7);
  return startMonth === endMonth ? [startMonth] : [startMonth, endMonth];
}

export { daysInMonth };
