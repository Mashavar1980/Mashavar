const { CurrencyConverter } = require('../../src/currencyConverter');
describe('Conversion history', () => {
  test('stores conversions in order with timestamps', () => {
    const converter = new CurrencyConverter();
    converter.convert(100, 'usd', 'rub');
    converter.convert(1, 'USD', 'EUR');
    const history = converter.getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({ amount: 100, from: 'USD', to: 'RUB', result: 9000 });
    expect(Number.isNaN(Date.parse(history[0].date))).toBe(false);
  });
  test('returns copies and supports clearing', () => {
    const converter = new CurrencyConverter();
    converter.convert(1, 'USD', 'EUR');
    const copy = converter.getHistory();
    copy[0].result = -1;
    copy.push({});
    expect(converter.getHistory()[0].result).toBe(0.92);
    expect(converter.getHistory()).toHaveLength(1);
    converter.clearHistory();
    expect(converter.getHistory()).toEqual([]);
  });
  test('separate instances have separate histories', () => {
    const first = new CurrencyConverter();
    first.convert(1, 'USD', 'EUR');
    expect(new CurrencyConverter().getHistory()).toEqual([]);
  });
});
