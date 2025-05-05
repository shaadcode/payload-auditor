import type { Access, BasePayload, Config } from 'payload'

import type { PluginOptions, TrackedCollection } from './../types/pluginOptions.js'
import type { Duration } from './../utils/toMS.js'

import auditor from '../collections/auditor.js'
import { autoLogCleaner } from '../collections/hooks/beforeChange.js'
import { bufferManager } from '../core/buffer/bufferManager.js'
import { collectionHooks } from '../core/log-builders/index.js'

type AccessOps = 'create' | 'delete' | 'read' | 'update'

type RoleAccessMap = Partial<Record<AccessOps, string[]>>

type CustomAccessMap = Partial<Record<AccessOps, Access>>

export const hookTypes = [
  'beforeOperation',
  'beforeValidate',
  'beforeDelete',
  'beforeChange',
  'beforeRead',
  'afterChange',
  'afterRead',
  'afterDelete',
  'afterOperation',
  'afterError',
  'beforeLogin',
  'afterLogin',
  'afterLogout',
  'afterRefresh',
  'afterMe',
  'afterForgotPassword',
  'refresh',
  'me',
] as const

export const validateAndAttachHooksToCollections = (
  collections: Config['collections'],
  trackCollections: TrackedCollection[],
): Config['collections'] => {
  // const allSlugs = (collections || []).map((c) => c.slug)
  // const invalidSlugs = trackCollections.filter((collection) => !allSlugs.includes(collection.slug))

  // if (invalidSlugs.length > 0) {
  //   console.warn(
  //     `[payload-auditor] The following collection slugs are invalid: ${invalidSlugs.join(', ')}`,
  //   )
  // }

  return (collections || []).map((collection) => {
    const tracked = trackCollections.find((tc) => tc.slug === collection.slug)

    if (tracked && !tracked.disabled) {
      collection.hooks = collection.hooks || {}

      for (const hookType of hookTypes) {
        const opConfigs = tracked.hooks ? tracked.hooks[hookType] : undefined

        if (opConfigs) {
          // @ts-ignore
          collection.hooks[hookType] = [
            ...(collection.hooks[hookType] || []),
            (args: any) =>
              collectionHooks[hookType]({
                ...args,
                context: {
                  userHookConfig: tracked,
                },
              }),
          ]
        }
      }
    }

    return collection
  })
}

export const attachHooksToActivityLogsCollection = (autoDeleteInterval: Duration) => {
  auditor.hooks = {
    ...auditor.hooks,
    beforeChange: [
      ...(auditor.hooks?.beforeChange || []),
      (args) =>
        autoLogCleaner({
          ...args,
          data: {
            autoDeleteInterval,
          },
        }),
    ],
  }

  return auditor
}

export const wrapOnInitWithBufferManager = (
  originalOnInit: Config['onInit'],
  pluginOptions: PluginOptions,
) => {
  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload)
    }
    bufferManager(payload, pluginOptions)
  }
}

export const buildAccessControl = (pluginOpts: PluginOptions) => {
  const roles: RoleAccessMap = pluginOpts?.collection?.Accessibility?.roles ?? {}
  const customAccess: CustomAccessMap = pluginOpts?.collection?.Accessibility?.customAccess ?? {}

  const defaultAccess: Access = ({ req }) => req.user?.role === 'admin'

  const accessOps: AccessOps[] = ['read']

  const access: Partial<Record<(typeof accessOps)[number], Access>> = {}

  accessOps.forEach((op) => {
    if (roles[op] && roles[op].length > 0) {
      access[op] = ({ req }) => roles[op]!.includes(req.user?.role)
    } else if (customAccess[op]) {
      access[op] = customAccess[op]
    } else {
      access[op] = defaultAccess
    }
  })

  auditor.access = access
}
