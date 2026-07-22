import type { Config, Plugin } from 'payload';

import { auditor } from './collections/auditor.js';
import type { PluginConfig } from './types/pluginOptions.js';
import { onInitManager } from './pluginUtils/configHelpers.js';
import { cleanupLogsTask } from './core/automation/tasks/cleanup/cleanup.js';
import { attachGlobalConfig } from './pluginUtils/attachGlobalConfig/attachGlobalConfig.js';
import { attachCollectionConfig } from './pluginUtils/attachCollectionConfig/attachCollectionConfig.js';
/**
 * 📝 The main function of plugin packaging
 *
 *
 * 📌@type {(pluginConfig?: PluginConfig) => Plugin}
 *
 * @param pluginConfig
 *
 */
export const auditorPlugin
  = (pluginConfig: PluginConfig): Plugin =>
    async (payloadConfig: Config): Promise<Config> => {
      if (pluginConfig.disabled === true) {
        return payloadConfig;
      }
      const config = { ...payloadConfig };

      const updatedCollection = pluginConfig.configureRootCollection?.(auditor) ?? auditor;

      config.collections = attachCollectionConfig(config.collections, pluginConfig);
      config.globals = attachGlobalConfig(config.globals, pluginConfig);

      config.collections = [
        ...(config?.collections ?? []),
        updatedCollection,
      ];

      config.jobs = {
        ...config.jobs,
        tasks: [
          ...(config.jobs?.tasks ?? []),
          cleanupLogsTask({
            pluginConfig,
            internalCollectionConfig: updatedCollection,
          }),
        ],
      };

      config.onInit = onInitManager({
        payloadConfig: config,
        internalCollectionConfig: updatedCollection,
        pluginConfig,
      });

      return config;
    };
