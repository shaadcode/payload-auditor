import type {
  CollectionConfig,
  LabelFunction,
  StaticLabel,
} from 'payload';

import type { BufferConfig } from '../core/buffer/types.js';
import type { AuditorLog } from './../collections/auditor.js';
import type { CollectionHooksKeys } from '../core/log-builders/collections/logBuilderManager.js';

export type PayloadCollectionHooksMap = {
  [K in CollectionHooksKeys]: NonNullable<NonNullable<CollectionConfig['hooks']>[K]>[number]
};

export type HookConfigForTracking = {
  [K in keyof NonNullable<CollectionConfig['hooks']>]:
    Partial<
      {
      // @ts-expect-error
        [O in Parameters<
          NonNullable<
            NonNullable<
              CollectionConfig['hooks']
            >[K]
          >[number]
        >[0]['operation']]: LogConfig | boolean
      } & LogConfig<K>
    > | boolean

};

export interface HookOperationDebugModeConfig {
  /**
   * 📝 How to display debug logs
   *
   * 📖 long.
   *
   * 📌@type {'manual' | 'table'}
   *
   * @default "table"
   *
   * ```
   *
   * ```
   *
   * ---
   *
   * ### ⚠️ Critical Notes
   * - The timeStamp field is not displayed in the table type
   *
   */
  displayType?: 'manual' | 'table';
  /**
   * 📝 Enable or disable debug mode
   *
   * 📖 long.
   *
   * 📌@type {'manual' | 'table'}
   *
   * @default false
   *
   * ```
   *
   * ```
   *
   * ---
   *
   * ### ⚠️ Critical Notes
   * - The timeStamp field is not displayed in the table type
   *
   */
  enabled?: boolean;
  /**
   * 📝 Select the required fields
   *
   * 📖 To reduce confusion, you can log only the fields you need.
   *
   * 📌@type {Partial<Record<keyof AuditorLog, boolean>>}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Only the true field is included in the log</caption>
   * ```ts
   * fields:{
   * type:true
   * }
   * ```
   *
   */
  fields?: Partial<Record<keyof AuditorLog, boolean>>;
}

export interface HookModesConfig {
  /**
   * 📝 Debug mode for better inspection of logging performance
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Enable debug mode</caption>
   * ```ts
   *    debug: {
   * enabled: boolean
   * }
   *
   * ```
   * ### ⚠️ Critical Notes
   * - The generated logs are only displayed in the console and are not stored in the database.
   */
  debug?: HookOperationDebugModeConfig;
}

export interface LogConfig<
  HookName extends CollectionHooksKeys = CollectionHooksKeys,
