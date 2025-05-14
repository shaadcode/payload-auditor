import type { CollectionAfterRefreshHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterRefreshCollectionLogBuilder: CollectionAfterRefreshHook = ({
  collection,
  context,
  exp,
  req,
  token,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterRefresh?.refresh?.enabled) {
    const log: AuditorLog = {
      action: 'refresh',
      collection: collection.slug,
      hook: 'afterRefresh',
      timestamp: new Date(),
      user: req.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterRefreshCollectionLogBuilder
