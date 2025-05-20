import type { CollectionConfig } from 'payload'

import type { AuditHookOperationType } from '../types/pluginOptions.js'
import type { hookTypes } from './../pluginUtils/configHelpers.js'

import { defaultCollectionValues } from '../Constant/Constant.js'

export type AuditorLog = {
  collection: string
  documentId?: string
  hook: (typeof hookTypes)[number]
  operation: AuditHookOperationType
  timestamp: Date
  type: 'audit' | 'debug' | 'error' | 'info' | 'security' | 'unknown' | 'warning'
  user: unknown
  userAgent?: string
}

const auditor: CollectionConfig = {
  slug: defaultCollectionValues.slug,
  admin: {
    defaultColumns: ['operation', 'type', 'collection', 'user', 'timestamp'],
    useAsTitle: 'operation',
  },
  fields: [
    {
      name: 'operation',
      type: 'text',
      required: true,
    },
    {
      name: 'collection',
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
}

export default auditor
