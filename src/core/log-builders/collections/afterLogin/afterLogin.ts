import type { CollectionAfterLoginHook } from 'payload'

import type { ActivityLog } from './../../../../collections/activity-logs.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterLoginCollectionLogBuilder: CollectionAfterLoginHook = ({
  collection,
  context,
  req,
  token,
  user,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterLogin?.login?.enabled) {
    const log: ActivityLog = {
      action: 'login',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterLoginCollectionLogBuilder
