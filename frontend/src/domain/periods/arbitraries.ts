import fc from 'fast-check';

import { toLocalDate, type LocalDate } from './localDate';

/** Any real calendar date from 1990 to 2100 (test helper). */
export const arbLocalDate: fc.Arbitrary<LocalDate> = fc
  .date({
    min: new Date(Date.UTC(1990, 0, 1)),
    max: new Date(Date.UTC(2100, 11, 31)),
    noInvalidDate: true,
  })
  .map((d) =>
    toLocalDate({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }),
  );

export const arbStartDay = fc.integer({ min: 1, max: 28 });
