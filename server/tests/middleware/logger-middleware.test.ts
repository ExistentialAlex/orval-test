import { Hono } from 'hono';
import { requestId } from 'hono/request-id';
import { testClient } from 'hono/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from '@/middleware';
import { colorString, log } from '@/utils';

describe('logger Middleware', () => {
  const initApp = () =>
    new Hono()
      .use('*', requestId())
      .use(logger())
      .get('/', (c) => {
        log('My Request', c.get('requestId'));
        return c.text('Request finished');
      });

  let app = initApp();
  let client = testClient(app);

  beforeEach(() => {
    app = initApp();
    client = testClient(app);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('logger', () => {
    it('should collect all logs and print them as one block when request finishes', async () => {
      // Arrange
      vi.useFakeTimers();
      const consoleSpy = vi.spyOn(console, 'log');
      const testRequestId = '123456';

      // Act
      await client.index.$get(
        {},
        {
          headers: {
            'X-Request-Id': testRequestId,
          },
        },
      );

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const loggedOutput = consoleSpy.mock.calls[0][0];

      // Check that all expected log parts are in the single output
      expect(loggedOutput).toContain(`┌─┤${testRequestId}├─┤${new Date().toISOString()}│`);
      expect(loggedOutput).toContain(`${colorString('│', 'info')} <-- GET /`);
      expect(loggedOutput).toContain(`${colorString('│', 'info')} My Request`);
      expect(loggedOutput).toContain(
        `${colorString('│', 'info')} --> GET / ${colorString('200', 'success')} 0ms`,
      );
      expect(loggedOutput).toContain(
        '└──────────────────────────────────────────────────────────────────',
      );

      // Cleanup
      vi.useRealTimers();
    });

    it('should handle requests without custom logs', async () => {
      // Arrange
      vi.useFakeTimers();
      const consoleSpy = vi.spyOn(console, 'log');
      const testRequestId = '789012';

      const simpleApp = new Hono()
        .use('*', requestId())
        .use(logger())
        .get('/', (c) => c.text('Simple response'));

      const simpleClient = testClient(simpleApp);

      // Act
      await simpleClient.index.$get(
        {},
        {
          headers: {
            'X-Request-Id': testRequestId,
          },
        },
      );

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      const loggedOutput = consoleSpy.mock.calls[0][0];

      // Check that basic request/response logs are present
      expect(loggedOutput).toContain(`┌─┤${testRequestId}├─┤${new Date().toISOString()}│`);
      expect(loggedOutput).toContain(`${colorString('│', 'info')} <-- GET /`);
      expect(loggedOutput).toContain(
        `${colorString('│', 'info')} --> GET / ${colorString('200', 'success')} 0ms`,
      );
      expect(loggedOutput).toContain(
        '└──────────────────────────────────────────────────────────────────',
      );

      // Cleanup
      vi.useRealTimers();
    });
  });
});
