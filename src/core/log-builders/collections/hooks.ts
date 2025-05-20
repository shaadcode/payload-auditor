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
} from 'payload'

import type { AuditorLog } from './../../../collections/auditor.js'
import type {
  AllCollectionHooks,
  HookOperationConfig,
  HookTrackingOperationMap,
  PluginOptions,
} from './../../../types/pluginOptions.js'
import type { SharedArgs } from './shared.js'

import { emitWrapper } from './helpers/emitWrapper.js'
import { handleDebugMode } from './helpers/handleDebugMode.js'

export const hookHandlers = {
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
  afterOperation: async <T extends keyof AllCollectionHooks>(
    args: Parameters<CollectionAfterOperationHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
    data: {
      pluginOpts: PluginOptions
      userActivatedHooks: Partial<HookTrackingOperationMap> | undefined
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
              data.userHookConfig as HookTrackingOperationMap[T],
              data.userHookOperationConfig,
              baseLog as AuditorLog,
              args.operation,
            )
            await emitWrapper(
              baseLog as AuditorLog,
              data.userHookConfig as HookTrackingOperationMap[T],
              sharedArgs.hook,
              data.userHookOperationConfig,
              data.pluginOpts,
              args,
              data.userActivatedHooks,
            )
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
