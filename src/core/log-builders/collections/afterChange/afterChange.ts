import type { CollectionAfterChangeHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from '../../../../types/pluginOptions.js'

import { handleDebugMode } from '../../../../core/log-builders/collections/helpers/handleDebugMode.js'
import { emitEvent } from '../../../events/emitter.js'

const afterChangeCollectionLogBuilder: CollectionAfterChangeHook = ({
  collection,
  context,
  doc,
  operation,
  req,
}) => {
  const hook = 'afterChange'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterChange
  const operationConfig = hookConfig?.[operation]
  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    documentId: doc.id,
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

  return doc
}

export default afterChangeCollectionLogBuilder
