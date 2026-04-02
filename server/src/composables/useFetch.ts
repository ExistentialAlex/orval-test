import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import type { $Fetch, FetchContext, FetchHook, FetchOptions, FetchResponse, ResponseType } from 'ofetch';
import defu from 'defu';
import {

  ofetch,

} from 'ofetch';
import { log, logExternalError, logExternalRequest, logExternalResponse } from '@/utils';

type OnRequestHook<T = any, R extends ResponseType = ResponseType> = FetchHook<FetchContext<T, R>>;
type OnResponseHook<T = any, R extends ResponseType = ResponseType> = FetchHook<
  FetchContext<T, R> & {
    response: FetchResponse<T>;
  }
>;
type OnResponseErrorHook<T = any, R extends ResponseType = ResponseType> = FetchHook<
  FetchContext<T, R> & {
    response: FetchResponse<T>;
  }
>;

export const logRequestWithID
  = (reqID: string): OnRequestHook =>
    ({ request, options }) => {
      logExternalRequest(
        options.method || 'GET',
        `${options.baseURL || ''}${request.toString()}`,
        reqID,
      );
    };

export const logResponseWithID
  = (reqID: string): OnResponseHook =>
    ({ request, response, options }) => {
      logExternalResponse(
        options.method || 'GET',
        request.toString(),
        response.status as StatusCode,
        reqID,
      );
    };

export const logResponseErrorWithID
  = (reqID: string): OnResponseErrorHook =>
    ({ request, response, options }) => {
      logExternalError(
        options.method || 'GET',
        request.toString(),
        response.status as StatusCode,
        reqID,
        JSON.stringify(response._data),
      );
    };

export interface UseFetchComposable {
  /**
   * The ofetch fetch instance created with the provided options.
   */
  $fetch: $Fetch;
}

export const useFetch = <TC extends Context>(
  c: TC,
  baseURL: string,
  options?: FetchOptions,
): UseFetchComposable => {
  const reqID = c.get('requestId');

  if (!baseURL) {
    log(
      '`baseURL` is undefined. You may experience unexpected behaviour when making external requests.',
      reqID,
    );
  }

  // Create request-specific hooks that have access to requestId
  const logRequest = logRequestWithID(reqID);
  const logResponse = logResponseWithID(reqID);
  const logResponseError = logResponseErrorWithID(reqID);

  const defaults: FetchOptions = {
    baseURL,
    headers: {
      Authorization: `Bearer ${c.session.secure?.authToken}`,
    },
    onRequest: [logRequest],
    onResponse: [logResponse],
    onResponseError: [logResponseError],
  };

  const opts = defu(options, defaults);

  const $fetch = ofetch.create(opts);

  return {
    $fetch,
  };
};
