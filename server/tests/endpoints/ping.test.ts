import { Hono } from 'hono';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { i18nMiddleware } from '@/middleware';
import { pingRouter } from '@/router';

describe('ping API', () => {
  let app = new Hono().use('*', i18nMiddleware).route('/', pingRouter);
  let client = testClient(app);

  beforeEach(() => {
    app = new Hono().use('*', i18nMiddleware).route('/', pingRouter);
    client = testClient(app);
  });

  it('should return ping message', async () => {
    // Arrange
    // Act
    const res = await client.index.$get();

    // Assert
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ message: 'Congratulations! Your API is live! 🚀' });
  });
});
