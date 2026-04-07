import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  renderIndexFile,
  renderWrapperFile,
} from './templates';
import {
  getQueryKeyFactoryName,
  getQueryKeyRootSegments,
  isEndpointFile,
  parseOperations,
  toPosix,
} from './utils';

const APP_ROOT = process.cwd();
const ENDPOINTS_ROOT = path.join(APP_ROOT, 'src/api/endpoints');
const OUTPUT_ROOT = path.join(APP_ROOT, 'src/composables/generated');

/**
 * Recursively walks a directory and returns all file paths.
 *
 * @param {string} dirPath Directory to scan.
 * @returns {Promise<string[]>} A flat array of discovered file paths.
 */
const walkFiles = async (dirPath: string): Promise<string[]> => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(fullPath);
      }

      return fullPath;
    }),
  );

  return files.flat();
};

/**
 * Generates Pinia Colada wrapper files for all discovered Orval endpoint files.
 *
 * @returns {Promise<void>} Resolves when wrappers and barrel exports are written.
 */
const main = async (): Promise<void> => {
  const endpointFiles = (await walkFiles(ENDPOINTS_ROOT)).filter(isEndpointFile);

  await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const generatedWrapperFiles: string[] = [];

  for (const endpointFile of endpointFiles) {
    const content = await fs.readFile(endpointFile, 'utf8');
    const operations = parseOperations(content);

    if (operations.length === 0) {
      continue;
    }

    const relativeFromEndpoints = path.relative(ENDPOINTS_ROOT, endpointFile);
    const outputRelativePath = relativeFromEndpoints.replace(/\.ts$/, '.colada.ts');
    const outputFile = path.join(OUTPUT_ROOT, outputRelativePath);
    const outputDir = path.dirname(outputFile);

    await fs.mkdir(outputDir, { recursive: true });

    const endpointImportPath = `@/api/endpoints/${toPosix(relativeFromEndpoints.replace(/\.ts$/, ''))}`;
    const queryKeyFactoryName = getQueryKeyFactoryName(relativeFromEndpoints);
    const queryKeyRootSegments = getQueryKeyRootSegments(relativeFromEndpoints);
    const wrapperContent = renderWrapperFile({ endpointImportPath, operations, queryKeyFactoryName, queryKeyRootSegments });

    await fs.writeFile(outputFile, wrapperContent, 'utf8');
    generatedWrapperFiles.push(outputRelativePath);
  }

  if (generatedWrapperFiles.length === 0) {
    return;
  }

  await fs.writeFile(path.join(OUTPUT_ROOT, 'index.ts'), renderIndexFile(generatedWrapperFiles), 'utf8');
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
