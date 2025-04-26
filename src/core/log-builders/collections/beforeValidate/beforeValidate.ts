import type { CollectionBeforeValidateHook } from 'payload'

import type { ActivityLog } from './../../../../collections/activity-logs.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeValidateCollectionLogBuilder: CollectionBeforeValidateHook = ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeValidate?.create?.enabled
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
    (context.userHookConfig as TrackedCollection).hooks?.beforeValidate?.update?.enabled
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
  return data
}

export default beforeValidateCollectionLogBuilder
