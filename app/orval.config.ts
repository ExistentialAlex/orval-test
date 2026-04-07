import { defineConfig } from 'orval';

export default defineConfig({
  server: {
    hooks: {
      afterAllFilesWrite: ['pnpm exec jiti ./orval/generate-colada-wrappers.ts'],
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints',
      schemas: 'src/api/models',
      baseUrl: 'http://localhost:3000',
      client: 'fetch',
      mock: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },

      },
    },
    input: {
      target: '../server/openapi.json',
    },
  },
  serverZod: {
    input: {
      target: '../server/openapi.json',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/api/endpoints',
      fileExtension: '.zod.ts',
    },
  },
});
