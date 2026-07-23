import type { CollectionConfig } from 'payload';

import type { GlobalHooksKeys } from '../types/global.js';
import type { CollectionHooksKeys, CollectionHooksOperation } from '../types/collection.js';

export interface AuditorLog {
  scope: 'collection' | 'global' | 'field';
  hook: CollectionHooksKeys | GlobalHooksKeys;
  operation: CollectionHooksOperation;
  timestamp: Date;
  userAgent?: string;
  identifier: string;
}

export type TypedRootCollection = typeof auditor;

export const auditor = {
  slug: 'Audit-log',
  labels: {
    plural: 'Audit-logs',
    singular: 'Audit-log',
  },
  admin: {
    defaultColumns: ['operation', 'hook', 'identifier', 'scope', 'timestamp', 'createdAt'],
    useAsTitle: 'operation',
  },
  fields: [
    {
      name: 'operation',
      type: 'text',
      required: true,
    },
    {
      name: 'identifier',
      type: 'text',
      required: true,
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        {
          value: 'collection',
          label: 'Collection',
        },
        {
          value: 'global',
          label: 'Global',
        },
      ],
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'hook',
      type: 'text',
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
  ],
  timestamps: false,
} as const satisfies CollectionConfig;

export default auditor;
