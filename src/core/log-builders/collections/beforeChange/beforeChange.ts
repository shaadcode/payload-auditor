import type { CollectionBeforeChangeHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeChangeCollectionLogBuilder: CollectionBeforeChangeHook = ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  console.log(originalDoc)
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeChange?.create?.enabled
  ) {
    const log: AuditorLog = {
      action: operation,
      collection: collection.slug,
      documentId: originalDoc.id,
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeChange?.update?.enabled
  ) {
    const log: AuditorLog = {
      action: operation,
      collection: collection.slug,
      documentId: originalDoc.id,
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return data
}

export default beforeChangeCollectionLogBuilder
