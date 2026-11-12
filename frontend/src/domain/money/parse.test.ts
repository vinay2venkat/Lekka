import fc from 'fast-check';

import { parseAmount } from './parse';
import { MAX_AMOUNT } from './paise';

const ok = (paise: number) => ({ ok: true, paise });
const err = (reason: string) => ({ ok: false, reason });

describe('parseAmount', () => {
  it.each([
    ['60', 6_000],
    ['60.5', 6_050],
    ['60.50', 6_050],
    ['0.01', 1],
    ['₹1,50,000', 15_000_000],
    ['₹ 1,50,000.50', 15_000_050],
    ['150,000', 15_000_000],
    ['Rs. 499', 49_900],
    ['INR 499', 49_900],
    ['1.5k', 150_000],
    ['1.5K', 150_000],
    ['2 lakh', 20_000_000],
    ['2lakhs', 20_000_000],
    ['2 lac', 20_000_000],
    ['2L', 20_000_000],
    ['1.25 lakh', 12_500_000],
    ['1.23456k', 123_456],
    ['1 cr', 1_000_000_000],
    ['1 crore', 1_000_000_000],
    ['10 crore', MAX_AMOUNT],
    ['120+80', 20_000],
    ['₹120 + ₹80.50', 20_050],
    ['0+60', 6_000],
    ['  60  ', 6_000],
    ['60.500', 6_050],
  ])('parses %j as %d paise', (input, paise) => {
    expect(parseAmount(input)).toEqual(ok(paise));
  });

  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['-50', 'negative'],
    ['50-20', 'negative'],
    ['0', 'zero'],
    ['0.00', 'zero'],
    ['0.001', 'too_many_decimals'],
    ['1,50,000.505', 'too_many_decimals'],
    ['1.234567k', 'too_many_decimals'],
    ['1e5', 'invalid'],
    ['abc', 'invalid'],
    ['12abc', 'invalid'],
    ['1,5,0', 'invalid'],
    ['1,50,00', 'invalid'],
    ['60.', 'invalid'],
    ['.5', 'invalid'],
    ['120+', 'invalid'],
    ['120*2', 'invalid'],
    ['10 crore + 1', 'out_of_range'],
    ['11 crore', 'out_of_range'],
    ['२००', 'unsupported_digits'],
    ['௫௦', 'unsupported_digits'],
  ])('rejects %j with reason %s', (input, reason) => {
    expect(parseAmount(input)).toEqual(err(reason));
  });

  it('property: any whole-paise amount written as rupees.paise parses back exactly', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: MAX_AMOUNT }), (paise) => {
        const text = `${String(Math.floor(paise / 100))}.${String(paise % 100).padStart(2, '0')}`;
        expect(parseAmount(text)).toEqual(ok(paise));
      }),
    );
  });

  it('property: a sum parses to the sum of its terms', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 100_000 }), { minLength: 1, maxLength: 10 }),
        (rupees) => {
          const expected = rupees.reduce((s, r) => s + r * 100, 0);
          expect(parseAmount(rupees.join('+'))).toEqual(ok(expected));
        },
      ),
    );
  });
});
