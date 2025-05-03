import type { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types.js'

import type { Duration } from './../../utils/toMS.js'

import { defaultAutoDeleteLog, defaultCollectionValues } from './../../Constant/Constant.js'
import ms from './../../utils/toMS.js'

type AutoLogCleanerProps = {
  autoDeleteInterval: Duration
  id: string
}

export const autoLogCleaner: BeforeChangeHook<AutoLogCleanerProps> = async ({
  data,
  operation,
  req,
}) => {
  try {
    const thirtySecondsAgo = new Date(
      Date.now() - ms(data.autoDeleteInterval || defaultAutoDeleteLog),
    )

    const oldLogs = await req.payload.find({
      collection: defaultCollectionValues.slug,
      limit: 1000,
      where: {
        createdAt: {
          less_than: thirtySecondsAgo.toISOString(),
        },
      },
    })

    if (oldLogs.docs.length > 0) {
      const deletePromises = oldLogs.docs.map((log) =>
        req.payload.delete({
          id: log.id,
          collection: defaultCollectionValues.slug,
        }),
      )

      await Promise.all(deletePromises)
    }
  } catch (err) {
    console.error('Error cleaning old logs:', err)
  }
}
