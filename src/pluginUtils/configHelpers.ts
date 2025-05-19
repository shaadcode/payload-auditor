import type { Access, BasePayload, Config } from 'payload'

import type {
  AllCollectionHooks,
  CollectionConfig,
  PluginOptions,
} from './../types/pluginOptions.js'

import auditor from '../collections/auditor.js'
import { bufferManager } from '../core/buffer/bufferManager.js'
import { autoLogCleaner } from './../collections/hooks/beforeChange.js'
import { cleanupStrategies } from './../Constant/automation.js'
import { hookMap } from './../Constant/Constant.js'

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

export const attachCollectionConfig = (
  userCollectionsConfig: Config['collections'],
  pluginCollectionsConfig: CollectionConfig | undefined,
) => {
  if (!pluginCollectionsConfig) {
    return userCollectionsConfig
  }

  // Attaching label
  if (pluginCollectionsConfig.labels) {
    auditor.labels = pluginCollectionsConfig.labels
  }

  // Attach Slug
  if (pluginCollectionsConfig.slug && pluginCollectionsConfig.slug.length > 0) {
    auditor.slug = pluginCollectionsConfig.slug
  }

  // Attaching Log Builders
  if (
    pluginCollectionsConfig.trackCollections &&
    pluginCollectionsConfig.trackCollections.length > 0
  ) {
    userCollectionsConfig = (userCollectionsConfig || []).map((collection) => {
      const tracked = pluginCollectionsConfig.trackCollections.find(
        (tc) => tc.slug === collection.slug,
      )

      if (tracked && !tracked.disabled) {
        collection.hooks = collection.hooks || {}

        if (tracked.hooks) {
          for (const hookName in tracked.hooks) {
            const typedHookName = hookName as keyof AllCollectionHooks
            // @ts-ignore
            collection.hooks[typedHookName] = [
              ...(collection.hooks[typedHookName] || []),
              async (args: any) =>
                await hookMap[typedHookName]({
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
    userCollectionsConfig = [...userCollectionsConfig, auditor]
  }

  // Attaching settings to plugin's internal collection hooks
  // ...

  return userCollectionsConfig
}

export const attachAutomationConfig = (
  incomingConfig: Config,
  pluginOpts: PluginOptions,
): Config => {
  // if (pluginOpts.automation?.logCleanup.disabled) {
  //   return incomingConfig
  // } else

  auditor.hooks = {
    ...auditor.hooks,
    beforeChange: [
      ...(auditor.hooks?.beforeChange || []),
      (args) =>
        autoLogCleaner({
          ...args,
          context: {
            pluginOptions: pluginOpts,
          },
          data: {
            olderThan:
              pluginOpts.automation?.logCleanup?.strategy?.olderThan ??
              cleanupStrategies.manual.olderThan,
          },
        }),
    ],
  }

  // incomingConfig.collections = [...(incomingConfig.collections || []), auditor]
  return incomingConfig

  // if (!incomingConfig.jobs) {
  //   incomingConfig.jobs = {} as JobsConfig
  // }
  // const existingAutoRun = incomingConfig.jobs?.autoRun

  // // log cleanup values
  // const logCleanupScheduleCron: string =
  //   pluginOpts.automation?.logCleanup.schedule?.cron ??
  //   defaultAutomationValues?.logCleanup.schedule.cron
  // const logCleanupScheduleLimit: number =
  //   pluginOpts.automation?.logCleanup.schedule?.limit ??
  //   defaultAutomationValues.logCleanup.schedule.limit
  // const logCleanupScheduleQueue: string =
  //   pluginOpts.automation?.logCleanup.schedule?.queue ??
  //   defaultAutomationValues.logCleanup.schedule.queue

  // incomingConfig.jobs = {
  //   ...incomingConfig,

  //   // add plugin tasks
  //   tasks: [...(incomingConfig.jobs.tasks || []), deleteOldLogTask(pluginOpts)],
  // }

  // // create plugin auto run
  // incomingConfig.jobs.autoRun = async (payload) => {
  //   // It is possible that autoRun is a function
  //   const previous =
  //     typeof existingAutoRun === 'function' ? await existingAutoRun(payload) : existingAutoRun || []
  //   return [
  //     ...previous,
  //     {
  //       cron: logCleanupScheduleCron,
  //       limit: logCleanupScheduleLimit,
  //       queue: logCleanupScheduleQueue,
  //     },
  //   ]
  // }

  // return incomingConfig
}

export const OnInitManager = (originalOnInit: Config['onInit'], pluginOpts: PluginOptions) => {
  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload)
    }

    bufferManager(payload, pluginOpts)

    // add jobs
    // await payload.jobs.queue({
    //   input: {
    //     slug: 'mojtaba',
    //     olderThan: '313m',
    //     pluginOpts,
    //   },
    //   queue:
    //     pluginOpts.automation?.logCleanup.schedule?.queue ??
    //     defaultAutomationValues.logCleanup.schedule.queue,
    //   task: pluginOpts.automation?.logCleanup.taskConfig?.slug ?? defaultCleanupTaskValues.slug,
    // })
  }
}
