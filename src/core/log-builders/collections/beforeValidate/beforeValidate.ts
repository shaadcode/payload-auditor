import type { CollectionBeforeValidateHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const beforeValidateCollectionLogBuilder: CollectionBeforeValidateHook = ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  const hook = 'beforeValidate'
  const hookConfig = context.userHookConfig?.hooks?.beforeValidate
  const operationConfig = hookConfig?.[operation]
  const allFields: AuditorLog = {
    type: 'debug',
    collection: collection.slug,
    documentId: operation === 'update' ? originalDoc?.id : undefined,
    hook,
    operation,
    timestamp: new Date(),
    user: req?.user?.id || 'anonymous',
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'read')
  return data
}

export default beforeValidateCollectionLogBuilder
