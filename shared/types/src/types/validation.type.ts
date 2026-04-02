import type { $ZodIssue } from 'zod/v4/core';

export interface StandardSchemaValidationError<T> {
  data: T;
  error: $ZodIssue[];
  success: false;
}
