import type { CollectionAfterLoginHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterLoginCollectionLogBuilder: CollectionAfterLoginHook = ({
  collection,
  context,
  req,
  token,
  user,
}) => {
  const hook = 'afterLogin'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterLogin
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

  return {}
}

export default afterLoginCollectionLogBuilder
