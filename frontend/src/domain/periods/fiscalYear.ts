import { z } from 'zod';

import { addDays, parseLocalDate, toLocalDate, type LocalDate } from './localDate';

/** 4 = Indian financial year (April–March), 1 = calendar year (01, ADR-028). */
export const fiscalYearStartMonthSchema = z.number().int().min(1).max(12);

export interface FiscalYear {
  /** Calendar year in which this financial year starts (FY 2026–27 → 2026). */
  startYear: number;
  startMonth: number;
  start: LocalDate;
  /** Inclusive last day. */
  end: LocalDate;
}

export function fiscalYearFor(date: LocalDate, startMonth = 4): FiscalYear {
  if (!fiscalYearStartMonthSchema.safeParse(startMonth).success) {
    throw new RangeError(`Fiscal year start month must be 1–12, got ${String(startMonth)}`);
  }
  const { year, month } = parseLocalDate(date);
  const startYear = month >= startMonth ? year : year - 1;
  const start = toLocalDate({ year: startYear, month: startMonth, day: 1 });
  const nextStart = toLocalDate({ year: startYear + 1, month: startMonth, day: 1 });
  return { startYear, startMonth, start, end: addDays(nextStart, -1) };
}
