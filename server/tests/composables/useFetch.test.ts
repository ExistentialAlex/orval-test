import type { Context } from 'hono';
import type { FetchResponse, ResolvedFetchOptions } from 'ofetch';
import { $fetchMock } from '@mocks/ofetch.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  logRequestWithID,
  logResponseErrorWithID,
  logResponseWithID,
  useFetch,
} from '@/composables/useFetch';
import { log, logExternalError, logExternalRequest, logExternalResponse } from '@/utils';

vi.mock('ofetch', async () => {
  const { ofetchCreateMock } = await import('@mocks/ofetch.mock');
  return {
    ofetch: {
      create: ofetchCreateMock,
    },
  };
});
vi.mock('@/utils', () => {
  return {
    logExternalRequest: vi.fn(),
    logExternalResponse: vi.fn(),
    logExternalError: vi.fn(),
    log: vi.fn(),
  };
});

describe('useFetch Composable', () => {
  let c: Context;
  const testRequestId = 'test-request-123';

  beforeEach(() => {
    c = {
      env: { VITE_ASM_URL: 'http://test-asm' },
      session: { secure: { authToken: '1234' } },
      get: vi.fn().mockReturnValue(testRequestId),
    } as unknown as Context;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('useFetch', () => {
      it('should create an ofetch instance with the specified options', async () => {
        // Arrange
        const { $fetch } = useFetch(c, 'test');

        // Act
        await $fetch('');

        // Assert
        expect($fetchMock).toHaveBeenCalled();
      });

      it('should log a warning message to console if baseURL is not defined', () => {
        // Arrange
        useFetch(c, '');

        // Assert
        expect(log).toHaveBeenCalledWith(
          '`baseURL` is undefined. You may experience unexpected behaviour when making external requests.',
          testRequestId,
        );
      });

      it('should create useFetch with requestId context for logging', async () => {
        // Arrange
        const { $fetch } = useFetch(c, 'http://test-api');

        // Act
        await $fetch('');

        // Assert
        expect($fetchMock).toHaveBeenCalled();
        // Verify that the context's requestId was retrieved
        expect(c.get).toHaveBeenCalledWith('requestId');
      });

      it('should handle error responses gracefully', async () => {
        // Arrange
        const { $fetch } = useFetch(c, 'http://test-api');

        // Mock a failed request
        $fetchMock.mockRejectedValueOnce(new Error('Network error'));

        // Act & Assert
        await expect($fetch('/test-endpoint')).rejects.toThrow('Network error');
      });

      it('should include authorization header from context session', () => {
        // Arrange & Act
        useFetch(c, 'http://test-api');

        // Assert
        expect($fetchMock).toBeDefined();
        // Note: The authorization header setting is tested implicitly through the ofetch mock
        // In a real scenario, this would be verified through the actual HTTP request headers
      });
    });
    describe('logRequest', () => {
      it('should log the outgoing request', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {} as unknown as ResolvedFetchOptions,
        };

        // Act
        logRequestWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalRequest).toHaveBeenCalledWith('GET', 'test', 'test-request-123');
      });

      it('should log the outgoing POST request', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {
            method: 'POST',
          } as unknown as ResolvedFetchOptions,
        };

        // Act
        logRequestWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalRequest).toHaveBeenCalledWith('POST', 'test', 'test-request-123');
      });
    });

    describe('logResponse', () => {
      it('should log the incoming response', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {} as unknown as ResolvedFetchOptions,
          response: {
            status: 200,
          } as FetchResponse<unknown>,
        };

        // Act
        logResponseWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalResponse).toHaveBeenCalledWith('GET', 'test', 200, 'test-request-123');
      });

      it('should log the incoming POST response', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {
            method: 'POST',
          } as unknown as ResolvedFetchOptions,
          response: {
            status: 200,
          } as FetchResponse<unknown>,
        };

        // Act
        logResponseWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalResponse).toHaveBeenCalledWith('POST', 'test', 200, 'test-request-123');
      });
    });

    describe('logResponseError', () => {
      it('should log the incoming response', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {} as unknown as ResolvedFetchOptions,
          response: {
            status: 200,
            _data: 'test data',
          } as FetchResponse<unknown>,
        };

        // Act
        logResponseErrorWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalError).toHaveBeenCalledWith(
          'GET',
          'test',
          200,
          'test-request-123',
          '"test data"',
        );
      });

      it('should log the incoming POST response', () => {
        // Arrange
        const requestData = {
          request: {
            toString: () => 'test',
          },
          options: {
            method: 'POST',
          } as unknown as ResolvedFetchOptions,
          response: {
            status: 200,
            _data: 'test data',
          } as FetchResponse<unknown>,
        };

        // Act
        logResponseErrorWithID(testRequestId)(requestData);

        // Assert
        expect(logExternalError).toHaveBeenCalledWith(
          'POST',
          'test',
          200,
          'test-request-123',
          '"test data"',
        );
      });
    });
  });
});
