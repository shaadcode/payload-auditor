import type { CollectionAfterDeleteHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterDeleteCollectionLogBuilder: CollectionAfterDeleteHook = ({
  id,
  collection,
  context,
  doc,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterDelete?.delete?.enabled) {
    const log: AuditorLog = {
      action: 'delete',
      collection: collection.slug,
      documentId: doc.id,
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterDeleteCollectionLogBuilder
