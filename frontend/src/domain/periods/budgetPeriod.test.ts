import fc from 'fast-check';

import { arbLocalDate, arbStartDay } from './arbitraries';
import {
  daysInPeriod,
  daysLeftInPeriod,
  monthsCovered,
  periodById,
  periodFor,
  periodIdFor,
  shiftPeriodId,
} from './budgetPeriod';
import { addDays } from './localDate';

describe('budget periods', () => {
  it('with start day 1, a period is the calendar month', () => {
    expect(periodFor('2026-11-12', 1)).toEqual({
      id: '2026-11',
      start: '2026-11-01',
      end: '2026-11-30',
    });
    expect(periodFor('2024-02-29', 1)).toEqual({
      id: '2024-02',
      start: '2024-02-01',
      end: '2024-02-29',
    });
  });

  it('start day 25: 24 Nov belongs to the period starting 25 Oct (03)', () => {
    expect(periodFor('2026-11-24', 25)).toEqual({
      id: '2026-10',
      start: '2026-10-25',
      end: '2026-11-24',
    });
    expect(periodIdFor('2026-11-25', 25)).toBe('2026-11');
  });

  it('start day 25: 24 Mar → 2026-02, 25 Mar → 2026-03 (E3)', () => {
    expect(periodFor('2026-03-24', 25)).toEqual({
      id: '2026-02',
      start: '2026-02-25',
      end: '2026-03-24',
    });
    expect(periodIdFor('2026-03-25', 25)).toBe('2026-03');
  });

  it('crosses the year boundary', () => {
    expect(periodFor('2027-01-10', 25)).toEqual({
      id: '2026-12',
      start: '2026-12-25',
      end: '2027-01-24',
    });
  });

  it('rejects start days outside 1–28', () => {
    for (const bad of [0, 29, 31, 1.5, -1]) {
      expect(() => periodIdFor('2026-11-12', bad)).toThrow(RangeError);
    }
  });

  it('counts days in the period and days left including today', () => {
    const p = periodById('2026-02', 25); // 25 Feb – 24 Mar 2026
    expect(daysInPeriod(p)).toBe(28);
    expect(daysLeftInPeriod(p, '2026-02-25')).toBe(28);
    expect(daysLeftInPeriod(p, '2026-03-24')).toBe(1);
    expect(daysLeftInPeriod(p, '2026-03-25')).toBe(0);
    expect(daysLeftInPeriod(p, '2026-01-01')).toBe(28);
  });

  it('lists the calendar months a period touches', () => {
    expect(monthsCovered(periodById('2026-11', 1))).toEqual(['2026-11']);
    expect(monthsCovered(periodById('2026-11', 25))).toEqual(['2026-11', '2026-12']);
  });

  it('shifts period ids across years', () => {
    expect(shiftPeriodId('2026-12', 1)).toBe('2027-01');
    expect(shiftPeriodId('2026-01', -1)).toBe('2025-12');
    expect(shiftPeriodId('2026-05', -17)).toBe('2024-12');
  });

  it('property: every date lies inside exactly the period it is assigned to', () => {
    fc.assert(
      fc.property(arbLocalDate, arbStartDay, (date, startDay) => {
        const p = periodFor(date, startDay);
        expect(p.start <= date && date <= p.end).toBe(true);
        expect(periodIdFor(p.start, startDay)).toBe(p.id);
        expect(periodIdFor(p.end, startDay)).toBe(p.id);
      }),
    );
  });

  it('property: consecutive periods have no gap or overlap and last 28–31 days', () => {
    fc.assert(
      fc.property(arbLocalDate, arbStartDay, (date, startDay) => {
        const p = periodFor(date, startDay);
        const next = periodById(shiftPeriodId(p.id, 1), startDay);
        expect(next.start).toBe(addDays(p.end, 1));
        expect(daysInPeriod(p)).toBeGreaterThanOrEqual(28);
        expect(daysInPeriod(p)).toBeLessThanOrEqual(31);
      }),
    );
  });
});
