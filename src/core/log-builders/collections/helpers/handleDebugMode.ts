import type { AuditorLog } from './../../../../collections/auditor.js'
import type {
  AuditHookOperationType,
  HookOperationConfig,
  HookTrackingOperationMap,
} from './../../../../types/pluginOptions.js'

import { prettyDebugLog } from './../../../../utils/prettyDebugLog.js'

export const handleDebugMode = (
  hookConfig: HookTrackingOperationMap[keyof HookTrackingOperationMap] | undefined,
  operationConfig: HookOperationConfig | undefined,
  allFields: AuditorLog,
  operation: AuditHookOperationType,
) => {
  const hookDebugConfig = hookConfig?.modes?.debug
  const operationDebugConfig = operationConfig?.modes?.debug

  const isDebugEnabled =
    (operationDebugConfig?.enabled ?? false) || (hookDebugConfig?.enabled ?? false)

  if (isDebugEnabled) {
    const debugFields = operationDebugConfig?.fields ?? hookDebugConfig?.fields
    const debugDisplayType = operationDebugConfig?.displayType ?? hookDebugConfig?.displayType

    const debugLog = debugFields
      ? Object.fromEntries(
          Object.entries(allFields).filter(([key]) => debugFields[key as keyof AuditorLog]),
        )
      : allFields

    prettyDebugLog('afterChange', operation, debugLog, debugDisplayType)
  }
}
