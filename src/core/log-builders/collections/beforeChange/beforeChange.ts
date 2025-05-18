import type { CollectionBeforeChangeHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const beforeChangeCollectionLogBuilder: CollectionBeforeChangeHook = ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  const hook = 'beforeChange'
  const hookConfig = context.userHookConfig?.hooks?.beforeChange
  const operationConfig = hookConfig?.[operation]
  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    documentId: originalDoc?.id,
    hook,
    operation,
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, operation)

  return data
}

export default beforeChangeCollectionLogBuilder
