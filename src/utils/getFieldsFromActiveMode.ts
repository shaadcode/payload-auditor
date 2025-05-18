import type { HookOperationConfig } from 'src/types/pluginOptions.js'

export const getFieldsFromActiveMode = (modes?: HookOperationConfig['modes']) => {
  if (!modes) {
    return undefined
  }

  for (const [_, config] of Object.entries(modes)) {
    if (config?.enabled && config.fields) {
      return config.fields
    }
  }

  return undefined
}
