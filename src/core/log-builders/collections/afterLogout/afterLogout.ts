import type { CollectionAfterLogoutHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterLogoutCollectionLogBuilder: CollectionAfterLogoutHook = ({
  collection,
  context,
  req,
}) => {
  const hook = 'afterLogout'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterLogout
  const operationConfig = hookConfig?.logout

  const allFields: AuditorLog = {
    type: 'security',
    collection: collection.slug,
    hook,
    operation: 'logout',
    timestamp: new Date(),
    user: req.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'logout')

  return {}
}

export default afterLogoutCollectionLogBuilder
