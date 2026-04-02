import type { ServerEnv } from '@env';
import type { Hono } from 'hono';
import session from 'hono-session';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { i18nMiddleware, logger } from '@/middleware';

export const configureMiddleware = (app: Hono<ServerEnv>) => {
  app.use(
    session({
      cookieOptions: {
        sameSite: 'None',
      },
    }),
  );
  app.use('*', requestId());
  app.use(logger()); // Apply logger middleware
  app.use('*', i18nMiddleware);
  app.use('*', async (c, next) => {
    const origin = env(c).VITE_UI_URL; // Default to frontend dev server URL

    const corsMiddleware = cors({
      origin, // Allow requests from the frontend development server
      credentials: true,
    });

    return corsMiddleware(c, next);
  }); // Apply CORS middleware globally
};
