import type { LocationQuery, RouteLocationNormalizedGeneric } from 'vue-router';

export interface UseQueryParamsComposable {
  /**
   * Get the value of a query param.
   * @param route The current route.
   * @param key The query param to access.
   * @param converter Conversion function.
   * @param defaultValue Default value if query param is not initialized.
   * @returns The value of the specified query param.
   */
  getQueryParamValue: <T>(
    route: RouteLocationNormalizedGeneric,
    key: string,
    converter: (v: string | string[]) => T,
    defaultValue: T,
  ) => T;

  /**
   * Safely converts Vue Router's LocationQuery to a more predictable format.
   *
   * Vue Router's LocationQuery has values typed as `LocationQueryValue | LocationQueryValue[]`
   * where `LocationQueryValue = string | null`. This function normalizes these complex types:
   *
   * Type mappings:
   * - `string` → `string` (unchanged)
   * - `string[]` → `string[]` (filters out null values)
   * - `null` → excluded from result
   * - `undefined` → excluded from result
   * - `(string | null)[]` → `string[]` (filters out null values, excluded if all null)
   *
   * Examples:
   * - `?status=active` → `{ status: "active" }`
   * - `?tags=tag1&tags=tag2` → `{ tags: ["tag1", "tag2"] }`
   * - `?empty=` → `{ empty: "" }`
   * - `?missing` → excluded from result
   * - `?mixed=null&mixed=value` → `{ mixed: ["value"] }`
   * - `?single=value` → `{ single: "value" }`
   *
   * @param query Vue Router's LocationQuery object
   * @returns Normalized object with string or string[] values (excluding null/undefined)
   */
  normalizeQueryParams: (query: LocationQuery) => Record<string, string | string[]>;
}

export const useQueryParams = (): UseQueryParamsComposable => {
  const normalizeQueryParams = (query: LocationQuery): Record<string, string | string[]> => {
    const normalized: Record<string, string | string[]> = {};

    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        // Filter out null values from arrays
        const validValues = value.filter((v): v is string => v !== null);
        if (validValues.length > 0) {
          normalized[key] = validValues;
        }
      }
      else if (typeof value === 'string') {
        normalized[key] = value;
      }
      // null and undefined values are excluded
    }

    return normalized;
  };

  const getQueryParamValue = <T>(
    route: RouteLocationNormalizedGeneric,
    key: string,
    converter: (v: string | string[]) => T,
    defaultValue: T,
  ): T => {
    const v = normalizeQueryParams(route.query)[key];

    return v && v.length ? converter(v) : defaultValue;
  };

  return {
    getQueryParamValue,
    normalizeQueryParams,
  };
};
