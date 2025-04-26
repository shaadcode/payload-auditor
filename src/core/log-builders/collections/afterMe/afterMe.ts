import type { CollectionAfterMeHook } from 'payload'

import type { ActivityLog } from './../../../../collections/activity-logs.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterMeCollectionLogBuilder: CollectionAfterMeHook = ({
  collection,
  context,
  req,
  response,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterMe?.me?.enabled) {
    const log: ActivityLog = {
      action: 'me',
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

export default afterMeCollectionLogBuilder
