import { emitEvent } from 'src/core/events/emitter.js'
import meCollectionLogBuilder from 'src/core/log-builders/collections/me/me.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('me collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if me hook is disabled', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'test-agent' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          me: {
            me: { enabled: false },
          },
        },
      },
    }

    const user = { id: 'user1' }

    await meCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log if me hook is enabled', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'Mozilla/5.0' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          me: {
            me: { enabled: true },
          },
        },
      },
    }

    const user = { id: 'user123' }

    await meCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'me',
        collection: 'users',
        timestamp: expect.any(Date),
        user: 'user123',
        userAgent: 'Mozilla/5.0',
      }),
    )
  })

  it('should log as "anonymous" if user id is not defined', async () => {
    const mockArgs = {
      collection: { config: { slug: 'users' } },
      req: {
        headers: { get: () => 'Chrome/91' },
      },
    }

    const context = {
      userHookConfig: {
        hooks: {
          me: {
            me: { enabled: true },
          },
        },
      },
    }

    const user = { id: null }

    await meCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'me',
        collection: 'users',
        timestamp: expect.any(Date),
        user: 'anonymous',
        userAgent: 'Chrome/91',
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
          me: {
            me: { enabled: true },
          },
        },
      },
    }

    const user = { id: 'user456' }

    await meCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith(
      'logGenerated',
      expect.objectContaining({
        action: 'me',
        collection: 'users',
        timestamp: expect.any(Date),
        user: 'user456',
        userAgent: 'unknown',
      }),
    )
  })
})
