import type { CollectionConfig } from 'payload'

import { anyone } from 'helpers/access/anyone.js'
import { authenticated } from 'helpers/access/authenticated.js'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
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
}
