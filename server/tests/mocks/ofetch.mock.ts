import { vi } from 'vitest';

export const $fetchMock = vi.fn();

export const ofetchCreateMock = vi.fn(() => $fetchMock);
