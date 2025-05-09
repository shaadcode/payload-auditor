import type { RequestContext } from 'next/dist/server/base-server.js'
import type { CollectionAfterDeleteHook, PayloadRequest, SanitizedCollectionConfig } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import afterDeleteCollectionLogBuilder from './afterDelete.js'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterDelete collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if delete operation is not enabled', async () => {
    const mockArgs = {
      id: 'id',
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterDelete: {
              delete: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      doc: { id: 'docId' },
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
    } as Parameters<CollectionAfterDeleteHook>[0]
    const result = await afterDeleteCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if delete operation is enabled', async () => {
    const mockArgs = {
      id: 'id',
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterDelete: {
              delete: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      doc: { id: 'docId' },
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
    } as Parameters<CollectionAfterDeleteHook>[0]

    const result = await afterDeleteCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'delete',
      collection: 'test',
      documentId: 'docId',
      timestamp: expect.any(Date),
      user: 'userId',
      userAgent: 'user-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = {
      id: 'id',
      collection: {
        slug: 'test',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            beforeDelete: {
              delete: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
      doc: { id: 'docId' },
      req: {
        headers: {
          get: () => 'user-agent',
        },
        user: {
          id: 'userId',
        },
      } as unknown as PayloadRequest,
    } as Parameters<CollectionAfterDeleteHook>[0]
    const result = await afterDeleteCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
