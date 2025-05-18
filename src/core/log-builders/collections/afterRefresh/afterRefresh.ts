import type { CollectionAfterRefreshHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const afterRefreshCollectionLogBuilder: CollectionAfterRefreshHook = ({
  collection,
  context,
  req,
}) => {
  const hook = 'afterRefresh'
  const hookConfig = context.userHookConfig?.hooks?.afterRefresh
  const operationConfig = hookConfig?.refresh
  const allFields: AuditorLog = {
    type: 'info',
    collection: collection.slug,
    hook,
    operation: 'refresh',
    timestamp: new Date(),
    user: req.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'refresh')
  return {}
}

export default afterRefreshCollectionLogBuilder
