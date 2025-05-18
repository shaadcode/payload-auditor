import type { CollectionBeforeDeleteHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const beforeDeleteCollectionLogBuilder: CollectionBeforeDeleteHook = ({
  id,
  collection,
  context,
  req,
}) => {
  const hook = 'beforeDelete'
  const hookConfig = context.userHookConfig?.hooks?.beforeDelete
  const operationConfig = hookConfig?.delete
  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    documentId: id.toString(),
    hook,
    operation: 'delete',
    timestamp: new Date(),
    user: req?.user?.id || 'anonymous',
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'delete')

  return {}
}

export default beforeDeleteCollectionLogBuilder
