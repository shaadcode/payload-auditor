import type { AllOperations, CollectionConfig, PayloadTypes } from 'payload';

import type { AuditorLog } from '../collections/auditor.js';

export type OperationDebugConfig = {
  skipDatabaseSave?: boolean;
} | true;

export type CollectionHookDebugConfig = {
  skipDatabaseSave?: true;
} | true;

export type CollectionHooksKeys = keyof NonNullable<CollectionConfig['hooks']>;
export type CollectionHooksOperation = AllOperations | 'read' | 'delete' | 'error' | 'login' | 'logout' | 'me' | 'refresh' | 'forgotPassword' | '';
export type CollectionHooksArgsParameterUnion = Parameters<
  NonNullable<
    NonNullable<
      CollectionConfig['hooks']
    >[CollectionHooksKeys]
  >[number]
>[0];

export type PayloadCollectionHooksMap = {
  [K in CollectionHooksKeys]: NonNullable<NonNullable<CollectionConfig['hooks']>[K]>[number]
};
export type CollectionsHookConfigForTracking = {
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
        >[0]['operation']]: CollectionOperationLogConfig | boolean
      } & CollectionHookLevelLogConfig<K>
    > | boolean
};

export interface CollectionOperationLogConfig<
  HookName extends CollectionHooksKeys = CollectionHooksKeys,
> {
  customLogger?: (
    args: Parameters<PayloadCollectionHooksMap[HookName]>[0],
    fields: Omit<AuditorLog, 'hook' | 'operation'>,
  ) => any | Promise<any>;
  enabled?: boolean;
  debug?: OperationDebugConfig;
}

export interface CollectionHookLevelLogConfig<
  HookName extends CollectionHooksKeys = CollectionHooksKeys,
> {
  customLogger?: (
    args: Parameters<PayloadCollectionHooksMap[HookName]>[0],
    fields: Omit<AuditorLog, 'hook'>,
  ) => Omit<AuditorLog, 'hook'> | Promise<Omit<AuditorLog, 'hook'>>;
  enabled?: boolean;
  debug?: CollectionHookDebugConfig;
}

export interface TrackedCollection {
  hooks?: Partial<CollectionsHookConfigForTracking>;
  slug: keyof PayloadTypes['collections'];
}
export interface CollectionsTrackConfig {
  track: TrackedCollection[];
}
