import type { CollectionAfterLoginHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterLoginCollectionLogBuilder: CollectionAfterLoginHook = ({
  collection,
  context,
  req,
  token,
  user,
}) => {
  const hook = 'afterLogin'
  if ((context.userHookConfig as TrackedCollection).hooks?.afterLogin?.login?.enabled) {
    const log: AuditorLog = {
      action: 'login',
      collection: collection.slug,
      hook,
      timestamp: new Date(),
      user: user.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return {}
}

export default afterLoginCollectionLogBuilder
