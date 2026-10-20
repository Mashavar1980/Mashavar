const RATES = Object.freeze({ USD: 1, EUR: 0.92, RUB: 90, GBP: 0.79, CNY: 7.2, JPY: 150 });
const { normalizeCurrency, validateAmount } = require('./utils/validation');

class CurrencyConverter {
  // У каждого объекта собственная история; после закрытия процесса она исчезает.
  constructor() { this.history = []; }

  convert(amount, from, to) {
    validateAmount(amount);
    const source = normalizeCurrency(from);
    const target = normalizeCurrency(to);
    // Сначала переводим в USD, затем в целевую валюту.
    const raw = (amount / RATES[source]) * RATES[target];
    if (!Number.isFinite(raw) || raw > Number.MAX_SAFE_INTEGER / 100) {
      throw new Error('Amount is too large');
    }
    const result = Math.round((raw + Number.EPSILON) * 100) / 100;
    this.history.push({ amount, from: source, to: target, result, date: new Date().toISOString() });
    return result;
  }

  getHistory() {
    // Возвращаем копии: вызывающий код не сможет изменить записи истории.
    return this.history.map(record => ({ ...record }));
  }
  getLastConversion() {
    const last = this.history.at(-1);
    return last ? { ...last } : null;
  }
  clearHistory() { this.history = []; }
}
module.exports = { CurrencyConverter };
