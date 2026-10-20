const { CurrencyConverter } = require('./currencyConverter');
const { RATES } = require('./exchangeRates');

function main(args = process.argv.slice(2)) {
  const converter = new CurrencyConverter();
  console.log('Application started!');
  console.log('Fixed educational rates; not live market quotes.');
  if (args.length === 0) {
    console.log('100 USD =', converter.convert(100, 'USD', 'RUB'), 'RUB');
    console.log('90 RUB =', converter.convert(90, 'RUB', 'EUR'), 'EUR');
  } else {
    if (args.length !== 3 || args[0].trim() === '') {
      throw new Error('Usage: npm start -- 100 USD RUB');
    }
    const [text, from, to] = args;
    console.log(`${text} ${from.toUpperCase()} = ${converter.convert(Number(text), from, to)} ${to.toUpperCase()}`);
  }
  console.log('Currencies:', Object.keys(RATES).join(', '));
  console.log('History:');
  console.table(converter.getHistory());
  return converter;
}
// При импорте в тестах программа сама не запускается.
if (require.main === module) {
  try { main(); } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { main };
