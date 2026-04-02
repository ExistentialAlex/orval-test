export type OperationKind = 'query' | 'mutation';

export interface ParsedParam {
  name: string;
  optional: boolean;
}

export interface ParsedOperation {
  name: string;
  kind: OperationKind;
  params: ParsedParam[];
}

export interface RenderWrapperFileInput {
  endpointImportPath: string;
  operations: ParsedOperation[];
  queryKeyFactoryName: string;
  queryKeyRootSegments: string[];
}

export interface RenderTypeImportsInput {
  hasQueryOperations: boolean;
}

export interface RenderRuntimeImportsInput {
  hasQueryOperations: boolean;
  hasMutationOperations: boolean;
}

export interface RenderEndpointImportsInput {
  endpointImportPath: string;
  operations: ParsedOperation[];
}

export interface RenderQueryArgTypesInput {
  queryOperations: ParsedOperation[];
}

export interface RenderQueryKeyFactoryInput {
  queryOperations: ParsedOperation[];
  queryKeyFactoryName: string;
  queryKeyRootSegments: string[];
}

export interface RenderQueryComposableInput {
  operation: ParsedOperation;
  queryKeyFactoryName: string;
}

export interface RenderMutationComposableInput {
  operation: ParsedOperation;
  queryKeyFactoryName: string;
}
