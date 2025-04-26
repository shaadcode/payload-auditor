import type { PluginOptions } from './../types/pluginOptions.js'
import type { Duration } from './../utils/toMS.js'

export const defaultCollectionValues = {
  slug: 'Audit-log',
}

export const defaultAutoDeleteLog: Duration = '1mo'

export const defaultPluginOpts: Required<PluginOptions> = {
  autoDeleteInterval: defaultAutoDeleteLog,
  collection: {
    trackCollections: [],
  },
  enabled: true,
}
