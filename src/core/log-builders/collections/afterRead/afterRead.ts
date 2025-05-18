import type { CollectionAfterReadHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const afterReadCollectionLogBuilder: CollectionAfterReadHook = ({
  collection,
  context,
  doc,
  req,
}) => {
  const hook = 'afterRead'
  const hookConfig = context.userHookConfig?.hooks?.afterRead
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

export default afterReadCollectionLogBuilder
