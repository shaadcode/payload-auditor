import type { TaskConfig } from 'payload';

import auditor from '../../../../collections/auditor.js';
import type { PluginConfig } from '../../../../types/pluginOptions.js';

export const DEFAULT_OLDER_THAN = 604800000; // 1 week
export const DEFAULT_CRON_TIME = '0 3 * * *'; // At 03:00 AM
export const DEFAULT_QUEUE_NAME = 'payload-auditor-queue'; // default queue name
export const CLEANUP_TASK_SLUG = 'cleanup-payload-auditor-log';
export const CLEANUP_TASK_LABEL = 'payload auditor - cleanup logs';

export const cleanupLogsTask = (pluginOptions: PluginConfig): TaskConfig<typeof CLEANUP_TASK_SLUG> => {
  const cronTime = pluginOptions.automation?.logCleanup?.cronTime ?? DEFAULT_CRON_TIME;
  const queueName = pluginOptions.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
  const olderThan = pluginOptions.automation?.logCleanup?.olderThan ?? DEFAULT_OLDER_THAN;
  const collectionSlug
    = pluginOptions.collection?.configureRootCollection?.(auditor).slug ?? 'Audit-log';
  return {
    slug: CLEANUP_TASK_SLUG,
    label: CLEANUP_TASK_LABEL,
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
        req.payload.logger.error(`Error while cleaning old logs — task: ${CLEANUP_TASK_SLUG}`);
      }

      return { output: {} };
    },
  };
};
