import { emitEvent } from '../../../events/emitter.js';
import { handleDebugMode } from '../helpers/handleDebugMode.js';
import type { AuditorLog } from '../../../../collections/auditor.js';
import type {
  PluginConfig,
} from '../../../../types/pluginOptions.js';
import { extractOperation } from '../helpers/extractOperation/extractOperation.js';
import { checkIsOperationEnabled } from '../helpers/isOperationEnabled/isOperationEnabled.js';
import type { GlobalHookConfigForTracking, GlobalHooksArgsParameterUnion, GlobalHooksKeys, GlobalOperationLogConfig } from '../../../../types/global.js';
import type { CollectionHooksArgsParameterUnion, CollectionHooksKeys, CollectionOperationLogConfig, CollectionsHookConfigForTracking } from '../../../../types/collection.js';

export type LogBuilderManager = {
  hookArgs: CollectionHooksArgsParameterUnion | GlobalHooksArgsParameterUnion;
  pluginConfig: PluginConfig;
  targetHookName: CollectionHooksKeys;
  targetHookLevelConfig: CollectionsHookConfigForTracking[CollectionHooksKeys] | GlobalHookConfigForTracking[GlobalHooksKeys];
  scopeSlug: AuditorLog['scope'];
  identifier: string;
};

export const logBuilderManager = async (params: LogBuilderManager) => {
  const operation = extractOperation(params);
  // @ts-expect-error
  const hookOperationLevelConfig = params
    .targetHookLevelConfig?.[operation] as CollectionOperationLogConfig | GlobalOperationLogConfig | undefined;
  const hookLevelConfig = typeof params.targetHookLevelConfig === 'boolean'
    ? undefined
    : params.targetHookLevelConfig;
  const isOperationEnabled = checkIsOperationEnabled({
    hookLevelConfig: params.targetHookLevelConfig,
    hookOperationLevelConfig,
  });

  const baseLog: AuditorLog = {
    scope: params.scopeSlug,
    hook: params.targetHookName,
    identifier: params.identifier,
    operation,
    timestamp: new Date(),
    // @ts-expect-error
    userAgent: params.hookArgs.req.headers.get('user-agent') || 'unknown',
  };

  if (isOperationEnabled) {
    const { hook, operation, ...otherLogData } = baseLog;
    const customLogData = {
      ...baseLog,
      ...(await hookLevelConfig?.customLogger?.(
        // @ts-expect-error
        params.hookArgs,
        otherLogData,
      )),
      ...(await hookOperationLevelConfig?.customLogger?.(
        // @ts-expect-error
        params.hookArgs,
        otherLogData,
      )),
      hook,
      operation,
    } as AuditorLog;

    const skipToDatabase = hookLevelConfig?.debug === true
      || hookLevelConfig?.debug?.skipDatabaseSave
      || hookOperationLevelConfig?.debug === true
      || hookOperationLevelConfig?.debug?.skipDatabaseSave;

    if (!skipToDatabase) {
      emitEvent<AuditorLog>('logGenerated', customLogData);
    }

    handleDebugMode({
      logData: customLogData,
      hookLevelConfig: params.targetHookLevelConfig,
      hookName: params.targetHookName,
      operation,
      // @ts-expect-error
      operationLevelConfig: hookOperationLevelConfig,
    });
  }
};
