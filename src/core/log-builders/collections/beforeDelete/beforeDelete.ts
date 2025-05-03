import type { CollectionBeforeDeleteHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeDeleteCollectionLogBuilder: CollectionBeforeDeleteHook = ({
  id,
  collection,
  context,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.beforeDelete?.delete?.enabled) {
    const log: ActivityLog = {
      action: 'delete',
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

export default beforeDeleteCollectionLogBuilder
