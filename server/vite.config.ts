import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import honoBuild from '@hono/vite-build/node';
import honoDevServer from '@hono/vite-dev-server';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      honoBuild(),
      honoDevServer({
        entry: 'src/index.ts', // The file path of your application.
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@env': fileURLToPath(new URL('./env.d.ts', import.meta.url)),
      },
    },
    server: {
      port: 3000, // The port your server will run on.
      strictPort: true, // Fail if the port is already in use.
      cors: false,
    },
  });
};
