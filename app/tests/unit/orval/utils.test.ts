import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getHttpMethodFromBody,
  getQueryKeyFactoryName,
  getQueryKeyRootSegments,
  getSafeParamName,
  isEndpointFile,
  parseOperations,
  toPosix,
  toSnakeCase,
  uniquifyParamNames,
} from '../../../orval/utils';

describe('isEndpointFile', () => {
  it('accepts a regular .ts file', () => {
    expect(isEndpointFile('/src/api/pets/pets.ts')).toBe(true);
  });

  it('rejects a .zod.ts file', () => {
    expect(isEndpointFile('/src/api/pets/pets.zod.ts')).toBe(false);
  });

  it('rejects a .msw.ts file', () => {
    expect(isEndpointFile('/src/api/pets/pets.msw.ts')).toBe(false);
  });

  it('rejects index.ts', () => {
    expect(isEndpointFile('/src/api/pets/index.ts')).toBe(false);
  });

  it('rejects non-TypeScript files', () => {
    expect(isEndpointFile('/src/api/pets/pets.js')).toBe(false);
  });
});

describe('toPosix', () => {
  it('returns POSIX-separated paths unchanged on a POSIX system', () => {
    const posixPath = 'pets/pets.ts';
    expect(toPosix(posixPath)).toBe('pets/pets.ts');
  });

  it('replaces platform separators with forward slashes', () => {
    const platformPath = `pets${path.sep}pets.ts`;
    expect(toPosix(platformPath)).toBe('pets/pets.ts');
  });
});

describe('getHttpMethodFromBody', () => {
  it('extracts GET from a function body', () => {
    expect(getHttpMethodFromBody('{ method: \'GET\' }')).toBe('GET');
  });

  it('extracts POST from a function body', () => {
    expect(getHttpMethodFromBody('{ method: \'POST\' }')).toBe('POST');
  });

  it('extracts PUT from a function body', () => {
    expect(getHttpMethodFromBody('{ method: "PUT" }')).toBe('PUT');
  });

  it('extracts DELETE from a function body', () => {
    expect(getHttpMethodFromBody('{ method: \'DELETE\' }')).toBe('DELETE');
  });

  it('defaults to GET when no method is present', () => {
    expect(getHttpMethodFromBody('{ headers: {} }')).toBe('GET');
  });
});

describe('toSnakeCase', () => {
  it('converts a lowercase word to uppercase', () => {
    expect(toSnakeCase('pets')).toBe('PETS');
  });

  it('converts camelCase to UPPER_SNAKE_CASE', () => {
    expect(toSnakeCase('petStore')).toBe('PET_STORE');
  });

  it('converts hyphenated strings to UPPER_SNAKE_CASE', () => {
    expect(toSnakeCase('pet-store')).toBe('PET_STORE');
  });

  it('trims leading and trailing underscores', () => {
    expect(toSnakeCase('-pets-')).toBe('PETS');
  });
});

describe('getSafeParamName', () => {
  it('returns the name as-is when valid', () => {
    expect(getSafeParamName('petId', 0)).toBe('petId');
  });

  it('renames "options" to "fetchOptions"', () => {
    expect(getSafeParamName('options', 1)).toBe('fetchOptions');
  });

  it('returns a fallback when the name starts with a digit', () => {
    expect(getSafeParamName('1invalid', 2)).toBe('arg2');
  });

  it('returns a fallback when the name is empty', () => {
    expect(getSafeParamName('', 3)).toBe('arg3');
  });

  it('strips invalid identifier characters', () => {
    expect(getSafeParamName('my-param', 0)).toBe('myparam');
  });
});

