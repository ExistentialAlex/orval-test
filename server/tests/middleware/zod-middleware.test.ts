import type { StandardSchemaV1 } from '@standard-schema/spec';
import { Hono } from 'hono';
import { requestId } from 'hono/request-id';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import z from 'zod';
import { i18nMiddleware, zValidator } from '@/middleware';

interface StandardError {
  success: false;
  error: StandardSchemaV1.Issue[];
}

describe('zod Middleware', () => {
  const initApp = () =>
    new Hono()
      .use('*', requestId())
      .use(i18nMiddleware)
      .post(
        '/',
        zValidator(
          'json',
          z.object({
            test: z.string().refine((v) => v.length >= 1, {
              params: { i18n: 'schemas.UserSchema.name.min' },
            }),
          }),
        ),
        (c) => {
          return c.text('Request finished');
        },
      )
      .post(
        '/params',
        zValidator(
          'json',
          z.object({
            test: z.string().refine((v) => v.length >= 1, {
              params: {
                i18n: 'server.exceptions.users.user-not-found',
                i18nParams: { id: 1 },
              },
            }),
          }),
        ),
        (c) => {
          return c.text('Request finished');
        },
      )
      .post(
        '/no-i18n',
        zValidator(
          'json',
          z.object({
            test: z.string().refine((v) => v.length >= 1, { params: { other: 'test' } }),
          }),
        ),
        (c) => {
          return c.text('Request finished');
        },
      )
      .post(
        '/hook',
        zValidator(
          'json',
          z.object({
            test: z.string().refine((v) => v.length >= 1, { params: { other: 'test' } }),
          }),
          (result, c) => {
            return c.json(result, 500);
          },
        ),
        (c) => {
          return c.text('Request finished');
        },
      );

  let app = initApp();
  let client = testClient(app);

  beforeEach(() => {
    app = initApp();
    client = testClient(app);
  });

  describe('zod Validator Middleware', () => {
    it('should not change the request if no validation errors occur', async () => {
      // Act
      const res = await client.index.$post(
        { json: { test: 'test' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(200);

      const body = await res.text();
      expect(body).toBe('Request finished');
    });

    it('should convert the schema message into the correct value', async () => {
      // Act
      const res = await client.index.$post(
        { json: { test: '' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(400);

      const body = (await res.json()) as StandardError;
      expect(body.error[0].message).toBe('Name is required');
    });

    it('should convert the schema message into the correct value with params', async () => {
      // Act
      const res = await client.params.$post(
        { json: { test: '' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(400);

      const body = (await res.json()) as StandardError;
      expect(body.error[0].message).toBe('User with ID \'1\' not found.');
    });

    it('should not convert non-custom errors', async () => {
      // Act
      const res = await client.params.$post(
        { json: { test: undefined as any } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(400);

      const body = (await res.json()) as StandardError;
      expect(body.error[0].message).not.toBe('User with ID \'1\' not found.');
    });

    it('should not convert errors if i18n is not provided', async () => {
      // Act
      const res = await client['no-i18n'].$post(
        { json: { test: '' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(400);

      const body = (await res.json()) as StandardError;
      expect(body.error[0].message).not.toBe('User with ID \'1\' not found.');
    });

    it('should run any input hooks', async () => {
      // Act
      const res = await client.hook.$post(
        { json: { test: 'test' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(500);
    });

    it('should run any input hooks on error', async () => {
      // Act
      const res = await client.hook.$post(
        { json: { test: '' } },
        { headers: { 'Accept-Language': 'en-GB' } },
      );

      // Assert
      expect(res.status).toBe(500);
    });
  });
});
