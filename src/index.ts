import type { Config, Plugin } from 'payload'

import type { PluginOptions } from './types/pluginOptions.js'

import { defaultAutoDeleteLog, defaultPluginOpts } from './Constant/Constant.js'
import {
  attachHooksToActivityLogsCollection,
  validateAndAttachHooksToCollections,
  wrapOnInitWithBufferManager,
} from './pluginUtils/configHelpers.js'

export const auditorPlugin =
  (opts: PluginOptions = defaultPluginOpts): Plugin =>
  (incomingConfig: Config): Config => {
    const config = incomingConfig
    if (opts.enabled === false) {
      return config
    }

    config.collections = validateAndAttachHooksToCollections(
      config.collections,
      opts.collection!.trackCollections,
    )

    const logsCollection = attachHooksToActivityLogsCollection(
      opts.autoDeleteInterval ?? defaultAutoDeleteLog,
    )
    config.collections = [...(config.collections || []), logsCollection]

    config.onInit = wrapOnInitWithBufferManager(config.onInit)

    return config
  }