> {
  /**
   * 📝 Custom log creation at a operation level
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Change the user value for the create operation</caption>
   * ```ts
   *  create: {
   *    customLogger: (args, fields) => {
   *      return { ...fields, user: null }
   *    },
   *    enabled: true,
   *  },
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Only works for the current operation
   * - Has the highest priority in execution
   */
  customLogger?: (
    args: Parameters<PayloadCollectionHooksMap[HookName]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>;
  /**
   * 📝 Specifies whether logging is enabled or disabled for this operation within the hook
   *
   * 📌@type {boolean}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Activating the create operation</caption>
   * ```ts
   *        create: {
   *             enabled: true,
   *           },
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - If the enabled value is not entered, it is considered false.
   *
   */
  enabled?: boolean;

  /**
   * 📝 Auxiliary side modes
   *
   * -
   */
  modes?: HookModesConfig;
}

export interface TrackedCollection {
  /**
   * 📝 Globally disable tracking for this collection
   *
   * 📌@type {boolean}
   *
   * @default undefined
   *
   */
  enabled?: boolean;

  /**
   * 📝 Define payload cms hooks for each collection being tracked
   *
   *
   * 📌@type {Partial<HookTrackingOperationMap>}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Define an afterChange hook for a collection</caption>
   * ```ts
   * hooks: { afterChange: { create: { enabled: true } } }
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Each hook performs only its own operations
   * - Authentication hooks are only triggered when authentication is enabled for the collection
   *
   * Read more:
   * @see {@link https://payloadcms.com/docs/hooks/collections}
   */
  hooks?: (LogConfig & Partial<HookConfigForTracking>) | boolean;
  /** Optional label or description for UI/doc */
  label?: string;

  /**
   * 📝 The original name of your collection for tracking
   *
   * 📌@type {string}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Collection tracking posts</caption>
   * ```ts
   * { slug: 'posts' },
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Make sure the value entered exactly matches the value in your main collection configuration.
   * @see {@link https://payloadcms.com/docs/configuration/collections#config-options}
   */
  slug: string;
}

export interface Localization {
  collection?: {
    fields?: Partial<Record<keyof AuditorLog, LabelFunction | StaticLabel>>;
  };
}
export interface PluginCollectionConfig {
  /**
   * 📝 Buffer management for injecting data into the database
   *
   *
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Data Injection into Database Based on Time</caption>
   * ```ts
   *  buffer: {
   *       flushStrategy: 'time',
   *     }
   * ```
   *
   * ---
   * ## ⚠️ Critical Notes
   * - These settings are very important, to change these settings, consider all aspects including RAM and server power.
   *
   */
  buffer?: BufferConfig;
  /**
   * 📝 Collection main configuration
   *
   *  You can fully customize the entire root collection
   *
   * 📌@type {TypedRootCollection}
   *
   * @default undefined
   *
   * @example <caption>🧪 Rename the slug, add a new field, and change the collection label</caption>
   *
   *```ts
   *         rootCollectionConfig: (defaults) => {
   *       const prevConf = defaults
   *       return {
   *         ...prevConf,
   *         slug: 'new slug',
   *         fields: [
   *           ...prevConf.fields,
   *           {
   *             name: 'product',
   *             type: 'text',
   *           },
   *         ],
   *         labels: {
   *           plural: 'logs',
   *           singular: 'log',
   *         },
   *       }
   *     },
   *```
   * ---
   * ### ⚠️ Critical Notes
   * - Changing collection values requires a lot of testing to make sure everything works correctly
   * - In each property, either change all the values or use the default values of the same property (which is for the plugin itself) in the context, otherwise you will encounter an error
   * ```ts
   *         rootCollectionConfig: (defaults) => {
   *       const prevConf = defaults
   *       return {
   *         ...prevConf,
   *         slug: 'new slug',
   *         hooks:{
   *           ...prevConf.hooks,
   *           // your hooks ...
   *         }
   *       }
   *     },
   * ```
   */
  configureRootCollection?: (defaults?: CollectionConfig) => Partial<CollectionConfig>;
  /**
   * 📝 Collection tracking management
   *
   * 📖 You should define the collections you want to track in this section.
   *  You can specify which hook each collection should use and what operations (within each hook) should generate logs.
   *
   * 📌@type {TrackedCollection[]}
   *
   * @default []
   *
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Track post collections when a new post is created</caption>
   * ```ts
   * trackCollections: [
   *       { slug: 'posts', hooks: { afterChange: { create: { enabled: true } } } },
   *     ],
   * ```
   * @example <caption>🧪 Temporarily disable tracking for a collection</caption>
   * ```ts
   * trackCollections: [
   *  { slug: 'slug', disabled: true, hooks: { afterChange: { create: { enabled: true } } } },
   * ],
   * ```
   * ---
   * ### ⚠️ Critical Notes
   * - To temporarily disable tracking for any collection, you can use the disabled key.
   *
   */
  track: TrackedCollection[];
}

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
  /**
   * 📝 Automatic plugin process management
   *
   *
   * 📌@type {AutomationConfig}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Setting a strategy for the log cleaner</caption>
   * ```
   *
   *   automation:{
   *     logCleanup: {
   *       strategy: "time"
   *     }
   *   }
   *
   *```
   */
  automation?: AutomationConfig;

  /**
   * 📝 Settings related to collections and the collection used by the plugin
   *
   * 📌@type {CollectionConfig}
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Media collection tracking</caption>
   * ```ts
   * trackCollections: [
   *   { slug: 'media', hooks: { afterChange: { update: { enabled: true } } } },
   * ],
   * ```
   *
   * ---
   * #### ⚠️ Critical Notes
   * - If defined, you must also enter the value of trackCollections.
   *
   */
  collection: PluginCollectionConfig;
  /**
   * 📝 Custom log creation at a global level
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Change the userAgent value for all operations</caption>
   * ```ts
   *  customLogger: (args, fields) => {
   *     return { ...fields, userAgent: 'custom user agent' }
   *  }
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Only works for active operations
   * - This function is only executed for all operations and hooks that do not have a dedicated customLogger
   * - It works for both collection hooks and globals hooks
   */
  customLogger?: <HookName extends CollectionHooksKeys>(
    args: Parameters<PayloadCollectionHooksMap[HookName]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>;

  /**
   * 📝 Enable or disable the plugin
   *
   * 📌@type {boolean}
   *
   * @default "true"
   */
  enabled?: boolean;
}
