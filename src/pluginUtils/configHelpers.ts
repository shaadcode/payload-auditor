import type { BasePayload, Config } from 'payload'
import type { Duration } from 'src/utils/toMS.js'

import ActivityLogsCollection from '../collections/activity-logs.js'
import { autoLogCleaner } from '../collections/hooks/beforeChange.js'
import { bufferManager } from '../core/buffer/bufferManager.js'
import { logAfterChange } from '../core/hooks/afterChange.js'

export const validateAndAttachHooksToCollections = (
  collections: Config['collections'],
  trackSlugs: string[],
): Config['collections'] => {
  const allSlugs = (collections || []).map((c) => c.slug)
  const invalidSlugs = trackSlugs.filter((slug) => !allSlugs.includes(slug))

  if (invalidSlugs.length > 0) {
    console.warn(
      `[payload-auditor] The following collection slugs are invalid: ${invalidSlugs.join(', ')}`,
    )
  }

  return (collections || []).map((collection) => {
    if (trackSlugs.includes(collection.slug)) {
      collection.hooks = collection.hooks || {}
      collection.hooks.afterChange = [...(collection.hooks.afterChange || []), logAfterChange]
    }
    return collection
  })
}

export const attachHooksToActivityLogsCollection = (autoDeleteInterval: Duration) => {
  ActivityLogsCollection.hooks = {
    ...ActivityLogsCollection.hooks,
    beforeChange: [
      ...(ActivityLogsCollection.hooks?.beforeChange || []),
      (args) =>
        autoLogCleaner({
          ...args,
          data: {
            autoDeleteInterval,
          },
        }),
    ],
  }

  return ActivityLogsCollection
}

export const wrapOnInitWithBufferManager = (originalOnInit: Config['onInit']) => {
  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload)
    }
    bufferManager(payload)
  }
}
