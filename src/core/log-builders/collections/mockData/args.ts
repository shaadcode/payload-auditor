import { vi } from 'vitest'

import type {
  AuditHookOperationType,
  TrackedCollection,
} from './../../../../types/pluginOptions.js'

type Args = {
  args: object
  collection: {
    slug: string
  }
  context: {
    userHookConfig: Pick<TrackedCollection, 'hooks'>
  }
  doc: {
    id: string
  }
  operation: AuditHookOperationType
  req: {
    headers: {
      get: () => null | string
    }
  }
  result: {
    id?: string
    user?: {
      id?: string
    }
  }
  user?: {
    id?: string
  }
}

export const buildMockArgs = (overrides: Partial<Args> = {}) => {
  return {
    args: {
      req: {
        headers: {
          get: vi.fn(() => 'test-agent'),
        },
      },
    },
    collection: { slug: 'users' },
    context: {
      userHookConfig: {
        hooks: {
          afterOperation: {
            create: { enabled: true },
          },
        },
      },
    },
    doc: {
      id: 'doc-123',
    },
    operation: 'create',
    req: {
      headers: {
        get: vi.fn(() => 'test-agent'),
      },
    },
    response: {},
    result: {
      id: 'id-123456',
      user: { id: 'userId-123' },
    },
    user: {
      id: 'user-123',
    },
    ...overrides, // allow custom overrides
  }
}
