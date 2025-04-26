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
  | 'error'
  | 'forgotPassword'
  | 'logout'
  | 'me'
  | 'refresh'
  | HookOperationType

export type HookOperationConfig = {
  enabled?: boolean
  logMessageTemplate?: string
  metadata?: Record<string, any>
}

export type HookTrackingOperationMap = {
  afterChange: {
    create?: HookOperationConfig
    update?: HookOperationConfig
  }
  afterDelete: {
    delete?: HookOperationConfig
  }
  afterError: {
    error?: HookOperationConfig
  }
  afterForgotPassword: {
    forgotPassword?: HookOperationConfig
  }
  afterLogin: {
    login?: HookOperationConfig
  }
  afterLogout: {
    logout?: HookOperationConfig
  }
  afterMe: {
    me?: HookOperationConfig
  }
  afterOperation: {
    create?: HookOperationConfig
    delete?: HookOperationConfig
    deleteByID?: HookOperationConfig
    find?: HookOperationConfig
    findByID?: HookOperationConfig
    forgotPassword?: HookOperationConfig
    login?: HookOperationConfig
    refresh?: HookOperationConfig
    update?: HookOperationConfig
    updateByID?: HookOperationConfig
  }
  afterRead: {
    read?: HookOperationConfig
  }
  afterRefresh: {
    refresh?: HookOperationConfig
  }
  beforeChange: {
    create?: HookOperationConfig
    update?: HookOperationConfig
  }
  beforeDelete: {
    delete?: HookOperationConfig
  }
  beforeLogin: {
    login?: HookOperationConfig
  }
  beforeOperation: {
    create?: HookOperationConfig
    delete?: HookOperationConfig
    forgotPassword?: HookOperationConfig
    login?: HookOperationConfig
    read?: HookOperationConfig
    refresh?: HookOperationConfig
    update?: HookOperationConfig
  }
  beforeRead: {
    read?: HookOperationConfig
  }
  beforeValidate: {
    create?: HookOperationConfig
    update?: HookOperationConfig
  }
  refresh: {
    refresh?: HookOperationConfig
  }
}

export type TrackedCollection = {
  /** Globally disable tracking for this collection */
  disabled?: boolean

  hooks?: Partial<HookTrackingOperationMap>

  /** Optional label or description for UI/doc */
  label?: string

  /** Slug of the collection to track */
  slug: string
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

  collection?: {
    trackCollections: TrackedCollection[]
  }

  /**
   * 📝 Enable or disable the plugin
   *
   * 📌@type {boolean}
   *
   * @default "true"
   */
  enabled?: boolean
}
