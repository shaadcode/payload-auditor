/* eslint-disable node/prefer-global/process */
import sharp from 'sharp';
import path from 'node:path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'node:url';
import type { CollectionConfig } from 'payload';
// import { auditorPlugin } from 'payload-auditor';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { navigation } from './globals/Nav.js';
import { media } from './collections/Media.js';
import { users } from './collections/Users.js';
// eslint-disable-next-line antfu/no-import-dist
import { auditorPlugin } from './../dist/index.js';
// import { auditorPlugin } from '../src/index.js';
import { testEmailAdapter } from './helpers/testEmailAdapter.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname;
}

export default buildConfig({
  admin: { importMap: { baseDir: path.resolve(dirname) },

  },
  collections: [media, users],
  globals: [navigation],

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      dbName: 'payload-auditor-db',
      appName: 'payload-auditor-app',
    },
  }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  // plugins
  plugins: [
    auditorPlugin({
      automation: {
        logCleanup: { cronTime: '0/1 * * * *', queueName: 'test', olderThan: 60000 },
      },
      configureRootCollection: (collection) => {
        const newCollection = {
          ...collection,
          fields: [
            ...collection.fields,
            {
              name: 'new-fields',
              type: 'text',
              defaultValue: 'test new fields value',
            },
          ],
        } as CollectionConfig;
        return newCollection;
      },
      globals: {
        track: [
          {
            slug: 'navigation',
            hooks: {
              beforeRead: true,
            },
          },
        ],
      },
      collections: {
        track: [
          {
            slug: 'media',
            hooks: {
              afterOperation: {
                updateByID: {
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
  jobs: {
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.hidden = false;
      return defaultJobsCollection;
    },
  },
});
