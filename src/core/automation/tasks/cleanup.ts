import type { TaskConfig } from 'payload';

import auditor from './../../../collections/auditor.js';
import type { PluginOptions } from './../../../types/pluginOptions.js';

const DEFAULT_OLDER_THAN = 604800000; // 1 week
const DEFAULT_CRON = '0 3 * * *'; // At 03:00 AM
export const DEFAULT_QUEUE_NAME = 'payload-auditor-queue'; // default queue name

export const cleanupLogsTask = (pluginOptions: PluginOptions): TaskConfig<'cleanup-payload-auditor-log'> => {
  const cronTime = pluginOptions.automation?.logCleanup?.cronTime ?? DEFAULT_CRON;
  const queueName = pluginOptions.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
  const olderThan = pluginOptions.automation?.logCleanup?.olderThan ?? DEFAULT_OLDER_THAN;
  const collectionSlug
    = pluginOptions.collection?.slug ?? pluginOptions.collection?.configureRootCollection?.(auditor).slug ?? 'Audit-log';
  return {
    slug: 'cleanup-payload-auditor-log',
    label: 'payload auditor - cleanup logs',
    schedule: [{ cron: cronTime, queue: queueName }],
    handler: async ({ req }) => {
      const millisecondsAgo = new Date(Date.now() - olderThan);
      try {
        await req.payload.delete({
          collection: collectionSlug,
          where: { createdAt: { less_than: millisecondsAgo.toISOString() } },
        });
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        req.payload.logger.error(`Error while cleaning old logs — task: "cleanup-payload-auditor-log"`);
      }

      return { output: {} };
    },
  };
};
