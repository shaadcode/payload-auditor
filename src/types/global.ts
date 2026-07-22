import type { GlobalConfig } from 'payload';

import type { AuditorLog } from '../collections/auditor.js';
import type { CollectionHookDebugConfig } from './collection.js';

export type GlobalHooksKeys = keyof NonNullable<GlobalConfig['hooks']>;

export type GlobalOperationDebugConfig = {
  skipDatabaseSave?: boolean;
} | true;

export type GlobalHookConfigForTracking = {
  [K in keyof NonNullable<GlobalConfig['hooks']>]:
    Partial<
      {
      // @ts-expect-error
        [O in Parameters<
          NonNullable<
            NonNullable<
              GlobalConfig['hooks']
            >[K]
          >[number]
        >[0]['operation']]: GlobalOperationLogConfig | boolean
      } & GlobalHookLevelLogConfig<K>
    > | boolean
};

export interface GlobalOperationLogConfig<
  HookName extends GlobalHooksKeys = GlobalHooksKeys,
> {
  customLogger?: (
    args: Parameters<NonNullable<NonNullable<GlobalConfig['hooks']>[HookName]>[number]>[0],
    fields: Omit<AuditorLog, 'hook' | 'operation'>,
  ) => Omit<AuditorLog, 'hook' | 'operation'> | Promise<Omit<AuditorLog, 'hook' | 'operation'>>;
  enabled?: boolean;
  debug?: GlobalOperationDebugConfig;
}

export interface GlobalHookLevelLogConfig<
  HookName extends GlobalHooksKeys = GlobalHooksKeys,
> {
  customLogger?: (
    args: Parameters<NonNullable<NonNullable<GlobalConfig['hooks']>[HookName]>[number]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'>
    | Promise<Omit<AuditorLog, 'hook'>>;
  enabled?: boolean;
  debug?: GlobalHookDebugConfig;
}

export type GlobalHookDebugConfig = CollectionHookDebugConfig;
export interface TrackedGlobal {
  hooks?: Partial<GlobalHookConfigForTracking>;
  slug: string;
}

export interface GlobalsTrackConfig {
  track: TrackedGlobal[];
}

export type GlobalHooksArgsParameterUnion = Parameters<
  NonNullable<
    NonNullable<
      GlobalConfig['hooks']
    >[GlobalHooksKeys]
  >[number]
>[0];
