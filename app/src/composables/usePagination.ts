import type { PaginationQuery, PaginationResponse } from '<project-name>-schemas';
import type { ColumnSort } from '<project-name>-types';
import type { EntryKey, UseQueryOptions } from '@pinia/colada';
import {
  addProperty,
  convertQuerySortToColumnSort,
  convertSortToQuerySort,
  filterKeys,
} from '<project-name>-utils';
import { useQuery } from '@pinia/colada';
import { useDebounceFn } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch } from '@/core';
import { updatePaginatedUrls } from '@/utils';
import { useQueryParams } from './useQueryParams';

type AdditionalQueries<P> = Omit<P, keyof PaginationQuery>;
type QueryKey<P> = keyof AdditionalQueries<P>;

const defaultPageSize = 25;
const defaultSearch = '';
const defaultSort: ColumnSort[] = [];

/**
 * A composable for handling paginated data with query parameter management.
 *
 * @template T The type of items in the paginated result
 * @template P The pagination request schema type (extends PaginationQuerySchema)
 *
 * @param queryKey Unique key for caching the query
 * @param request API endpoint URL
 * @param options Additional query options
 *
 * @returns Object containing pagination state, controls, and query results
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { pageSize, search, sort, useQueryParam } = usePagination(['users'], '/api/users');
 *
 * // Create refs for additional query params
 * const status = useQueryParam('status');
 * const attributeType = useQueryParam('attribute_type');
 *
 * // Use with v-model
 * // <UInput v-model="search" />
 * // <USelectMenu v-model="status" />
 * ```
 */

export const usePagination = <T, P extends PaginationQuery = PaginationQuery>(
  queryKey: EntryKey,
  request: string,
  options?: UseQueryOptions<PaginationResponse<T>>,
) => {
  const route = useRoute();
  const router = useRouter();
  const { $fetch } = useFetch();
  const { getQueryParamValue, normalizeQueryParams } = useQueryParams();

  // Extract getter logic into helper functions to avoid duplication
  const getSearch = () => getQueryParamValue(route, 'search', (v) => (Array.isArray(v) ? '' : v), defaultSearch);
  const getSort = () => getQueryParamValue(route, 'sort', (v) => convertQuerySortToColumnSort(v), defaultSort);
  const getPageSize = () => getQueryParamValue(route, 'page_size', (v) => Number(v), defaultPageSize);
  const getAdditionalQueries = () =>
    filterKeys(normalizeQueryParams(route.query), [
      'page_size',
      'search',
      'sort',
      'page',
    ]) as AdditionalQueries<P>;

  const pushQuery = (
    params: Partial<{
      search: string;
      sort: string[];
      page_size: string;
      extraQueries: AdditionalQueries<P>;
    }>,
  ) => {
    const { extraQueries, ...rest } = params;

    let query = addProperty({}, 'search', getSearch(), !!getSearch());
    query = addProperty(query, 'sort', convertSortToQuerySort(getSort()), !!getSort().length);
    query = addProperty(query, 'page_size', getPageSize(), !!getPageSize());
    query = { ...query, ...getAdditionalQueries() };

    router.push({ query: { ...query, ...extraQueries, ...rest } });
  };

  const pageSizeItems = [5, 10, 25, 50, 100];
  const pageSize = computed({
    get: getPageSize,
    set: (v) => pushQuery({ page_size: String(v) }),
  });
  const search = computed({
    get: getSearch,
    set: useDebounceFn((v) => pushQuery({ search: v }), 500),
  });
  const sort = computed({
    get: getSort,
    set: (v) => pushQuery({ sort: convertSortToQuerySort(v) }),
  });
  const additionalQueries = computed({
    get: getAdditionalQueries,
    set: (v) => pushQuery({ extraQueries: v }),
  });

  // Simple helper to create computed refs for additional query params
  const useQueryParam = <K extends QueryKey<P>>(key: K) =>
    computed({
      get: () => additionalQueries.value[key],
      set: (value) => (additionalQueries.value = { ...additionalQueries.value, [key]: value }),
    });

  const query = useQuery<PaginationResponse<T>>({
    key: () => [...queryKey],
    query: () =>
      $fetch<PaginationResponse<T>>(request, {
        query: route.query,
      }).then(updatePaginatedUrls),
    ...(options || {}),
  });

  watch(
    () => route.query,
    () => {
      // Manually refetch based on changes to the route query.
      query.refetch();
    },
    { deep: true },
  );

  return {
    ...query,
    search,
    sort,
    pageSize,
    pageSizeItems,
    useQueryParam,
  };
};
