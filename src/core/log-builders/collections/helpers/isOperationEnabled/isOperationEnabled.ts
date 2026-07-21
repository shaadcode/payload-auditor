import type { CollectionConfig } from 'payload';

import type { HookConfigForTracking, LogConfig, TrackedCollection } from '../../../../../types/pluginOptions.js';

type CollectionHooksKeys = keyof NonNullable<CollectionConfig['hooks']>;

interface Params {
  hookOperationLevelConfig?: LogConfig<CollectionHooksKeys> | true;
  hookLevelConfig?: HookConfigForTracking[CollectionHooksKeys];
  allHooksLevelConfig: TrackedCollection['hooks'];
  collectionLevelConfig: TrackedCollection;
}

export const isBooleanConfig = <T>(v: T): boolean | undefined => typeof v === 'boolean'
  ? v
  // @ts-expect-error
  : v?.enabled;

export const checkIsOperationEnabled = (params: Params): boolean => {
  const hookLevelEnabled = isBooleanConfig(params.hookLevelConfig);
  const allHooksLevelConfigEnabled = isBooleanConfig(params.allHooksLevelConfig);
  const operationLevelEnabled = isBooleanConfig(params.hookOperationLevelConfig);

  return params.collectionLevelConfig.enabled !== false
    && (operationLevelEnabled !== false)
    && (hookLevelEnabled !== false)
    && (allHooksLevelConfigEnabled !== false)
    && !!(
      params.collectionLevelConfig.enabled
      || operationLevelEnabled
      || hookLevelEnabled
      || allHooksLevelConfigEnabled);
};
