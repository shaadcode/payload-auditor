/* eslint-disable node/prefer-global/process */
import sharp from 'sharp';
import path from 'node:path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'node:url';
// import { auditorPlugin } from 'payload-auditor';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { media } from './collections/Media.js';
import { users } from './collections/Users.js';
// import { auditorPlugin } from './../dist/index.js';
import { auditorPlugin } from '../src/index.js';
import { testEmailAdapter } from './helpers/testEmailAdapter.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname;
}

export default buildConfig({
  admin: { importMap: { baseDir: path.resolve(dirname) } },
  collections: [media, users],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '', connectOptions: {
    dbName: 'payload-auditor-db',
    appName: 'payload-auditor-app',
  } }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  // plugins
  plugins: [
    auditorPlugin({
      automation: {
        logCleanup: { cronTime: '*/1 * * * *', queueName: 'test', olderThan: 60000 },
      },
      // customLogger
      collection: {
        track: [
          {
            slug: 'media',

            hooks: {
              // customLogger
              afterOperation: {
                updateByID: true,
              },
              // afterRead: {
              //   enabled: true,
              // },
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
