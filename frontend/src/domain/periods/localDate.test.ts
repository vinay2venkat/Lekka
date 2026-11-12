import fc from 'fast-check';

import { arbLocalDate } from './arbitraries';
import {
  addDays,
  compareLocalDate,
  daysBetween,
  daysInMonth,
  isLocalDate,
  localDateSchema,
  parseLocalDate,
} from './localDate';

describe('LocalDate', () => {
  it.each(['2026-11-12', '2024-02-29', '2000-02-29', '2026-12-31'])('accepts %s', (d) => {
    expect(isLocalDate(d)).toBe(true);
    expect(localDateSchema.safeParse(d).success).toBe(true);
  });

  it.each([
    '2026-02-29',
    '1900-02-29',
    '2026-13-01',
    '2026-04-31',
    '2026-1-5',
    '2026-11-12T10:00',
    '',
    20261112,
  ])('rejects %p', (d) => {
    expect(isLocalDate(d)).toBe(false);
  });

  it('knows month lengths including leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  it('adds days across month, year and leap-day boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('property: addDays and daysBetween are inverse', () => {
    fc.assert(
      fc.property(arbLocalDate, fc.integer({ min: -4000, max: 4000 }), (date, n) => {
        const moved = addDays(date, n);
        expect(isLocalDate(moved)).toBe(true);
        expect(daysBetween(date, moved)).toBe(n);
      }),
    );
  });

  it('compares dates and rejects invalid ones', () => {
    expect(compareLocalDate('2026-01-31', '2026-02-01')).toBe(-1);
    expect(compareLocalDate('2026-02-01', '2026-01-31')).toBe(1);
    expect(compareLocalDate('2026-02-01', '2026-02-01')).toBe(0);
    expect(() => compareLocalDate('2026-02-30', '2026-02-01')).toThrow(RangeError);
  });

  it('parses components', () => {
    expect(parseLocalDate('2026-11-12')).toEqual({ year: 2026, month: 11, day: 12 });
  });
});
