import type { CollectionAfterErrorHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
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
  const hook = 'afterError'
  if ((context.userHookConfig as TrackedCollection).hooks?.afterError?.error?.enabled) {
    const log: AuditorLog = {
      type: 'error',
      action: 'error',
      collection: collection.slug,
      documentId: 'unknown',
      hook,
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterErrorCollectionLogBuilder
