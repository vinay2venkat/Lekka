import { todayIn } from './today';

describe('todayIn (household timezone, E1/E2)', () => {
  it('uses the household timezone, not UTC or the device', () => {
    // 2026-11-12 18:29:50 UTC is 23:59:50 IST on the 12th.
    const lateEvening = new Date('2026-11-12T18:29:50Z');
    expect(todayIn('Asia/Kolkata', lateEvening)).toBe('2026-11-12');
    // Ten seconds after IST midnight it is the 13th in India but still the 12th in UTC.
    const afterMidnight = new Date('2026-11-12T18:30:00Z');
    expect(todayIn('Asia/Kolkata', afterMidnight)).toBe('2026-11-13');
    expect(todayIn('UTC', afterMidnight)).toBe('2026-11-12');
  });

  it('gives a relative abroad their household’s date, not their own', () => {
    const now = new Date('2026-11-13T02:00:00Z'); // 18:00 on the 12th in California
    expect(todayIn('America/Los_Angeles', now)).toBe('2026-11-12');
    expect(todayIn('Asia/Kolkata', now)).toBe('2026-11-13');
  });

  it('throws for an unknown timezone', () => {
    expect(() => todayIn('Mars/Olympus', new Date())).toThrow(RangeError);
  });
});
