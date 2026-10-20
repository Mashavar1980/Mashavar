const { RATES } = require('../exchangeRates');
function normalizeCurrency(code) {
  if (typeof code !== 'string') throw new Error('Currency code must be a string');
  const normalized = code.trim().toUpperCase();
  if (!Object.hasOwn(RATES, normalized)) throw new Error(`Unsupported currency: ${normalized}`);
  return normalized;
}
function validateAmount(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new Error('Amount must be a finite non-negative number');
  }
}
module.exports = { normalizeCurrency, validateAmount };
