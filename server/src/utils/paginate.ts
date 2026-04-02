/* eslint-disable no-console */
import type {
  ExternalPaginationResponseSchema,
  PaginationResponseSchema,
} from '<project-name>-schemas';
import type { Context } from 'hono';
import { appendQueryAndHash } from '<project-name>-utils';

export const paginate = <T>(
  dataset: T[],
  page = 1,
  pageSize = 25,
  search?: string,
  sort?: string[] | string,
): ExternalPaginationResponseSchema<T> => {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  if (search) {
    console.log(`Searching for: '${search}'`);
  }

  if (sort && sort.length > 0) {
    console.log(`Sorting by: ${JSON.stringify(sort)}`);
  }

  return {
    results: dataset.slice(start, end), // The results for the current page.
    count: dataset.length, // The maximum number of records
    page, // The current page
    next: end < dataset.length ? `https://test-api.com/url?page=${page + 1}` : null,
    previous: start > 0 ? `https://test-api.com/url?page=${page - 1}` : null,
    page_size: pageSize,
    total_pages: Math.ceil(dataset.length / pageSize),
  };
};

/**
 * Convert the external paginated response schema to the server paginated format.
 * @param c The Hono context
 * @param res The external paginated response schema.
 * @returns The converted schema.
 */
export const convertExternalPaginationResponse = <T>(
  c: Context,
  res: ExternalPaginationResponseSchema<T>,
): PaginationResponseSchema<T> => {
  const converted: PaginationResponseSchema<T> = {
    results: res.results,
    count: res.count,
    page: res.page,
  };

  if (res.next) {
    converted.next = appendQueryAndHash(c.req.url, res.next);
  }

  if (res.previous) {
    converted.previous = appendQueryAndHash(c.req.url, res.previous);
  }

  return converted;
};
