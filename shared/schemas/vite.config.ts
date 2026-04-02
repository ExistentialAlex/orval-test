import { resolve } from 'node:path';
import { defineConfig, mergeConfig } from 'vite';
import { BASIC_CONF } from '../../vite.config';

// https://vitejs.dev/config/
export default mergeConfig(
  BASIC_CONF,
  defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: '<project-name>_schemas',
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
  }),
);
