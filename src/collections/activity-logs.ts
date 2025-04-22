import type { CollectionConfig } from 'payload'

import { autoLogCleaner } from './hooks/beforeChange.js'

export type ActivityLog = {
  action: string
  collection: string
  documentId: string
  // ip: string
  // meta: string
  timestamp: Date
  user: unknown
  userAgent: string
}

const ActivityLogsCollection: CollectionConfig = {
  slug: 'activity-logs',
  access: {
    create: () => false,
    delete: () => false,
    read: () => true,
    update: () => false,
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
      name: 'ip',
      type: 'text',
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
    {
      name: 'meta',
      type: 'json',
    },
  ],
  hooks: {
    beforeChange: [autoLogCleaner],
  },
}

export default ActivityLogsCollection
