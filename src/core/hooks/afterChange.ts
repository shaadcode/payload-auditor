import type { CollectionAfterChangeHook } from 'payload'
import type { ActivityLog } from 'src/collections/activity-logs.js'

import { emitEvent } from 'src/core/events/emitter.js'

export const logAfterChange: CollectionAfterChangeHook = ({ collection, doc, operation, req }) => {
  const log: ActivityLog = {
    action: operation, // 'create' | 'update'
    changes: operation === 'update' ? getChangedFields(previousDoc, doc) : undefined,
    collection: collection.slug,
    documentId: doc.id,
    timestamp: Date.now(),
    user: req?.user?.id || null,
  }

  emitEvent('logGenerated', log)
}
