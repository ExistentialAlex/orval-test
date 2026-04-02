import type { DeepPartial } from '<project-name>-types';
import type { FetchOptions } from 'ofetch';
import defu from 'defu';
import { vi } from 'vitest';

export const $fetch = vi.fn();

export const createMockFetchInstance = <
  T extends Record<string, Record<string, unknown>>,
  K extends keyof T,
>(
  defaults: T,
) => {
  const setupFetchResponses = (mockData?: DeepPartial<T>) => {
    $fetch.mockImplementation((url: K, options: FetchOptions = {}) => {
      const { method } = options;

      const data = (defu(mockData, defaults) as T)[url] as Partial<T[K]>;

      if (method && method in data) {
        return Promise.resolve(data[method]);
      }

      return Promise.resolve('GET' in data ? data.GET : data);
    });
  };

  return { setupFetchResponses };
};
