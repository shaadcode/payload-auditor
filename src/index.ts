import type { Config, Plugin } from 'payload';

import { defaultPluginOpts } from './Constant/Constant.js';
import type { PluginOptions } from './types/pluginOptions.js';
import {
  attachAutomationConfig,
  attachCollectionConfig,
  buildAccessControl,
  OnInitManager,
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
    (incomingConfig: Config): Config => {
      let config = incomingConfig;
      if (opts.enabled === false) {
        return config;
      }
      // Accessibility customization
      // TODO: combine to attachCollectionConfig function
      buildAccessControl(opts);

      config = attachAutomationConfig(config, opts);
      config.collections = attachCollectionConfig(config.collections, opts);
      config.onInit = OnInitManager(config.onInit, opts);

      return config;
    };
