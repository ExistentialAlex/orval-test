import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@mocks': new URL('./tests/mocks/', import.meta.url).pathname,
    },
  },
});
