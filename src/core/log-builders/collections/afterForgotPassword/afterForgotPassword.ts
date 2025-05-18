import type { CollectionAfterForgotPasswordHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import { handleDebugMode } from './../../../../core/log-builders/collections/helpers/handleDebugMode.js'

const afterForgotPasswordCollectionLogBuilder: CollectionAfterForgotPasswordHook = async ({
  args,
  collection,
  context,
}) => {
  const hook = 'afterForgotPassword'
  const hookConfig = (context.userHookConfig as TrackedCollection).hooks?.afterForgotPassword
  const operationConfig = hookConfig?.forgotPassword
  const email = args.data?.email
  const userAgent = args.req.headers.get('user-agent') || 'unknown'
  const allFields: AuditorLog = {
    type: 'security',
    collection: collection.slug,
    hook,
    operation: 'forgotPassword',
    timestamp: new Date(),
    user: 'anonymous',
    userAgent,
  }

  if (operationConfig?.enabled) {
    const userDoc = await args.req.payload.find({
      collection: collection.slug,
      limit: 1,
      where: { email: { equals: email } },
    })

    const userId = userDoc?.docs?.[0]?.id
    allFields.user = userId

    emitEvent('logGenerated', allFields)
  }

  handleDebugMode(hookConfig, operationConfig, allFields, 'forgotPassword')

  return {}
}

export default afterForgotPasswordCollectionLogBuilder
