import fc from 'fast-check';

import { arbLocalDate } from './arbitraries';
import { fiscalYearFor } from './fiscalYear';
import { addDays } from './localDate';

describe('financial year (calendar dates, ADR-028)', () => {
  it('defaults to April–March', () => {
    expect(fiscalYearFor('2026-11-12')).toEqual({
      startYear: 2026,
      startMonth: 4,
      start: '2026-04-01',
      end: '2027-03-31',
    });
    expect(fiscalYearFor('2026-03-31').startYear).toBe(2025);
    expect(fiscalYearFor('2026-04-01').startYear).toBe(2026);
  });

  it('supports the calendar year', () => {
    expect(fiscalYearFor('2026-11-12', 1)).toEqual({
      startYear: 2026,
      startMonth: 1,
      start: '2026-01-01',
      end: '2026-12-31',
    });
  });

  it('ends on 29 Feb in a leap year when it starts in March', () => {
    expect(fiscalYearFor('2023-06-01', 3).end).toBe('2024-02-29');
  });

  it('rejects an invalid start month', () => {
    expect(() => fiscalYearFor('2026-11-12', 0)).toThrow(RangeError);
    expect(() => fiscalYearFor('2026-11-12', 13)).toThrow(RangeError);
  });

  it('property: each date is inside its year, and the next year starts the day after', () => {
    fc.assert(
      fc.property(arbLocalDate, fc.integer({ min: 1, max: 12 }), (date, startMonth) => {
        const fy = fiscalYearFor(date, startMonth);
        expect(fy.start <= date && date <= fy.end).toBe(true);
        expect(fiscalYearFor(addDays(fy.end, 1), startMonth).startYear).toBe(fy.startYear + 1);
      }),
    );
  });
});
