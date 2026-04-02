import { Hono } from 'hono';
import session from 'hono-session';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { requireUserSession } from '@/middleware';

describe('session Middleware', () => {
  describe('requireUserSession', () => {
    const initApp = () =>
      new Hono()
        .use(session())
        .get('/init', (c) => {
          const session = c.get('session');
          session.user = { email: 'test@test.org' };

          return c.json({ message: 'Initialized' });
        })
        .use(requireUserSession())
        .get('/protected', (c) => c.json({ message: 'Protected' }));

    let app = initApp();
    let client = testClient(app);

    beforeEach(() => {
      app = initApp();
      client = testClient(app);
    });

    it('should allow access to the route if the session is initialized', async () => {
      // Arrange
      const initRes = await client.init.$get();

      // Act
      const res = await client.protected.$get(
        {},
        { headers: { Cookie: initRes.headers.get('set-cookie')?.toString() || '' } },
      );

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe('Protected');
    });

    it('should return an unauthorized error if the session is not initialized', async () => {
      // Act
      const res = await client.protected.$get();

      // Assert
      expect(res.status).toBe(401);
      const body = await res.text();
      expect(body).toBe('Unauthorized');
    });

    it('should be possible to provide a custom status code and message', async () => {
      // Arrange
      const customStatusCode = 403;
      const customMessage = 'Forbidden';
      const appWithCustomError = new Hono()
        .use(session())
        .use(
          requireUserSession({
            statusCode: customStatusCode,
            message: customMessage,
          }),
        )
        .get('/protected', (c) => c.json({ message: 'Protected' }));

      const customClient = testClient(appWithCustomError);

      // Act
      const res = await customClient.protected.$get();

      // Assert
      expect(res.status).toBe(customStatusCode);
      const body = await res.text();
      expect(body).toBe(customMessage);
    });
  });
});
