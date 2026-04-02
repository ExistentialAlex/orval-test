import { vi } from 'vitest';

export const mockRouterPush = vi.fn();

/**
 * Simple mock of vue router for use in unit testing.
 * @returns useRoute and useRouter mocked.
 * @example
 * ```ts
 * vi.mock('vue-router', async () => (await import('../mocks/vue-router')).mockVueRouter());
 * ```
 */
export const mockVueRouter = (opts: { name?: string } = {}) => ({
  useRoute: vi.fn(() => ({
    name: opts.name,
    params: {},
    query: {},
  })),
  useRouter: () => ({
    push: mockRouterPush,
  }),
});
