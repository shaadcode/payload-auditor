import type { CollectionAfterErrorHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterErrorCollectionLogBuilder: CollectionAfterErrorHook = ({
  collection,
  context,
  error,
  graphqlResult,
  req,
  result,
}) => {
  const hook = 'afterError'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterError
  const operationConfig = hookConfig?.error
  const allFields: AuditorLog = {
    type: 'error',
    collection: collection.slug,
    documentId: 'unknown',
    hook,
    operation: 'error',
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'error')
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }

  return {}
}

export default afterErrorCollectionLogBuilder
