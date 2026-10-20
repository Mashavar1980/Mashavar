const { spawnSync } = require('node:child_process');
const path = require('node:path');
const run = args => spawnSync(process.execPath, [path.join(__dirname, '../../src/app.js'), ...args], { encoding: 'utf8', timeout: 5000 });
test('demo starts and exits successfully', () => {
  const result = run([]);
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('100 USD = 9000 RUB');
  expect(result.stdout).toContain('History:');
});
test('CLI converts requested amount', () => {
  const result = run(['100', 'USD', 'EUR']);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('100 USD = 92 EUR');
});
test.each([['abc', 'USD', 'EUR'], ['1'], ['', 'USD', 'EUR']])('CLI rejects bad input %p', (...args) => {
  const result = run(args);
  expect(result.status).toBe(1);
  expect(result.stderr.length).toBeGreaterThan(0);
});
