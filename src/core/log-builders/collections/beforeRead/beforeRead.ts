import type { CollectionBeforeReadHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const beforeReadCollectionLogBuilder: CollectionBeforeReadHook = ({
  collection,
  context,
  doc,
  query,
  req,
}) => {
  const hook = 'beforeRead'
  const hookConfig = context.userHookConfig?.hooks?.beforeRead
  const operationConfig = hookConfig?.read
  const allFields: AuditorLog = {
    type: 'info',
    collection: collection.slug,
    documentId: doc.id,
    hook,
    operation: 'read',
    timestamp: new Date(),
    user: req?.user?.id || 'anonymous',
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'read')
  return doc
}

export default beforeReadCollectionLogBuilder
