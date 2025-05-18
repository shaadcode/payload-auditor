import type { Access, HookOperationType, LabelFunction, StaticLabel } from 'payload'

import type { AuditorLog } from './../collections/auditor.js'
import type { Duration } from './../utils/toMS.js'

export type HookStage =
  | 'afterChange'
  | 'afterDelete'
  | 'afterError'
  | 'afterForgotPassword'
  | 'afterLogin'
  | 'afterLogout'
  | 'afterMe'
  | 'afterRead'
  | 'afterRefresh'
  | 'beforeChange'
  | 'beforeDelete'
  | 'beforeLogin'
  | 'beforeOperation'
  | 'beforeRead'
  | 'beforeValidate'
  | 'refresh'

export type AuditHookOperationType =
  | 'deleteByID'
  | 'error'
  | 'find'
  | 'findByID'
  | 'forgotPassword'
  | 'logout'
  | 'me'
  | 'refresh'
  | 'updateByID'
  | HookOperationType

export type HookOperationDebugModeConfig = {
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
  displayType?: 'manual' | 'table'
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
  enabled?: boolean
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
  fields?: Partial<Record<keyof AuditorLog, boolean>>
}

export type HookModesConfig = {
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
  debug?: HookOperationDebugModeConfig
}

export type HookOperationConfig = {
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
  enabled?: boolean
  /**
   * 📝 Auxiliary side modes
   *
   * -
   */
  modes?: HookModesConfig
}

