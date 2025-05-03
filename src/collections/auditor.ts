import type { CollectionConfig } from 'payload'

import type { AuditHookOperationType } from '../types/pluginOptions.js'

import { defaultCollectionValues } from '../Constant/Constant.js'
import { autoLogCleaner } from './hooks/beforeChange.js'

export type ActivityLog = {
  action: AuditHookOperationType
  collection: string
  documentId?: string
  timestamp: Date
  user: unknown
  userAgent?: string
}

const auditor: CollectionConfig = {
  slug: defaultCollectionValues.slug,
  admin: {
    defaultColumns: ['action', 'collection', 'user', 'timestamp'],
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
  timestamps: false,
}

export default auditor
