import type { CollectionBeforeDeleteHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeDeleteCollectionLogBuilder: CollectionBeforeDeleteHook = ({
  id,
  collection,
  context,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.beforeDelete?.delete?.enabled) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'delete',
      collection: collection.slug,
      documentId: id.toString(),
      hook: 'beforeDelete',
      timestamp: new Date(),
      user: req?.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  return {}
}

export default beforeDeleteCollectionLogBuilder
