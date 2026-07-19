import type { CollectionConfig } from 'payload';

import type { CollectionHooksKeys, CollectionHooksOperation } from '../core/log-builders/collections/logBuilderManager.js';

export interface AuditorLog {
  onCollection: string;
  hook: CollectionHooksKeys;
  operation: CollectionHooksOperation;
  timestamp: Date;
  userAgent?: string;
}

export type TypedRootCollection = typeof auditor;

export const auditor: CollectionConfig = {
  slug: 'Audit-log',
  labels: {
    plural: 'Audit-logs',
    singular: 'Audit-log',
  },
  admin: {
    defaultColumns: ['operation', 'hook', 'onCollection', 'timestamp', 'createdAt'],
    useAsTitle: 'operation',
  },
  fields: [
    {
      name: 'operation',
      type: 'text',
      required: true,
    },
    {
      name: 'onCollection',
      type: 'text',
      required: true,
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
};

export default auditor;
