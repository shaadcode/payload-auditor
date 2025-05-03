import type { CollectionAfterChangeHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from '../../../../types/pluginOptions.js'

import { emitEvent } from '../../../events/emitter.js'

const afterChangeCollectionLogBuilder: CollectionAfterChangeHook = ({
  collection,
  context,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterChange?.create?.enabled
  ) {
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
  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterChange?.update?.enabled
  ) {
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
  return doc
}

export default afterChangeCollectionLogBuilder
