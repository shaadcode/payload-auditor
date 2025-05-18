import type { CollectionAfterOperationHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { HookOperationConfig, TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterOperationCollectionLogBuilder: CollectionAfterOperationHook = ({
  args,
  collection,
  // @ts-ignore
  context,
  operation,
  req,
  result,
}) => {
  const hook = 'afterOperation'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterOperation
  // @ts-ignore
  const operationConfig: HookOperationConfig | undefined = hookConfig?.[operation]
  const allFields: AuditorLog = {
    type: 'audit',
    collection: collection.slug,
    documentId: 'unknown',
    hook,
    operation,
    timestamp: new Date(),
    user: req?.user?.id || null,
    userAgent: req.headers.get('user-agent') || 'unknown',
  }

  if (operation === 'refresh' || operation === 'login') {
    console.log(hookConfig)
  }

  const emitWrapper = (fields: AuditorLog) => {
    if (operationConfig?.enabled) {
      emitEvent('logGenerated', fields)
    }
  }

  switch (operation) {
    case 'create':
    case 'deleteByID':
    case 'findByID':
    case 'updateByID': {
      const updatedFields = {
        ...allFields,
        documentId: result ? result.id.toString() : undefined,
      }
      emitWrapper(updatedFields)
      handleDebugMode(hookConfig, operationConfig, updatedFields, operation)
      break
    }
    case 'delete':
    case 'update': {
      if (result?.docs?.length) {
        for (const doc of result.docs) {
          const updatedFields = { ...allFields, documentId: doc.id.toString() }

          handleDebugMode(hookConfig, operationConfig, updatedFields, operation)
          emitWrapper(updatedFields)
        }
        return result
      }
      break
    }
    case 'login':
    case 'refresh': {
      const updatedFields = { ...allFields, user: result.user.id.toString() }

      emitWrapper(updatedFields)
      handleDebugMode(hookConfig, operationConfig, updatedFields, operation)
      break
    }
  }
  return result
}

export default afterOperationCollectionLogBuilder
