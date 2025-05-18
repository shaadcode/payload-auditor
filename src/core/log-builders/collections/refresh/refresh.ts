import type { CollectionRefreshHook, RequestContext } from 'payload'

import type { AuditorLog } from './../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const refreshCollectionLogBuilder: CollectionRefreshHook = ({
  args,
  // @ts-ignore
  context,
  user,
}) => {
  const hook = 'refresh'
  const hookConfig = (context as RequestContext).userHookConfig?.hooks?.refresh
  const operationConfig = hookConfig?.refresh

  const allFields: AuditorLog = {
    type: 'info',
    collection: args.collection.config.slug,
    hook,
    operation: 'refresh',
    timestamp: new Date(),
    user: user?.id || 'anonymous',
    userAgent: args.req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'read')
}

export default refreshCollectionLogBuilder
