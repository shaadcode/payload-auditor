import type { ActivityLog } from 'src/collections/activity-logs.js'

import EventEmitter from 'events'

const emitter = new EventEmitter()

// Emit an event asynchronously
export const emitEvent = (event: string, data: unknown) => {
  setImmediate(() => {
    emitter.emit(event, data)
  })
}

// Register an event listener
export const onEventLog = (event: string, handler: (log: ActivityLog) => Promise<void>) => {
  emitter.on(event, handler)
}
