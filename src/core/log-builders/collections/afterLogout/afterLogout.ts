import type { CollectionAfterLogoutHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterLogoutCollectionLogBuilder: CollectionAfterLogoutHook = ({
  collection,
  context,
  req,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.afterLogout?.logout?.enabled) {
    const log: AuditorLog = {
      action: 'logout',
      collection: collection.slug,
      timestamp: new Date(),
      user: req.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterLogoutCollectionLogBuilder
