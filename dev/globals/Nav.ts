import type { GlobalConfig } from 'payload';

export const navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: () => true,
    readVersions: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'nav item name',
    },
    {
      name: 'link',
      type: 'text',
      defaultValue: 'nav item href',
    },
  ],
};
