import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import afterRefreshCollectionLogBuilder from './../../../../core/log-builders/collections/afterRefresh/afterRefresh.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
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
    const log: AuditorLog = {
      type: 'info',
      collection: 'sessions',
      hook: 'afterRefresh',
      operation: 'refresh',
      timestamp: expect.any(Date),
      user: 'user123',
      userAgent: 'firefox',
    }

    afterRefreshCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
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
