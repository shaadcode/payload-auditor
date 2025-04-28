import type { HookOperationType } from 'payload'

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
  logMessageTemplate?: string
  metadata?: Record<string, any>
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
  }
  afterError: {
    /**
     * Error operation
     *
     * Triggered when an error occurs during another operation.
     */
    error?: HookOperationConfig
  }
  afterForgotPassword: {
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig
  }
  afterLogin: {
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
  }
  afterLogout: {
    /**
     * Logout operation
     *
     * Triggered when a user logs out.
     */
    logout?: HookOperationConfig
  }
  afterMe: {
    /**
     * Me operation
     *
     * Triggered when a user fetches their own profile information.
     */
    me?: HookOperationConfig
  }
  afterOperation: {
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
     * Read operation
     *
     * Triggered when data is read.
     */
    read?: HookOperationConfig
  }
  afterRefresh: {
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
  }
  beforeLogin: {
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig
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
  }
  refresh: {
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

type CollectionConfig = {
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

export type PluginOptions = {
  /**
   * 📝 Defines the interval for automatic deletion of logs or data.
   *
   * 📖 This interval is specified as a string containing a number followed by a time unit.
   *
   * 📌@type {Duration}
   *
   * @default "1mo"
   *
   * Supported time units include:
   * - 'd' for days
   * - 'h' for hours
   * - 'm' for minutes
   * - 'mo' for months
   * - 's' for seconds
   * - 'w' for weeks
   * - 'y' for years
   *
   * ---
   * 📦 Usage Example
   *
   * @example <caption>🧪 For 7 days</caption>
   * ```
   * autoDeleteInterval?: "7d",
   * ```
   *
   * @example <caption>🧪 For 2 weeks</caption>
   * ```
   * autoDeleteInterval?: "2w",
   * ```
   *
   * ---
   * 💡 Tips:
   * - Use small durations for testing (e.g., `'5s'`)
   * - For production, prefer longer intervals (e.g., `'1w'`, `'1mo'`)
   *
   * ⚠️ Keep in mind:
   * - Values below `'1s'` may be invalid.
   * - Only use supported suffixes: `s`, `m`, `h`, `d`, `w`, `mo`, `y`
   *
   */
  autoDeleteInterval?: Duration

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
