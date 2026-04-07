import type { FetchOptions } from 'ofetch';
import defu from 'defu';
import { ofetch } from 'ofetch';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfig } from '@/core/config';

/**
 * Creates a configured ofetch instance for use in generated API endpoints.
 * This instance includes proper BFF configuration, error handling, and i18n support.
 */
const createApiFetchInstance = () => {
  // Note: useConfig, useRouter, and useI18n must be called within a Vue context.
  // These are typically available during component initialization and composable setup.
  // For SSR or non-component contexts, override these in your fetch calls.

  try {
    const { config } = useConfig();
    const router = useRouter();
    const { locale } = useI18n();

    const url = config.value?.VITE_API_BASE_URL || '/';

    const unauthorisedErrorHook: FetchOptions['onResponseError'] = ({ response }) => {
      if (response.status !== 401) {
        return;
      }

      router.push('/login');
    };

    const defaults: FetchOptions = {
      baseURL: url,
      credentials: 'include',
      headers: {
        'accept-language': locale.value,
      },
      onResponseError: [unauthorisedErrorHook],
    };

    return defaults;
  }
  catch {
    // If Vue context is not available (e.g., in tests or non-component code),
    // return minimal defaults. The baseURL can be overridden per-request if needed.
    return {
      baseURL: '/',
      credentials: 'include' as const,
    };
  }
};

/**
 * Custom mutator for Orval-generated API endpoints using ofetch.
 * Replaces the default fetch implementation with ofetch, gaining preconfigured
 * base URL, credentials, error hooks, and i18n support.
 *
 * @param url The API endpoint path.
 * @param config Configuration object with method, params, body, headers, and other options.
 * @param config.method HTTP method (GET, POST, etc.).
 * @param config.params Query parameters.
 * @param config.body Request body.
 * @param config.headers Request headers.
 * @returns {Promise<T>} The parsed response from the API.
 */
export const customInstance = async <T>(
  url: string,
  config?: Partial<FetchOptions>,
): Promise<T> => {
  if (!config) {
    config = {};
  }

  const { method = 'GET', params, body, headers, ...rest } = config;
  const instanceDefaults = createApiFetchInstance();

  // Build query string from params
  let targetUrl = url;
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    targetUrl = queryString ? `${url}?${queryString}` : url;
  }

  // Create fetch options, merging instance defaults with method/body/headers and any additional options
  const fetchOptions: FetchOptions = defu(
    {
      method: (method || 'GET') as string,
      body: typeof body === 'string' ? body : (body ? JSON.stringify(body) : undefined),
      headers,
      ...rest,
    },
    instanceDefaults,
  );

  // Make the request using ofetch
  // Cast to any to handle responseType compatibility
  const response = await ofetch<T>(targetUrl, fetchOptions as any);

  return response;
};

/**
 * Type overrides for error handling (optional, for type safety in generated code).
 * Adjust based on your actual Error type from the OpenAPI schema.
 */
export type ErrorType<Error> = Error;

/**
 * Body type wrapper (optional, for case transformation or other processing).
 * Keep as-is unless you need special body handling.
 */
export type BodyType<BodyData> = BodyData;

export default customInstance;
