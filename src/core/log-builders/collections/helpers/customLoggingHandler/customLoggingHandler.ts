import { emitEvent } from '../../../../events/emitter.js';
import type { CollectionHooksKeys } from '../../logBuilderManager.js';
import type { AuditorLog } from '../../../../../collections/auditor.js';
import type {
  HookConfigForTracking,
  LogConfig,
  PayloadCollectionHooksMap,
  PluginConfig,
} from '../../../../../types/pluginOptions.js';

interface Params {

  logData: AuditorLog;
  hookConfig: HookConfigForTracking[CollectionHooksKeys];
  hookName: CollectionHooksKeys;
  operationConfig: LogConfig<CollectionHooksKeys> | undefined;
  pluginConfig: PluginConfig;
  hookArgs: Parameters<PayloadCollectionHooksMap[CollectionHooksKeys]>[0];
}

export const customLoggingHandler = async (params: Params) => {
  const customLogging = async (): Promise<AuditorLog> => {
    const { hook, ...otherLogData } = params.logData;

    const result = {
      ...params.logData,
      ...(await params.pluginConfig.customLogger?.(params.hookArgs, otherLogData)),
      // ...(await params.userActivatedHooks?.customLogger?.(params.hookArgs, otherLogData)),
      // @ts-expect-error
      ...(await params.hookConfig.customLogger?.(params.hookArgs, otherLogData)),
      ...(await params.operationConfig?.customLogger?.(params.hookArgs, otherLogData)),
      hook: params.logData.hook,
    };

    return result;
  };

  const log = await customLogging();

  emitEvent<AuditorLog>('logGenerated', log);
};
