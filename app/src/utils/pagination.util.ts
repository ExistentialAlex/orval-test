import type { PaginationResponseSchema } from '<project-name>-schemas';
import { appendQueryAndHash } from '<project-name>-utils';

export const updatePaginatedUrls = <T>(
  data: PaginationResponseSchema<T>,
): PaginationResponseSchema<T> => {
  // If they're present, transform the next and previous URLs to use the correct URL.
  const transformedData = structuredClone(data);

  if (data.next) {
    transformedData.next = appendQueryAndHash(window.location.pathname, data.next);
  }

  if (data.previous) {
    transformedData.previous = appendQueryAndHash(window.location.pathname, data.previous);
  }

  return transformedData;
};
