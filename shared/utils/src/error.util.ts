import type { StandardSchemaValidationError } from '<project-name>-types';
import { FetchError } from 'ofetch';

/**
 * Type guard to check if an error is a FetchError
 * @param error The error to check
 * @returns True if the error is a FetchError
 */
export const isFetchError = (error: Error): error is FetchError => {
  return error instanceof FetchError;
};

/**
 * Safely cast an error to FetchError with validation
 * @param error The error to cast
 * @returns The error as FetchError if valid, or throws if not a FetchError
 * @throws Error if the input is not a valid FetchError
 */
export const asFetchError = (error: Error): FetchError => {
  if (isFetchError(error)) {
    return error;
  }

  throw new Error(
    `Expected FetchError but received: ${error.constructor.name}. Original error: ${error.message}`,
  );
};

/**
 * Safely attempt to cast an error to FetchError, returning null if not valid
 * @param error The error to cast
 * @returns The error as FetchError if valid, null otherwise
 */
export const tryAsFetchError = (error: Error): FetchError | null => {
  return isFetchError(error) ? error : null;
};

/**
 * Type guard to check if an object is a StandardSchemaValidationError
 * @param obj The object to check
 * @returns True if the object is a StandardSchemaValidationError
 */
export const isValidationError = <T = unknown>(
  obj: unknown,
): obj is StandardSchemaValidationError<T> => {
  return (
    typeof obj === 'object'
    && obj !== null
    && 'data' in obj
    && 'error' in obj
    && 'success' in obj
    && (obj as Record<string, unknown>).success === false
    && Array.isArray((obj as Record<string, unknown>).error)
  );
};

/**
 * Safely cast an object to StandardSchemaValidationError with validation
 * @param obj The object to cast
 * @returns The object as StandardSchemaValidationError if valid, or throws if not a validation error
 * @throws Error if the input is not a valid StandardSchemaValidationError
 */
export const asValidationError = <T = unknown>(obj: unknown): StandardSchemaValidationError<T> => {
  if (isValidationError<T>(obj)) {
    return obj;
  }

  throw new Error(
    `Expected StandardSchemaValidationError but received: ${typeof obj}. Object: ${JSON.stringify(obj)}`,
  );
};

/**
 * Safely attempt to cast an object to StandardSchemaValidationError, returning null if not valid
 * @param obj The object to cast
 * @returns The object as StandardSchemaValidationError if valid, null otherwise
 */
export const tryAsValidationError = <T = unknown>(
  obj: unknown,
): StandardSchemaValidationError<T> | null => {
  return isValidationError<T>(obj) ? obj : null;
};

/**
 * Helper to check if a FetchError contains validation error data
 * @param error The FetchError to check
 * @returns True if the error data is a validation error
 */
export const isFetchValidationError = <T = unknown>(error: FetchError): boolean => {
  return isValidationError<T>(error.data);
};

/**
 * Extract validation error from a FetchError if it contains one
 * @param error The FetchError to extract from
 * @returns The validation error if present, null otherwise
 */
export const extractValidationError = <T = unknown>(
  error: FetchError,
): StandardSchemaValidationError<T> | null => {
  return tryAsValidationError<T>(error.data);
};
