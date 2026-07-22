import type { AuditorLog } from './../../../../collections/auditor.js';
import { prettyDebugLog } from './../../../../utils/prettyDebugLog.js';
import type { GlobalHookConfigForTracking, GlobalHooksKeys, GlobalOperationLogConfig } from '../../../../types/global.js';
import type { CollectionHooksKeys, CollectionHooksOperation, CollectionsHookConfigForTracking } from '../../../../types/collection.js';

type Params = {
  hookLevelConfig?: CollectionsHookConfigForTracking[CollectionHooksKeys] | GlobalHookConfigForTracking[GlobalHooksKeys];
  operationLevelConfig?: GlobalOperationLogConfig;
  logData: AuditorLog;
  operation: CollectionHooksOperation;
  hookName: CollectionHooksKeys;
};

export const handleDebugMode = (params: Params) => {
  const hookDebugConfig = typeof params.hookLevelConfig === 'boolean'
    ? undefined
    : params.hookLevelConfig?.debug;
  const operationDebugConfig = params.operationLevelConfig?.debug;

  const isDebugEnabled = operationDebugConfig || hookDebugConfig;

  if (isDebugEnabled) {
    prettyDebugLog({
      title: params.hookName,
      data: params.logData,
      subtitle: params.operation,
    });
  }
};
