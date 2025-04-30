import { EventEmitter } from 'events'

import type { ActivityLog } from './../../collections/activity-logs.js'

const globalEmitter = (global as any).payloadAuditorEmitter || new EventEmitter()

if (!(global as any).payloadAuditorEmitter) {
  ;(global as any).payloadAuditorEmitter = globalEmitter
}

export const emitEvent = (event: string, data: unknown) => {
  setImmediate(() => {
    globalEmitter.emit(event, data)
  })
}

export const onEventLog = (event: string, handler: (log: ActivityLog) => Promise<void>) => {
  globalEmitter.on(event, handler)
}
