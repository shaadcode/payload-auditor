import type { CollectionAfterReadHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterReadCollectionLogBuilder: CollectionAfterReadHook = ({
  collection,
  context,
  doc,
  findMany,
  query,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterRead?.read?.enabled) {
    const log: ActivityLog = {
      action: 'read',
      collection: collection.slug,
      documentId: doc.id,
      timestamp: new Date(),
      user: req?.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  return doc
}

export default afterReadCollectionLogBuilder
