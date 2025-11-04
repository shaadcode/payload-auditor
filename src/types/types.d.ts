import type { RequestContext as OriginalRequestContext } from 'payload';

import type { PluginOptions, TrackedCollection } from './../types/pluginOptions.ts';

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    pluginOptions: PluginOptions;
    userHookConfig?: TrackedCollection;
  }
}
