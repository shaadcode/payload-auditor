import type { CollectionConfig } from 'payload'

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
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
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
}

export default ActivityLogsCollection
