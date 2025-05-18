import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import beforeChangeCollectionLogBuilder from './../../../../core/log-builders/collections/beforeChange/beforeChange.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeChange collection hook', () => {
  describe('create operation', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
    it('should not log if create hook is not enabled', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                create: { enabled: false },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: { id: '123' },
        req: { headers: { get: () => 'agent' }, user: { id: 'user1' } },
      }

      beforeChangeCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should not log if operation is not create', () => {
      const mockArgs = {
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                create: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: '123' },
        req: { headers: { get: () => 'agent' }, user: { id: 'user1' } },
      }

      beforeChangeCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if create hook is enabled', () => {
      const mockArgs = {
        collection: { slug: 'articles' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                create: { enabled: true },
              },
            },
          },
        },
        data: { title: 'Test' },
        operation: 'create',
        originalDoc: { id: '321' },
        req: { headers: { get: () => 'firefox' }, user: { id: 'userX' } },
      }
      const log: AuditorLog = {
        type: 'audit',
        collection: 'articles',
        documentId: '321',
        hook: 'beforeChange',
        operation: 'create',
        timestamp: expect.any(Date),
        user: 'userX',
        userAgent: 'firefox',
      }
      beforeChangeCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should log with null user if user is missing', () => {
      const mockArgs = {
        collection: { slug: 'entries' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                create: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: { id: '555' },
        req: { headers: { get: () => 'chrome' }, user: null },
      }

      beforeChangeCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          user: null,
          userAgent: 'chrome',
        }),
      )
    })
  })
  describe('update operation', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
    it('should not log if update hook is not enabled', () => {
      const mockArgs = {
        collection: { slug: 'comments' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                update: { enabled: false },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: '999' },
        req: { headers: { get: () => 'agent' }, user: { id: 'userZ' } },
      }

      beforeChangeCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should not log if operation is not update', () => {
      const mockArgs = {
        collection: { slug: 'comments' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                update: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'create',
        originalDoc: { id: '888' },
        req: { headers: { get: () => 'agent' }, user: { id: 'userZ' } },
      }

      beforeChangeCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if update hook is enabled', () => {
      const mockArgs = {
        collection: { slug: 'settings' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                update: { enabled: true },
              },
            },
          },
        },
        data: { name: 'New Value' },
        operation: 'update',
        originalDoc: { id: '1234' },
        req: { headers: { get: () => 'safari' }, user: { id: 'admin' } },
      }
      const log: AuditorLog = {
        type: 'audit',
        collection: 'settings',
        documentId: '1234',
        hook: 'beforeChange',
        operation: 'update',
        timestamp: expect.any(Date),
        user: 'admin',
        userAgent: 'safari',
      }
      beforeChangeCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should log with null user if user is missing', () => {
      const mockArgs = {
        collection: { slug: 'info' },
        context: {
          userHookConfig: {
            hooks: {
              beforeChange: {
                update: { enabled: true },
              },
            },
          },
        },
        data: {},
        operation: 'update',
        originalDoc: { id: '0001' },
        req: { headers: { get: () => 'opera' }, user: null },
      }
      const log: Partial<AuditorLog> = {
        user: null,
        userAgent: 'opera',
      }
      beforeChangeCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
})
