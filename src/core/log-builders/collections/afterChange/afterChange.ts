import type { CollectionAfterChangeHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
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
  const hook = 'afterChange'
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterChange?.create?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: operation,
      collection: collection.slug,
      documentId: doc.id,
      hook,
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
    const log: AuditorLog = {
      type: 'audit',
      action: operation,
      collection: collection.slug,
      documentId: doc.id,
      hook,
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return doc
}

export default afterChangeCollectionLogBuilder
