import type { AuditorLog } from './../../../../collections/auditor.js'
import type {
  AllCollectionHooks,
  HookOperationConfig,
  HookTrackingOperationMap,
  PluginOptions,
} from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

export const emitWrapper = async <T extends keyof AllCollectionHooks>(
  logData: AuditorLog,
  hookConfig: HookTrackingOperationMap[T],
  hookName: keyof AllCollectionHooks,
  operationConfig: HookOperationConfig<T> | undefined,
  pluginOpts: PluginOptions,
  hookArgs: Parameters<AllCollectionHooks[T]>[0],
  userActivatedHooks: Partial<HookTrackingOperationMap> | undefined,
) => {
  const customLogging = async (): Promise<AuditorLog> => {
    const { hook, ...otherLogData } = logData

    let result: AuditorLog = logData

    if (operationConfig?.customLogger) {
      result = {
        ...(await operationConfig.customLogger(hookArgs, otherLogData)),
        hook,
      }
    } else if (hookConfig?.customLogger) {
      result = {
        // @ts-ignore
        ...(await hookConfig.customLogger(hookArgs, otherLogData)),
        hook,
      }
    } else if (userActivatedHooks?.customLogger) {
      result = {
        ...(await userActivatedHooks.customLogger(hookArgs, otherLogData)),
        hook,
      }
    } else if (pluginOpts?.customLogger) {
      result = {
        ...(await pluginOpts.customLogger(hookArgs, otherLogData)),
        hook,
      }
    }

    return {
      ...result,
      type: result.type,
      onCollection: result.onCollection,
      documentId: result.documentId,
      hook,
      operation: result.operation,
      timestamp: result.timestamp,
      user: result.user,
      userAgent: result.userAgent,
    }
  }

  emitEvent<AuditorLog>('logGenerated', await customLogging())
}
