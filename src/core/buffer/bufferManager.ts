import type { Payload } from 'payload'

import type { AuditorLog } from '../../collections/auditor.js'

import { defaultCollectionValues } from './../../Constant/Constant.js'
import { onEventLog } from './../../core/events/emitter.js'

const BUFFER: AuditorLog[] = []
const BATCH_SIZE = 10
const FLUSH_INTERVAL = 5000

let payloadInstance: Payload

export const bufferManager = (payload: Payload) => {
  payloadInstance = payload

  // When the log is generated, add it to the buffer.
  onEventLog('logGenerated', async (log: AuditorLog) => {
    BUFFER.push(log)

    if (BUFFER.length >= BATCH_SIZE) {
      await flushBuffer()
    }
  })

  // Every few seconds, empty the buffer (even if it's not full)
  setInterval(async () => {
    if (BUFFER.length > 0) {
      await flushBuffer()
    }
  }, FLUSH_INTERVAL)
}

const flushBuffer = async () => {
  const logsToInsert = [...BUFFER]
  BUFFER.length = 0
  await Promise.all(
    logsToInsert.map((log) =>
      payloadInstance.create({
        collection: defaultCollectionValues.slug,
        data: log,
      }),
    ),
  )
}
