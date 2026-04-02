import type { StandardSchemaValidationError } from '<project-name>-types';
import { FetchError } from 'ofetch';
import { describe, expect, it } from 'vitest';
import {
  asFetchError,
  asValidationError,
  extractValidationError,
  isFetchError,
  isFetchValidationError,
  isValidationError,
  tryAsFetchError,
  tryAsValidationError,
} from '../src';

describe('error.util', () => {
  describe('functions', () => {
    describe('isFetchError', () => {
      it('should return true for FetchErrors', () => {
        // Arrange
        const error = new FetchError('test');

        // Act
        const result = isFetchError(error);

        // Assert
        expect(result).toBe(true);
      });

      it('should return false for regular Error objects', () => {
        // Arrange
        const regularError = new Error('Regular error message');

        // Act
        const result = isFetchError(regularError);

        // Assert
        expect(result).toBe(false);
      });
    });

    describe('asFetchError', () => {
      it('should throw an error for Error objects with FetchError-like properties (not instanceof FetchError)', () => {
        // Arrange - Create an error that looks like FetchError but isn't an instance
        const fetchErrorLike = Object.assign(new Error('The requested resource was not found'), {
          status: 404,
          statusText: 'Not Found',
          data: null,
        });

        // Act & Assert
        expect(() => asFetchError(fetchErrorLike)).toThrow(
          'Expected FetchError but received: Error. Original error: The requested resource was not found',
        );
      });

      it('should throw an error if the input is not a valid FetchError', () => {
        // Arrange
        const regularError = new Error('Not a fetch error');

        // Act & Assert
        expect(() => asFetchError(regularError)).toThrow(
          'Expected FetchError but received: Error. Original error: Not a fetch error',
        );
      });

      it('should handle custom error classes with descriptive error type', () => {
        // Arrange - Custom error class
        class CustomBusinessError extends Error {
          constructor(message: string) {
            super(message);
            this.name = 'CustomBusinessError';
          }
        }
        const customError = new CustomBusinessError('Business logic violation');

        // Act & Assert
        expect(() => asFetchError(customError)).toThrow(
          'Expected FetchError but received: CustomBusinessError. Original error: Business logic violation',
        );
      });

      it('should handle built-in error types like TypeError', () => {
        // Arrange - Built-in TypeError
        const typeError = new TypeError('Invalid argument type');

        // Act & Assert
        expect(() => asFetchError(typeError)).toThrow(
          'Expected FetchError but received: TypeError. Original error: Invalid argument type',
        );
      });
    });

    describe('tryAsFetchError', () => {
      it('should return the error if it is a FetchError', () => {
        // Arrange
        const error = new FetchError('test');

        // Act
        const result = tryAsFetchError(error);

        // Assert
        expect(result).toEqual(error);
      });

      it('should return null for regular Error objects', () => {
        // Arrange
        const regularError = new Error('Not a fetch error');

        // Act
        const result = tryAsFetchError(regularError);

        // Assert
        expect(result).toBe(null);
      });
    });

    describe('isValidationError', () => {
      it('should return true for valid StandardSchemaValidationError objects', () => {
        // Arrange
        const validationError: StandardSchemaValidationError<{ name: string }> = {
          data: { name: 'invalid' },
          error: [
            {
              message: 'Required field missing',
              path: ['name'],
              code: 'invalid_type',
              expected: 'string',
            },
          ],
          success: false,
        };

        // Act
        const result = isValidationError(validationError);

        // Assert
        expect(result).toBe(true);
      });

      it('should return false for objects missing required properties', () => {
        // Arrange
        const invalidObject = {
          data: { name: 'test' },
          success: false,
          // Missing 'error' property
        };

        // Act
        const result = isValidationError(invalidObject);

        // Assert
        expect(result).toBe(false);
      });

      it('should return false for objects with success: true', () => {
        // Arrange
        const successObject = {
          data: { name: 'test' },
          error: [],
          success: true,
        };

        // Act
        const result = isValidationError(successObject);

        // Assert
        expect(result).toBe(false);
      });

      it('should return false for objects with non-array error property', () => {
        // Arrange
        const invalidErrorObject = {
          data: { name: 'test' },
          error: 'not an array',
          success: false,
        };

        // Act
        const result = isValidationError(invalidErrorObject);

        // Assert
        expect(result).toBe(false);
      });

      it('should return false for null or undefined values', () => {
        // Arrange & Act & Assert
        expect(isValidationError(null)).toBe(false);
        expect(isValidationError(undefined)).toBe(false);
      });

      it('should return false for primitive values', () => {
        // Arrange & Act & Assert
        expect(isValidationError('string')).toBe(false);
        expect(isValidationError(123)).toBe(false);
        expect(isValidationError(true)).toBe(false);
      });
    });

    describe('asValidationError', () => {
      it('should return the object if it is a valid ValidationError', () => {
        // Arrange
        const validationError: StandardSchemaValidationError<{ email: string }> = {
          data: { email: 'invalid-email' },
          error: [
            {
              message: 'Invalid email format',
              path: ['email'],
              code: 'invalid_type',
              expected: 'string',
            },
          ],
          success: false,
        };

        // Act
        const result = asValidationError(validationError);

        // Assert
        expect(result).toEqual(validationError);
      });

      it('should throw an error for invalid objects', () => {
        // Arrange
        const invalidObject = {
          data: { name: 'test' },
          success: true, // Invalid: should be false
        };

        // Act & Assert
        expect(() => asValidationError(invalidObject)).toThrow(
          'Expected StandardSchemaValidationError but received: object',
        );
      });

      it('should throw an error for primitive values', () => {
        // Arrange
        const primitive = 'not an object';

        // Act & Assert
        expect(() => asValidationError(primitive)).toThrow(
          'Expected StandardSchemaValidationError but received: string',
        );
      });

      it('should throw an error for null values', () => {
        // Arrange
        const nullValue = null;

        // Act & Assert
        expect(() => asValidationError(nullValue)).toThrow(
          'Expected StandardSchemaValidationError but received: object',
        );
      });
    });

    describe('tryAsValidationError', () => {
      it('should return the object if it is a valid ValidationError', () => {
        // Arrange
        const validationError: StandardSchemaValidationError<{ age: number }> = {
          data: { age: -5 },
          error: [
            {
              message: 'Age must be positive',
              path: ['age'],
              code: 'too_small',
              minimum: 1,
              origin: 'int',
            },
          ],
          success: false,
        };

        // Act
        const result = tryAsValidationError(validationError);

        // Assert
        expect(result).toEqual(validationError);
      });

      it('should return null for invalid objects', () => {
        // Arrange
        const invalidObject = {
          data: { name: 'test' },
          success: true, // Invalid: should be false
        };

        // Act
        const result = tryAsValidationError(invalidObject);

        // Assert
        expect(result).toBe(null);
      });

      it('should return null for primitive values', () => {
        // Arrange
        const primitive = 42;

        // Act
        const result = tryAsValidationError(primitive);

        // Assert
        expect(result).toBe(null);
      });

      it('should return null for null or undefined values', () => {
        // Arrange & Act & Assert
        expect(tryAsValidationError(null)).toBe(null);
        expect(tryAsValidationError(undefined)).toBe(null);
      });
    });

    describe('isFetchValidationError', () => {
      it('should return true when FetchError contains validation error data', () => {
        // Arrange
        const validationErrorData: StandardSchemaValidationError<{ username: string }> = {
          data: { username: '' },
          error: [
            {
              message: 'Username is required',
              path: ['username'],
              code: 'invalid_type',
              expected: 'string',
            },
          ],
          success: false,
        };
        const fetchError = new FetchError('Validation failed');
        fetchError.data = validationErrorData;

        // Act
        const result = isFetchValidationError(fetchError);

        // Assert
        expect(result).toBe(true);
      });

      it('should return false when FetchError contains non-validation data', () => {
        // Arrange
        const fetchError = new FetchError('Server error');
        fetchError.data = { message: 'Internal server error' };

        // Act
        const result = isFetchValidationError(fetchError);

        // Assert
        expect(result).toBe(false);
      });

      it('should return false when FetchError has no data', () => {
        // Arrange
        const fetchError = new FetchError('Network error');

        // Act
        const result = isFetchValidationError(fetchError);

        // Assert
        expect(result).toBe(false);
      });

      it('should return false when FetchError data is null', () => {
        // Arrange
        const fetchError = new FetchError('Empty response');
        fetchError.data = null;

        // Act
        const result = isFetchValidationError(fetchError);

        // Assert
        expect(result).toBe(false);
      });
    });

    describe('extractValidationError', () => {
      it('should return validation error when FetchError contains validation data', () => {
        // Arrange
        const validationErrorData: StandardSchemaValidationError<{ password: string }> = {
          data: { password: '123' },
          error: [
            {
              message: 'Password too short',
              path: ['password'],
              code: 'too_small',
              origin: 'string',
              minimum: 8,
            },
          ],
          success: false,
        };
        const fetchError = new FetchError('Validation failed');
        fetchError.data = validationErrorData;

        // Act
        const result = extractValidationError(fetchError);

        // Assert
        expect(result).toEqual(validationErrorData);
      });

      it('should return null when FetchError contains non-validation data', () => {
        // Arrange
        const fetchError = new FetchError('Server error');
        fetchError.data = { message: 'Internal server error', code: 500 };

        // Act
        const result = extractValidationError(fetchError);

        // Assert
        expect(result).toBe(null);
      });

      it('should return null when FetchError has no data', () => {
        // Arrange
        const fetchError = new FetchError('Network error');

        // Act
        const result = extractValidationError(fetchError);

        // Assert
        expect(result).toBe(null);
      });

      it('should return null when FetchError data is primitive', () => {
        // Arrange
        const fetchError = new FetchError('Bad request');
        fetchError.data = 'Error message string';

        // Act
        const result = extractValidationError(fetchError);

        // Assert
        expect(result).toBe(null);
      });
    });
  });
});
