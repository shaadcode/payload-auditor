import type { RequestContext } from 'next/dist/server/base-server.js'
import type { SanitizedCollectionConfig } from 'payload'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuditorLog } from './../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'
import afterForgotPasswordCollectionLogBuilder from './../../../../core/log-builders/collections/afterForgotPassword/afterForgotPassword.js'
import { buildMockArgs } from './../../../../core/log-builders/collections/mockData/args.js'

vi.mock('./../../../../core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterForgotPassword collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('Should not log if forgot password operation is not enabled', async () => {
    const mockArgs = buildMockArgs()

    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs as any)

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
    } as any
    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs)

    expect(result).toEqual({})
    expect(emitEvent).toHaveBeenCalledTimes(1)

    const expectedLog: AuditorLog = {
      type: 'security',
      collection: 'users',
      hook: 'afterForgotPassword',
      operation: 'forgotPassword',
      timestamp: expect.any(Date),
      user: 'userId',
      userAgent: 'test-agent',
    }
    expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
  })

  it('Should not log, it is wrong when the hook is activated', async () => {
    const mockArgs = buildMockArgs()

    const result = await afterForgotPasswordCollectionLogBuilder(mockArgs as any)

    expect(result).toEqual({})

    expect(emitEvent).toHaveBeenCalledTimes(0)
  })
})
