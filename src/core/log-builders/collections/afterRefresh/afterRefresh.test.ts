import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterRefreshCollectionLogBuilder from 'src/core/log-builders/collections/afterRefresh/afterRefresh.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterRefresh collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if refresh hook is not enabled', () => {
    const mockArgs = {
      collection: { slug: 'users' },
      context: {
        userHookConfig: {
          hooks: {
            afterRefresh: {
              refresh: { enabled: false },
            },
          },
        } as TrackedCollection,
      },
      req: {
        headers: { get: () => 'chrome' },
        user: { id: 'user1' },
      },
    }

    afterRefreshCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should not log if refresh config is missing', () => {
    const mockArgs = {
      collection: { slug: 'accounts' },
      context: {
        userHookConfig: {
          hooks: {
            afterRefresh: {},
          },
        } as TrackedCollection,
      },
      req: {
        headers: { get: () => 'chrome' },
        user: { id: 'user2' },
      },
    }

    afterRefreshCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should emit log if refresh hook is enabled', () => {
    const mockArgs = {
      collection: { slug: 'sessions' },
      context: {
        userHookConfig: {
          hooks: {
            afterRefresh: {
              refresh: { enabled: true },
            },
          },
        } as TrackedCollection,
      },
      req: {
        headers: { get: () => 'firefox' },
        user: { id: 'user123' },
      },
    }

    afterRefreshCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'refresh',
        collection: 'sessions',
        hook: 'afterRefresh',
        timestamp: expect.any(Date),
        user: 'user123',
        userAgent: 'firefox',
      }),
    )
  })

  it('should log with null user if user is not set', () => {
    const mockArgs = {
      collection: { slug: 'tokens' },
      context: {
        userHookConfig: {
          hooks: {
            afterRefresh: {
              refresh: { enabled: true },
            },
          },
        } as TrackedCollection,
      },
      req: {
        headers: { get: () => 'safari' },
        user: null,
      },
    }

    afterRefreshCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        user: null,
        userAgent: 'safari',
      }),
    )
  })
})
