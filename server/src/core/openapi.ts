import type { ServerEnv } from '@env';
import type { Hono } from 'hono';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';

export const configureOpenAPI = (app: Hono<ServerEnv>) => {
  app.get(
    '/openapi',
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: 'orval-test API',
          version: '0.0.0',
          description: 'API Documentation for the orval-test.',
        },
      },
    }),
  );
  app.get(
    '/docs',
    Scalar({
      theme: 'elysiajs',
      layout: 'classic',
      url: '/openapi',
    }),
  );
};
