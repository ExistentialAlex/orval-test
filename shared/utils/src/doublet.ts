export type Callback = (...args: any) => any;

export type Result<R, E> = [E, null] | [null, R];

export type MaybeAsyncResult<R, E>
  = R extends Promise<infer U> ? Promise<Result<U, E>> : Result<R, E>;

export const doublet = <TCallback extends Callback>(
  cb: TCallback,
  ...args: Parameters<TCallback>
): MaybeAsyncResult<ReturnType<TCallback>, Error> => {
  try {
    const result = cb(...(args as unknown[]));

    if (result instanceof Promise) {
      return result.then((rx) => [null, rx]).catch((error) => [error, null]) as MaybeAsyncResult<
        ReturnType<TCallback>,
        Error
      >;
    }

    return [null, result] as MaybeAsyncResult<ReturnType<TCallback>, Error>;
  }
  catch (error) {
    return [error, null] as MaybeAsyncResult<ReturnType<TCallback>, Error>;
  }
};

/**
 * Consolidate an array of doublet results into a single results, containing all errors and all data.
 * @param doubletResults The doublet results to consolidate.
 * @returns An array of arrays of all the errors and all the results.
 */
export const consolidateDoublet = <TError extends Error, T>(
  doubletResults: Result<T, TError>[],
): [TError[], T[]] => {
  return doubletResults.reduce<[TError[], T[]]>(
    ([errors, results], [err, res]) => {
      if (err) {
        errors.push(err);
      }
      else {
        results.push(res as T);
      }
      return [errors, results];
    },
    [[], []],
  );
};
