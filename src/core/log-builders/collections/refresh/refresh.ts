import type { CollectionRefreshHook } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const refreshCollectionLogBuilder: CollectionRefreshHook = ({
  args,
  // @ts-ignore
  context,
  user,
}) => {
  if ((context.userHookConfig as TrackedCollection).hooks?.refresh?.refresh?.enabled) {
    const log: AuditorLog = {
      action: 'refresh',
      collection: args.collection.config.slug,
      timestamp: new Date(),
      user: user?.id || null,
      userAgent: args.req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
}

export default refreshCollectionLogBuilder
