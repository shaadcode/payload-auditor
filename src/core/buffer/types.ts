export interface BufferDebugFields {
  flushStrategy: boolean;
  interval: boolean;
  size: boolean;
}

export type BufferDebugModeConfig = {
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
  enabled?: boolean;
} | true;

export interface BufferConfig {
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
  flushStrategy?: 'realtime' | 'size' | 'time';
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
  size?: number;

  /**
   * 📝 Maximum time to inject logs into the buffer relative to the last injection
   *
   *
   * 📌@type {Duration}
   *
   * @default 10000
   *
   *
   * 📦 Usage Example
   *
   * @example <caption>🧪 Inject logs every 1 minute</caption>
   * ```ts
   *  time: 5000
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
  time?: number;
}
