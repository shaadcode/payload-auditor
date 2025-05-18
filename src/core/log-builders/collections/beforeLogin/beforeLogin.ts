import type { CollectionBeforeLoginHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const beforeLoginCollectionLogBuilder: CollectionBeforeLoginHook = ({
  collection,
  context,
  req,
  user,
}) => {
  const hook = 'beforeLogin'
  const hookConfig = context.userHookConfig?.hooks?.beforeLogin
  const operationConfig = hookConfig?.login
  const allFields: AuditorLog = {
    type: 'security',
    collection: collection.slug,
    hook,
    operation: 'login',
    timestamp: new Date(),
    user: user.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'login')
  return user
}

export default beforeLoginCollectionLogBuilder
