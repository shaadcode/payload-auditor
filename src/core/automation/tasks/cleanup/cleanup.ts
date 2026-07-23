import type { CollectionConfig, TaskConfig } from 'payload';

import type { PluginConfig } from '../../../../types/config.js';

export const DEFAULT_OLDER_THAN = 604800000; // 1 week
export const DEFAULT_CRON_TIME = '0 3 * * *'; // At 03:00 AM
export const DEFAULT_QUEUE_NAME = 'payload-auditor-queue'; // default queue name
export const CLEANUP_TASK_SLUG = 'cleanup-payload-auditor-log';
export const CLEANUP_TASK_LABEL = 'payload auditor - cleanup logs';

type CleanupLogsTaskParams = {
  pluginConfig: PluginConfig;
  internalCollectionConfig: CollectionConfig;
};
export const cleanupLogsTask = (params: CleanupLogsTaskParams): TaskConfig<typeof CLEANUP_TASK_SLUG> => {
  const cronTime = params.pluginConfig.automation?.logCleanup?.cronTime ?? DEFAULT_CRON_TIME;
  const queueName = params.pluginConfig.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
  const olderThan = params.pluginConfig.automation?.logCleanup?.olderThan ?? DEFAULT_OLDER_THAN;

  return {
    slug: CLEANUP_TASK_SLUG,
    label: CLEANUP_TASK_LABEL,
    schedule: [{ cron: cronTime, queue: queueName }],
    handler: async ({ req }) => {
      const millisecondsAgo = new Date(Date.now() - olderThan);
      try {
        await req.payload.delete({
          collection: params.internalCollectionConfig.slug,
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
