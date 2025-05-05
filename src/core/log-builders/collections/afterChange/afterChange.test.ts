import type { CollectionAfterChangeHook, PayloadRequest, SanitizedCollectionConfig } from 'payload'

import { emitEvent } from './../../../events/emitter.js'
// afterChangeCollectionLogBuilder.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TrackedCollection } from '../../../../types/pluginOptions.js'
import type { AuditorLog } from './../../../../collections/auditor.js'

import afterChangeCollectionLogBuilder from './afterChange.js'

// Mock برای emitEvent
vi.mock('./../../../events/emitter.ts', () => ({
  emitEvent: vi.fn(),
}))

describe('afterChange collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Should log if create operation is enabled', async () => {
    const mockDoc = { id: '123' }
    const mockReq = {
      headers: { get: () => 'test-user-agent' },
      user: { id: 'user-123' },
    } as unknown as PayloadRequest
    const mockCollection = {
      slug: 'test-collection',
    } as SanitizedCollectionConfig

    const mockContext = {
      userHookConfig: {
        hooks: {
          afterChange: {
            create: { enabled: true },
          },
        },
      } as TrackedCollection,
    }
    const result = await afterChangeCollectionLogBuilder({
      collection: mockCollection,
      context: mockContext,
      doc: mockDoc,
      operation: 'create',
      req: mockReq,
    } as Parameters<CollectionAfterChangeHook>[0])

    expect(result).toEqual(mockDoc)
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'create',
      collection: 'test-collection',
      documentId: '123',
      timestamp: expect.any(Date),
      user: 'user-123',
      userAgent: 'test-user-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not be logged if the create operation is not enabled', async () => {
    const mockDoc = { id: '123' }
    const mockReq = {
      headers: { get: () => 'test-user-agent' },
      user: { id: 'user-123' },
    } as unknown as PayloadRequest
    const mockCollection = {
      slug: 'test-collection',
    } as SanitizedCollectionConfig
    const mockContext = {
      userHookConfig: {
        hooks: {
          afterChange: {
            create: {
              enabled: false,
            },
          },
        },
      } as TrackedCollection,
    }
    const result = await afterChangeCollectionLogBuilder({
      collection: mockCollection,
      context: mockContext,
      doc: mockDoc,
      operation: 'create',
      req: mockReq,
    } as Parameters<CollectionAfterChangeHook>[0])

    expect(result).toEqual(mockDoc)
    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if update operation is enabled', async () => {
    const mockDoc = { id: '123' }
    const mockReq = {
      headers: { get: () => 'test-user-agent' },
      user: { id: 'user-123' },
    } as unknown as PayloadRequest
    const mockCollection = {
      slug: 'test-collection',
    } as SanitizedCollectionConfig

    const mockContext = {
      userHookConfig: {
        hooks: {
          afterChange: {
            update: { enabled: true },
          },
        },
      } as TrackedCollection,
    }
    const result = await afterChangeCollectionLogBuilder({
      collection: mockCollection,
      context: mockContext,
      doc: mockDoc,
      operation: 'update',
      req: mockReq,
    } as Parameters<CollectionAfterChangeHook>[0])

    expect(result).toEqual(mockDoc)
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'update',
      collection: 'test-collection',
      documentId: '123',
      timestamp: expect.any(Date),
      user: 'user-123',
      userAgent: 'test-user-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not be logged if the update operation is not enabled', async () => {
    const mockDoc = { id: '123' }
    const mockReq = {
      headers: { get: () => 'test-user-agent' },
      user: { id: 'user-123' },
    } as unknown as PayloadRequest
    const mockCollection = {
      slug: 'test-collection',
    } as SanitizedCollectionConfig
    const mockContext = {
      userHookConfig: {
        hooks: {
          afterChange: {
            update: {
              enabled: false,
            },
          },
        },
      } as TrackedCollection,
    }
    const result = await afterChangeCollectionLogBuilder({
      collection: mockCollection,
      context: mockContext,
      doc: mockDoc,
      operation: 'update',
      req: mockReq,
    } as Parameters<CollectionAfterChangeHook>[0])

    expect(result).toEqual(mockDoc)
    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
