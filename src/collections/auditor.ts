import type { CollectionConfig } from 'payload'
import type { hookTypes } from 'src/pluginUtils/configHelpers.js'

import type { AuditHookOperationType } from '../types/pluginOptions.js'

import { defaultCollectionValues } from '../Constant/Constant.js'
import { autoLogCleaner } from './hooks/beforeChange.js'

export type AuditorLog = {
  action: AuditHookOperationType
  collection: string
  documentId?: string
  hook: (typeof hookTypes)[number]
  timestamp: Date
  type: 'audit' | 'debug' | 'error' | 'info' | 'security' | 'warning'
  user: unknown
  userAgent?: string
}

const auditor: CollectionConfig = {
  slug: defaultCollectionValues.slug,
  admin: {
    defaultColumns: ['action', 'type', 'collection', 'user', 'timestamp'],
    useAsTitle: 'action',
  },
  fields: [
    {
      name: 'action',
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
      options: ['info', 'debug', 'warning', 'error', 'audit', 'security'] as Array<
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
  hooks: {
    beforeChange: [autoLogCleaner],
  },
  labels: defaultCollectionValues.labels,
  timestamps: false,
}

export default auditor
