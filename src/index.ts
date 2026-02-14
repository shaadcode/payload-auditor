import type { Config, Plugin } from 'payload';

import { defaultPluginOpts } from './Constant/Constant.js';
import type { PluginOptions } from './types/pluginOptions.js';
import { cleanupLogsTask } from './core/automation/tasks/cleanup.js';
import {
  attachCollectionConfig,
  buildAccessControl,
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
  = (opts: PluginOptions = defaultPluginOpts): Plugin =>
    async (incomingConfig: Config): Promise<Config> => {
      const config = { ...incomingConfig };
      if (opts.enabled === false) {
        return config;
      }
      // Accessibility customization
      // TODO: combine to attachCollectionConfig function
      buildAccessControl(opts);

      config.collections = attachCollectionConfig(config.collections, opts);
      config.jobs = {
        ...config.jobs,
        tasks: [...(config.jobs?.tasks ?? []), cleanupLogsTask(opts)],
      };
      config.onInit = onInitManager(config, opts);

      return config;
    };
