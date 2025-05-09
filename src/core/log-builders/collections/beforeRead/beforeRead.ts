import type { CollectionBeforeReadHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeReadCollectionLogBuilder: CollectionBeforeReadHook = ({
  collection,
  context,
  doc,
  query,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.beforeRead?.read?.enabled) {
    const log: AuditorLog = {
      action: 'read',
      collection: collection.slug,
      documentId: doc.id,
      timestamp: new Date(),
      user: req.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return doc
}

export default beforeReadCollectionLogBuilder
