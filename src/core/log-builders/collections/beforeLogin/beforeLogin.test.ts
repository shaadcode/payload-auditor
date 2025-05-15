import type { AuditorLog } from 'src/collections/auditor.js'

import { emitEvent } from 'src/core/events/emitter.js'
import beforeLoginCollectionLogBuilder from 'src/core/log-builders/collections/beforeLogin/beforeLogin.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('beforeLogin collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should not log if login hook is not enabled', () => {
    const mockArgs = {
      collection: { slug: 'users' },
      context: {
        userHookConfig: {
          hooks: {
            beforeLogin: {
              login: { enabled: false },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'test-agent' },
      },
      user: { id: 'user1' },
    }

    beforeLoginCollectionLogBuilder(mockArgs as any)
    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should log if login hook is enabled', () => {
    const mockArgs = {
      collection: { slug: 'users' },
      context: {
        userHookConfig: {
          hooks: {
            beforeLogin: {
              login: { enabled: true },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'Mozilla/5.0' },
      },
      user: { id: 'user123' },
    }
    const log: AuditorLog = {
      type: 'security',
      action: 'login',
      collection: 'users',
      hook: 'beforeLogin',
      timestamp: expect.any(Date),
      user: 'user123',
      userAgent: 'Mozilla/5.0',
    }
    beforeLoginCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
  })

  it('should not log if login config is missing entirely', () => {
    const mockArgs = {
      collection: { slug: 'accounts' },
      context: {
        userHookConfig: {
          hooks: {
            beforeLogin: {},
          },
        },
      },
      req: {
        headers: { get: () => 'agent-x' },
      },
      user: { id: 'id123' },
    }

    beforeLoginCollectionLogBuilder(mockArgs as any)
    expect(emitEvent).not.toHaveBeenCalled()
  })

  it('should handle null user ID gracefully', () => {
    const mockArgs = {
      collection: { slug: 'customers' },
      context: {
        userHookConfig: {
          hooks: {
            beforeLogin: {
              login: { enabled: true },
            },
          },
        },
      },
      req: {
        headers: { get: () => 'Chrome' },
      },
      user: { id: null },
    }
    const log: Partial<AuditorLog> = {
      user: null,
      userAgent: 'Chrome',
    }
    beforeLoginCollectionLogBuilder(mockArgs as any)

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expect.objectContaining(log))
  })
})
