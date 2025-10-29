/* eslint-disable node/prefer-global/process */
import sharp from 'sharp';
import path from 'node:path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'node:url';
import { media } from 'collections/Media.js';
import { users } from 'collections/Users.js';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// import { auditorPlugin } from '../src/index.js';
// eslint-disable-next-line antfu/no-import-dist
import { auditorPlugin } from './../dist/index.js';
import { testEmailAdapter } from './helpers/testEmailAdapter.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname;
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

  // plugins
  plugins: [
    auditorPlugin({
      collection: {
        buffer: {
          flushStrategy: 'time',
          // time: '1m',
        },
        trackCollections: [
          {
            slug: 'media',
            hooks: {
              afterOperation: {
                create: {
                  enabled: true,
                },
                update: {
                  enabled: true,
                },
                delete: {
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
});
