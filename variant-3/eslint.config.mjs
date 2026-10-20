import globals from 'globals';
// Настоящая проверка JS: необъявленные переменные и неиспользуемые значения.
export default [{
  files: ['**/*.js'],
  languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: { ...globals.node, ...globals.jest } },
  rules: { 'no-undef': 'error', 'no-unused-vars': 'error', 'eqeqeq': 'error' }
}];
