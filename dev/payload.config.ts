import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { media } from 'collections/Media.js'
import { users } from 'collections/Users.js'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// import { auditorPlugin } from 'payload-auditor/index.js'
import { auditorPlugin } from '../src/index.js'
import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

export default buildConfig({
  admin: {
    // autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [media, users],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  onInit: async (payload) => {
    await seed(payload)
  },
  // plugins
  plugins: [
    auditorPlugin({
      collection: {
        trackCollections: [
          {
            slug: 'media',
            disabled: false,
            hooks: {
              beforeValidate: {
                create: {
                  enabled: true,
                },
              },
            },
          },
          {
            slug: 'users',
            disabled: false,
            hooks: {
              refresh: {
                refresh: {
                  enabled: true,
                },
              },
            },
          },
        ],
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
