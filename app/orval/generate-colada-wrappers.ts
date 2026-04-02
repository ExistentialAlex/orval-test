import type { OperationKind, ParsedOperation } from './types';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import {
  renderIndexFile,
  renderWrapperFile,
} from './templates';

const APP_ROOT = process.cwd();
const ENDPOINTS_ROOT = path.join(APP_ROOT, 'src/api/endpoints');
const OUTPUT_ROOT = path.join(APP_ROOT, 'src/composables/generated');

/**
 * Determines whether a file path points to a generated endpoint source file.
 *
 * @param {string} filePath Absolute or relative file path.
 * @returns {boolean} True when the file should be parsed for operation wrappers.
 */
const isEndpointFile = (filePath: string): boolean => {
  const baseName = path.basename(filePath);

  return (
    baseName.endsWith('.ts')
    && !baseName.endsWith('.zod.ts')
    && !baseName.endsWith('.msw.ts')
    && baseName !== 'index.ts'
  );
};

/**
 * Converts a path string to POSIX separators for import paths.
 *
 * @param {string} value Path value that may use platform-specific separators.
 * @returns {string} Path normalized to forward slashes.
 */
const toPosix = (value: string): string => value.split(path.sep).join('/');

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
 * Extracts an HTTP method literal from an operation function body.
 *
 * @param {string} bodyText Function body source text.
 * @returns {string} Uppercase HTTP method, defaulting to GET.
 */
const getHttpMethodFromBody = (bodyText: string): string => {
  const methodMatch = bodyText.match(/method:\s*['"]([A-Z]+)['"]/);
  return methodMatch?.[1] ?? 'GET';
};

/**
 * Converts a string to upper snake case for constant naming.
 *
 * @param {string} value Input segment.
 * @returns {string} Normalized upper snake case value.
 */
const toSnakeCase = (value: string): string => {
  return value
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/[^a-z\d]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
};

/**
 * Returns a valid and ergonomic parameter name for generated wrappers.
 *
 * @param {string} name Raw parameter name.
 * @param {number} index Parameter index used for fallback naming.
 * @returns {string} Safe identifier for generated code.
 */
const getSafeParamName = (name: string, index: number): string => {
  const fallback = `arg${index}`;
  const candidate = (name || fallback).replace(/[^\w$]/g, '') || fallback;

  if (/^\d/.test(candidate)) {
    return fallback;
  }

  if (candidate === 'options') {
    return 'fetchOptions';
  }

  return candidate;
};

/**
 * Makes parameter names unique by appending numeric suffixes to duplicates.
 *
 * @param {string[]} names Candidate parameter names.
 * @returns {string[]} Unique names preserving original order.
 */
const uniquifyParamNames = (names: string[]): string[] => {
  const used = new Map<string, number>();

  return names.map((name) => {
    const count = used.get(name) ?? 0;
    used.set(name, count + 1);

    if (count === 0) {
      return name;
    }

    return `${name}${count + 1}`;
  });
};

/**
 * Builds a stable query key factory constant name from an endpoint path.
 *
 * @param {string} relativeFromEndpoints Endpoint file path relative to the endpoints root.
 * @returns {string} Query key factory constant name.
 */
const getQueryKeyFactoryName = (relativeFromEndpoints: string): string => {
  const segments = relativeFromEndpoints
    .replace(/\.ts$/, '')
    .split(path.sep)
    .filter(Boolean);

  const dedupedSegments = segments.filter((segment, index) => segment !== segments[index - 1]);
  const base = dedupedSegments.map(toSnakeCase).filter(Boolean).join('_') || 'ORVAL';

  return `${base}_QUERY_KEYS`;
};

/**
 * Builds the root query key path segments from an endpoint path.
 *
 * @param {string} relativeFromEndpoints Endpoint file path relative to the endpoints root.
 * @returns {string[]} Lowercase, de-duplicated key root segments.
 */
const getQueryKeyRootSegments = (relativeFromEndpoints: string): string[] => {
  const segments = relativeFromEndpoints
    .replace(/\.ts$/, '')
    .split(path.sep)
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  return segments.filter((segment, index) => segment !== segments[index - 1]);
};

/**
 * Parses exported async endpoint functions into operation metadata.
 *
 * @param {string} fileContent Endpoint source file content.
 * @returns {ParsedOperation[]} Parsed operations used to render wrappers.
 */
const parseOperations = (fileContent: string): ParsedOperation[] => {
  const sourceFile = ts.createSourceFile('api.ts', fileContent, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const operations: ParsedOperation[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
        continue;
      }

      if (!ts.isArrowFunction(declaration.initializer) || !declaration.initializer.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) {
        continue;
      }

      const bodyText = declaration.initializer.body.getText(sourceFile);
      const method = getHttpMethodFromBody(bodyText);
      const kind: OperationKind = method === 'GET' || method === 'HEAD' ? 'query' : 'mutation';
      const safeNames = uniquifyParamNames(
        declaration.initializer.parameters.map((parameter, index) => {
          const rawName = ts.isIdentifier(parameter.name) ? parameter.name.text : `arg${index}`;
          return getSafeParamName(rawName, index);
        }),
      );

      const params = declaration.initializer.parameters.map((parameter, index) => {
        return {
          name: safeNames[index],
          optional: Boolean(parameter.questionToken || parameter.initializer),
        };
      });

      operations.push({
        name: declaration.name.text,
        kind,
        params,
      });
    }
  }

  return operations;
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
