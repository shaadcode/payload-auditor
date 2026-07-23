/* eslint-disable no-console */

import type { LiteralUnion } from 'type-fest';

import type { GlobalHooksKeys } from '../types/global.js';
import type { CollectionHooksKeys, CollectionHooksOperation } from '../types/collection.js';

type Params = {
  title: LiteralUnion<CollectionHooksKeys | GlobalHooksKeys, string>;
  subtitle: LiteralUnion<CollectionHooksOperation | CollectionHooksOperation, string>;
  data: Record<string, any>;
};

export const prettyDebugLog = (params: Params) => {
  if (!params.data || Object.keys(params.data).length === 0) {
    console.log('%cNo data to display', 'color: #888; font-style: italic;');
  }
  else {
    console.log('-----------------------------------------');
    console.log(`| %c🔍 Debug Log - ${params.title} ${params.subtitle && `[${params.subtitle}]`} |`);
    console.log('-----------------------------------------');
    for (const [key, value] of Object.entries(params.data)) {
      console.log(`|- %c${key}:`, 'color: #666; font-weight: 600;', value);
    }
    console.log('-------------------------------------------');
  }
};
