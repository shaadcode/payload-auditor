import type { CollectionHooksArgsParameterUnion, CollectionHooksKeys, CollectionHooksOperation } from '../../logBuilderManager.js';

interface Params {
  hookArgs: CollectionHooksArgsParameterUnion;
  targetHookName: CollectionHooksKeys;
}

const regex = /[A-Z]?[a-z]+/g;
const splitCamelCase = (str: string) => {
  return str.match(regex) || [];
};

export const extractOperation = (params: Params): CollectionHooksOperation => {
  const operation = params
    .hookArgs
  // @ts-expect-error
    .operation
    || splitCamelCase(params.targetHookName)[1].toLowerCase();
  return operation as CollectionHooksOperation;
};
