import type { CollectionAfterMeHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterMeCollectionLogBuilder: CollectionAfterMeHook = ({
  collection,
  context,
  req,
  response,
}) => {
  const hook = 'afterMe'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterMe
  const operationConfig = hookConfig?.me
  const allFields: AuditorLog = {
    type: 'info',
    collection: collection.slug,
    hook,
    operation: 'me',
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }
  if (operationConfig?.enabled) {
    emitEvent('logGenerated', allFields)
  }
  handleDebugMode(hookConfig, operationConfig, allFields, 'me')

  return {}
}

export default afterMeCollectionLogBuilder
