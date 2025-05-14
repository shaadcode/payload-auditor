import type { RequestContext } from 'next/dist/server/base-server.js'
import type { CollectionAfterMeHook, PayloadRequest, SanitizedCollectionConfig } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterMeCollectionLogBuilder from 'src/core/log-builders/collections/afterMe/afterMe.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterMe collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if me operation is not enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterMe: {
              me: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {
        headers: {
          get: () => 'test-agent',
        },
      } as unknown as PayloadRequest,
      response: {} as unknown,
    } as Parameters<CollectionAfterMeHook>[0]
    const result = await afterMeCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should not log if me operation is not defined', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterMe: {},
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {
        headers: {
          get: () => 'test-agent',
        },
      } as unknown as PayloadRequest,
      response: {} as unknown,
    } as Parameters<CollectionAfterMeHook>[0]
    const result = await afterMeCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if me operation is enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterMe: {
              me: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {
        headers: {
          get: () => 'test-agent',
        },
        user: {
          id: 'id-123',
        },
      },
    } as unknown as Parameters<CollectionAfterMeHook>[0]
    const result = await afterMeCollectionLogBuilder(mockArgs)
    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'me',
      collection: 'users',
      hook: 'afterMe',
      timestamp: expect.any(Date),
      user: 'id-123',
      userAgent: 'test-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            beforeValidate: {
              create: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {
        headers: {
          get: () => 'test-agent',
        },
        user: {
          id: 'id-123',
        },
      },
    } as unknown as Parameters<CollectionAfterMeHook>[0]
    const result = await afterMeCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
