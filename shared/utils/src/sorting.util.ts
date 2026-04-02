import type { ColumnSort } from '<project-name>-types';

/**
 * Convert a column sort array into a string array.
 * @param sort The array of ColumnSort objects to convert.
 * @returns A string array representation of the sort parameters.
 * @example
 * convertSortToQueryString([{ id: 'name', desc: false }, { id: 'age', desc: true }])
 * // Returns ['name', '-age']
 */
export const convertSortToQuerySort = (sort: ColumnSort[]): string[] => {
  if (!sort || sort.length === 0) {
    return [];
  }

  return sort.map((s) => `${s.desc ? '-' : ''}${s.id}`);
};

const stringToColumnSort = (s: string) => {
  const desc = s.startsWith('-');
  const id = desc ? s.slice(1) : s;
  return { id, desc };
};

/**
 * Converts a query string or string array into an array of ColumnSort objects.
 * @param query The query string or string array to convert.
 * @returns An array of ColumnSort objects representing the sorting parameters.
 * @example
 * convertQuerySortToColumnSort(['name','-age'])
 * // Returns [{ id: 'name', desc: false }, { id: 'age', desc: true }]
 * // OR
 * convertQuerySortToColumnSort('-name');
 * // Returns [{ id: 'name', desc: true }]
 */
export const convertQuerySortToColumnSort = (query: string | string[]): ColumnSort[] => {
  if (typeof query === 'string') {
    if (!query) {
      return [];
    }

    return [stringToColumnSort(query)];
  }

  return query.map(stringToColumnSort);
};
