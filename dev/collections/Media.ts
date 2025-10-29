import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';
import { anyone } from 'helpers/access/anyone.js';
import { authenticated } from 'helpers/access/authenticated.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
export const media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, 'media'),
  },
};
