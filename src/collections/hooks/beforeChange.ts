import type { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types.js'

import type { ActivityLog } from './../../collections/activity-logs.js'
import type { Duration } from './../../utils/toMS.js'

import { defaultAutoDeleteLog } from './../../Constant/Constant.js'
import ms from './../../utils/toMS.js'

type AutoLogCleanerProps = {
  autoDeleteInterval: Duration
  id: ActivityLog['documentId']
}

export const autoLogCleaner: BeforeChangeHook<AutoLogCleanerProps> = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create') {
    try {
      const thirtySecondsAgo = new Date(
        Date.now() - ms(data.autoDeleteInterval || defaultAutoDeleteLog),
      )

      const oldLogs = await req.payload.find({
        collection: 'activity-logs',
        limit: 1000,
        where: {
          timestamp: {
            less_than: thirtySecondsAgo.toISOString(),
          },
        },
      })

      if (oldLogs.docs.length > 0) {
        const deletePromises = oldLogs.docs.map((log) =>
          req.payload.delete({
            id: log.id,
            collection: 'activity-logs',
          }),
        )

        await Promise.all(deletePromises)
      }
    } catch (err) {
      console.error('Error cleaning old logs:', err)
    }
  }
}
