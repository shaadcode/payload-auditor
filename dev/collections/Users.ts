import type { CollectionConfig } from 'payload';

export const users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: ['admin', 'user', 'test', 'orbital'],
      required: true,
      saveToJWT: true,
    },
  ],
};
