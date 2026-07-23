import type {
  CollectionConfig,
} from 'payload';

import type { GlobalsTrackConfig } from './global.js';
import type { auditor } from '../collections/auditor.js';
import type { BufferConfig } from '../core/buffer/types.js';
import type { CollectionsTrackConfig } from './collection.js';

export interface AutomationConfig {
  logCleanup?: {
    /**
     * @default 604800000 // 1 week
     */
    olderThan?: number;
    /**
     * @default "payload-auditor-queue"
     */
    queueName?: string;
    /**
     * The cron for scheduling the job.
     *
     * @default '0 3 * * *' // At 03:00 AM
     *
     * @example
     *     ┌───────────── (optional) second (0 - 59)
     *     │ ┌───────────── minute (0 - 59)
     *     │ │ ┌───────────── hour (0 - 23)
     *     │ │ │ ┌───────────── day of the month (1 - 31)
     *     │ │ │ │ ┌───────────── month (1 - 12)
     *     │ │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
     *     │ │ │ │ │ │
     *     │ │ │ │ │ │
     *  - '* 0 * * * *' every hour at minute 0
     *  - '* 0 0 * * *' daily at midnight
     *  - '* 0 0 * * 0' weekly at midnight on Sundays
     *  - '* 0 0 1 * *' monthly at midnight on the 1st day of the month
     *  - '* 0/5 * * * *' every 5 minutes
     *  - '* * * * * *' every second
     */
    cronTime?: string;
  };
}

export interface PluginConfig {
  automation?: AutomationConfig;
  collections?: CollectionsTrackConfig;
  buffer?: BufferConfig;
  configureRootCollection?: (defaults: typeof auditor) => CollectionConfig;
  globals?: GlobalsTrackConfig;
  disabled?: boolean;
}
