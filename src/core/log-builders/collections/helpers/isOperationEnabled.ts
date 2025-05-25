import type {
  AllCollectionHooks,
  HookOperationConfig,
  HookTrackingOperationMap,
} from 'src/types/pluginOptions.js'

export const checkOperationEnabled = <T extends keyof AllCollectionHooks>(
  userHookOperationConfig: HookOperationConfig<T> | undefined,
  userHookConfig: HookTrackingOperationMap[T] | undefined,
): boolean => {
  if (userHookConfig?.enabled === false) {
    return false
  } else if (userHookConfig?.enabled === true && userHookOperationConfig?.enabled !== false) {
    return true
  } else if (userHookConfig?.enabled === true && userHookOperationConfig?.enabled === false) {
    return false
  } else if (userHookOperationConfig?.enabled) {
    return true
  } else {
    return false
  }
}
