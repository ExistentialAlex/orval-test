import type { ParsedOperation, ParsedParam } from './types';
import { pascalCase } from './helpers';

interface GenerateMutationCommentBlockInput {
  queryKeyFactoryName: string;
}

interface GenerateMutationHandlerCommentInput {
  operation: ParsedOperation;
}

interface GenerateMutationWithGt1ParamsInput {
  commentBlock: string;
  operationName: string;
  operationParams: ParsedParam[];
  wrapperName: string;
}

interface GenerateMutationWithEq1ParamInput {
  commentBlock: string;
  operationName: string;
  paramName: string;
  wrapperName: string;
}

interface GenerateMutationWithNoParamsInput {
  commentBlock: string;
  operationName: string;
  wrapperName: string;
}

interface GenerateMutationComposableInput {
  operation: ParsedOperation;
  queryKeyFactoryName: string;
}

/**
 * Generates the JSDoc block describing invalidation guidance for a mutation composable.
 * @param {GenerateMutationCommentBlockInput} input Function input.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateMutationCommentBlock = ({ queryKeyFactoryName }: GenerateMutationCommentBlockInput): string => {
  return `/**
 * After this mutation settles, invalidate affected queries with ${queryKeyFactoryName}.root or a specific key from ${queryKeyFactoryName}.
 * Example: queryCache.invalidateQueries({ key: ${queryKeyFactoryName}.root })
 */`;
};

/**
 * Generates JSDoc for the mutation callback parameter passed to useMutation.
 * @param {GenerateMutationHandlerCommentInput} input Function input.
 * @param {ParsedOperation} input.operation Parsed operation metadata.
 */
const generateMutationHandlerComment = ({ operation }: GenerateMutationHandlerCommentInput): string => {
  if (operation.params.length > 1) {
    const mutationArgsTypeName = `${pascalCase(operation.name)}MutationArgs`;

    return `/**
     * @param {${mutationArgsTypeName}} params Variables passed to mutate or mutateAsync.
     */`;
  }

  if (operation.params.length === 1) {
    const paramName = operation.params[0].name;

    return `/**
     * @param {Parameters<typeof ${operation.name}>[0]} ${paramName} Variable passed to mutate or mutateAsync.
     */`;
  }

  return '';
};

/**
 * Generates a mutation composable template for operations with more than one parameter.
 * @param {GenerateMutationWithGt1ParamsInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {ParsedParam[]} input.operationParams Operation parameters.
 * @param {string} input.wrapperName Generated composable name.
 */
export const generateMutationWithGt1Params = ({
  commentBlock,
  operationName,
  operationParams,
  wrapperName,
}: GenerateMutationWithGt1ParamsInput): string => {
  const mutationArgsTypeName = `${pascalCase(operationName)}MutationArgs`;
  const handlerComment = generateMutationHandlerComment({
    operation: {
      kind: 'mutation',
      name: operationName,
      params: operationParams,
    },
  });
  const fields = operationParams
    .map((param, index) => `  ${param.name}${param.optional ? '?' : ''}: Parameters<typeof ${operationName}>[${index}];`)
    .join('\n');

  return `type ${mutationArgsTypeName} = {
${fields}
};

${commentBlock}
export const ${wrapperName} = () => {
  return useMutation({
    ${handlerComment}
    mutation: async (params: ${mutationArgsTypeName}) => ${operationName}(${operationParams.map((param) => `params.${param.name}`).join(', ')}),
  });
};`;
};

/**
 * Generates a mutation composable template for operations with exactly one parameter.
 * @param {GenerateMutationWithEq1ParamInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {string} input.paramName Single operation parameter name.
 * @param {string} input.wrapperName Generated composable name.
 */
export const generateMutationWithEq1Param = ({
  commentBlock,
  operationName,
  paramName,
  wrapperName,
}: GenerateMutationWithEq1ParamInput): string => {
  const handlerComment = generateMutationHandlerComment({
    operation: {
      kind: 'mutation',
      name: operationName,
      params: [{ name: paramName, optional: false }],
    },
  });

  return `${commentBlock}
export const ${wrapperName} = () => {
  return useMutation({
    ${handlerComment}
    mutation: async (${paramName}: Parameters<typeof ${operationName}>[0]) => ${operationName}(${paramName}),
  });
};`;
};

/**
 * Generates a mutation composable template for operations with no parameters.
 * @param {GenerateMutationWithNoParamsInput} input Function input.
 * @param {string} input.commentBlock Generated JSDoc comment block.
 * @param {string} input.operationName Operation function name.
 * @param {string} input.wrapperName Generated composable name.
 */
export const generateMutationWithNoParams = ({
  commentBlock,
  operationName,
  wrapperName,
}: GenerateMutationWithNoParamsInput): string => {
  return `${commentBlock}
export const ${wrapperName} = () => {
  return useMutation({
    mutation: async () => ${operationName}(),
  });
};`;
};

/**
 * Selects and generates the correct mutation template variant by operation parameter count.
 * @param {GenerateMutationComposableInput} input Function input.
 * @param {ParsedOperation} input.operation Parsed operation metadata.
 * @param {string} input.queryKeyFactoryName Query key factory object name.
 */
export const generateMutationComposable = ({ operation, queryKeyFactoryName }: GenerateMutationComposableInput): string => {
  const wrapperName = `use${pascalCase(operation.name)}Mutation`;
  const commentBlock = generateMutationCommentBlock({ queryKeyFactoryName });

  if (operation.params.length > 1) {
    return generateMutationWithGt1Params({
      commentBlock,
      operationName: operation.name,
      operationParams: operation.params,
      wrapperName,
    });
  }

  if (operation.params.length === 1) {
    return generateMutationWithEq1Param({
      commentBlock,
      operationName: operation.name,
      paramName: operation.params[0].name,
      wrapperName,
    });
  }

  return generateMutationWithNoParams({
    commentBlock,
    operationName: operation.name,
    wrapperName,
  });
};
