import type { CollectionAfterErrorHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterErrorCollectionLogBuilder: CollectionAfterErrorHook = ({
  collection,
  context,
  error,
  graphqlResult,
  req,
  result,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterError?.error?.enabled) {
    const log: ActivityLog = {
      action: 'error',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterErrorCollectionLogBuilder
