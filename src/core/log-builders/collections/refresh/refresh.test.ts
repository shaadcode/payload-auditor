import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import refreshCollectionLogBuilder from './../../../../core/log-builders/collections/refresh/refresh.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
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
    const log: AuditorLog = {
      type: 'info',
      collection: 'users',
      hook: 'refresh',
      operation: 'refresh',
      timestamp: expect.any(Date),
      user: 'user123',
      userAgent: 'Mozilla/5.0',
    }
    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
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
    const log: AuditorLog = {
      type: 'info',
      collection: 'users',
      hook: 'refresh',
      operation: 'refresh',
      timestamp: expect.any(Date),
      user: 'anonymous',
      userAgent: 'Safari',
    }
    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
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
    const log: AuditorLog = {
      type: 'info',
      collection: 'users',
      hook: 'refresh',
      operation: 'refresh',
      timestamp: expect.any(Date),
      user: 'user456',
      userAgent: 'unknown',
    }
    await refreshCollectionLogBuilder({ args: mockArgs, context, user } as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
  })
})
