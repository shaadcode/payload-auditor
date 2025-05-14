import type { RequestContext } from 'next/dist/server/base-server.js'
import type { CollectionAfterForgotPasswordHook, SanitizedCollectionConfig } from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterForgotPasswordCollectionLogBuilder from 'src/core/log-builders/collections/afterForgotPassword/afterForgotPassword.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterForgotPassword collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if forgot password operation is not enabled', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterForgotPassword: {
              forgotPassword: {
                enabled: false,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
    } as Parameters<CollectionAfterForgotPasswordHook>[0]
    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })

  it('Should log if forgot password operation is enabled', async () => {
    const mockArgs = {
      args: {
        data: {
          email: 'test@example.com',
        },
        req: {
          headers: {
            get: vi.fn().mockReturnValue('test-agent'),
          },
          payload: {
            find: vi.fn().mockResolvedValue({
              docs: [{ id: 'userId' }],
            }),
          },
        },
      },
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterForgotPassword: {
              forgotPassword: {
                enabled: true,
              },
            },
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
    } as Parameters<CollectionAfterForgotPasswordHook>[0]
    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      action: 'forgotPassword',
      collection: 'users',
      hook: 'afterForgotPassword',
      timestamp: expect.any(Date),
      user: 'userId',
      userAgent: 'test-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = {
      args: {},
      collection: {
        slug: 'users',
      } as SanitizedCollectionConfig,
      context: {
        userHookConfig: {
          hooks: {
            afterLogin: {},
          },
        } as TrackedCollection,
      } as unknown as RequestContext,
    } as Parameters<CollectionAfterForgotPasswordHook>[0]
    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
