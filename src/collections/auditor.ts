import type { CollectionConfig } from 'payload'

import type { AuditHookOperationType } from '../types/pluginOptions.js'

import { defaultCollectionValues } from '../Constant/Constant.js'
import { autoLogCleaner } from './hooks/beforeChange.js'

export type ActivityLog = {
  action: AuditHookOperationType
  collection: string
  documentId: string
  timestamp: Date
  user: unknown
  userAgent: string
}

const ActivityLogsCollection: CollectionConfig = {
  slug: defaultCollectionValues.slug,
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
  },
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
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
  ],
  hooks: {
    beforeChange: [autoLogCleaner],
  },
}

export default ActivityLogsCollection
