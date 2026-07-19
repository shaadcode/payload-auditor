import type { AuditorLog } from './../../../../collections/auditor.js';
import { prettyDebugLog } from './../../../../utils/prettyDebugLog.js';
import type { CollectionHooksKeys, CollectionHooksOperation } from '../logBuilderManager.js';
import type {
  HookConfigForTracking,
  LogConfig,
} from './../../../../types/pluginOptions.js';

export const handleDebugMode = <T extends CollectionHooksKeys>(
  hookConfig: HookConfigForTracking[T] | undefined,
  operationConfig: LogConfig<T> | undefined,
  allFields: AuditorLog,
  operation: CollectionHooksOperation,
) => {
  const hookDebugConfig = hookConfig?.modes?.debug;
  const operationDebugConfig = operationConfig?.modes?.debug;

  const isDebugEnabled
    = (operationDebugConfig?.enabled ?? false) || (hookDebugConfig?.enabled ?? false);

  if (isDebugEnabled) {
    const debugFields = operationDebugConfig?.fields ?? hookDebugConfig?.fields;
    const debugDisplayType = operationDebugConfig?.displayType ?? hookDebugConfig?.displayType;

    const debugLog = debugFields
      ? Object.fromEntries(
          Object.entries(allFields).filter(([key]) => debugFields[key as keyof AuditorLog]),
        )
      : allFields;

    prettyDebugLog('afterChange', operation, debugLog, debugDisplayType);
  }
};
