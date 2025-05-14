import { emitEvent } from 'src/core/events/emitter.js'
import beforeReadCollectionLogBuilder from 'src/core/log-builders/collections/beforeRead/beforeRead.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeRead collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if read hook is disabled', () => {
    const mockArgs = {
      collection: { slug: 'posts' },
      context: {
        userHookConfig: {
          hooks: {
            beforeRead: {
              read: { enabled: false },
            },
          },
        },
      },
      doc: { id: 'doc123' },
      query: {},
      req: {
        headers: { get: () => 'test-agent' },
        user: { id: 'user1' },
      },
    }

    beforeReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log if read hook is enabled', () => {
    const mockArgs = {
      collection: { slug: 'posts' },
      context: {
        userHookConfig: {
          hooks: {
            beforeRead: {
              read: { enabled: true },
            },
          },
        },
      },
      doc: { id: 'doc123' },
      query: {},
      req: {
        headers: { get: () => 'Mozilla/5.0' },
        user: { id: 'user123' },
      },
    }

    beforeReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'read',
        collection: 'posts',
        documentId: 'doc123',
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
            beforeRead: {
              read: { enabled: true },
            },
          },
        },
      },
      doc: { id: 'doc456' },
      query: {},
      req: {
        headers: { get: () => 'Chrome/91' },
        user: null,
      },
    }

    beforeReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'read',
        collection: 'posts',
        documentId: 'doc456',
        timestamp: expect.any(Date),
        user: null,
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
            beforeRead: {
              read: { enabled: true },
            },
          },
        },
      },
      doc: { id: 'doc789' },
      query: {},
      req: {
        headers: { get: () => null },
        user: { id: 'user456' },
      },
    }

    beforeReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'read',
        collection: 'posts',
        documentId: 'doc789',
        hook: 'beforeRead',
        timestamp: expect.any(Date),
        user: 'user456',
        userAgent: 'unknown',
      }),
    )
  })
})
