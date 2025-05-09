import { emitEvent } from 'src/core/events/emitter.js'
import refreshCollectionLogBuilder from 'src/core/log-builders/collections/refresh/refresh.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('refresh collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if refresh hook is disabled', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'test-agent' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          refresh: {
            refresh: { enabled: false },
          },
        },
      },
    }

    const user = { id: 'user1' }

    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log if refresh hook is enabled', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'Mozilla/5.0' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          refresh: {
            refresh: { enabled: true },
          },
        },
      },
    }

    const user = { id: 'user123' }

    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'refresh',
        collection: 'users',
        timestamp: expect.any(Date),
        user: 'user123',
        userAgent: 'Mozilla/5.0',
      }),
    )
  })

  it('should log with null user if user is not defined', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'Safari' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          refresh: {
            refresh: { enabled: true },
          },
        },
      },
    }

    const user = null

    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'refresh',
        collection: 'users',
        timestamp: expect.any(Date),
        user: null,
        userAgent: 'Safari',
      }),
    )
  })

  it('should handle missing user-agent gracefully', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => null },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          refresh: {
            refresh: { enabled: true },
          },
        },
      },
    }

    const user = { id: 'user456' }

    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'refresh',
        collection: 'users',
        timestamp: expect.any(Date),
        user: 'user456',
        userAgent: 'unknown',
      }),
    )
  })
})
