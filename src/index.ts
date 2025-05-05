import type { Config, Plugin } from 'payload'

import type { PluginOptions } from './types/pluginOptions.js'

import { defaultAutoDeleteLog, defaultPluginOpts } from './Constant/Constant.js'
import {
  attachHooksToActivityLogsCollection,
  buildAccessControl,
  validateAndAttachHooksToCollections,
  wrapOnInitWithBufferManager,
} from './pluginUtils/configHelpers.js'
/**
 * 📝 The main function of plugin packaging
 *
 *
 * 📌@type {(opts?: PluginOptions) => Plugin}
 *
 * @param opts
 *
 */
export const auditorPlugin =
  (opts: PluginOptions = defaultPluginOpts): Plugin =>
  (incomingConfig: Config): Config => {
    const config = incomingConfig
    if (opts.enabled === false) {
      return config
    }

    buildAccessControl(opts)

    config.collections = validateAndAttachHooksToCollections(
      config.collections,
      opts.collection!.trackCollections,
    )

    const logsCollection = attachHooksToActivityLogsCollection(
      opts.autoDeleteInterval ?? defaultAutoDeleteLog,
    )
    config.collections = [...(config.collections || []), logsCollection]

    config.onInit = wrapOnInitWithBufferManager(config.onInit, opts)

    return config
  }
