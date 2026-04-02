import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export const requireUserSession = (
  opts: { statusCode?: ContentfulStatusCode; message?: string } = {},
) =>
  createMiddleware(async (c, next) => {
    const session = c.get('session');

    // Check if the session exists and has a user
    if (!session?.user) {
      throw new HTTPException(opts.statusCode || 401, {
        message: opts.message || 'Unauthorized',
      });
    }

    // If the session is valid, renew it to keep it active
    session.renew();

    await next();
  });

export const clearSession = (c: Context) => {
  c.session = null;
};
