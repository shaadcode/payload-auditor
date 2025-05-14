import type { CollectionAfterForgotPasswordHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterForgotPasswordCollectionLogBuilder: CollectionAfterForgotPasswordHook = async ({
  args,
  collection,
  context,
}) => {
  const hook = 'afterForgotPassword'

  const config = context.userHookConfig as TrackedCollection

  if (config?.hooks?.afterForgotPassword?.forgotPassword?.enabled) {
    const email = args.data?.email
    const userAgent = args.req.headers.get('user-agent') || 'unknown'

    const userDoc = await args.req.payload.find({
      collection: collection.slug,
      limit: 1,
      where: { email: { equals: email } },
    })

    const userId = userDoc?.docs?.[0]?.id

    if (userId) {
      const log: AuditorLog = {
        action: 'forgotPassword',
        collection: collection.slug,
        hook,
        timestamp: new Date(),
        user: userId,
        userAgent,
      }

      emitEvent('logGenerated', log)
    }
  }

  return {}
}

export default afterForgotPasswordCollectionLogBuilder
