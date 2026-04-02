import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addRawLogToRequest,
  colorString,
  flushRequestLogs,
  initRequestLogs,
  log,
  logExternalError,
  logExternalRequest,
  logExternalResponse,
  logRequest,
  logResponse,
} from '@/utils';

describe('logger', () => {
  let consoleLogSpy: MockInstance;
  const prefix = colorString('│', 'info');
  const testRequestId = 'test-request-id';

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log');
    // Initialize request logs for each test
    initRequestLogs(testRequestId);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('colorString', () => {
      it('should return the status if an invalid status was provided', () => {
        // Act
        const res = colorString('test', 'test' as any);

        // Assert
        expect(res).toBe('test');
      });
    });

    describe('log', () => {
      it('should collect the log message and print it when flushed', () => {
        // Act
        log('Test', testRequestId, 'Log', 'Message');
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${prefix} Test Log Message`);
      });
    });

    describe('logRequest', () => {
      it('should collect the request log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logRequest(method, path, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${prefix} <-- ${method} ${path}`);
      });
    });

    describe('logResponse', () => {
      it('should collect the response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logResponse(method, path, 200, '2ms', testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} --> ${method} ${path} ${colorString('200', 'success')} 2ms`,
        );
      });
    });

    describe('logExternalRequest', () => {
      it('should collect the external request log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalRequest(method, path, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${prefix} --> ${method} ${path}`);
      });
    });

    describe('logExternalResponse', () => {
      it('should collect a successful response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalResponse(method, path, 200, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} <-- ${method} ${path} \x1B[32m200\x1B[0m`,
        );
      });

      it('should collect a redirect response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalResponse(method, path, 301, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} <-- ${method} ${path} \x1B[36m301\x1B[0m`,
        );
      });
    });

    describe('logExternalError', () => {
      it('should collect a warning response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalError(method, path, 400, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} xxx ${method} ${path} \x1B[33m400\x1B[0m`,
        );
      });

      it('should collect an error response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalError(method, path, 500, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} xxx ${method} ${path} \x1B[31m500\x1B[0m`,
        );
      });

      it('should collect a basic response log and print it when flushed', () => {
        // Arrange
        const method = 'GET';
        const path = 'https://my-external-service/my-path';

        // Act
        logExternalResponse(method, path, 100, testRequestId);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${prefix} <-- ${method} ${path} 100`);
      });
    });
  });

  describe('request Log Management', () => {
    describe('initRequestLogs', () => {
      it('should initialize an empty log array for a request ID', () => {
        // Arrange
        const requestId = 'new-request-id';

        // Act
        initRequestLogs(requestId);

        // Add a log to verify it was initialized
        log('test message', requestId);
        flushRequestLogs(requestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${prefix} test message`);
      });
    });

    describe('addRawLogToRequest', () => {
      it('should add a raw log message without prefix formatting', () => {
        // Arrange
        const rawMessage = 'Raw log message without formatting';

        // Act
        addRawLogToRequest(testRequestId, rawMessage);
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(rawMessage);
      });

      it('should not add log if request ID does not exist', () => {
        // Arrange
        const nonExistentRequestId = 'non-existent-id';
        const rawMessage = 'This should not be logged';

        // Act
        addRawLogToRequest(nonExistentRequestId, rawMessage);

        // Assert
        expect(consoleLogSpy).not.toHaveBeenCalled();
      });
    });

    describe('flushRequestLogs', () => {
      it('should print all collected logs joined with newlines', () => {
        // Arrange
        log('First message', testRequestId);
        log('Second message', testRequestId);
        addRawLogToRequest(testRequestId, 'Raw message');

        // Act
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `${prefix} First message\n${prefix} Second message\nRaw message`,
        );
      });

      it('should not print anything if no logs exist for request ID', () => {
        // Arrange
        const emptyRequestId = 'empty-request-id';
        initRequestLogs(emptyRequestId);

        // Act
        flushRequestLogs(emptyRequestId);

        // Assert
        expect(consoleLogSpy).not.toHaveBeenCalled();
      });

      it('should clean up logs after flushing', () => {
        // Arrange
        log('Test message', testRequestId);
        flushRequestLogs(testRequestId);
        consoleLogSpy.mockClear();

        // Act - try to flush again
        flushRequestLogs(testRequestId);

        // Assert
        expect(consoleLogSpy).not.toHaveBeenCalled();
      });
    });

    describe('multiple Request IDs', () => {
      it('should handle multiple concurrent request logs independently', () => {
        // Arrange
        const requestId1 = 'request-1';
        const requestId2 = 'request-2';
        initRequestLogs(requestId1);
        initRequestLogs(requestId2);

        // Act
        log('Message from request 1', requestId1);
        log('Message from request 2', requestId2);
        log('Another message from request 1', requestId1);

        flushRequestLogs(requestId1);
        const firstCallArgs = consoleLogSpy.mock.calls[0][0];

        consoleLogSpy.mockClear();
        flushRequestLogs(requestId2);
        const secondCallArgs = consoleLogSpy.mock.calls[0][0];

        // Assert
        expect(firstCallArgs).toContain('Message from request 1');
        expect(firstCallArgs).toContain('Another message from request 1');
        expect(firstCallArgs).not.toContain('Message from request 2');

        expect(secondCallArgs).toContain('Message from request 2');
        expect(secondCallArgs).not.toContain('Message from request 1');
      });
    });
  });
});
