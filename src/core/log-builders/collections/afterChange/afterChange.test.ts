import type { CollectionAfterChangeHook, PayloadRequest, SanitizedCollectionConfig } from 'payload'

import { buildMockArgs } from './../../../../core/log-builders/collections/mockData/args.js'
import { emitEvent } from './../../../events/emitter.js'
// afterChangeCollectionLogBuilder.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { TrackedCollection } from '../../../../types/pluginOptions.js'
import type { AuditorLog } from './../../../../collections/auditor.js'

import afterChangeCollectionLogBuilder from './afterChange.js'

vi.mock('./../../../events/emitter.ts', () => ({
  emitEvent: vi.fn(),
}))

vi.mock('./../helpers/handleDebugMode.js', () => ({
  handleDebugMode: vi.fn(),
}))

describe('afterChange collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create operation', () => {
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
        type: 'audit',
        collection: 'test-collection',
        documentId: '123',
        hook: 'afterChange',
        operation: 'create',
        timestamp: expect.any(Date),
        user: 'user-123',
        userAgent: 'test-user-agent',
      }
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })
    it('Should not be logged if the create operation is not enabled', async () => {
      const mockArgs = buildMockArgs()

      await afterChangeCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
  })

  describe('update operation', () => {
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
        type: 'audit',
        collection: 'test-collection',
        documentId: '123',
        hook: 'afterChange',
        operation: 'update',
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
})
