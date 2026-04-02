import type { ClientResponse } from 'hono/client';
import { Hono } from 'hono';
import session from 'hono-session';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { i18nMiddleware } from '@/middleware';
import { authRouter, sessionRouter } from '@/router';

/**
 * Gets the set-cookie header from the response.
 * This is useful for extracting session cookies after login or other operations that modify the session.
 * @param res The response object from the client request
 * @returns The set-cookie header value as a string, ready to be used in subsequent requests.
 */
export const getSetCookieFromResponse = <T>(res: ClientResponse<T>) => {
  const cookies = res.headers.getSetCookie();
  return cookies ? [cookies[2], cookies[3]].join('; ') : '';
};

describe('session API', () => {
  let app = new Hono()
    .use('*', i18nMiddleware)
    .use(session())
    .route('/session', sessionRouter)
    .route('/auth', authRouter);
  let client = testClient(app);

  beforeEach(() => {
    app = new Hono()
      .use('*', i18nMiddleware)
      .use(session())
      .route('/session', sessionRouter)
      .route('/auth', authRouter);
    client = testClient(app);
  });

  describe('gET /session', () => {
    it('should return an empty session if the user is not logged in', async () => {
      // Arrange

      // Act
      const res = await client.session.$get();

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).not.toHaveProperty('user');
    });

    it('should return the current user session if logged in', async () => {
      // Arrange
      const loginRes = await client.auth.login.$post({
        json: { email: 'admin@admin.com', organisation: 'Organisation A' },
      });

      // Act
      const res = await client.session.$get(
        {},
        { headers: { Cookie: getSetCookieFromResponse(loginRes) } },
      );

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('user');
      expect(body.user.email).toBe('admin@admin.com');
      expect(body).not.toHaveProperty('secure');
    });
  });

  describe('dELETE /session', () => {
    it('should delete the session', async () => {
      // Arrange
      const loginRes = await client.auth.login.$post({
        json: { email: 'admin@admin.com', organisation: 'Organisation B' },
      });

      // Act
      const res = await client.session.$delete(
        {},
        { headers: { Cookie: getSetCookieFromResponse(loginRes) } },
      );

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe('Session cleared');

      // Verify session is cleared
      const sessionRes = await client.session.$get(
        {},
        {
          headers: { Cookie: getSetCookieFromResponse(res) },
        },
      );
      expect(sessionRes.status).toBe(200);
      const sessionBody = await sessionRes.json();
      expect(sessionBody).not.toHaveProperty('user');
    });
  });
});
