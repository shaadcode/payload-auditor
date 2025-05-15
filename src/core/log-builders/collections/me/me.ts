import type { CollectionMeHook } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const meCollectionLogBuilder: CollectionMeHook = ({
  args,
  // @ts-ignore
  context,
  user,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.me?.me?.enabled) {
    const log: AuditorLog = {
      type: 'info',
      action: 'me',
      collection: args.collection.config.slug,
      hook: 'me',
      timestamp: new Date(),
      user: user.id || 'anonymous',
      userAgent: args.req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
}

export default meCollectionLogBuilder
