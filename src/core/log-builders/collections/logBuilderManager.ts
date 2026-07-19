import type { AllOperations, CollectionConfig } from 'payload';

import type { AuditorLog } from '../../../collections/auditor.js';
import { checkIsOperationEnabled } from './helpers/isOperationEnabled.js';
import { extractOperation } from './helpers/extractOperation/extractOperation.js';
import { customLoggingHandler } from './helpers/customLoggingHandler/customLoggingHandler.js';
import type {
  HookConfigForTracking,
  LogConfig,
  PluginConfig,
} from '../../../types/pluginOptions.js';

export type CollectionHooksKeys = keyof NonNullable<CollectionConfig['hooks']>;
export type CollectionHooksOperation = AllOperations | 'read' | 'delete' | 'error' | 'login' | 'logout' | 'me' | 'refresh' | 'forgotPassword' | '';

export type CollectionHooksArgsParameterUnion = Parameters<
  NonNullable<
    NonNullable<
      CollectionConfig['hooks']
    >[CollectionHooksKeys]
  >[number]
>[0];

type LogBuilderManager = {
  hookArgs: CollectionHooksArgsParameterUnion;
  pluginConfig: PluginConfig;
  targetHookName: CollectionHooksKeys;
  targetHookLevelConfig: HookConfigForTracking[CollectionHooksKeys];
  collectionSlug: string;
};

export const logBuilderManager = async (params: LogBuilderManager) => {
  const operation = extractOperation(params);
  // @ts-expect-error
  const hookOperationLevelConfig = params
    .targetHookLevelConfig?.[operation] as LogConfig | undefined;

  const isOperationEnabled = checkIsOperationEnabled({
    hookLevelConfig: params.targetHookLevelConfig,
    hookOperationLevelConfig,
  });

  const baseLog: AuditorLog = {
    onCollection: params.collectionSlug,
    hook: params.targetHookName,
    operation,
    timestamp: new Date(),
    // @ts-expect-error
    userAgent: params.hookArgs.req.headers.get('user-agent') || 'unknown',
  };

  if (isOperationEnabled) {
    await customLoggingHandler({
      hookName: params.targetHookName,
      pluginConfig: params.pluginConfig,
      hookArgs: params.hookArgs,
      hookConfig: params.targetHookLevelConfig,
      logData: baseLog,
      operationConfig: hookOperationLevelConfig,
    });
  }
};
