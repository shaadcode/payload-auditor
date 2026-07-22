import type { Config } from 'payload';

import type { GlobalHooksKeys } from '../../types/global.js';
import type { PluginConfig } from '../../types/pluginOptions.js';
import { logBuilderManager } from '../../core/log-builders/collections/logBuilderManager/logBuilderManager.js';

export const attachGlobalConfig = (
  userGlobalConfig: Config['globals'],
  pluginOpts: PluginConfig,
) => {
  const pluginGlobalsConfig = pluginOpts.globals;
  if (!pluginGlobalsConfig) {
    return userGlobalConfig;
  }

  const trackedGlobals = pluginGlobalsConfig.track ?? [];

  // Attaching Log Builders
  if (trackedGlobals.length) {
    userGlobalConfig = (userGlobalConfig || []).map((global) => {
      const tracked = pluginGlobalsConfig.track.find(
        tc => tc.slug === global.slug,
      );

      if (tracked) {
        global.hooks = global.hooks || {};

        if (tracked?.hooks) {
          for (const hookName in tracked?.hooks) {
            const typedHookName = hookName as GlobalHooksKeys;
            // @ts-expect-error
            global.hooks[typedHookName] = [
              ...(global.hooks[typedHookName] || []),
              // @ts-ignore
              async args => logBuilderManager({
                scopeSlug: 'collection',
                hookArgs: args,
                pluginConfig: pluginOpts,
                targetHookLevelConfig: tracked.hooks?.[typedHookName],
                targetHookName: typedHookName,
                identifier: global.slug,
              }),
            ];
          }
        }
      }

      return global;
    });
  }

  return userGlobalConfig ?? [];
};
