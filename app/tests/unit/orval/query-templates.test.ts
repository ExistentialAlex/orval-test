import type { ParsedOperation } from '../../../orval/types';
import { describe, expect, it } from 'vitest';
import {
  generateQueryCommentBlock,
  generateQueryWithEq1Param,
  generateQueryWithGt1Params,
  generateQueryWithNoParams,
  getQueryKeyFactoryCall,
} from '../../../orval/query-templates';

const KEY_FACTORY = 'PETS_QUERY_KEYS';

const operationWithGt1Params: ParsedOperation = {
  name: 'searchPets',
  kind: 'query',
  params: [
    { name: 'params', optional: false },
    { name: 'fetchOptions', optional: true },
  ],
};

const operationWithEq1Param: ParsedOperation = {
  name: 'showPetById',
  kind: 'query',
  params: [{ name: 'petId', optional: false }],
};

const operationWithNoParams: ParsedOperation = {
  name: 'listAllPets',
  kind: 'query',
  params: [],
};

describe('getQueryKeyFactoryCall', () => {
  it('returns a params-arg call for operations with more than one parameter', () => {
    const result = getQueryKeyFactoryCall({ operation: operationWithGt1Params, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toBe('PETS_QUERY_KEYS.searchPets(params)');
  });

  it('returns the single param name as the call argument for one-parameter operations', () => {
    const result = getQueryKeyFactoryCall({ operation: operationWithEq1Param, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toBe('PETS_QUERY_KEYS.showPetById(petId)');
  });

  it('returns a no-arg call for operations with no parameters', () => {
    const result = getQueryKeyFactoryCall({ operation: operationWithNoParams, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toBe('PETS_QUERY_KEYS.listAllPets()');
  });
});

describe('generateQueryCommentBlock', () => {
  it('includes the cache key factory reference', () => {
    const result = generateQueryCommentBlock({
      operation: operationWithGt1Params,
      operationName: 'searchPets',
      keyFactoryCall: `${KEY_FACTORY}.searchPets(params)`,
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain(`Cache key factory: ${KEY_FACTORY}.searchPets`);
  });

  it('includes the invalidation example', () => {
    const result = generateQueryCommentBlock({
      operation: operationWithGt1Params,
      operationName: 'searchPets',
      keyFactoryCall: `${KEY_FACTORY}.searchPets(params)`,
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('invalidateQueries');
    expect(result).toContain(`${KEY_FACTORY}.root`);
  });

  it('emits a @param for the args object when there are multiple params', () => {
    const result = generateQueryCommentBlock({
      operation: operationWithGt1Params,
      operationName: 'searchPets',
      keyFactoryCall: `${KEY_FACTORY}.searchPets(params)`,
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('@param {SearchPetsQueryArgs} params');
  });

  it('emits a @param using Parameters<typeof> for a single-param operation', () => {
    const result = generateQueryCommentBlock({
      operation: operationWithEq1Param,
      operationName: 'showPetById',
      keyFactoryCall: `${KEY_FACTORY}.showPetById(petId)`,
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('@param {Parameters<typeof showPetById>[0]} petId');
  });

  it('emits @param for options on all variants', () => {
    const result = generateQueryCommentBlock({
      operation: operationWithNoParams,
      operationName: 'listAllPets',
      keyFactoryCall: `${KEY_FACTORY}.listAllPets()`,
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('@param');
    expect(result).toContain('[options]');
  });
});

describe('generateQueryWithGt1Params', () => {
  const commentBlock = '/** comment */';

  it('exports a const with the wrapper name', () => {
    const result = generateQueryWithGt1Params({
      commentBlock,
      operationName: 'searchPets',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useSearchPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('export const useSearchPetsQuery');
  });

  it('uses the operation query key in the useQuery call', () => {
    const result = generateQueryWithGt1Params({
      commentBlock,
      operationName: 'searchPets',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useSearchPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain(`key: ${KEY_FACTORY}.searchPets(params)`);
  });

  it('calls the operation with individual params from the args object', () => {
    const result = generateQueryWithGt1Params({
      commentBlock,
      operationName: 'searchPets',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useSearchPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('searchPets(params.params, params.fetchOptions)');
  });

  it('includes the comment block', () => {
    const result = generateQueryWithGt1Params({
      commentBlock,
      operationName: 'searchPets',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useSearchPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain(commentBlock);
  });
});

describe('generateQueryWithEq1Param', () => {
  const commentBlock = '/** comment */';

  it('exports a const with the wrapper name', () => {
    const result = generateQueryWithEq1Param({
      commentBlock,
      operationName: 'showPetById',
      paramName: 'petId',
      wrapperName: 'useShowPetByIdQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('export const useShowPetByIdQuery');
  });

  it('passes the single param to the key factory and query call', () => {
    const result = generateQueryWithEq1Param({
      commentBlock,
      operationName: 'showPetById',
      paramName: 'petId',
      wrapperName: 'useShowPetByIdQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain(`key: ${KEY_FACTORY}.showPetById(petId)`);
    expect(result).toContain('showPetById(petId)');
  });
});

describe('generateQueryWithNoParams', () => {
  const commentBlock = '/** comment */';

  it('exports a const with the wrapper name', () => {
    const result = generateQueryWithNoParams({
      commentBlock,
      operationName: 'listAllPets',
      wrapperName: 'useListAllPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain('export const useListAllPetsQuery');
  });

  it('calls the key factory with no arguments', () => {
    const result = generateQueryWithNoParams({
      commentBlock,
      operationName: 'listAllPets',
      wrapperName: 'useListAllPetsQuery',
      queryKeyFactoryName: KEY_FACTORY,
    });
    expect(result).toContain(`key: ${KEY_FACTORY}.listAllPets()`);
    expect(result).toContain('listAllPets()');
  });
});
