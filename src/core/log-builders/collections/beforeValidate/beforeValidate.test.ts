import { emitEvent } from 'src/core/events/emitter.js'
import beforeValidateCollectionLogBuilder from 'src/core/log-builders/collections/beforeValidate/beforeValidate.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeValidate collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('create operation', () => {
    it('should not log if create hook is disabled', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                create: { enabled: false },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: null,
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user123' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if create hook is enabled', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                create: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: null,
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user123' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'create',
          collection: 'posts',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'user123',
          userAgent: 'Mozilla/5.0',
        }),
      )
    })

    it('should log as "anonymous" if user is not defined', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                create: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: null,
        req: {
          headers: { get: () => 'Chrome/91' },
          user: null,
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'create',
          collection: 'posts',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'anonymous',
          userAgent: 'Chrome/91',
        }),
      )
    })

    it('should handle missing user-agent gracefully', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                create: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: null,
        req: {
          headers: { get: () => null },
          user: { id: 'user123' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'create',
          collection: 'posts',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'user123',
          userAgent: 'unknown',
        }),
      )
    })
  })
  describe('update operation', () => {
    it('should not log if update hook is disabled', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                update: { enabled: false },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: 'doc123' },
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user123' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if update hook is enabled', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                update: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: 'doc123' },
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user456' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'update',
          collection: 'posts',
          documentId: 'doc123',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'user456',
          userAgent: 'Mozilla/5.0',
        }),
      )
    })

    it('should log as "anonymous" if user is not defined', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                update: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: 'doc456' },
        req: {
          headers: { get: () => 'Edge/90' },
          user: null,
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'update',
          collection: 'posts',
          documentId: 'doc456',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'anonymous',
          userAgent: 'Edge/90',
        }),
      )
    })

    it('should handle missing user-agent gracefully', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeValidate: {
                update: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: 'doc789' },
        req: {
          headers: { get: () => null },
          user: { id: 'user789' },
        },
      }

      beforeValidateCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'update',
          collection: 'posts',
          documentId: 'doc789',
          hook: 'beforeValidate',
          timestamp: expect.any(Date),
          user: 'user789',
          userAgent: 'unknown',
        }),
      )
    })
  })
})
