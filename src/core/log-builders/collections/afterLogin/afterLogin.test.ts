import type { RequestContext } from 'next/dist/server/base-server.js'
import type { CollectionAfterLoginHook, SanitizedCollectionConfig } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterLoginCollectionLogBuilder from 'src/core/log-builders/collections/afterLogin/afterLogin.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterLogin collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if login operation is not enabled', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogin: {
              login: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {},
      token: {},
      user: {
        id: 'id-123',
      },
    } as unknown as Parameters<CollectionAfterLoginHook>[0]
    const result = await afterLoginCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should not log if login operation is not defined', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogin: {},
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {},
      token: {},
      user: {
        id: 'id-123',
      },
    } as unknown as Parameters<CollectionAfterLoginHook>[0]
    const result = await afterLoginCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if login operation is enabled', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogin: {
              login: {
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
      },
      token: {},
      user: {
        id: 'id-123',
      },
    } as unknown as Parameters<CollectionAfterLoginHook>[0]
    const result = await afterLoginCollectionLogBuilder(mockArgs)
    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'login',
      collection: 'users',
      hook: 'afterLogin',
      timestamp: expect.any(Date),
      user: 'id-123',
      userAgent: 'test-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterChange: {
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
      },
      token: {},
      user: {
        id: 'id-123',
      },
    } as unknown as Parameters<CollectionAfterLoginHook>[0]
    const result = await afterLoginCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
