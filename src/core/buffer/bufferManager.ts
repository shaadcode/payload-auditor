import type { Payload } from 'payload'

import type { AuditorLog } from '../../collections/auditor.js'
import type { PluginOptions } from './../../types/pluginOptions.js'

import { defaultCollectionValues } from './../../Constant/Constant.js'
import { handleBufferDebugMode } from './../../core/buffer/helpers/handleBufferDebugMode.js'
import { onEventLog } from './../../core/events/emitter.js'
import ms from './../../utils/toMS.js'

const store: AuditorLog[] = []

let payloadInstance: Payload

export const bufferManager = (payload: Payload, pluginOptions: PluginOptions) => {
  const bufferConfig = pluginOptions.collections?.buffer
  const size = bufferConfig?.size ?? 10
  const interval = ms(bufferConfig?.time ?? '5s')
  const flushStrategy = bufferConfig?.flushStrategy ?? 'time'
  payloadInstance = payload

  // When the log is generated, add it to the buffer.
  onEventLog('logGenerated', async (log: AuditorLog) => {
    handleBufferDebugMode({ flushStrategy, interval, size }, bufferConfig)
    store.push(log)

    if (flushStrategy === 'size') {
      if (store.length >= size) {
        await flushBuffer(pluginOptions)
      }
    } else if (flushStrategy === 'realtime') {
      await flushBuffer(pluginOptions)
    }
  })

  if (flushStrategy === 'time') {
    // Every few seconds, empty the buffer (even if it's not full)
    setInterval(async () => {
      if (store.length > 0) {
        await flushBuffer(pluginOptions)
      }
    }, interval)
  }
}

const flushBuffer = async (pluginOptions: PluginOptions) => {
  const logsToInsert = [...store]
  store.length = 0
  await Promise.all(
    logsToInsert.map((log) =>
      payloadInstance.create({
        collection: pluginOptions.collections?.slug
          ? pluginOptions.collections?.slug
          : defaultCollectionValues.slug,
        data: log,
      }),
    ),
  )
}
