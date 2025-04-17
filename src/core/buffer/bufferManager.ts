import type { Payload } from 'payload'
import type { ActivityLog } from 'src/collections/activity-logs.js'

import { onEventLog } from 'src/core/events/emitter.js'

const BUFFER: ActivityLog[] = []
const BATCH_SIZE = 10
const FLUSH_INTERVAL = 5000

let payloadInstance: Payload

export const initBufferManager = (payload: Payload) => {
  payloadInstance = payload

  // وقتی لاگی تولید شد، اضافه‌اش کن به بافر
  onEventLog('logGenerated', async (log: ActivityLog) => {
    BUFFER.push(log)

    // اگر بافر به حد نصاب رسید، همه رو وارد دیتابیس کن
    if (BUFFER.length >= BATCH_SIZE) {
      await flushBuffer()
    }
  })

  // هر چند ثانیه، بافر رو خالی کن (حتی اگه کامل نشده باشه)
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
        collection: 'activity-logs',
        data: log,
      }),
    ),
  )
}
