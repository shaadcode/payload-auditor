import { emitEvent } from 'src/core/events/emitter.js'
import beforeDeleteCollectionLogBuilder from 'src/core/log-builders/collections/beforeDelete/beforeDelete.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeDelete collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if delete hook is not enabled', () => {
    const mockArgs = {
      id: '123',
      collection: { slug: 'posts' },
      context: {
        userHookConfig: {
          hooks: {
            beforeDelete: {
              delete: { enabled: false },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'test-agent' },
        user: { id: 'user1' },
      },
    }

    beforeDeleteCollectionLogBuilder(mockArgs as any)
    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log if delete hook is enabled', () => {
    const mockArgs = {
      id: '456',
      collection: { slug: 'comments' },
      context: {
        userHookConfig: {
          hooks: {
            beforeDelete: {
              delete: { enabled: true },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'mozilla' },
        user: { id: 'admin' },
      },
    }

    beforeDeleteCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'delete',
        collection: 'comments',
        documentId: '456',
        hook: 'beforeDelete',
        timestamp: expect.any(Date),
        user: 'admin',
        userAgent: 'mozilla',
      }),
    )
  })

  it('should not log if delete config is missing entirely', () => {
    const mockArgs = {
      id: '789',
      collection: { slug: 'articles' },
      context: {
        userHookConfig: {
          hooks: {
            beforeDelete: {},
          },
        },
      },
      req: {
        headers: { get: () => 'chrome' },
        user: { id: 'userX' },
      },
    }

    beforeDeleteCollectionLogBuilder(mockArgs as any)
    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log with anonymous user if no user exists', () => {
    const mockArgs = {
      id: '101',
      collection: { slug: 'logs' },
      context: {
        userHookConfig: {
          hooks: {
            beforeDelete: {
              delete: { enabled: true },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'safari' },
        user: null,
      },
    }

    beforeDeleteCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        user: 'anonymous',
        userAgent: 'safari',
      }),
    )
  })
})
