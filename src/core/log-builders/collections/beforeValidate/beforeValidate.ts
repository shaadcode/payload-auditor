import type { CollectionBeforeValidateHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeValidateCollectionLogBuilder: CollectionBeforeValidateHook = ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeValidate?.create?.enabled
  ) {
    const log: AuditorLog = {
      type: 'debug',
      action: operation,
      collection: collection.slug,
      hook: 'beforeValidate',
      timestamp: new Date(),
      user: req?.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeValidate?.update?.enabled
  ) {
    const log: AuditorLog = {
      type: 'debug',
      action: operation,
      collection: collection.slug,
      documentId: originalDoc.id,
      hook: 'beforeValidate',
      timestamp: new Date(),
      user: req?.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return data
}

export default beforeValidateCollectionLogBuilder
