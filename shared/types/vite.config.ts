import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { BASIC_CONF } from '../../vite.config';

// https://vitejs.dev/config/
export default defineConfig({
  ...BASIC_CONF,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '<project-name>_types',
    },
    // Rollup conf
    rollupOptions: {
      input: {
        main: './src/index.ts',
      },
      output: {
        exports: 'named',
      },
    },
  },
});
