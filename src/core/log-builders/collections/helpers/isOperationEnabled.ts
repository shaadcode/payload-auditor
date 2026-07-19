import type { CollectionConfig } from 'payload';

import type { HookConfigForTracking, LogConfig } from '../../../../types/pluginOptions.js';

type CollectionHooksKeys = keyof NonNullable<CollectionConfig['hooks']>;

interface Params {
  hookOperationLevelConfig?: LogConfig<CollectionHooksKeys> | true;
  hookLevelConfig?: HookConfigForTracking[CollectionHooksKeys];
}

export const checkIsOperationEnabled = (params: Params): boolean => {
  const hookLevelEnabled = params.hookLevelConfig?.enabled;
  const operationLevelEnabled = typeof params.hookOperationLevelConfig === 'boolean'
    ? params.hookOperationLevelConfig
    : params.hookOperationLevelConfig?.enabled;

  if (
    (hookLevelEnabled && operationLevelEnabled)
    || (hookLevelEnabled === undefined && operationLevelEnabled)
    || (hookLevelEnabled && operationLevelEnabled === undefined)
  ) {
    return true;
  }
  else {
    return false;
  }
};
