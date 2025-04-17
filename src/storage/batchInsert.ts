import { insertMany } from 'src/core/adapters/mongoAdapter.js'

const buffer: unknown[] = []
const MAX_BATCH_SIZE = 10
const MAX_WAIT_TIME = 5000 // 5 ثانیه

let timeout: NodeJS.Timeout | null = null

export const pushToBuffer = async (log: unknown) => {
  buffer.push(log)

  if (buffer.length >= MAX_BATCH_SIZE) {
    await flush()
  } else if (!timeout) {
    timeout = setTimeout(async () => {
      await flush()
    }, MAX_WAIT_TIME)
  }
}

const flush = async () => {
  if (buffer.length === 0) {
    return
  }

  const batch = buffer.splice(0, buffer.length)
  try {
    await insertMany(batch)
  } catch (err) {
    console.error('Error inserting log batch:', err)
  }

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
}
