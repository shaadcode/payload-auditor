import { beforeEach, describe, expect, it, vi } from 'vitest'

import { emitEvent } from './../../../../core/events/emitter.js'
import afterOperationCollectionLogBuilder from './../../../../core/log-builders/collections/afterOperation/afterOperation.js'
import { buildMockArgs } from './../../../../core/log-builders/collections/mockData/args.js'
import { handleDebugMode } from './../helpers/handleDebugMode.js'

vi.mock('./../../../events/emitter.ts', () => ({
  emitEvent: vi.fn(),
}))

vi.mock('./../helpers/handleDebugMode.js', () => ({
  handleDebugMode: vi.fn(),
}))

describe('afterOperation collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const singleDocOps = ['create', 'deleteByID', 'updateByID', 'findByID']
  const multiDocOps = ['update', 'delete'] as const
  const authOps = ['login', 'refresh'] as const

  it.each(singleDocOps)(
    'should handle %s operation with single result object',
    async (operation) => {
      const mockArgs = buildMockArgs({
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                create: {
                  enabled: true,
                },
                deleteByID: {
                  enabled: true,
                },
                findByID: {
                  enabled: true,
                },
                updateByID: {
                  enabled: true,
                },
              },
            },
          },
        },
        result: {
          id: 'doc-id-123',
        },
      })
      const finalResult = await afterOperationCollectionLogBuilder({
        ...mockArgs,
        operation,
      } as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          documentId: 'doc-id-123',
          operation,
        }),
      )

      expect(handleDebugMode).toHaveBeenCalled()
      expect(finalResult).toEqual(mockArgs.result)
    },
  )

  it.each(multiDocOps)(
    'should handle %s operation with multiple documents',
    async (operation: (typeof multiDocOps)[number]) => {
      const mockArgs = buildMockArgs({
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                delete: {
                  enabled: true,
                },
                update: {
                  enabled: true,
                },
              },
            },
          },
        },
      })
      const result = {
        docs: [{ id: 'doc1' }, { id: 'doc2' }],
      }

      const finalResult = await afterOperationCollectionLogBuilder({
        ...mockArgs,
        operation,
        result,
      } as any)

      expect(emitEvent).toHaveBeenCalledTimes(2)
      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({ documentId: 'doc1' }),
      )
      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({ documentId: 'doc2' }),
      )

      expect(handleDebugMode).toHaveBeenCalledTimes(2)
      expect(finalResult).toEqual(result)
    },
  )

  it.each(authOps)(
    'should handle %s authentication operation',
    async (operation: (typeof authOps)[number]) => {
      const mockArgs = buildMockArgs({
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                login: {
                  enabled: true,
                },
                refresh: {
                  enabled: true,
                },
              },
            },
          },
        },
        result: {
          user: {
            id: 'auth-user',
          },
        },
      })

      const finalResult = await afterOperationCollectionLogBuilder({
        ...mockArgs,
        operation,
      } as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          operation,
          user: 'auth-user',
        }),
      )

      expect(handleDebugMode).toHaveBeenCalled()
      expect(finalResult).toEqual(mockArgs.result)
    },
  )
})
