import type { CollectionBeforeOperationHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type {
  HookOperationConfig,
  HookTrackingOperationMap,
} from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const beforeOperationCollectionLogBuilder: CollectionBeforeOperationHook = async ({
  args,
  collection,
  context,
  operation,
  req,
}) => {
  const hook = 'beforeOperation'
  const hookConfig = context.userHookConfig?.hooks
    ?.beforeOperation as HookTrackingOperationMap['beforeOperation']
  const operationConfig = hookConfig?.[operation as keyof typeof hookConfig] as
    | HookOperationConfig
    | undefined

  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    hook,
    operation,
    timestamp: new Date(),
    user: req?.user?.id || 'anonymous',
    userAgent: req.headers.get('user-agent') || 'anonymous',
  }

  const emitWrapper = (fields: AuditorLog) => {
    if (operationConfig?.enabled) {
      emitEvent('logGenerated', fields)
    }
  }

  switch (operation) {
    case 'create':
    case 'refresh':
    case 'update':
      emitWrapper(allFields)
      break
    case 'delete':
      emitWrapper({ ...allFields, documentId: args.id ? args.id.toString() : undefined })
      break
    case 'forgotPassword': {
      const email = args.data?.email
      const result = await args.req.payload.find({
        collection: collection.slug,
        limit: 1,
        where: { email: { equals: email } },
      })
      const userId = result?.docs?.[0]?.id
      emitWrapper({ ...allFields, user: userId || 'anonymous' })
      break
    }
    case 'login': {
      const email = args.data?.email
      const result = await args.req.payload.find({
        collection: collection.slug,
        limit: 1,
        where: { email: { equals: email } },
      })
      const userId = result?.docs?.[0]?.id
      emitWrapper({ ...allFields, user: userId || 'anonymous' })
      break
    }
  }

  handleDebugMode(hookConfig, operationConfig, allFields, operation)
  return args
}

export default beforeOperationCollectionLogBuilder
