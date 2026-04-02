import { vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@/core', async () => {
  const { $fetch } = await import('@mocks/fetch.mock');
  return {
    useFetch: () => ({
      $fetch,
    }),
    useConfig: vi.fn(() => ({
      config: ref({}),
    })),
  };
});
