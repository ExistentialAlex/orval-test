import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['app', 'server', 'shared/*'],
    coverage: {
      provider: 'istanbul',
      include: ['{app,server,shared}/**/src/**/*.{ts,js,vue}'],
      exclude: [
        'node_modules',
        '{app,server,shared}/**/tests/**/*.{ts,js}',
        'shared/{types,schemas,i18n}/**',
        'app/src/main.ts',
        'app/src/types/**',
        'app/src/router/**',
        'app/src/core/**',
        'server/src/core/**',
        'server/src/index.ts',
        'server/src/exceptions/base.exception.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
