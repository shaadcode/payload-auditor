import type { CollectionAfterLogoutHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterLogoutCollectionLogBuilder: CollectionAfterLogoutHook = ({
  collection,
  context,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterLogout?.logout?.enabled) {
    const log: ActivityLog = {
      action: 'logout',
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

export default afterLogoutCollectionLogBuilder
