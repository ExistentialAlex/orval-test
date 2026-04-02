import {
  createUserMock,
  deleteUserMock,
  getUserMock,
  getUsersMock,
  updateUserMock,
} from '@mocks/user-service.mock';
import { Hono } from 'hono';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userRouter } from '@/router';

vi.mock('@/services', async () => {
  const { mockUserService } = await import('@mocks/user-service.mock');

  return {
    useUserService: mockUserService,
  };
});

vi.mock('@/middleware', async (original) => {
  const { createMiddleware } = await import('hono/factory');

  return {
    ...(await original()),
    requireUserSession: () => createMiddleware((c, next) => next()),
  };
});

describe('users API', () => {
  let app = new Hono().route('/users', userRouter);
  let client = testClient(app);

  beforeEach(() => {
    app = new Hono().route('/users', userRouter);
    client = testClient(app);
  });

  describe('gET /users', () => {
    it('should return a list of users', async () => {
      // Arrange
      getUsersMock.mockResolvedValueOnce({ results: [{ id: 1 }] });
      const query = { page: '1', page_size: '25' };

      // Act
      const res = await client.users.$get({ query });

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.results[0].id).toBe(1);
    });
  });

  describe('gET /users/:id', () => {
    it('should return a user by ID', async () => {
      // Arrange
      getUserMock.mockResolvedValueOnce({ id: 1 });
      const userId = '1';

      // Act
      const res = await client.users[':id'].$get({ param: { id: userId } });

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(1);
    });
  });

  describe('pOST /users', () => {
    it('should create a new user', async () => {
      // Arrange
      createUserMock.mockResolvedValueOnce({ id: 1 });
      const newUser = { name: 'John Doe', jobTitle: 'Tester' };

      // Act
      const res = await client.users.$post({ json: newUser });

      // Assert
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.id).toBe(1);
    });
  });

  describe('pATCH /users/:id', () => {
    it('should update an existing user', async () => {
      // Arrange
      updateUserMock.mockResolvedValueOnce({ id: 1 });
      const userId = '1';
      const updatedUser = { name: 'Alex Ashwood', jobTitle: 'Senior Developer' };

      // Act
      const res = await client.users[':id'].$patch({
        param: { id: userId },
        json: updatedUser,
      });

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(1);
    });
  });

  describe('dELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
      // Arrange
      deleteUserMock.mockResolvedValueOnce({ id: 1 });
      const userId = '1';

      // Act
      const res = await client.users[':id'].$delete({ param: { id: userId } });

      // Assert
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(1);
    });
  });
});
