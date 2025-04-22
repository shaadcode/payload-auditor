import type { PluginOptions } from './../plugin.js'
import type { Duration } from './../utils/toMS.js'

export const defaultAutoDeleteLog: Duration = '1mo'

export const defaultPluginOpts: Required<PluginOptions> = {
  autoDeleteInterval: defaultAutoDeleteLog,
  collection: {
    trackCollections: [''],
  },
  enabled: true,
}
