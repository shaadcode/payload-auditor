import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import afterReadCollectionLogBuilder from './../../../../core/log-builders/collections/afterRead/afterRead.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterRead collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if read hook is not enabled', () => {
    const mockArgs = {
      collection: { slug: 'posts' },
      context: {
        userHookConfig: {
          hooks: {
            afterRead: {
              read: { enabled: false },
            },
          },
        } as TrackedCollection,
      },
      doc: { id: 'abc123' },
      req: {
        headers: { get: () => 'agent' },
        user: { id: 'user1' },
      },
    }

    afterReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should not log if read hook config is missing', () => {
    const mockArgs = {
      collection: { slug: 'comments' },
      context: {
        userHookConfig: {
          hooks: {
            afterRead: {},
          },
        } as TrackedCollection,
      },
      doc: { id: 'c456' },
      req: {
        headers: { get: () => 'agent' },
        user: { id: 'user2' },
      },
    }

    afterReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should emit log if hook is enabled', () => {
    const mockArgs = {
      collection: { slug: 'articles' },
      context: {
        userHookConfig: {
          hooks: {
            afterRead: {
              read: { enabled: true },
            },
          },
        } as TrackedCollection,
      },
      doc: { id: 'articleId' },
      req: {
        headers: { get: () => 'firefox' },
        user: { id: 'userX' },
      },
    }
    const log: AuditorLog = {
      type: 'info',
      collection: 'articles',
      documentId: 'articleId',
      hook: 'afterRead',
      operation: 'read',
      timestamp: expect.any(Date),
      user: 'userX',
      userAgent: 'firefox',
    }
    afterReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
  })

  it('should default to anonymous user if user is not set', () => {
    const mockArgs = {
      collection: { slug: 'profiles' },
      context: {
        userHookConfig: {
          hooks: {
            afterRead: {
              read: { enabled: true },
            },
          },
        } as TrackedCollection,
      },
      doc: { id: 'userDoc' },
      req: {
        headers: { get: () => 'chrome' },
        user: undefined,
      },
    }

    afterReadCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        user: 'anonymous',
        userAgent: 'chrome',
      }),
    )
  })
})
