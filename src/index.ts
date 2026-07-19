import type { Config, Plugin } from 'payload';

import type { PluginConfig } from './types/pluginOptions.js';
import { cleanupLogsTask } from './core/automation/tasks/cleanup/cleanup.js';
import {
  attachCollectionConfig,
  onInitManager,
} from './pluginUtils/configHelpers.js';
/**
 * 📝 The main function of plugin packaging
 *
 *
 * 📌@type {(opts?: PluginOptions) => Plugin}
 *
 * @param opts
 *
 */
export const auditorPlugin
  = (opts: PluginConfig): Plugin =>
    async (incomingConfig: Config): Promise<Config> => {
      const config = { ...incomingConfig };
      if (opts.enabled === false) {
        return config;
      }

      config.collections = attachCollectionConfig(config.collections, opts);

      config.jobs = {
        ...config.jobs,
        tasks: [...(config.jobs?.tasks ?? []), cleanupLogsTask(opts)],
      };

      config.onInit = onInitManager(config, opts);

      return config;
    };
