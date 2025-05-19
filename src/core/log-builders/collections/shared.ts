import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterErrorHook,
  CollectionAfterForgotPasswordHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterMeHook,
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionAfterRefreshHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeLoginHook,
  CollectionBeforeOperationHook,
  CollectionBeforeReadHook,
  CollectionBeforeValidateHook,
  CollectionMeHook,
  CollectionRefreshHook,
  PayloadRequest,
  RequestContext,
  SanitizedCollectionConfig,
} from 'payload'

import type { AuditorLog } from './../../../collections/auditor.js'
import type { hookTypes } from './../../../pluginUtils/configHelpers.js'
import type {
  AllCollectionHooks,
  AuditHookOperationType,
  HookOperationConfig,
  HookTrackingOperationMap,
} from './../../../types/pluginOptions.js'

import { emitEvent } from './../../../core/events/emitter.js'
import { handleDebugMode } from './helpers/handleDebugMode.js'

export type SharedArgs = {
  collection: SanitizedCollectionConfig
  context: RequestContext
  hook: (typeof hookTypes)[number]
  operation: AuditHookOperationType
  req: PayloadRequest
}

export const sharedLogic = async <T extends keyof AllCollectionHooks>(
  args: Parameters<AllCollectionHooks[T]>[0],
  sharedArgs: SharedArgs,
) => {
  const userHookConfig = sharedArgs.context.userHookConfig?.hooks?.[sharedArgs.hook]
  const userHookOperationConfig = (
    userHookConfig as Record<AuditHookOperationType, HookOperationConfig<T> | undefined>
  )?.[sharedArgs.operation]

  const baseLog: Partial<AuditorLog> = {
    collection: sharedArgs.collection.slug,
    documentId: 'unknown',
    hook: sharedArgs.hook,
    operation: sharedArgs.operation,
    timestamp: new Date(),
    userAgent: sharedArgs.req.headers.get('user-agent') || 'unknown',
  }

  if (!exceptions({ hookName: sharedArgs.hook, operation: sharedArgs.operation })) {
    handleDebugMode(
      userHookConfig,
      userHookOperationConfig,
      baseLog as AuditorLog,
      sharedArgs.operation,
    )
  }

  if (userHookOperationConfig?.enabled) {
    // @ts-ignore
    await hookHandlers[sharedArgs.hook](args, sharedArgs, baseLog, {
      userHookConfig,
      userHookOperationConfig,
    })
    if (!exceptions({ hookName: sharedArgs.hook, operation: sharedArgs.operation })) {
      emitEvent('logGenerated', baseLog)
    }
  }
}

