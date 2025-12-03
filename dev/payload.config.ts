/* eslint-disable node/prefer-global/process */
import sharp from 'sharp';
import path from 'node:path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'node:url';
import { media } from 'collections/Media.js';
import { users } from 'collections/Users.js';
// import { auditorPlugin } from 'payload-auditor';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

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
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  // plugins
  plugins: [
    auditorPlugin({
      automation: { logCleanup: { cronTime: '*/1 * * * *', queueName: 'test', olderThan: 30000 } },
      collection: {
        configureRootCollection(defaults) {
          return {
            ...defaults,
            slug: 'some-name',
            labels: {
              singular: 'some-name',
              plural: 'some-names',
            },
          };
        },
        trackCollections: [
          {
            slug: 'media',
            hooks: {
              afterOperation: {
                updateByID: { enabled: true },
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
