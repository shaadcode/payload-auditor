import type { RequestContext } from 'next/dist/server/base-server.js'
import type {
  CollectionAfterErrorHook,
  ErrorResult,
  PayloadRequest,
  SanitizedCollectionConfig,
} from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import afterErrorCollectionLogBuilder from './afterError.js'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterError collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if delete operation is not enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterError: {
              error: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      error: {} as Error,
      graphqlResult: {} as any,
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
      result: {} as ErrorResult,
    } as Parameters<CollectionAfterErrorHook>[0]
    const result = await afterErrorCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if error operation is enabled', async () => {
    const mockArgs = {
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterError: {
              error: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      error: {} as Error,
      graphqlResult: {} as any,
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
      result: {} as ErrorResult,
    } as Parameters<CollectionAfterErrorHook>[0]

    const result = await afterErrorCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      type: 'error',
      action: 'error',
      collection: 'test',
      documentId: 'unknown',
      hook: 'afterError',
      timestamp: expect.any(Date),
      user: 'userId',
      userAgent: 'user-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = {
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterError: {
              error: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      error: {} as Error,
      graphqlResult: {} as any,
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
      result: {} as ErrorResult,
    } as Parameters<CollectionAfterErrorHook>[0]
    const result = await afterErrorCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
