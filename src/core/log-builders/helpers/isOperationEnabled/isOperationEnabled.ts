import type { CollectionConfig } from 'payload';

import type { CollectionOperationLogConfig, CollectionsHookConfigForTracking } from '../../../../types/collection.js';
import type { GlobalHookConfigForTracking, GlobalHooksKeys, GlobalOperationLogConfig } from '../../../../types/global.js';

type CollectionHooksKeys = keyof NonNullable<CollectionConfig['hooks']>;

interface Params {
  hookOperationLevelConfig?: CollectionOperationLogConfig<CollectionHooksKeys> | GlobalOperationLogConfig<GlobalHooksKeys> | true;
  hookLevelConfig?: CollectionsHookConfigForTracking[CollectionHooksKeys] | GlobalHookConfigForTracking[GlobalHooksKeys];
}

export const isBooleanConfig = <T>(v: T): boolean | undefined => typeof v === 'boolean'
  ? v
  // @ts-expect-error
  : v?.enabled;

export const checkIsOperationEnabled = (params: Params): boolean => {
  const hookLevelEnabled = isBooleanConfig(params.hookLevelConfig);
  const operationLevelEnabled = isBooleanConfig(params.hookOperationLevelConfig);

  return (operationLevelEnabled !== false) && (hookLevelEnabled !== false)
    && !!(operationLevelEnabled || hookLevelEnabled);
};