export type HookTrackingOperationMap = {
  afterChange: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig

    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig

    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig
  }
  afterDelete: {
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterError: {
    /**
     * Error operation
     *
     * Triggered when an error occurs during another operation.
     */
    error?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterForgotPassword: {
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterLogin: {
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterLogout: {
    /**
     * Logout operation
     *
     * Triggered when a user logs out.
     */
    logout?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterMe: {
    /**
     * Me operation
     *
     * Triggered when a user fetches their own profile information.
     */
    me?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterOperation: {
    countVersions?: HookOperationConfig
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig
    /**
     * Delete by ID operation
     *
     * Triggered when a specific item is deleted by its ID.
     */
    deleteByID?: HookOperationConfig
    /**
     * Find operation
     *
     * Triggered when items are queried based on specific conditions.
     */
    find?: HookOperationConfig
    /**
     * Find by ID operation
     *
     * Triggered when a specific item is retrieved by its ID.
     */
    findByID?: HookOperationConfig
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Refresh operation
     *
     * Triggered when authentication tokens are refreshed.
     */
    refresh?: HookOperationConfig
    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig

    /**
     * Update by ID operation
     *
     * Triggered when a specific item is updated by its ID.
     */
    updateByID?: HookOperationConfig
  }
  afterRead: {
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Read operation
     *
     * Triggered when data is read.
     */
    read?: HookOperationConfig
  }
  afterRefresh: {
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Refresh operation
     *
     * Triggered when authentication tokens are refreshed.
     */
    refresh?: HookOperationConfig
  }
  beforeChange: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig
  }
  beforeDelete: {
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  beforeLogin: {
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  beforeOperation: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Read operation
     *
     * Triggered when data is read.
     */
    read?: HookOperationConfig
    /**
     * Refresh operation
     *
     * Triggered when authentication tokens are refreshed.
     */
    refresh?: HookOperationConfig
    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig
  }
  beforeRead: {
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Read operation
     *
     * Triggered when data is read.
     */
    read?: HookOperationConfig
  }
  beforeValidate: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig
  }
  me: {
    /**
     * Me operation
     *
     * Triggered when a user fetches their own profile information.
     */
    me: HookOperationConfig
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  refresh: {
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
    /**
     * Refresh operation
     *
     * Triggered when authentication tokens are refreshed.
     */
    refresh?: HookOperationConfig
  }
}

export type TrackedCollection = {
  /**
   * 📝 Globally disable tracking for this collection
   *
   * 📌@type {boolean}
   *
   * @default undefined
   *
   */
  disabled?: boolean
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
  hooks?: Partial<HookTrackingOperationMap>

  /** Optional label or description for UI/doc */
  label?: string

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
  slug: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allowedSlugs = ['activities', 'auditor', 'logger'] as const

export type BufferDebugFields = {
  flushStrategy: boolean
  interval: boolean
  size: boolean
}

export type BufferModesConfig = {
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
  debug?: {
    /**
     * 📝 How to display debug logs
     *
     * 📖 long.
     *
     * 📌@type {'manual' | 'table'}
     *
     * @default "table"
     *
     */
    displayType?: 'manual' | 'table'
    /**
     * 📝 Enable or disable debug mode
     *
     * 📖 long.
     *
     * 📌@type {'manual' | 'table'}
     *
     * @default false
     *
     */
    enabled?: boolean
    /**
     * 📝 Select the required fields
     *
     * 📖 To reduce confusion, you can log only the fields you need.
     *
     * 📌@type {BufferDebugFields}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Only the size field is included in the log</caption>
     * ```ts
     * fields:{
     * size: true
     * }
     * ```
     */
    fields?: Partial<BufferDebugFields>
  }
}

export type BufferConfig = {
  /**
   * 📝 The basics of injecting logs into the database
   *
   *
   *
   * @default "time"
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Data injection based on log count</caption>
   * ```ts
   *  flushStrategy: 'size',
   * ```
   * ### ⚠️ Critical Notes
   * - If you use the size method, your logs will be stored in RAM before being injected into the database.
   *
   */
  flushStrategy?: 'realtime' | 'size' | 'time'
  /**
   * 📝 Auxiliary side modes
   */
  modes?: BufferModesConfig
  /**
   * 📝 Maximum number of logs before injection
   *
   * 📖 If the number of logs stored in the buffer memory reaches this number, data will be injected.
   *
   * 📌@type {number}
   *
   * @default 10
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Up to 18 logs can be stored in memory</caption>
   * ```ts
   *  size: 18
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Works when flushStrategy is equal to size
   * - If you enter the number 1, use the realtime method and do not define a value for this.
   * ```ts
   *  flushStrategy: 'realtime',
   * ```
   * - Very high numbers will increase RAM usage.
   * - If you set a high number and on the other hand the logs produced are low, the logs will be recorded later.
   *
   */
  size?: number

  /**
   * 📝 Maximum time to inject logs into the buffer relative to the last injection
   *
   *
   * 📌@type {Duration}
   *
   * @default "5s"
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Inject logs every 1 minute</caption>
   * ```ts
   *  time: "1m"
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - If you want to enter a value of "1s", set the flushStrategy value to time instead and do not define a value for the time property.
   * ```ts
   *  flushStrategy: 'realtime',
   * ```
   * - If you set the time too low, the CPU will be severely affected.
   * - If you allow too much time, the logs will be recorded later. If the server crashes, the logs will be lost.
   */
  time?: Duration
}
export type CollectionConfig = {
  /**
   * 📝 auditor Collection Accessibility Settings
   *
   * 📖 Determine who can access the collection for what purposes. You can even fully customize each operation.
   *
   *
   * @default undefined
   *
   * ---
   * ### ⚠️ Critical Notes
   * - If you do not define a value, the default access rule is used, which is as follows:
   * ```({ req }) => req.user?.role === 'admin'```
   * - Currently only read operations are available
   */
  Accessibility?: {
    /**
     * 📝 Full accessibility customization for collections in every operation
     *
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Allow only specific users to read.</caption>
     * ```ts
     * customAccess: {
     *   read: ({ req }) => req.user?.email === 'admin@example.com',
     * }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - For any operation (such as reading), it works when you have not defined any custom roles in roles for that operation.
     *
     */
    customAccess?: {
      read?: Access
    }
    /**
     * 📝 Define which roles are allowed for each operation.
     *
     *
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Only super-admin and CEO roles can view (read) logs</caption>
     * ```ts
     * roles: {
     *    read: ['CEO', 'super-admin'],
     *  },
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - When you have defined specific roles for an operation, customAccess values for that operation are ignored.
     *
     */
    roles?: {
      read: string[]
    }
  }
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
  buffer?: BufferConfig

  /**
   * 📝 Uses internal payload CMS configuration for labels
   *
   * 📖 You can customize the plugin's built-in collection label.
   * @see {@link https://payloadcms.com/docs/configuration/collections#config-options}
   */
  labels?:
    | {
        plural?: LabelFunction | StaticLabel | undefined
        singular?: LabelFunction | StaticLabel
      }
    | undefined
  /**
   * 📝 Uses internal payload CMS configuration for slug
   *
   * 📖 You can customize the plugin's built-in collection slug.
   *
   * @see {@link https://payloadcms.com/docs/configuration/collections#config-options}
   */
  slug?: (typeof allowedSlugs)[number] | ({} & string)

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
  trackCollections: TrackedCollection[]
}

// export type CountStrategy = {
//   amountToDelete: number
//   deletionCount: number
//   name: 'count'
// }

// export type TimeStrategy = {
//   name: 'time'
//   olderThan: Duration
// }

export type ManualStrategy = {
  name: 'manual'
  olderThan: Duration
}
export type AutomationConfig = {
  logCleanup: {
    // disabled?: boolean
    // schedule?: CronConfig
    strategy?: ManualStrategy
    // CountStrategy
    //  | TimeStrategy
    // taskConfig?: TaskConfig<DeleteOldLogResultTask>
    // withJobs?: boolean
  }
}

export type PluginOptions = {
  // /**
  //  * 📝 Defines the interval for automatic deletion of logs or data.
  //  *
  //  * 📖 This interval is specified as a string containing a number followed by a time unit.
  //  *
  //  * 📌@type {Duration}
  //  *
  //  * @default "1mo"
  //  *
  //  * Supported time units include:
  //  * - 'd' for days
  //  * - 'h' for hours
  //  * - 'm' for minutes
  //  * - 'mo' for months
  //  * - 's' for seconds
  //  * - 'w' for weeks
  //  * - 'y' for years
  //  *
  //  * ---
  //  * 📦 Usage Example
  //  *
  //  * @example <caption>🧪 For 7 days</caption>
  //  * ```
  //  * autoDeleteInterval?: "7d",
  //  * ```
  //  *
  //  * @example <caption>🧪 For 2 weeks</caption>
  //  * ```
  //  * autoDeleteInterval?: "2w",
  //  * ```
  //  *
  //  * ---
  //  * 💡 Tips:
  //  * - Use small durations for testing (e.g., `'5s'`)
  //  * - For production, prefer longer intervals (e.g., `'1w'`, `'1mo'`)
  //  *
  //  * ⚠️ Keep in mind:
  //  * - Values below `'1s'` may be invalid.
  //  * - Only use supported suffixes: `s`, `m`, `h`, `d`, `w`, `mo`, `y`
  //  *
  //  */
  // autoDeleteInterval?: Duration
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
   * ---
   * ### ⚠️ Critical Notes
   * -
   *
   */
  automation?: AutomationConfig

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
  collection?: CollectionConfig
  /**
   * 📝 Enable or disable the plugin
   *
   * 📌@type {boolean}
   *
   * @default "true"
   */
  enabled?: boolean
}
