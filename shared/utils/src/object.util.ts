import type { KeyOfLoose } from '<project-name>-types';

export const addProperty = <T extends object>(
  obj: T,
  key: string,
  value: unknown,
  condition: boolean,
): T | (T & Record<string, unknown>) => (condition ? { ...obj, [key]: value } : obj);

/**
 * Recursively traverse a JSON structure and filter keys from objects in the structure.
 * @param obj The structure to traverse.
 * @param keysToRemove Keys to remove.
 * @returns The filtered structure.
 */
export const filterKeys = <T extends object, K extends keyof T>(
  obj: T,
  keysToRemove: K[],
): Omit<T, K> => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => filterKeys(v, keysToRemove)) as T;
  }

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (!keysToRemove.includes(key as K)) {
      (result as Record<string, unknown>)[key] = filterKeys(value, keysToRemove);
    }
  }

  return result;
};

/**
 * Recursively traverse an array to find an item based on the input ID, returning where it exists within it's containing array.
 * @param arr The array to traverse.
 * @param itemId The target item to find.
 * @param idKey The key ot match the itemId against.
 * @param childrenKey The key to access child items on.
 * @returns The item, the index within the parent array it was found and the parent array itself.
 */
export const findItem = <T>(
  arr: T[],
  itemId: string,
  idKey: KeyOfLoose<T>,
  childrenKey: KeyOfLoose<T>,
): { item: T; index: number; parentArray: T[] } | null => {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item || typeof item !== 'object' || !(idKey in item)) {
      continue;
    }

    if (item[idKey as keyof T] === itemId) {
      return { item, index: i, parentArray: arr };
    }

    // Search children
    const children = item[childrenKey as keyof T];

    if (!Array.isArray(children)) {
      continue;
    }

    const result = findItem(children, itemId, idKey, childrenKey);
    if (result) {
      return result;
    }
  }

  return null;
};

/**
 * Recursively traverse an array to find an array of child items based on the input ID.
 * @param arr The array to traverse
 * @param targetId The target item to find
 * @param idKey The key to match the targetId against.
 * @param childrenKey The key to access the children on.
 * @returns The array of child objects or null if none are found.
 */
export const findTargetArray = <T>(
  arr: T[],
  targetId: string,
  idKey: KeyOfLoose<T>,
  childrenKey: KeyOfLoose<T>,
): T[] | null => {
  const result = findItem(arr, targetId, idKey, childrenKey);

  if (!result) {
    return null;
  }

  const children = result.item[childrenKey as keyof T] as T[] | undefined;

  if (!Array.isArray(children)) {
    return null;
  }

  return children;
};
