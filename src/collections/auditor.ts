import type { CollectionConfig } from 'payload';

import { defaultCollectionValues } from '../Constant/Constant.js';
import type { hookTypes } from './../pluginUtils/configHelpers.js';
import type { AuditHookOperationType } from '../types/pluginOptions.js';

export interface AuditorLog {
  onCollection: string;
  documentId?: string;
  hook: (typeof hookTypes)[number];
  operation: AuditHookOperationType;
  timestamp: Date;
  type: 'audit' | 'debug' | 'error' | 'info' | 'security' | 'unknown' | 'warning';
  user: unknown;
  userAgent?: string;
}

export type TypedRootCollection = typeof auditor;

export const auditor: CollectionConfig = {
  slug: defaultCollectionValues.slug,
  access: {
    admin: () => false,
    create: () => false,
    delete: () => false,
    read: () => false,
    readVersions: () => false,
    unlock: () => false,
    update: () => false,
  },
  admin: {
    defaultColumns: ['operation', 'type', 'collection', 'user', 'timestamp'],
    useAsTitle: 'type',
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
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
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
      name: 'type',
      type: 'select',
      defaultValue: 'info',
      options: ['info', 'debug', 'warning', 'error', 'audit', 'security', 'unknown'] as Array<
        AuditorLog['type']
      >,
      required: true,
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
  labels: defaultCollectionValues.labels,
  timestamps: false,
};

export default auditor;
