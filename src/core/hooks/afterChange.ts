import type { CollectionAfterChangeHook } from 'payload'
import type { ActivityLog } from 'src/collections/activity-logs.js'

import { emitEvent } from 'src/core/events/emitter.js'

export const logAfterChange: CollectionAfterChangeHook = ({ collection, doc, operation, req }) => {
  const log: ActivityLog = {
    action: operation,
    collection: collection.slug,
    documentId: doc.id,
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  emitEvent('logGenerated', log)
}
