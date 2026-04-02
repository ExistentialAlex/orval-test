import { fileURLToPath } from 'node:url';
import { configDefaults, defineProject, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineProject({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'tests/e2e/**', 'tests/mocks/**', '.features-gen/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: [
        './tests/unit/setup/setup-router.ts',
        './tests/unit/setup/setup-test-utils.ts',
        './tests/unit/setup/setup-app-utils.ts',
        './tests/unit/setup/setup-mocks.ts',
      ],
    },
    resolve: {
      alias: {
        '@mocks': fileURLToPath(new URL('./tests/unit/mocks', import.meta.url)),
        '@helpers': fileURLToPath(new URL('./tests/unit/helpers', import.meta.url)),
        '@data': fileURLToPath(new URL('./tests/unit/data', import.meta.url)),
      },
    },
  }),
);
