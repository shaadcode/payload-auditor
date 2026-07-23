import type { GlobalHooksArgsParameterUnion, GlobalHooksKeys } from '../../../../types/global.js';
import type { CollectionHooksArgsParameterUnion, CollectionHooksKeys, CollectionHooksOperation } from '../../../../types/collection.js';

interface Params {
  hookArgs: CollectionHooksArgsParameterUnion | GlobalHooksArgsParameterUnion;
  targetHookName: CollectionHooksKeys | GlobalHooksKeys;
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
    || splitCamelCase(params.targetHookName).splice(1).join('-').toLowerCase();

  return operation as CollectionHooksOperation;
};
