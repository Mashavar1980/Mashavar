const { CurrencyConverter } = require('../src/currencyConverter');

describe('Currency conversion', () => {
  let converter;
  beforeEach(() => { converter = new CurrencyConverter(); });
  test('100 USD -> 9000 RUB', () => {
    expect(converter.convert(100, 'USD', 'RUB')).toBe(9000);
  });
  test('cross conversion RUB -> EUR', () => {
    expect(converter.convert(90, 'RUB', 'EUR')).toBe(0.92);
  });
  test('same currency', () => { expect(converter.convert(50, 'GBP', 'GBP')).toBe(50); });
  test('zero amount', () => { expect(converter.convert(0, 'USD', 'CNY')).toBe(0); });
  test('case and surrounding spaces', () => { expect(converter.convert(1, ' usd ', 'eur')).toBe(0.92); });
  test('rounds to two digits', () => { expect(converter.convert(1, 'EUR', 'USD')).toBe(1.09); });
  test.each([-1, NaN, Infinity, '100', null])('rejects invalid amount %p', amount => {
    expect(() => converter.convert(amount, 'USD', 'EUR')).toThrow('Amount must');
    expect(converter.getHistory()).toEqual([]);
  });
  test.each(['XYZ', '__proto__', 'constructor', ''])('rejects invalid currency %s', code => {
    expect(() => converter.convert(1, code, 'USD')).toThrow('Unsupported currency');
  });
  test('rejects non-string currency', () => { expect(() => converter.convert(1, null, 'USD')).toThrow(); });
  test('rejects invalid target', () => { expect(() => converter.convert(1, 'USD', 'XXX')).toThrow(); });
  test('rejects overflow', () => { expect(() => converter.convert(Number.MAX_VALUE, 'USD', 'RUB')).toThrow('too large'); });
});
