import type {
  Access,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterErrorHook,
  CollectionAfterForgotPasswordHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterMeHook,
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionAfterRefreshHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeLoginHook,
  CollectionBeforeOperationHook,
  CollectionBeforeReadHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  CollectionMeHook,
  CollectionRefreshHook,
  HookOperationType,
  LabelFunction,
  StaticLabel,
} from 'payload'

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

export type HookOperations = {
  afterChange: Parameters<CollectionAfterChangeHook>[0]['operation']
  afterDelete: 'delete'
  afterError: 'error'
  afterForgotPassword: 'afterForgotPassword'
  afterLogin: 'login'
  afterLogout: 'logout'
  afterMe: 'me'
  afterOperation: Parameters<CollectionAfterOperationHook>[0]['operation']
  afterRead: 'read'
  afterRefresh: 'refresh'
  beforeChange: Parameters<CollectionBeforeChangeHook>[0]['operation']
  beforeDelete: 'delete'
  beforeLogin: 'login'
  beforeOperation: Parameters<CollectionBeforeOperationHook>[0]['operation']
  beforeRead: 'read'
  beforeValidate: Parameters<CollectionBeforeValidateHook>[0]['operation']
  me: 'me'
  refresh: 'refresh'
}

export type AllCollectionHooks = {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
  afterError: CollectionAfterErrorHook
  afterForgotPassword: CollectionAfterForgotPasswordHook
  afterLogin: CollectionAfterLoginHook
  afterLogout: CollectionAfterLogoutHook
  afterMe: CollectionAfterMeHook
  afterOperation: CollectionAfterOperationHook
  afterRead: CollectionAfterReadHook
  afterRefresh: CollectionAfterRefreshHook
  beforeChange: CollectionBeforeChangeHook
  beforeDelete: CollectionBeforeDeleteHook
  beforeLogin: CollectionBeforeLoginHook
  beforeOperation: CollectionBeforeOperationHook
  beforeRead: CollectionBeforeReadHook
  beforeValidate: CollectionBeforeValidateHook
  me: CollectionMeHook
  refresh: CollectionRefreshHook
}

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

