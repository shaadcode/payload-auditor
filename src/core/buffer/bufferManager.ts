import type { Payload } from 'payload'

import type { AuditorLog } from '../../collections/auditor.js'
import type { PluginOptions } from './../../types/pluginOptions.js'

import { defaultCollectionValues } from './../../Constant/Constant.js'
import { onEventLog } from './../../core/events/emitter.js'
import ms from './../../utils/toMS.js'

const BUFFER: AuditorLog[] = []

let payloadInstance: Payload

export const bufferManager = (payload: Payload, pluginOptions: PluginOptions) => {
  const BATCH_SIZE = pluginOptions.collection?.buffer?.size ?? 10
  const FLUSH_INTERVAL = ms(pluginOptions.collection?.buffer?.time ?? '5s')
  const flushStrategy = pluginOptions.collection?.buffer?.flushStrategy ?? 'time'
  payloadInstance = payload

  // When the log is generated, add it to the buffer.
  onEventLog('logGenerated', async (log: AuditorLog) => {
    BUFFER.push(log)

    if (flushStrategy === 'size') {
      if (BUFFER.length >= BATCH_SIZE) {
        await flushBuffer(pluginOptions)
      }
    } else if (flushStrategy === 'realtime') {
      await flushBuffer(pluginOptions)
    }
  })

  if (flushStrategy === 'time') {
    // Every few seconds, empty the buffer (even if it's not full)
    setInterval(async () => {
      if (BUFFER.length > 0) {
        await flushBuffer(pluginOptions)
      }
    }, FLUSH_INTERVAL)
  }
}

const flushBuffer = async (pluginOptions: PluginOptions) => {
  const logsToInsert = [...BUFFER]
  BUFFER.length = 0
  await Promise.all(
    logsToInsert.map((log) =>
      payloadInstance.create({
        collection: pluginOptions.collection?.slug
          ? pluginOptions.collection?.slug
          : defaultCollectionValues.slug,
        data: log,
      }),
    ),
  )
}
