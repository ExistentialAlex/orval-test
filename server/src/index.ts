import type { ServerEnv } from '../env';
import process from 'node:process';
import { Hono } from 'hono';
import { configureMiddleware, configureOpenAPI, configureRouter } from './core';

const PORT = process.env.PORT || 3000;

const app = new Hono<ServerEnv>();

// Setup Global Middleware
configureMiddleware(app);

// Configure Endpoints
const routes = configureRouter(app);

// Add OpenAPI spec.
configureOpenAPI(app);

export { routes };
export default {
  fetch: app.fetch,
  port: PORT,
};
