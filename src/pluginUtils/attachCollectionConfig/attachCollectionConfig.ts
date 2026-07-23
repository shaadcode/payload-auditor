import type { Config } from 'payload';

import type { PluginConfig } from '../../types/config.js';
import type { CollectionHooksKeys } from '../../types/collection.js';
import { logBuilderManager } from '../../core/log-builders/logBuilderManager/logBuilderManager.js';

export const attachCollectionConfig = (
  userCollectionsConfig: Config['collections'],
  pluginOpts: PluginConfig,
) => {
  const pluginCollectionsConfig = pluginOpts.collections;

  const trackedCollections = pluginCollectionsConfig?.track ?? [];

  // Attaching Log Builders
  if (trackedCollections.length) {
    userCollectionsConfig = (userCollectionsConfig || []).map((collection) => {
      const trackedCollectionConfig = pluginCollectionsConfig?.track.find(
        tc => tc.slug === collection.slug,
      );

      if (trackedCollectionConfig?.hooks) {
        collection.hooks = collection.hooks ?? {};

        for (const hookName in trackedCollectionConfig?.hooks) {
          const typedHookName = hookName as CollectionHooksKeys;
          // @ts-expect-error
          collection.hooks[typedHookName] = [
            ...(collection.hooks?.[typedHookName] || []),
            // @ts-ignore
            async args => logBuilderManager({
              scopeSlug: 'collection',
              hookArgs: args,
              pluginConfig: pluginOpts,
              targetHookLevelConfig: trackedCollectionConfig.hooks?.[typedHookName],
              targetHookName: typedHookName,
              identifier: collection.slug,
            }),
          ];
        }
      }

      return collection;
    });
  }

  return userCollectionsConfig ?? [];
};
