import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const bffEnvFile = join(__dirname, '../server/.env');

const main = () => {
  console.log('Initialising .env file 🚧');

  if (existsSync(bffEnvFile)) {
    console.log('➡️ .env file already initialised, skipping.')
    return;
  }

  writeFileSync(bffEnvFile, 'VITE_UI_URL=http://localhost:5173\n');
  console.log('.env file created. 🎉');
};

main();
