import type { BasePayload, Config } from 'payload'

import type { TrackedCollection } from './../types/pluginOptions.js'
import type { Duration } from './../utils/toMS.js'

import ActivityLogsCollection from '../collections/activity-logs.js'
import { autoLogCleaner } from '../collections/hooks/beforeChange.js'
import { bufferManager } from '../core/buffer/bufferManager.js'
import { collectionHooks } from '../core/log-builders/index.js'

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
  ActivityLogsCollection.hooks = {
    ...ActivityLogsCollection.hooks,
    beforeChange: [
      ...(ActivityLogsCollection.hooks?.beforeChange || []),
      (args) =>
        autoLogCleaner({
          ...args,
          data: {
            autoDeleteInterval,
          },
        }),
    ],
  }

  return ActivityLogsCollection
}

export const wrapOnInitWithBufferManager = (originalOnInit: Config['onInit']) => {
  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload)
    }
    bufferManager(payload)
  }
}
