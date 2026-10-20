// Переносим исходники в dist. Работает одинаково в Windows и Linux.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.cpSync(path.join(root, 'src'), path.join(root, 'dist'), { recursive: true });
console.log('Build complete: dist/app.js');