describe('uniquifyParamNames', () => {
  it('returns names unchanged when all are unique', () => {
    expect(uniquifyParamNames(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('appends a numeric suffix to duplicate names', () => {
    expect(uniquifyParamNames(['a', 'a', 'a'])).toEqual(['a', 'a2', 'a3']);
  });

  it('handles mixed duplicates independently', () => {
    expect(uniquifyParamNames(['a', 'b', 'a', 'b'])).toEqual(['a', 'b', 'a2', 'b2']);
  });

  it('returns an empty array when given an empty array', () => {
    expect(uniquifyParamNames([])).toEqual([]);
  });
});

describe('getQueryKeyFactoryName', () => {
  it('builds a key factory name from a simple path', () => {
    expect(getQueryKeyFactoryName(`pets${path.sep}pets.ts`)).toBe('PETS_QUERY_KEYS');
  });

  it('builds a key factory name from a nested path using the deduplicated segments', () => {
    expect(getQueryKeyFactoryName(`users${path.sep}users.ts`)).toBe('USERS_QUERY_KEYS');
  });

  it('builds a multi-segment key factory name when folder and file differ', () => {
    expect(getQueryKeyFactoryName(`animals${path.sep}pets.ts`)).toBe('ANIMALS_PETS_QUERY_KEYS');
  });
});

describe('getQueryKeyRootSegments', () => {
  it('returns a single segment for a flat path', () => {
    expect(getQueryKeyRootSegments(`pets${path.sep}pets.ts`)).toEqual(['pets']);
  });

  it('deduplicates identical adjacent segments', () => {
    expect(getQueryKeyRootSegments(`users${path.sep}users.ts`)).toEqual(['users']);
  });

  it('returns both segments when folder and file differ', () => {
    expect(getQueryKeyRootSegments(`animals${path.sep}pets.ts`)).toEqual(['animals', 'pets']);
  });
});

const GET_OPERATION_SNIPPET = `
export const listPets = async (params?: ListPetsParams, options?: RequestInit): Promise<listPetsResponse> => {
  const res = await fetch('/pets', {
    ...options,
    method: 'GET',
  });
  const body = await res.text();
  const data = body ? JSON.parse(body) : {};
  return { data, status: res.status, headers: res.headers } as listPetsResponse;
};
`;

const POST_OPERATION_SNIPPET = `
export const createPets = async (createPetsBody: CreatePetsBody, options?: RequestInit): Promise<createPetsResponse> => {
  const res = await fetch('/pets', {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPetsBody),
  });
  const body = await res.text();
  const data = body ? JSON.parse(body) : {};
  return { data, status: res.status, headers: res.headers } as createPetsResponse;
};
`;

const NON_EXPORTED_SNIPPET = `
const hiddenFn = async (): Promise<void> => {
  await fetch('/hidden', { method: 'GET' });
};
`;

const NON_ASYNC_SNIPPET = `
export const syncFn = (id: string): string => {
  return id;
};
`;

describe('parseOperations', () => {
  it('parses a GET operation as a query', () => {
    const ops = parseOperations(GET_OPERATION_SNIPPET);
    expect(ops).toHaveLength(1);
    expect(ops.at(0)?.name).toBe('listPets');
    expect(ops.at(0)?.kind).toBe('query');
  });

  it('parses a POST operation as a mutation', () => {
    const ops = parseOperations(POST_OPERATION_SNIPPET);
    expect(ops).toHaveLength(1);
    expect(ops.at(0)?.name).toBe('createPets');
    expect(ops.at(0)?.kind).toBe('mutation');
  });

  it('extracts parameters from the operation signature', () => {
    const ops = parseOperations(GET_OPERATION_SNIPPET);
    expect(ops.at(0)?.params).toEqual([
      { name: 'params', optional: true },
      { name: 'fetchOptions', optional: true },
    ]);
  });

  it('renames "options" parameters to "fetchOptions"', () => {
    const ops = parseOperations(POST_OPERATION_SNIPPET);
    expect(ops.at(0)?.params.at(1)?.name).toBe('fetchOptions');
  });

  it('ignores non-exported functions', () => {
    const ops = parseOperations(NON_EXPORTED_SNIPPET);
    expect(ops).toHaveLength(0);
  });

  it('ignores non-async exported functions', () => {
    const ops = parseOperations(NON_ASYNC_SNIPPET);
    expect(ops).toHaveLength(0);
  });

  it('parses multiple operations from a single file', () => {
    const ops = parseOperations(GET_OPERATION_SNIPPET + POST_OPERATION_SNIPPET);
    expect(ops).toHaveLength(2);
  });
});
