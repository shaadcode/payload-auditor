import type { CollectionAfterForgotPasswordHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterForgotPasswordCollectionLogBuilder: CollectionAfterForgotPasswordHook = ({
  args,
  collection,
  context,
}) => {
  if (
    (context.userHookConfig as TrackedCollection).hooks?.afterForgotPassword?.forgotPassword
      ?.enabled
  ) {
    const log: ActivityLog = {
      action: 'forgotPassword',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: 'unknown',
      userAgent: 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterForgotPasswordCollectionLogBuilder
