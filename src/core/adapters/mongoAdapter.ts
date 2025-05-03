import type { Payload } from 'payload'

import type { ActivityLog } from '../../collections/auditor.js'

import { defaultCollectionValues } from './../../Constant/Constant.js'
export const insertMany = async (payload: Payload, logs: ActivityLog[]) => {
  try {
    const logCollection = payload.collections[defaultCollectionValues.slug]
    if (!logCollection) {
      throw new Error('Activity Logs collection not found')
    }

    await Promise.all(
      logs.map((log) =>
        payload.create({
          collection: defaultCollectionValues.slug,
          data: log,
        }),
      ),
    )
  } catch (err) {
    console.error('Failed to insert logs:', err)
  }
}
