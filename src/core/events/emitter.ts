import EventEmitter from 'events'

const emitter = new EventEmitter()

// Emit an event asynchronously
export const emitEvent = (event: string, data: unknown) => {
  setImmediate(() => {
    emitter.emit(event, data)
  })
}

// Register an event listener
export const onEventLog = (event: string, handler: (data: unknown) => Promise<void>) => {
  emitter.on(event, handler)
}
