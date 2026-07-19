import type { BasePayload, Config } from 'payload';

import auditor from '../collections/auditor.js';
import type { PluginConfig } from './../types/pluginOptions.js';
import { bufferManager } from './../core/buffer/bufferManager.js';
import { DEFAULT_QUEUE_NAME } from '../core/automation/tasks/cleanup/cleanup.js';
import { logBuilderManager } from '../core/log-builders/collections/logBuilderManager.js';
import type { CollectionHooksKeys } from '../core/log-builders/collections/logBuilderManager.js';

export const attachCollectionConfig = (
  userCollectionsConfig: Config['collections'],
  pluginOpts: PluginConfig,
) => {
  const pluginCollectionsConfig = pluginOpts.collection;
  if (!pluginCollectionsConfig) {
    return userCollectionsConfig;
  }

  const trackedCollections = pluginCollectionsConfig.track ?? [];

  // Attaching Log Builders
  if (trackedCollections.length) {
    userCollectionsConfig = (userCollectionsConfig || []).map((collection) => {
      const tracked = pluginCollectionsConfig.track.find(
        tc => tc.slug === collection.slug,
      );

      if (tracked && !tracked.disabled) {
        collection.hooks = collection.hooks || {};

        if (tracked.hooks) {
          for (const hookName in tracked?.hooks) {
            const typedHookName = hookName as CollectionHooksKeys;
            // @ts-expect-error
            collection.hooks[typedHookName] = [
              ...(collection.hooks[typedHookName] || []),
              // @ts-ignore
              async args => logBuilderManager({
                collectionSlug: collection.slug,
                hookArgs: args,
                pluginConfig: pluginOpts,
                targetHookLevelConfig: tracked.hooks?.[typedHookName],
                targetHookName: typedHookName,
              }),
            ];
          }
        }
      }

      return collection;
    });
  }

  //  add root collection to payload config
  const rootCollection = pluginCollectionsConfig.configureRootCollection
    ? {
        ...auditor,
        ...pluginCollectionsConfig.configureRootCollection(auditor),
      }
    : auditor;

  userCollectionsConfig = [
    ...(userCollectionsConfig || []),
    rootCollection,
  ];

  // Attaching settings to plugin's internal collection hooks
  return userCollectionsConfig;
};

export const onInitManager = (incomingConfig: Config, pluginOptions: PluginConfig) => {
  const originalOnInit = incomingConfig.onInit;

  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload);
    }

    bufferManager(payload, pluginOptions);

    let autoRun = payload.config.jobs?.autoRun ?? [];
    const queueName = pluginOptions.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
    if (Array.isArray(autoRun)) {
      autoRun = [...(autoRun ?? []), { queue: queueName }];
    }
    else {
      autoRun = [...(await autoRun?.(payload) ?? []), { queue: queueName }];
    }

    payload.config.jobs = {
      ...(payload.config.jobs ?? {}),
      autoRun,
    };
  };
};
