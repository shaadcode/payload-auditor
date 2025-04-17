import type { Config } from 'payload'
export type PluginOptions<Collections extends string = string> = {
  trackCollections: Collections[]
}

import ActivityLogsCollection from 'src/collections/activity-logs.js'

export const auditLogs = (opts: PluginOptions) => {
  const config = (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

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
    return config
  }
}
