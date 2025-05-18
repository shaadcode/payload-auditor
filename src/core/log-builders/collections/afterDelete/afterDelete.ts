import type { CollectionAfterDeleteHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { handleDebugMode } from '../../../../core/log-builders/collections/helpers/handleDebugMode.js'
import { emitEvent } from './../../../../core/events/emitter.js'

const afterDeleteCollectionLogBuilder: CollectionAfterDeleteHook = ({
  id,
  collection,
  context,
  doc,
  req,
}) => {
  const hook = 'afterDelete'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterDelete
  const operationConfig = hookConfig?.delete
  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    documentId: doc.id,
    hook,
    operation: 'delete',
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'delete')

  return {}
}

export default afterDeleteCollectionLogBuilder
