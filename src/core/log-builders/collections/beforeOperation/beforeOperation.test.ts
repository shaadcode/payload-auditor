import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import beforeOperationCollectionLogBuilder from './../../../../core/log-builders/collections/beforeOperation/beforeOperation.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeOperation collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('create operation', () => {
    it('should not log if create hook is disabled', async () => {
      const args = { something: 'value' }
      const result = await beforeOperationCollectionLogBuilder({
        args,
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                create: { enabled: false },
              },
            },
          },
        },
        operation: 'create',
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user1' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
      expect(result).toBe(args)
    })

    it('should emit log if create hook is enabled', async () => {
      const args = { some: 'value' }
      const result = await beforeOperationCollectionLogBuilder({
        args,
        collection: { slug: 'articles' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                create: { enabled: true },
              },
            },
          },
        },
        operation: 'create',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user42' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          collection: 'articles',
          hook: 'beforeOperation',
          operation: 'create',
          timestamp: expect.any(Date),
          user: 'user42',
          userAgent: 'Mozilla/5.0',
        }),
      )
      expect(result).toBe(args)
    })

    it('should not log if hook config is missing', async () => {
      const args = {}
      await beforeOperationCollectionLogBuilder({
        args,
        collection: { slug: 'comments' },
        context: {
          userHookConfig: {},
        },
        operation: 'create',
        req: {
          headers: { get: () => 'agent-x' },
          user: { id: 'u001' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should handle missing user or user-agent', async () => {
      const args = {}
      const log: Partial<AuditorLog> = {
        user: 'anonymous',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args,
        collection: { slug: 'files' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                create: { enabled: true },
              },
            },
          },
        },
        operation: 'create',
        req: {
          headers: { get: () => null },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
  describe('delete operation', () => {
    it('should not log if delete hook is disabled', async () => {
      await beforeOperationCollectionLogBuilder({
        args: { id: '123' },
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                delete: { enabled: false },
              },
            },
          },
        },
        operation: 'delete',
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user1' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if delete hook is enabled', async () => {
      const log: AuditorLog = {
        type: 'audit',
        collection: 'files',
        documentId: 'abc123',
        hook: 'beforeOperation',
        operation: 'delete',
        timestamp: expect.any(Date),
        user: 'user42',
        userAgent: 'Mozilla/5.0',
      }
      await beforeOperationCollectionLogBuilder({
        args: { id: 'abc123' },
        collection: { slug: 'files' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                delete: { enabled: true },
              },
            },
          },
        },
        operation: 'delete',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user42' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should not throw error if documentId is missing', async () => {
      const log: Partial<AuditorLog> = {
        documentId: undefined,
        user: 'anonymous',
        userAgent: 'unknown-agent',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'docs' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                delete: { enabled: true },
              },
            },
          },
        },
        operation: 'delete',
        req: {
          headers: { get: () => 'unknown-agent' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should handle null user-agent and user gracefully', async () => {
      const log: Partial<AuditorLog> = {
        documentId: 'id-test',
        user: 'anonymous',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args: { id: 'id-test' },
        collection: { slug: 'entities' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                delete: { enabled: true },
              },
            },
          },
        },
        operation: 'delete',
        req: {
          headers: { get: () => null },
          user: null,
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
  describe('forgotPassword operation', () => {
    it('should not log if forgotPassword hook is disabled', async () => {
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'test@example.com' },
          req: { payload: { find: vi.fn() } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                forgotPassword: { enabled: false },
              },
            },
          },
        },
        operation: 'forgotPassword',
        req: {
          headers: { get: () => 'agent' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should emit log with user ID if found', async () => {
      const findMock = vi.fn().mockResolvedValue({
        docs: [{ id: 'user-found' }],
      })

      const log: Partial<AuditorLog> = {
        type: 'audit',
        hook: 'beforeOperation',
        operation: 'forgotPassword',
        user: 'user-found',
        userAgent: 'Mozilla/5.0',
      }

      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'me@example.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                forgotPassword: { enabled: true },
              },
            },
          },
        },
        operation: 'forgotPassword',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
        },
      } as any)

      expect(findMock).toHaveBeenCalled()
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should fallback to "anonymous" if user not found', async () => {
      const findMock = vi.fn().mockResolvedValue({ docs: [] })
      const log: Partial<AuditorLog> = {
        type: 'audit',
        user: 'anonymous',
        userAgent: 'CustomAgent',
      }
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'notfound@example.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                forgotPassword: { enabled: true },
              },
            },
          },
        },
        operation: 'forgotPassword',
        req: {
          headers: { get: () => 'CustomAgent' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should handle missing headers and payload.find gracefully', async () => {
      const findMock = vi.fn().mockResolvedValue(undefined)
      const log: Partial<AuditorLog> = {
        type: 'audit',
        user: 'anonymous',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'test@test.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                forgotPassword: { enabled: true },
              },
            },
          },
        },
        operation: 'forgotPassword',
        req: {
          headers: { get: () => null },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
  describe('login operation', () => {
    it('should not log if login hook is disabled', async () => {
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'test@example.com' },
          req: { payload: { find: vi.fn() } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                login: { enabled: false },
              },
            },
          },
        },
        operation: 'login',
        req: {
          headers: { get: () => 'test-agent' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if login hook is enabled and user found', async () => {
      const findMock = vi.fn().mockResolvedValue({
        docs: [{ id: 'user123' }],
      })
      const log: Partial<AuditorLog> = {
        type: 'audit',
        collection: 'users',
        hook: 'beforeOperation',
        operation: 'login',
        timestamp: expect.any(Date),
        user: 'user123',
        userAgent: 'Mozilla/5.0',
      }
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'me@example.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                login: { enabled: true },
              },
            },
          },
        },
        operation: 'login',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
        },
      } as any)

      expect(findMock).toHaveBeenCalled()
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should log as "anonymous" if user not found', async () => {
      const findMock = vi.fn().mockResolvedValue({ docs: [] })
      const log: Partial<AuditorLog> = {
        type: 'audit',
        user: 'anonymous',
        userAgent: 'Chrome/91',
      }
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'notfound@example.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                login: { enabled: true },
              },
            },
          },
        },
        operation: 'login',
        req: {
          headers: { get: () => 'Chrome/91' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should handle missing headers or find gracefully', async () => {
      const findMock = vi.fn().mockResolvedValue(undefined)
      const log: Partial<AuditorLog> = {
        user: 'anonymous',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args: {
          data: { email: 'error@example.com' },
          req: { payload: { find: findMock } },
        },
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                login: { enabled: true },
              },
            },
          },
        },
        operation: 'login',
        req: {
          headers: { get: () => null },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
  describe('refresh operation', () => {
    it('should not log if refresh hook is disabled', async () => {
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'sessions' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                refresh: { enabled: false },
              },
            },
          },
        },
        operation: 'refresh',
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user1' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if refresh hook is enabled', async () => {
      const log: AuditorLog = {
        type: 'audit',
        collection: 'sessions',
        hook: 'beforeOperation',
        operation: 'refresh',
        timestamp: expect.any(Date),
        user: 'user42',
        userAgent: 'Mozilla/5.0',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'sessions' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                refresh: { enabled: true },
              },
            },
          },
        },
        operation: 'refresh',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user42' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should log as "anonymous" if user is not defined', async () => {
      const log: Partial<AuditorLog> = {
        user: 'anonymous',
        userAgent: 'Safari/13.1',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'sessions' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                refresh: { enabled: true },
              },
            },
          },
        },
        operation: 'refresh',
        req: {
          headers: { get: () => 'Safari/13.1' },
          user: null,
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should handle missing user-agent gracefully', async () => {
      const log: Partial<AuditorLog> = {
        user: 'user77',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'sessions' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                refresh: { enabled: true },
              },
            },
          },
        },
        operation: 'refresh',
        req: {
          headers: { get: () => null },
          user: { id: 'user77' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
  describe('update operation', () => {
    it('should not log if update hook is disabled', async () => {
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                update: { enabled: false },
              },
            },
          },
        },
        operation: 'update',
        req: {
          headers: { get: () => 'test-agent' },
          user: { id: 'user123' },
        },
      } as any)

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('should log if update hook is enabled', async () => {
      const log: AuditorLog = {
        type: 'audit',
        collection: 'posts',
        hook: 'beforeOperation',
        operation: 'update',
        timestamp: expect.any(Date),
        user: 'user123',
        userAgent: 'Mozilla/5.0',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                update: { enabled: true },
              },
            },
          },
        },
        operation: 'update',
        req: {
          headers: { get: () => 'Mozilla/5.0' },
          user: { id: 'user123' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should log with null user if user is not defined', async () => {
      const log: Partial<AuditorLog> = {
        user: 'anonymous',
        userAgent: 'Chrome/91',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                update: { enabled: true },
              },
            },
          },
        },
        operation: 'update',
        req: {
          headers: { get: () => 'Chrome/91' },
          user: null,
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })

    it('should handle missing user-agent gracefully', async () => {
      const log: Partial<AuditorLog> = {
        user: 'user456',
        userAgent: 'anonymous',
      }
      await beforeOperationCollectionLogBuilder({
        args: {},
        collection: { slug: 'posts' },
        context: {
          userHookConfig: {
            hooks: {
              beforeOperation: {
                update: { enabled: true },
              },
            },
          },
        },
        operation: 'update',
        req: {
          headers: { get: () => null },
          user: { id: 'user456' },
        },
      } as any)

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
    })
  })
})
