import type { hookTypes } from 'src/pluginUtils/configHelpers.js'
import type { AuditHookOperationType } from 'src/types/pluginOptions.js'

/* eslint-disable no-console */
export const prettyDebugLog = (
  title: (typeof hookTypes)[number] | ({} & string),
  subtitle: ({} & string) | AuditHookOperationType,
  data: Record<string, any>,
  type: 'manual' | 'table' = 'table',
) => {
  if (!data || Object.keys(data).length === 0) {
    console.log('%cNo data to display', 'color: #888; font-style: italic;')
  } else {
    if (type === 'table') {
      console.groupCollapsed(
        `| %c🔍 Debug Log - ${title} [${subtitle}]`,
        'color: #007acc; font-weight: bold; font-size: 14px;',
      )
      console.table(data)
      console.groupEnd()
    } else if (type === 'manual') {
      console.log('-----------------------------------------')
      console.log(`| %c🔍 Debug Log - ${title} ${subtitle && `[${subtitle}]`} |`)
      console.log('-----------------------------------------')
      for (const [key, value] of Object.entries(data)) {
        console.log(`|- %c${key}:`, 'color: #666; font-weight: 600;', value)
      }
      console.log('-------------------------------------------')
    }
  }
}
