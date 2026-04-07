import type { ParsedOperation } from '../../../orval/types';
import { describe, expect, it } from 'vitest';
import {
  generateMutationCommentBlock,
  generateMutationComposable,
  generateMutationWithEq1Param,
  generateMutationWithGt1Params,
  generateMutationWithNoParams,
} from '../../../orval/mutation-templates';

const KEY_FACTORY = 'PETS_QUERY_KEYS';

const operationWithGt1Params: ParsedOperation = {
  name: 'uploadFile',
  kind: 'mutation',
  params: [
    { name: 'petId', optional: false },
    { name: 'uploadFileBody', optional: false },
    { name: 'fetchOptions', optional: true },
  ],
};

const operationWithEq1Param: ParsedOperation = {
  name: 'deletePet',
  kind: 'mutation',
  params: [{ name: 'petId', optional: false }],
};

const operationWithNoParams: ParsedOperation = {
  name: 'clearPets',
  kind: 'mutation',
  params: [],
};

describe('generateMutationCommentBlock', () => {
  it('references the key factory root for invalidation', () => {
    const result = generateMutationCommentBlock({ queryKeyFactoryName: KEY_FACTORY });
    expect(result).toContain(`${KEY_FACTORY}.root`);
  });

  it('includes an invalidate example', () => {
    const result = generateMutationCommentBlock({ queryKeyFactoryName: KEY_FACTORY });
    expect(result).toContain('invalidateQueries');
  });
});

describe('generateMutationWithGt1Params', () => {
  const commentBlock = '/** comment */';

  it('emits the args type definition before the composable', () => {
    const result = generateMutationWithGt1Params({
      commentBlock,
      operationName: 'uploadFile',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useUploadFileMutation',
    });
    expect(result).toContain('type UploadFileMutationArgs = {');
    expect(result.indexOf('type UploadFileMutationArgs')).toBeLessThan(result.indexOf('export const useUploadFileMutation'));
  });

  it('marks optional params with a question mark in the type', () => {
    const result = generateMutationWithGt1Params({
      commentBlock,
      operationName: 'uploadFile',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useUploadFileMutation',
    });
    expect(result).toContain('fetchOptions?:');
  });

  it('exports a const with the wrapper name', () => {
    const result = generateMutationWithGt1Params({
      commentBlock,
      operationName: 'uploadFile',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useUploadFileMutation',
    });
    expect(result).toContain('export const useUploadFileMutation');
  });

  it('calls the operation with all params spread from the args object', () => {
    const result = generateMutationWithGt1Params({
      commentBlock,
      operationName: 'uploadFile',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useUploadFileMutation',
    });
    expect(result).toContain('uploadFile(params.petId, params.uploadFileBody, params.fetchOptions)');
  });

  it('emits a @param JSDoc for the mutation callback inside useMutation', () => {
    const result = generateMutationWithGt1Params({
      commentBlock,
      operationName: 'uploadFile',
      operationParams: operationWithGt1Params.params,
      wrapperName: 'useUploadFileMutation',
    });
    expect(result).toContain('@param {UploadFileMutationArgs} params');
  });
});

describe('generateMutationWithEq1Param', () => {
  const commentBlock = '/** comment */';

  it('exports a const with the wrapper name', () => {
    const result = generateMutationWithEq1Param({
      commentBlock,
      operationName: 'deletePet',
      paramName: 'petId',
      wrapperName: 'useDeletePetMutation',
    });
    expect(result).toContain('export const useDeletePetMutation');
  });

  it('types the mutation callback parameter with Parameters<typeof>', () => {
    const result = generateMutationWithEq1Param({
      commentBlock,
      operationName: 'deletePet',
      paramName: 'petId',
      wrapperName: 'useDeletePetMutation',
    });
    expect(result).toContain('petId: Parameters<typeof deletePet>[0]');
  });

  it('emits a @param JSDoc for the single param inside useMutation', () => {
    const result = generateMutationWithEq1Param({
      commentBlock,
      operationName: 'deletePet',
      paramName: 'petId',
      wrapperName: 'useDeletePetMutation',
    });
    expect(result).toContain('@param {Parameters<typeof deletePet>[0]} petId');
  });
});

describe('generateMutationWithNoParams', () => {
  const commentBlock = '/** comment */';

  it('exports a const with the wrapper name', () => {
    const result = generateMutationWithNoParams({
      commentBlock,
      operationName: 'clearPets',
      wrapperName: 'useClearPetsMutation',
    });
    expect(result).toContain('export const useClearPetsMutation');
  });

  it('calls the operation with no arguments in the mutation', () => {
    const result = generateMutationWithNoParams({
      commentBlock,
      operationName: 'clearPets',
      wrapperName: 'useClearPetsMutation',
    });
    expect(result).toContain('clearPets()');
  });
});

describe('generateMutationComposable', () => {
  it('dispatches to the gt1 template when there are multiple params', () => {
    const result = generateMutationComposable({ operation: operationWithGt1Params, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toContain('export const useUploadFileMutation');
    expect(result).toContain('type UploadFileMutationArgs');
  });

  it('dispatches to the eq1 template when there is one param', () => {
    const result = generateMutationComposable({ operation: operationWithEq1Param, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toContain('export const useDeletePetMutation');
    expect(result).not.toContain('type DeletePetMutationArgs');
  });

  it('dispatches to the no-params template when there are no params', () => {
    const result = generateMutationComposable({ operation: operationWithNoParams, queryKeyFactoryName: KEY_FACTORY });
    expect(result).toContain('export const useClearPetsMutation');
    expect(result).not.toContain('type ClearPetsMutationArgs');
  });

  it('includes the invalidation comment in all variants', () => {
    for (const operation of [operationWithGt1Params, operationWithEq1Param, operationWithNoParams]) {
      const result = generateMutationComposable({ operation, queryKeyFactoryName: KEY_FACTORY });
      expect(result).toContain(`${KEY_FACTORY}.root`);
    }
  });
});
