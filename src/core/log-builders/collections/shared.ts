import type { PayloadRequest, RequestContext, SanitizedCollectionConfig } from 'payload'

import type { AuditorLog } from './../../../collections/auditor.js'
import type { hookTypes } from './../../../pluginUtils/configHelpers.js'
import type {
  AllCollectionHooks,
  AuditHookOperationType,
  HookOperationConfig,
  HookTrackingOperationMap,
} from './../../../types/pluginOptions.js'

import { emitWrapper } from './helpers/emitWrapper.js'
import { handleDebugMode } from './helpers/handleDebugMode.js'
import { checkOperationEnabled } from './helpers/isOperationEnabled.js'
import { hookHandlers } from './hooks.js'

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
  const pluginOpts = sharedArgs.context.pluginOptions
  const userActivatedHooks = sharedArgs.context.userHookConfig?.hooks
  const userHookConfig = sharedArgs.context.userHookConfig?.hooks?.[sharedArgs.hook]
  const userHookOperationConfig = (
    userHookConfig as Record<AuditHookOperationType, HookOperationConfig<T> | undefined>
  )?.[sharedArgs.operation]
  const isOperationEnabled = checkOperationEnabled<typeof sharedArgs.hook>(
    userHookOperationConfig,
    userHookConfig,
  )

  const baseLog: AuditorLog = {
    type: 'unknown',
    onCollection: sharedArgs.collection.slug,
    documentId: 'unknown',
    hook: sharedArgs.hook,
    operation: sharedArgs.operation,
    timestamp: new Date(),
    user: 'anonymous',
    userAgent: sharedArgs.req.headers.get('user-agent') || 'unknown',
  }

  if (!exceptions({ hookName: sharedArgs.hook, operation: sharedArgs.operation })) {
    handleDebugMode(
      userHookConfig as HookTrackingOperationMap[T],
      userHookOperationConfig,
      baseLog,
      sharedArgs.operation,
    )
  }

  if (isOperationEnabled) {
    // @ts-ignore
    await hookHandlers[sharedArgs.hook](args, sharedArgs, baseLog, {
      pluginOpts,
      userActivatedHooks,
      userHookConfig,
      userHookOperationConfig,
    })
    if (!exceptions({ hookName: sharedArgs.hook, operation: sharedArgs.operation })) {
      await emitWrapper(
        baseLog,
        userHookConfig as HookTrackingOperationMap[T],
        sharedArgs.hook,
        userHookOperationConfig,
        pluginOpts,
        args,
        userActivatedHooks,
      )
    }
  }
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
