import type { RequestContext } from 'next/dist/server/base-server.js'
import type { PayloadRequest, SanitizedCollectionConfig } from 'payload'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import afterDeleteCollectionLogBuilder from './afterDelete.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
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
    } as any
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
    } as any

    const result = await afterDeleteCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      type: 'audit',
      collection: 'test',
      documentId: 'docId',
      hook: 'afterDelete',
      operation: 'delete',
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
    } as any
    const result = await afterDeleteCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
