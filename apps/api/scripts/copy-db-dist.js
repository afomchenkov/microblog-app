// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs');

fs.mkdirSync('dist/data', { recursive: true });
fs.copyFileSync('data/microblog.db', 'dist/data/microblog.db');
