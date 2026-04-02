import type { CreateUser, UpdateUser } from '<project-name>-schemas';
import type { Context } from 'hono';
import { doublet } from '<project-name>-utils';
import { $fetchMock } from '@mocks/ofetch.mock';
import { FetchError } from 'ofetch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserGetException, UserNotFoundException } from '@/exceptions';
import { useUserService } from '@/services';

vi.mock('ofetch', async (original) => {
  const { ofetchCreateMock } = await import('@mocks/ofetch.mock');
  return {
    ...(await original()),
    ofetch: {
      create: ofetchCreateMock,
    },
  };
});

vi.mock('@intlify/hono', () => {
  return {
    useTranslation: () => vi.fn(),
  };
});

describe('user Service', () => {
  let c: Context;

  beforeEach(() => {
    c = {
      env: { VITE_ASM_URL: 'http://test-asm' },
      session: { secure: { authToken: '1234' } },
      get: (key: string) => c[key as keyof typeof c],
      req: { url: '' },
    } as unknown as Context;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('getUsers', () => {
      it('should return a list of users', async () => {
        // Arrange

        // Act
        const res = await useUserService(c).getUsers();

        // Assert
        expect(res.results[0].id).toBe(1);
      });
    });

    describe('getUser', () => {
      it('should return an user corresponding to the input id', async () => {
        // Arrange

        // Act
        const res = await useUserService(c).getUser(1);

        // Assert
        expect(res.id).toBe(1);
      });

      it('should handle 404 errors', async () => {
        // Arrange

        // Act
        const [err] = await doublet(useUserService(c).getUser, 52);

        // Assert
        expect(err instanceof UserNotFoundException).toBe(true);
      });

      it('should handle unexpected errors', async () => {
        // Arrange

        // Act
        const [err] = await doublet(useUserService(c).getUser, 999);

        // Assert
        expect(err instanceof UserGetException).toBe(true);
      });
    });

    describe('createUser', () => {
      it('should create an user matching the input schema', async () => {
        // Arrange
        const data: CreateUser = {
          name: 'Test',
          jobTitle: 'test',
        };

        // Act
        const res = await useUserService(c).createUser(data);

        // Assert
        expect(res.id).toBe(52);
      });
    });

    describe('updateUser', () => {
      it('should update the specified user', async () => {
        // Arrange
        const data: UpdateUser = {
          name: 'Updated name',
          jobTitle: 'test',
        };

        // Act
        const res = await useUserService(c).updateUser(1, data);

        // Assert
        expect(res.id).toBe(1);
      });

      it('should handle 404 errors from updating the user', async () => {
        // Arrange
        const data: UpdateUser = {
          name: 'Updated name',
          jobTitle: 'test',
        };
        $fetchMock.mockImplementationOnce(() => {
          const err = new FetchError('');
          err.status = 404;
          throw err;
        });

        // Act
        const [err] = await doublet(useUserService(c).updateUser, 53, data);

        // Assert
        expect(err instanceof UserNotFoundException).toBe(true);
      });
    });

    describe('deleteUser', () => {
      it('should return an user corresponding to the input id', async () => {
        // Arrange

        // Act
        const res = await useUserService(c).deleteUser(1);

        // Assert
        expect(res.id).toBe(1);
      });

      it('should handle 404 errors', async () => {
        // Arrange

        // Act
        const [err] = await doublet(useUserService(c).deleteUser, 55);

        // Assert
        expect(err instanceof UserNotFoundException).toBe(true);
      });
    });
  });
});