const hookHandlers = {
  afterChange: (
    args: Parameters<CollectionAfterChangeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit'
    baseLog.documentId = args.doc.id
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'

    return args.doc
  },
  afterDelete: (
    args: Parameters<CollectionAfterDeleteHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit'
    baseLog.documentId = args.doc.id
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  afterError: (
    args: Parameters<CollectionAfterErrorHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'error'
    baseLog.documentId = 'unknown'
    baseLog.user = sharedArgs.req?.user?.id || null
  },
  afterForgotPassword: async (
    args: Parameters<CollectionAfterForgotPasswordHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security'
    baseLog.user = 'anonymous'

    const email = args.args.data?.email
    const userDoc = await sharedArgs.req.payload.find({
      collection: sharedArgs.collection.slug,
      limit: 1,
      where: { email: { equals: email } },
    })

    const userId = userDoc?.docs?.[0]?.id
    baseLog.user = userId
  },
  afterLogin: (
    args: Parameters<CollectionAfterLoginHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security'
    baseLog.operation = 'login'
    baseLog.user = args.user.id || 'anonymous'
  },
  afterLogout: (
    args: Parameters<CollectionAfterLogoutHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Omit<AuditorLog, 'collection' | 'hook' | 'operation' | 'timestamp' | 'userAgent'>,
  ) => {
    baseLog.type = 'security'
    baseLog.user = sharedArgs.req.user?.id || 'anonymous'
  },
  afterMe: (
    args: Parameters<CollectionAfterMeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Omit<AuditorLog, 'collection' | 'hook' | 'operation' | 'timestamp' | 'userAgent'>,
  ) => {
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
    baseLog.type = 'info'
  },
  afterOperation: <T extends keyof AllCollectionHooks>(
    args: Parameters<CollectionAfterOperationHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
    data: {
      userHookConfig: HookTrackingOperationMap
      userHookOperationConfig: HookOperationConfig<T>
    },
  ) => {
    baseLog.type = 'audit'
    baseLog.documentId = 'unknown'
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'

    switch (args.operation) {
      case 'create':
      case 'deleteByID':
      case 'findByID':
      case 'updateByID': {
        baseLog.documentId = args.result ? args.result?.id.toString() : 'unknown'

        break
      }
      case 'delete':
      case 'update': {
        if (args.result?.docs?.length) {
          for (const doc of args.result.docs) {
            baseLog.documentId = doc.id.toString()

            handleDebugMode(
              data.userHookConfig,
              data.userHookOperationConfig,
              baseLog as AuditorLog,
              args.operation,
            )
            emitEvent('logGenerated', baseLog)
          }
        }
        break
      }
      case 'login':
      case 'refresh': {
        baseLog.user = args.result.user.id.toString()
        break
      }
    }
  },
  afterRead: (
    args: Parameters<CollectionAfterReadHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info'
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  afterRefresh: (
    args: Parameters<CollectionAfterRefreshHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info'
    baseLog.user = sharedArgs.req.user?.id || 'anonymous'
  },
  beforeChange: (
    args: Parameters<CollectionBeforeChangeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit'
    baseLog.documentId = args.originalDoc?.id
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  beforeDelete: (
    args: Parameters<CollectionBeforeDeleteHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit'
    baseLog.documentId = args.id.toString()
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  beforeLogin: (
    args: Parameters<CollectionBeforeLoginHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security'
    baseLog.user = args.user.id || 'anonymous'
  },
  beforeOperation: async (
    args: Parameters<CollectionBeforeOperationHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit'
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'

    switch (args.operation) {
      case 'create':
      case 'refresh':
      case 'update':
        break
      case 'delete':
        baseLog.documentId = args.args.id ? args.args.id.toString() : 'unknown'
        break
      case 'forgotPassword':
      case 'login': {
        const email = args.args.data?.email
        const result = await args.req.payload.find({
          collection: sharedArgs.collection.slug,
          limit: 1,
          where: { email: { equals: email } },
        })
        const userId = result?.docs?.[0]?.id
        baseLog.user = userId || 'anonymous'
        break
      }
    }
  },
  beforeRead: (
    args: Parameters<CollectionBeforeReadHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info'
    baseLog.documentId = args.doc.id
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  beforeValidate: (
    args: Parameters<CollectionBeforeValidateHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'debug'
    baseLog.documentId = args.operation === 'update' ? args.originalDoc?.id : 'unknown'
    baseLog.user = sharedArgs.req?.user?.id || 'anonymous'
  },
  me: (
    args: Parameters<CollectionMeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info'
    baseLog.user = args.user.id || 'anonymous'
  },
  refresh: (
    args: Parameters<CollectionRefreshHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info'
    baseLog.user = args.user?.id || 'anonymous'
  },
}

type ExceptionsParams<T extends keyof AllCollectionHooks> = {
  hookName: (typeof hookTypes)[number]
  operation: AuditHookOperationType
}

const exceptions = <T extends keyof AllCollectionHooks>(params: ExceptionsParams<T>): boolean => {
  let result: boolean = false
  switch (params.hookName) {
    case 'afterOperation':
      if (params.operation === 'delete' || params.operation === 'update') {
        result = true
      }
      break

    default:
      break
  }
  return result
}
