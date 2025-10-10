import type { PluginOptions } from 'src/types/pluginOptions.js'

import { defaultCollectionValues } from 'src/Constant/Constant.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { bufferManager } from './../../core/buffer/bufferManager.js'
import { onEventLog } from './../../core/events/emitter.js'

vi.mock('../../core/events/emitter.ts', () => ({
  onEventLog: vi.fn(),
}))

const createMock = vi.fn()
const mockPayload = {
  create: createMock,
}

const sampleLog = { message: 'test log', timestamp: Date.now() }
beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('bufferManager', () => {
  it('should flush when buffer reaches size limit', async () => {
    const pluginOptions = {
      collections: {
        buffer: {
          flushStrategy: 'size',
          size: 2,
        },
      },
    } as PluginOptions

    bufferManager(mockPayload as any, pluginOptions)

    // simulate event listener
    const handler = (onEventLog as any).mock.calls[0][1]

    await handler(sampleLog)
    expect(createMock).not.toHaveBeenCalled()

    await handler(sampleLog)
    expect(createMock).toHaveBeenCalledTimes(2)
  })

  it('should flush immediately in realtime mode', async () => {
    const pluginOptions = {
      collections: {
        buffer: {
          flushStrategy: 'realtime',
        },
      },
    } as PluginOptions

    bufferManager(mockPayload as any, pluginOptions)
    const handler = (onEventLog as any).mock.calls[0][1]

    await handler(sampleLog)
    expect(createMock).toHaveBeenCalledWith({
      collection: defaultCollectionValues.slug,
      data: sampleLog,
    })
  })

  it('should flush periodically in time mode', async () => {
    const pluginOptions = {
      collections: {
        buffer: {
          flushStrategy: 'time',
          time: '2s',
        },
      },
    } as unknown as PluginOptions

    bufferManager(mockPayload as any, pluginOptions)
    const handler = (onEventLog as any).mock.calls[0][1]
    await handler(sampleLog)
    expect(createMock).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2000)

    await Promise.resolve() // allow flushBuffer to run
    expect(createMock).toHaveBeenCalledWith({
      collection: defaultCollectionValues.slug,
      data: sampleLog,
    })
  })

  it('should clear buffer after flushing', async () => {
    const pluginOptions = {
      collections: {
        buffer: {
          flushStrategy: 'size',
          size: 1,
        },
      },
    } as PluginOptions

    bufferManager(mockPayload as any, pluginOptions)
    const handler = (onEventLog as any).mock.calls[0][1]

    await handler(sampleLog)
    expect(createMock).toHaveBeenCalledTimes(1)

    // now push another and check it's flushed separately (i.e., buffer reset)
    await handler(sampleLog)
    expect(createMock).toHaveBeenCalledTimes(2)
  })
})
