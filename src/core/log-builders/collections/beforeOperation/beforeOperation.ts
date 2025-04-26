import type { CollectionBeforeOperationHook } from 'payload'

import type { ActivityLog } from './../../../../collections/activity-logs.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeOperationCollectionLogBuilder: CollectionBeforeOperationHook = ({
  args,
  collection,
  context,
  operation,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.create?.enabled
  ) {
    const log: ActivityLog = {
      action: operation,
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.update?.enabled
  ) {
    const log: ActivityLog = {
      action: operation,
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return args
}

export default beforeOperationCollectionLogBuilder
