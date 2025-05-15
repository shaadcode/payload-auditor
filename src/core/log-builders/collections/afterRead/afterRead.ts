import type { CollectionAfterReadHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
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
    const log: AuditorLog = {
      type: 'info',
      action: 'read',
      collection: collection.slug,
      documentId: doc.id,
      hook: 'afterRead',
      timestamp: new Date(),
      user: req?.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  return doc
}

export default afterReadCollectionLogBuilder
