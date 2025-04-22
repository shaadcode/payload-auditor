import type { Payload } from 'payload'
import type { ActivityLog } from 'src/collections/activity-logs.js'
export const insertMany = async (payload: Payload, logs: ActivityLog[]) => {
  try {
    const logCollection = payload.collections['activity-logs']
    if (!logCollection) {
      throw new Error('Activity Logs collection not found')
    }

    await Promise.all(
      logs.map((log) =>
        payload.create({
          collection: 'activity-logs',
          data: log,
        }),
      ),
    )
  } catch (err) {
    console.error('Failed to insert logs:', err)
  }
}
