import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    hooks: {
      afterAllFilesWrite: ['pnpm exec jiti ./orval/generate-colada-wrappers.ts'],
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints',
      schemas: 'src/api/models',
      client: 'fetch',
      mock: true,
    },
    input: {
      target: './petstore.yaml',
    },
  },
  petstoreZod: {
    input: {
      target: './petstore.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/api/endpoints',
      fileExtension: '.zod.ts',
    },
  },
});
