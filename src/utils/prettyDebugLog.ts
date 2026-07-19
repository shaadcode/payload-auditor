/* eslint-disable no-console */

import type { LiteralUnion } from 'type-fest';

import type { CollectionHooksKeys, CollectionHooksOperation } from '../core/log-builders/collections/logBuilderManager.js';

export const prettyDebugLog = (
  title: LiteralUnion<CollectionHooksKeys, string>,
  subtitle: LiteralUnion<CollectionHooksOperation, string>,
  data: Record<string, any>,
  type: 'manual' | 'table' = 'table',
) => {
  if (!data || Object.keys(data).length === 0) {
    console.log('%cNo data to display', 'color: #888; font-style: italic;');
  }
  else {
    if (type === 'table') {
      console.groupCollapsed(
        `| %c🔍 Debug Log - ${title} [${subtitle}]`,
        'color: #007acc; font-weight: bold; font-size: 14px;',
      );
      console.table(data);
      console.groupEnd();
    }
    else if (type === 'manual') {
      console.log('-----------------------------------------');
      console.log(`| %c🔍 Debug Log - ${title} ${subtitle && `[${subtitle}]`} |`);
      console.log('-----------------------------------------');
      for (const [key, value] of Object.entries(data)) {
        console.log(`|- %c${key}:`, 'color: #666; font-weight: 600;', value);
      }
      console.log('-------------------------------------------');
    }
  }
};