export type HookOperationConfig<TCustomLogger extends keyof AllCollectionHooks> = {
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
    args: Parameters<AllCollectionHooks[TCustomLogger]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
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
    create?: HookOperationConfig<'afterChange'>

    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterChange hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterChange']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>

    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean

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
    update?: HookOperationConfig<'afterChange'>
  }
  afterDelete: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterDelete hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterDelete']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig<'afterDelete'>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterError hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterError']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Error operation
     *
     * Triggered when an error occurs during another operation.
     */
    error?: HookOperationConfig<'afterError'>
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterForgotPassword hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterForgotPassword']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>

    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig<'afterForgotPassword'>
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterLogin hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterLogin']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig<'afterLogin'>
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterLogout hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterLogout']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Logout operation
     *
     * Triggered when a user logs out.
     */
    logout?: HookOperationConfig<'afterLogout'>
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterMe hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterMe']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Me operation
     *
     * Triggered when a user fetches their own profile information.
     */
    me?: HookOperationConfig<'afterMe'>
    /**
     * 📝 Auxiliary side modes
     *
     * ### ⚠️ Critical Notes
     * - By enabling debug mode at the hook level, all operations of that hook are logged
     */
    modes?: HookModesConfig
  }
  afterOperation: {
    countVersions?: HookOperationConfig<'afterOperation'>
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig<'afterOperation'>
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterOperation hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['refresh']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig<'afterOperation'>
    /**
     * Delete by ID operation
     *
     * Triggered when a specific item is deleted by its ID.
     */
    deleteByID?: HookOperationConfig<'afterOperation'>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Find operation
     *
     * Triggered when items are queried based on specific conditions.
     */
    find?: HookOperationConfig<'afterOperation'>
    /**
     * Find by ID operation
     *
     * Triggered when a specific item is retrieved by its ID.
     */
    findByID?: HookOperationConfig<'afterOperation'>
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig<'afterOperation'>
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig<'afterOperation'>
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
    refresh?: HookOperationConfig<'afterOperation'>

    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig<'afterOperation'>
    /**
     * Update by ID operation
     *
     * Triggered when a specific item is updated by its ID.
     */
    updateByID?: HookOperationConfig<'afterOperation'>
  }
  afterRead: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterRead hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterRead']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    read?: HookOperationConfig<'afterRead'>
  }
  afterRefresh: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all afterRefresh hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['afterRefresh']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    refresh?: HookOperationConfig<'afterRefresh'>
  }
  beforeChange: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig<'beforeChange'>
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeChange hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['refresh']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    update?: HookOperationConfig<'beforeChange'>
  }
  beforeDelete: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeDelete hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['beforeDelete']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig<'beforeDelete'>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeLogin hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['beforeLogin']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig<'beforeLogin'>
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
    create?: HookOperationConfig<'beforeOperation'>
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeOperation hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['beforeOperation']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * Delete operation
     *
     * Triggered when an item is deleted.
     */
    delete?: HookOperationConfig<'beforeOperation'>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Forgot password operation
     *
     * Triggered when a password recovery request is made.
     */
    forgotPassword?: HookOperationConfig<'beforeOperation'>
    /**
     * Login operation
     *
     * Triggered when a user logs in.
     */
    login?: HookOperationConfig<'beforeOperation'>
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
    read?: HookOperationConfig<'beforeOperation'>
    /**
     * Refresh operation
     *
     * Triggered when authentication tokens are refreshed.
     */
    refresh?: HookOperationConfig<'beforeOperation'>
    /**
     * Update operation
     *
     * Triggered when an existing item is updated.
     */
    update?: HookOperationConfig<'beforeOperation'>
  }
  beforeRead: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeRead hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['beforeRead']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    read?: HookOperationConfig<'beforeRead'>
  }
  beforeValidate: {
    /**
     * Create operation
     *
     * Triggered when a new item is created.
     */
    create?: HookOperationConfig<'beforeValidate'>
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all beforeValidate hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['beforeValidate']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    update?: HookOperationConfig<'beforeValidate'>
  }
  /**
   * 📝 Custom log creation at a hooks level
   *
   * @default undefined
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Change the type value for all operations within all hooks</caption>
   * ```ts
   *  customLogger: (args, fields) => {
   *     return { ...fields, type: 'error' }
   *  }
   * ```
   *
   * ---
   * ### ⚠️ Critical Notes
   * - Only works for active operations
   * - This function is only executed for all operations and hooks that do not have a dedicated customLogger
   * - Do not confuse this customLogger with the hook-level customLogger (which is only for a specific hook)!
   */
  customLogger?: (
    args: Parameters<AllCollectionHooks[keyof AllCollectionHooks]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>

  me: {
    /**
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all me hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['me']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
    /**
     * Me operation
     *
     * Triggered when a user fetches their own profile information.
     */
    me?: HookOperationConfig<'me'>
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
     * 📝 Custom log creation at a hook level
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Change the user value for all refresh hook operations</caption>
     * ```ts
     *  customLogger: (args, fields) => {
     *     return { ...fields, user: null }
     *  }
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for active operations
     * - This function is only executed for operations that do not have a dedicated customLogger
     * - Do not confuse this customLogger with the hooks-level customLogger (which is for all hooks)!
     */
    customLogger?: (
      args: Parameters<AllCollectionHooks['refresh']>[0],
      fields: Omit<AuditorLog, 'hook'>,
    ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>
    /**
     * 📝 Enabling all supported operations within the afterChange hook
     *
     * 📌@type {boolean}
     *
     * @default undefined
     *
     *
     * 📦 Usage Example
     *
     * @example <caption>🧪 Enabling all operations</caption>
     * ```ts
     *  enabled: true
     * ```
     *
     * ---
     * ### ⚠️ Critical Notes
     * - Only works for operations whose enabled property value is not false
     * - If the value is false, it disables all operations (even explicitly enabled operations)
     *
     */
    enabled?: boolean
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
    refresh?: HookOperationConfig<'refresh'>
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

export type Localization = {
  collection?: {
    fields?: Partial<Record<keyof AuditorLog, LabelFunction | StaticLabel>>
  }
}
export type PluginCollectionConfig = {
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
  configureRootCollection?: (defaults: CollectionConfig) => Partial<CollectionConfig>
  /**
   * 📝 Internationalization for the plugin
   *
   * 📌@type {Localization}
   *
   * @default undefined
   */
  locale?: Localization
  /**
   * 📝 Uses internal payload CMS configuration for slug
   *
   * 📖 You can customize the plugin's built-in collection slug.
   *
   * @see {@link https://payloadcms.com/docs/configuration/collections#config-options}
   *
   * ### ⚠️ Critical Notes
   * - If you define a slug name in the `configureRootCollection` property, this value is ignored.
   *
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
  amount?: number
  name?: 'manual'
  olderThan?: Duration
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
  collections?: PluginCollectionConfig
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
  customLogger?: <TCustomLogger extends keyof AllCollectionHooks>(
    args: Parameters<AllCollectionHooks[TCustomLogger]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>

  /**
   * 📝 Enable or disable the plugin
   *
   * 📌@type {boolean}
   *
   * @default "true"
   */
  enabled?: boolean
}
