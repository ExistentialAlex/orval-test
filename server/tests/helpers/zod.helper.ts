import type { ZodError, ZodSafeParseResult } from 'zod';

export const getZodError = <T>(data: T): ZodError<T> => {
  const error = (data as ZodSafeParseResult<T>).error;

  if (!error) {
    throw new Error('No error found in ZodSafeParseResult');
  }

  return error;
};
