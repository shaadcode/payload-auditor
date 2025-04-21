import type { Config, Plugin } from 'payload'

import ActivityLogsCollection from 'src/collections/activity-logs.js'
import { bufferManager } from 'src/core/buffer/bufferManager.js'
import { logAfterChange } from 'src/core/hooks/afterChange.js'
export type PluginOptions = {
  enabled?: boolean
  trackCollections: string[]
}

export const auditorPlugin =
  (
    opts: PluginOptions = {
      enabled: true,
      trackCollections: [''],
    },
  ): Plugin =>
  (incomingConfig: Config): Config => {
    const config = incomingConfig
    if (opts.enabled === false) {
      return config
    }

    // check invalid collections slug
    const allSlugs = (config.collections || []).map((c) => c.slug)
    const invalidSlugs = opts.trackCollections.filter((slug) => !allSlugs.includes(slug))
    if (invalidSlugs.length > 0) {
      console.warn(`[payload-auditor] کالکشن‌های نامعتبر یافت شد: ${invalidSlugs.join(', ')}`)
    }

    // add audit logs collection to user collection
    config.collections = [...(config.collections || []), ActivityLogsCollection]

    // add log hooks to user collections
    config.collections = config.collections.map((collection) => {
      if (opts.trackCollections.includes(collection.slug)) {
        collection.hooks = collection.hooks || {}
        collection.hooks.afterChange = [...(collection.hooks.afterChange || []), logAfterChange]
      }

      return collection
    })

    // add buffer manager
    const originalOnInit = config.onInit
    config.onInit = async (payload) => {
      if (originalOnInit) {
        await originalOnInit(payload)
      }
      bufferManager(payload)
    }

    return config
  }
