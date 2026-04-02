import type { Mock } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserSession } from '@/composables';
import { authGuard } from '@/guards';

vi.mock('@/composables', () => {
  return {
    useUserSession: vi.fn(),
  };
});

describe('auth Guard', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia());
  });

  it('should redirect to login if not authenticated', async () => {
    // Arrange
    (useUserSession as unknown as Mock).mockImplementationOnce(() => ({
      loggedIn: { value: false },
      ready: { value: true },
    }));
    const to = { path: '/test', query: {}, meta: { requiresAuth: true } };

    // Act
    const result = await authGuard(to as unknown as RouteLocationNormalized);

    // Assert
    expect(result).toEqual({ path: '/login', query: { redirect: '/test' } });
  });

  it('should allow access if authenticated', async () => {
    // Arrange
    (useUserSession as unknown as Mock).mockImplementationOnce(() => ({
      loggedIn: { value: true },
      ready: { value: true },
    }));
    const to = { meta: { requiresAuth: true } };

    // Act
    const result = await authGuard(to as unknown as RouteLocationNormalized);

    // Assert
    expect(result).toEqual(true);
  });

  it('should fetch the session if it is not ready yet', async () => {
    // Arrange
    const fetchSession = vi.fn();
    (useUserSession as unknown as Mock).mockImplementationOnce(() => ({
      loggedIn: { value: true },
      ready: { value: false },
      fetch: fetchSession,
    }));
    const to = { meta: { requiresAuth: true } };

    // Act
    const result = await authGuard(to as unknown as RouteLocationNormalized);

    // Assert
    expect(result).toEqual(true);
    expect(fetchSession).toHaveBeenCalled();
  });

  it('should append the query params and hash to the url if they exist', async () => {
    // Arrange
    (useUserSession as unknown as Mock).mockImplementationOnce(() => ({
      loggedIn: { value: false },
      ready: { value: true },
    }));
    const to = {
      path: '/test',
      query: { myParam: '123' },
      hash: '#hash',
      meta: { requiresAuth: true },
    };

    // Act
    const result = await authGuard(to as unknown as RouteLocationNormalized);

    // Assert
    expect(result).toEqual({ path: '/login', query: { redirect: '/test?myParam=123#hash' } });
  });
});
