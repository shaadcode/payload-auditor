import type { RequestContext } from 'next/dist/server/base-server.js'
import type { Arguments } from 'node_modules/payload/dist/collections/operations/create.js'
import type {
  CollectionAfterOperationHook,
  PayloadRequest,
  SanitizedCollectionConfig,
} from 'payload'
import type { AuditorLog } from 'src/collections/auditor.js'
import type { TrackedCollection } from 'src/types/pluginOptions.js'

import { emitEvent } from 'src/core/events/emitter.js'
import afterOperationCollectionLogBuilder from 'src/core/log-builders/collections/afterOperation/afterOperation.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/core/events/emitter.js', () => ({
  emitEvent: vi.fn(),
}))

describe('afterOperation collection hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create operation', () => {
    it('Should not log if create operation is not enabled', async () => {
      const mockArgs = {
        args: {} as Arguments<string>,
        collection: {
          slug: 'users',
        } as SanitizedCollectionConfig,
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                create: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'create',
        req: {
          headers: {
            get: () => 'test-agent',
          },
        } as unknown as PayloadRequest,
        response: {} as unknown,
        result: {} as any,
      } as Parameters<CollectionAfterOperationHook>[0]
      await afterOperationCollectionLogBuilder(mockArgs)

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should not log if the input operation was not equal to the create', async () => {
      const mockArgs = {
        args: {} as Arguments<string>,
        collection: {
          slug: 'users',
        } as SanitizedCollectionConfig,
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                create: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'count',
        req: {
          headers: {
            get: () => 'test-agent',
          },
        } as unknown as PayloadRequest,
        response: {} as unknown,
        result: {} as any,
      } as Parameters<CollectionAfterOperationHook>[0]
      await afterOperationCollectionLogBuilder(mockArgs)

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
    it('Should not log if create operation is not defined', async () => {
      const mockArgs = {
        args: {} as Arguments<string>,
        collection: {
          slug: 'users',
        } as SanitizedCollectionConfig,
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'create',
        req: {
          headers: {
            get: () => 'test-agent',
          },
        } as unknown as PayloadRequest,
        response: {} as unknown,
        result: {} as any,
      } as Parameters<CollectionAfterOperationHook>[0]
      await afterOperationCollectionLogBuilder(mockArgs)

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should log if create operation is enabled', async () => {
      const mockArgs = {
        args: {} as Arguments<string>,
        collection: {
          slug: 'users',
        } as SanitizedCollectionConfig,
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                create: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'create',
        req: {
          headers: {
            get: () => 'test-agent',
          },
          user: {
            id: 'userId-132456',
          },
        } as unknown as PayloadRequest,
        response: {} as unknown,
        result: {
          id: 'id-123456',
        } as any,
      } as Parameters<CollectionAfterOperationHook>[0]
      await afterOperationCollectionLogBuilder(mockArgs)
      expect(emitEvent).toHaveBeenCalledTimes(1)

      const expectedLog: AuditorLog = {
        action: 'create',
        collection: 'users',
        documentId: 'id-123456',
        timestamp: expect.any(Date),
        user: 'userId-132456',
        userAgent: 'test-agent',
      }
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })

    it('Should not log, it is wrong when the hook is activated', async () => {
      const mockArgs = {
        args: {} as Arguments<string>,
        collection: {
          slug: 'users',
        } as SanitizedCollectionConfig,
        context: {
          userHookConfig: {
            hooks: {
              afterLogin: {
                login: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'create',
        req: {
          headers: {
            get: () => 'test-agent',
          },
        } as unknown as PayloadRequest,
        response: {} as unknown,
        result: {} as any,
      } as Parameters<CollectionAfterOperationHook>[0]
      await afterOperationCollectionLogBuilder(mockArgs)

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
  })

  describe('delete operation', () => {
    it('Should not log if delete operation is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                delete: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'delete',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should not log if the input operation was not equal to the delete', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'count',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
    it('Should not log if delete operation is not defined', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'delete',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should log if delete operation is enabled', async () => {
      const mockArgs = {
        collection: {
          slug: 'posts',
        },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'delete',
        req: {
          headers: {
            get: () => 'test-agent',
          },
          user: { id: 'userId' },
        },
        result: {
          docs: [
            {
              id: 'docId',
            },
            {
              id: 'docId',
            },
            {
              id: 'docId',
            },
          ],
        },
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )
      expect(emitEvent).toHaveBeenCalledTimes(3)

      const expectedLog: AuditorLog = {
        action: 'delete',
        collection: 'posts',
        documentId: 'docId',
        timestamp: expect.any(Date),
        user: 'userId',
        userAgent: 'test-agent',
      }
      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'delete',
          collection: 'posts',
          documentId: 'docId',
          timestamp: expect.any(Date),
          user: 'userId',
          userAgent: 'test-agent',
        }),
      )
    })

    it('Should not log, it is wrong when the hook is activated', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterDelete: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'delete',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
  })

  describe('deleteByID operation', () => {
    it('Should not log if deleteByID operation is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should not log if the input operation was not equal to the deleteByID', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'count',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })
    it('Should not log if deleteByID operation is not defined', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if deleteByID operation is enabled', async () => {
      const mockArgs = {
        collection: {
          slug: 'posts',
        },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
        req: {
          headers: {
            get: () => 'test-agent',
          },
          user: { id: 'userId' },
        },
        result: {
          id: 'docId',
        },
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )
      expect(emitEvent).toHaveBeenCalled()

      const expectedLog: AuditorLog = {
        action: 'deleteByID',
        collection: 'posts',
        documentId: 'docId',
        timestamp: expect.any(Date),
        user: 'userId',
        userAgent: 'test-agent',
      }
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })

    it('Should not log, it is wrong when the hook is activated', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterDelete: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
  })

  describe('deleteByID operation', () => {
    it('Should not log if deleteByID operation is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })

    it('Should not log if the input operation was not equal to the deleteByID', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'count',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })
    it('Should not log if deleteByID operation is not defined', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if deleteByID operation is enabled', async () => {
      const mockArgs = {
        collection: {
          slug: 'posts',
        },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                deleteByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
        req: {
          headers: {
            get: () => 'test-agent',
          },
          user: { id: 'userId' },
        },
        result: {
          id: 'docId',
        },
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )
      expect(emitEvent).toHaveBeenCalled()

      const expectedLog: AuditorLog = {
        action: 'deleteByID',
        collection: 'posts',
        documentId: 'docId',
        timestamp: expect.any(Date),
        user: 'userId',
        userAgent: 'test-agent',
      }
      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })

    it('Should not log, it is wrong when the hook is activated', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterDelete: {
                delete: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'deleteByID',
      }
      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalledTimes(0)
    })
  })
  describe('find operation', () => {
    it('Should not log if find operation is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                find: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'find',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not find', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                find: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'update',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if find config is not defined', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'find',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if find operation is enabled', async () => {
      const mockArgs = {
        collection: {
          slug: 'users',
        },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                find: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'find',
        req: {
          headers: {
            get: () => 'mock-agent',
          },
          user: { id: 'test-user' },
        },
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).toHaveBeenCalled()

      const expectedLog: AuditorLog = {
        action: 'find',
        collection: 'users',
        documentId: 'unknown',
        timestamp: expect.any(Date),
        user: 'test-user',
        userAgent: 'mock-agent',
      }

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })
  })

  describe('findByID operation', () => {
    it('Should not log if findByID operation is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                findByID: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'findByID',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not findByID', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                findByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'update',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if findByID config is not defined', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'findByID',
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if findByID operation is enabled', async () => {
      const mockArgs = {
        collection: {
          slug: 'articles',
        },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                findByID: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'findByID',
        req: {
          headers: {
            get: () => 'my-browser',
          },
          user: { id: 'admin123' },
        },
        result: {
          id: 'abc123',
        },
      }

      await afterOperationCollectionLogBuilder(
        mockArgs as unknown as Parameters<CollectionAfterOperationHook>[0],
      )

      const expectedLog: AuditorLog = {
        action: 'findByID',
        collection: 'articles',
        documentId: 'abc123',
        timestamp: expect.any(Date),
        user: 'admin123',
        userAgent: 'my-browser',
      }

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', expectedLog)
    })
  })
  describe('forgotPassword operation', () => {
    it('Should not log if forgotPassword is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                forgotPassword: {
                  enabled: false,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'forgotPassword',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not forgotPassword', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                forgotPassword: {
                  enabled: true,
                },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'login',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if forgotPassword config is missing', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'forgotPassword',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if forgotPassword is enabled and operation matches', async () => {
      const mockArgs = {
        collection: { slug: 'users' },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                forgotPassword: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'forgotPassword',
        req: {
          headers: { get: () => 'agent' },
          user: { id: 'user123' },
        },
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'forgotPassword',
          collection: 'users',
          documentId: 'unknown',
          user: 'user123',
          userAgent: 'agent',
        }),
      )
    })
  })

  describe('login operation', () => {
    it('Should not log if login is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                login: { enabled: false },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'login',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not login', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                login: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'refresh',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if login config is missing', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'login',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if login is enabled and operation matches', async () => {
      const mockArgs = {
        collection: { slug: 'admins' },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                login: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'login',
        req: {
          headers: { get: () => 'chrome' },
          user: { id: 'admin1' },
        },
        result: {
          user: { id: 'admin1' },
        },
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'login',
          collection: 'admins',
          documentId: 'admin1',
          user: 'admin1',
          userAgent: 'chrome',
        }),
      )
    })
  })

  describe('refresh operation', () => {
    it('Should not log if refresh is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                refresh: { enabled: false },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'refresh',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not refresh', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                refresh: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'login',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if refresh config is missing', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'refresh',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if refresh is enabled and operation matches', async () => {
      const mockArgs = {
        collection: { slug: 'sessions' },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                refresh: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'refresh',
        req: {
          headers: { get: () => 'Mozilla' },
          user: { id: 'ref-user' },
        },
        result: {
          user: { id: 'ref-user' },
        },
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'refresh',
          collection: 'sessions',
          documentId: 'ref-user',
          user: 'ref-user',
          userAgent: 'Mozilla',
        }),
      )
    })
  })

  describe('update operation', () => {
    it('Should not log if update is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                update: { enabled: false },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'update',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not update', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                update: { enabled: true },
              },
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'delete',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if update config is missing', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        } as unknown as RequestContext,
        operation: 'update',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if update is enabled and operation matches', async () => {
      const mockArgs = {
        collection: { slug: 'products' },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                update: { enabled: true },
              },
            },
          } as TrackedCollection,
        },
        operation: 'update',
        req: {
          headers: { get: () => 'agent' },
          user: { id: 'updater' },
        },
        result: {
          docs: [{ id: 'item1' }, { id: 'item2' }],
        },
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledTimes(2)
      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'update',
          collection: 'products',
          documentId: 'item1',
        }),
      )
      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'update',
          collection: 'products',
          documentId: 'item2',
        }),
      )
    })
  })
  describe('updateByID operation', () => {
    it('Should not log if updateByID is not enabled', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                updateByID: { enabled: false },
              },
            },
          } as TrackedCollection,
        },
        operation: 'updateByID',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if operation is not updateByID', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                updateByID: { enabled: true },
              },
            },
          } as TrackedCollection,
        },
        operation: 'create',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should not log if updateByID config is missing', async () => {
      const mockArgs = {
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {},
            },
          } as TrackedCollection,
        },
        operation: 'updateByID',
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)
      expect(emitEvent).not.toHaveBeenCalled()
    })

    it('Should log if updateByID is enabled and operation matches', async () => {
      const mockArgs = {
        collection: { slug: 'articles' },
        context: {
          userHookConfig: {
            hooks: {
              afterOperation: {
                updateByID: { enabled: true },
              },
            },
          } as TrackedCollection,
        },
        operation: 'updateByID',
        req: {
          headers: { get: () => 'Safari' },
          user: { id: 'editor' },
        },
        result: {
          id: 'art123',
        },
      }

      await afterOperationCollectionLogBuilder(mockArgs as any)

      expect(emitEvent).toHaveBeenCalledWith(
        'logGenerated',
        expect.objectContaining({
          action: 'updateByID',
          collection: 'articles',
          documentId: 'art123',
          user: 'editor',
          userAgent: 'Safari',
        }),
      )
    })
  })
})
