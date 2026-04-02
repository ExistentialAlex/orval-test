import type { ParsedOperation, ParsedParam } from './types';
import { pascalCase } from './helpers';

interface GetQueryKeyFactoryCallInput {
  operation: ParsedOperation;
  queryKeyFactoryName: string;
}

interface GenerateQueryCommentBlockInput {
  operation: ParsedOperation;
  operationName: string;
  keyFactoryCall: string;
  queryKeyFactoryName: string;
}

interface GenerateQueryWithGt1ParamsInput {
  commentBlock: string;
  operationName: string;
  operationParams: ParsedParam[];
  wrapperName: string;
  queryKeyFactoryName: string;
}

interface GenerateQueryWithEq1ParamInput {
  commentBlock: string;
  operationName: string;
  paramName: string;
  wrapperName: string;
  queryKeyFactoryName: string;
}

interface GenerateQueryWithNoParamsInput {
  commentBlock: string;
  operationName: string;
  wrapperName: string;
  queryKeyFactoryName: string;
}

/**
 * Builds the query key factory invocation string for an operation.
 * @param {GetQueryKeyFactoryCallInput} input Function input.
 * @param {ParsedOperation} input.operation Parsed operation metadata.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const getQueryKeyFactoryCall = ({ operation, queryKeyFactoryName }: GetQueryKeyFactoryCallInput): string => {
  if (operation.params.length > 1) {
    return `${queryKeyFactoryName}.${operation.name}(params)`;
  }

  if (operation.params.length === 1) {
    return `${queryKeyFactoryName}.${operation.name}(${operation.params[0].name})`;
  }

  return `${queryKeyFactoryName}.${operation.name}()`;
};

/**
 * Generates the JSDoc block describing invalidation guidance for a query composable.
 * @param {GenerateQueryCommentBlockInput} input Function input.
 * @param {ParsedOperation} input.operation Parsed operation metadata.
 * @param {string} input.operationName Operation function name.
 * @param {string} input.keyFactoryCall Query key factory invocation expression.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateQueryCommentBlock = ({ operation, operationName, keyFactoryCall, queryKeyFactoryName }: GenerateQueryCommentBlockInput): string => {
  const optionsParam = ` * @param {Partial<UseQueryOptions<Awaited<ReturnType<typeof ${operationName}>>>>} [options] Pinia Colada query options.`;

  if (operation.params.length > 1) {
    const queryArgsTypeName = `${pascalCase(operationName)}QueryArgs`;

    return `/**
 * Cache key factory: ${queryKeyFactoryName}.${operationName}
 * Invalidate this query: queryCache.invalidateQueries({ key: ${keyFactoryCall}, exact: true })
 * Invalidate all generated queries in this file: queryCache.invalidateQueries({ key: ${queryKeyFactoryName}.root })
 * @param {${queryArgsTypeName}} params Query arguments forwarded to ${operationName}.
${optionsParam}
 */`;
  }

  if (operation.params.length === 1) {
    const paramName = operation.params[0].name;

    return `/**
 * Cache key factory: ${queryKeyFactoryName}.${operationName}
 * Invalidate this query: queryCache.invalidateQueries({ key: ${keyFactoryCall}, exact: true })
 * Invalidate all generated queries in this file: queryCache.invalidateQueries({ key: ${queryKeyFactoryName}.root })
 * @param {Parameters<typeof ${operationName}>[0]} ${paramName} Argument forwarded to ${operationName}.
${optionsParam}
 */`;
  }

  return `/**
 * Cache key factory: ${queryKeyFactoryName}.${operationName}
 * Invalidate this query: queryCache.invalidateQueries({ key: ${keyFactoryCall}, exact: true })
 * Invalidate all generated queries in this file: queryCache.invalidateQueries({ key: ${queryKeyFactoryName}.root })
${optionsParam}
 */`;
};

/**
 * Generates a query composable template for operations with more than one parameter.
 * @param {GenerateQueryWithGt1ParamsInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {ParsedParam[]} input.operationParams Operation parameters.
 * @param {string} input.wrapperName Generated composable name.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateQueryWithGt1Params = ({
  commentBlock,
  operationName,
  operationParams,
  wrapperName,
  queryKeyFactoryName,
}: GenerateQueryWithGt1ParamsInput): string => {
  const queryArgsTypeName = `${pascalCase(operationName)}QueryArgs`;

  return `${commentBlock}
export const ${wrapperName} = (
  params: ${queryArgsTypeName},
  options: Partial<UseQueryOptions<Awaited<ReturnType<typeof ${operationName}>>>> = {},
) => {
  return useQuery({
    key: ${queryKeyFactoryName}.${operationName}(params),
    query: async () => ${operationName}(${operationParams.map((param) => `params.${param.name}`).join(', ')}),
    ...options,
  });
};`;
};

/**
 * Generates a query composable template for operations with exactly one parameter.
 * @param {GenerateQueryWithEq1ParamInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {string} input.paramName Single operation parameter name.
 * @param {string} input.wrapperName Generated composable name.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateQueryWithEq1Param = ({
  commentBlock,
  operationName,
  paramName,
  wrapperName,
  queryKeyFactoryName,
}: GenerateQueryWithEq1ParamInput): string => {
  return `${commentBlock}
export const ${wrapperName} = (
  ${paramName}: Parameters<typeof ${operationName}>[0],
  options: Partial<UseQueryOptions<Awaited<ReturnType<typeof ${operationName}>>>> = {},
) => {
  return useQuery({
    key: ${queryKeyFactoryName}.${operationName}(${paramName}),
    query: async () => ${operationName}(${paramName}),
    ...options,
  });
};`;
};

/**
 * Generates a query composable template for operations with no parameters.
 * @param {GenerateQueryWithNoParamsInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {string} input.wrapperName Generated composable name.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateQueryWithNoParams = ({
  commentBlock,
  operationName,
  wrapperName,
  queryKeyFactoryName,
}: GenerateQueryWithNoParamsInput): string => {
  return `${commentBlock}
export const ${wrapperName} = (
  options: Partial<UseQueryOptions<Awaited<ReturnType<typeof ${operationName}>>>> = {},
) => {
  return useQuery({
    key: ${queryKeyFactoryName}.${operationName}(),
    query: async () => ${operationName}(),
    ...options,
  });
};`;
};
