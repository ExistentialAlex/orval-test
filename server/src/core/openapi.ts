import type { ServerEnv } from '@env';
import type { Hono } from 'hono';
import type { GenerateSpecOptions } from 'hono-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';

export const OPEN_API_DOCUMENTATION: Partial<GenerateSpecOptions> = {
  documentation: {
    info: {
      title: 'orval-test API',
      version: '0.0.0',
      description: 'API Documentation for the orval-test.',
    },
  },
};

export const configureOpenAPI = (app: Hono<ServerEnv>) => {
  app.get(
    '/openapi',
    openAPIRouteHandler(app, OPEN_API_DOCUMENTATION),
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
