import type { RequestContext } from 'next/dist/server/base-server.js'
import type { CollectionAfterLogoutHook, SanitizedCollectionConfig } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterLogoutCollectionLogBuilder from 'src/core/log-builders/collections/afterLogout/afterLogout.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterLogout collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if logout operation is not enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogout: {
              logout: {
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
      },
    } as unknown as Parameters<CollectionAfterLogoutHook>[0]
    const result = await afterLogoutCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should not log if logout operation is not defined', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogout: {},
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      req: {
        headers: {
          get: () => 'test-agent',
        },
      },
    } as unknown as Parameters<CollectionAfterLogoutHook>[0]
    const result = await afterLogoutCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if login operation is enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogout: {
              logout: {
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
    } as unknown as Parameters<CollectionAfterLogoutHook>[0]
    const result = await afterLogoutCollectionLogBuilder(mockArgs)
    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'logout',
      collection: 'users',
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
    } as unknown as Parameters<CollectionAfterLogoutHook>[0]
    const result = await afterLogoutCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
