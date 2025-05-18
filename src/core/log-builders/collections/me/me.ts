import type { CollectionMeHook, RequestContext } from 'payload'

import type { AuditorLog } from './../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'
const meCollectionLogBuilder: CollectionMeHook = ({
  args,
  // @ts-ignore
  context,
  user,
}) => {
  const hook = 'me'
  const hookConfig = (context as RequestContext).userHookConfig?.hooks?.me
  const operationConfig = hookConfig?.me
  const allFields: AuditorLog = {
    type: 'info',
    collection: args.collection.config.slug,
    hook,
    operation: 'me',
    timestamp: new Date(),
    user: user.id || 'anonymous',
    userAgent: args.req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'read')
}

export default meCollectionLogBuilder
