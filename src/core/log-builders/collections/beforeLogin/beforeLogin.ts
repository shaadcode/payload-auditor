import type { CollectionBeforeLoginHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeLoginCollectionLogBuilder: CollectionBeforeLoginHook = ({
  collection,
  context,
  req,
  user,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.beforeLogin?.login?.enabled) {
    const log: AuditorLog = {
      type: 'security',
      action: 'login',
      collection: collection.slug,
      hook: 'beforeLogin',
      timestamp: new Date(),
      user: user.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  return user
}

export default beforeLoginCollectionLogBuilder
