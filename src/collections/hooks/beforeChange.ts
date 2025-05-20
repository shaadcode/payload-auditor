import type { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types.js'

import type { Duration } from './../../utils/toMS.js'

import { defaultAutoDeleteLog, defaultCollectionValues } from './../../Constant/Constant.js'
import ms from './../../utils/toMS.js'

type AutoLogCleanerProps = {
  id: string
  olderThan: Duration
}

export const autoLogCleaner: BeforeChangeHook<AutoLogCleanerProps> = async ({
  context,
  data,
  operation,
  req,
}) => {
  try {
    const millisecondsAgo = new Date(Date.now() - ms(data.olderThan || defaultAutoDeleteLog))
    const oldLogs = await req.payload.find({
      collection: context.pluginOptions.collection?.slug
        ? context.pluginOptions.collection?.slug
        : defaultCollectionValues.slug,
      limit: context.pluginOptions.automation?.logCleanup?.strategy?.amount || 100,
      where: {
        createdAt: {
          less_than: millisecondsAgo.toISOString(),
        },
      },
    })

    if (oldLogs.docs.length > 0) {
      const deletePromises = oldLogs.docs.map((log) =>
        req.payload.delete({
          id: log.id,
          collection: context.pluginOptions.collection?.slug
            ? context.pluginOptions.collection?.slug
            : defaultCollectionValues.slug,
        }),
      )

      await Promise.all(deletePromises)
    }
  } catch (err) {
    console.error('Error cleaning old logs:', err)
  }
}
