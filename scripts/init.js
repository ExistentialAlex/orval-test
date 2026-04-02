import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

/**
 * Recursively gets all the paths to files in the input directory.
 * @param {String} dir The current directory to search.
 * @param {String[]} fileList The list of previously explored files.
 * @returns The list of file paths.
 */
const getAllFiles = (dir, fileList = []) => {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);

    if (
      filePath.includes('node_modules') ||
      filePath.includes('.git') ||
      filePath.includes(`${join('scripts', '')}`)
    ) {
      continue;
    }

    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
      continue;
    }

    fileList.push(filePath);
  }

  return fileList;
};

/**
 * Converts a string to kebabcase.
 * @param {String} str The string to convert.
 * @returns {String} The converted string.
 */
const kebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+|_/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
};

// Main script
const main = () => {
  const args = process.argv.slice(2);
  if (args.length < 4) {
    console.error(
      'Usage: node init.js <repository-name> <project-name> <platform-team-name> <platform-keyfile-name>'
    );
    process.exit(1);
  }
  const repoNameInput = args[0];
  const projectNameInput = args[1];
  const platformTeamNameInput = args[2];
  const platformKeyfileNameInput = args[3];
  const repoNameKebab = kebabCase(repoNameInput);
  const projectNameKebab = kebabCase(projectNameInput);
  const platformTeamKebab = kebabCase(platformTeamNameInput);
  const platformKeyfileKebab = kebabCase(platformKeyfileNameInput);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = join(__filename, '..');
  const root = join(__dirname, '..');
  const files = getAllFiles(root);
  files.forEach((file) => {
    // Only process text/code files
    const ext = extname(file);
    if (
      [
        '.js',
        '.ts',
        '.json',
        '.md',
        '.yaml',
        '.yml',
        '.env',
        '.txt',
        '.tsx',
        '.jsx',
        '.html',
        '.css',
        '.scss',
        '.less',
        '.vue',
        '',
      ].includes(ext)
    ) {
      let content = readFileSync(file, 'utf8');
      let updated = false;

      const replacementMapping = {
        '<repository-name>': repoNameKebab,
        '<project-name>': projectNameKebab,
        '<platform-team-name>': platformTeamKebab,
        '<platform-keyfile-name>': platformKeyfileKebab,
      };

      for (const [key, value] of Object.entries(replacementMapping)) {
        if (content.includes(key)) {
          content = content.split(key).join(value);
          updated = true;
        }
      }

      if (updated) {
        writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file} ✅`);
      }
    }
  });
  console.log('Replacement complete ✅');

  console.log('Installing Packages 🚧');

  execSync('pnpm install', { stdio: 'inherit' });

  console.log('Packages installed ✅\n')

  console.log('Fixing Linting Errors 🚧')

  execSync('pnpm run lint:fix', { stdio: 'inherit' });

  console.log('Fixing Linting Errors ✅')
};

main();
