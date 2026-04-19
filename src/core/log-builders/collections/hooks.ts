import type {
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
  CollectionMeHook,
  CollectionRefreshHook,
  PayloadRequest,
} from 'payload';

import type { SharedArgs } from './shared.js';
import { emitWrapper } from './helpers/emitWrapper.js';
import { handleDebugMode } from './helpers/handleDebugMode.js';
import type { AuditorLog, AuditorUser } from '../../../collections/auditor.js';
import type {
  AllCollectionHooks,
  HookOperationConfig,
  HookTrackingOperationMap,
  PluginOptions,
} from '../../../types/pluginOptions.js';

const extractUser = (req: PayloadRequest): AuditorUser | null => {
  if (!req?.user) {
    return null;
  }
  const collection = req.user.collection as string | undefined;
  const id = req.user.id as string | undefined;
  if (!collection || !id) {
    return null;
  }
  return { collection, id };
};

export const hookHandlers = {
  afterChange: (
    args: Parameters<CollectionAfterChangeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit';
    baseLog.documentId = args.doc.id;
    baseLog.user = extractUser(sharedArgs.req);

    return args.doc;
  },
  afterDelete: (
    args: Parameters<CollectionAfterDeleteHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit';
    baseLog.documentId = args.doc.id;
    baseLog.user = extractUser(sharedArgs.req);
  },
  afterError: (
    args: Parameters<CollectionAfterErrorHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'error';
    baseLog.documentId = 'unknown';
    baseLog.user = extractUser(sharedArgs.req);
  },
  afterForgotPassword: async (
    args: Parameters<CollectionAfterForgotPasswordHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security';

    const email = args.args.data?.email;
    const userDoc = await sharedArgs.req.payload.find({
      collection: sharedArgs.collection.slug,
      limit: 1,
      where: { email: { equals: email } },
    });

    const userId = userDoc?.docs?.[0]?.id;
    baseLog.user = userId
      ? { collection: sharedArgs.collection.slug, id: userId.toString() }
      : null;
  },
  afterLogin: (
    args: Parameters<CollectionAfterLoginHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security';
    baseLog.operation = 'login';
    baseLog.user = { collection: sharedArgs.collection.slug, id: args.user.id.toString() };
  },
  afterLogout: (
    args: Parameters<CollectionAfterLogoutHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Omit<AuditorLog, 'onCollection' | 'hook' | 'operation' | 'timestamp' | 'userAgent'>,
  ) => {
    baseLog.type = 'security';
    baseLog.user = extractUser(sharedArgs.req);
  },
  afterMe: (
    args: Parameters<CollectionAfterMeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Omit<AuditorLog, 'onCollection' | 'hook' | 'operation' | 'timestamp' | 'userAgent'>,
  ) => {
    baseLog.user = extractUser(sharedArgs.req);
    baseLog.type = 'info';
  },
  afterOperation: async <T extends keyof AllCollectionHooks>(
    args: Parameters<CollectionAfterOperationHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
    data: {
      pluginOpts: PluginOptions;
      userActivatedHooks: Partial<HookTrackingOperationMap> | undefined;
      userHookConfig: HookTrackingOperationMap;
      userHookOperationConfig: HookOperationConfig<T>;
    },
  ) => {
    baseLog.type = 'audit';
    baseLog.documentId = 'unknown';
    baseLog.user = extractUser(sharedArgs.req);

    switch (args.operation) {
      case 'create':
      case 'deleteByID':
      case 'findByID':
      case 'updateByID': {
        baseLog.documentId = args.result ? args.result?.id.toString() : 'unknown';

        break;
      }
      case 'delete':
      case 'update': {
        if (args.result?.docs?.length) {
          for (const doc of args.result.docs) {
            baseLog.documentId = doc.id.toString();

            handleDebugMode(
              data.userHookConfig as HookTrackingOperationMap[T],
              data.userHookOperationConfig,
              baseLog as AuditorLog,
              args.operation,
            );
            await emitWrapper(
              baseLog as AuditorLog,
              data.userHookConfig as HookTrackingOperationMap[T],
              sharedArgs.hook,
              data.userHookOperationConfig,
              data.pluginOpts,
              args,
              data.userActivatedHooks,
            );
          }
        }
        break;
      }
      case 'login':
      case 'refresh': {
        baseLog.user = { collection: sharedArgs.collection.slug, id: args.result.user.id.toString() };
        break;
      }
    }
  },
  afterRead: (
    args: Parameters<CollectionAfterReadHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info';
    baseLog.user = extractUser(sharedArgs.req);
  },
  afterRefresh: (
    args: Parameters<CollectionAfterRefreshHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info';
    baseLog.user = extractUser(sharedArgs.req);
  },
  beforeChange: (
    args: Parameters<CollectionBeforeChangeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit';
    baseLog.documentId = args.originalDoc?.id;
    baseLog.user = extractUser(sharedArgs.req);
  },
  beforeDelete: (
    args: Parameters<CollectionBeforeDeleteHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit';
    baseLog.documentId = args.id.toString();
    baseLog.user = extractUser(sharedArgs.req);
  },
  beforeLogin: (
    args: Parameters<CollectionBeforeLoginHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'security';
    baseLog.user = { collection: sharedArgs.collection.slug, id: args.user.id.toString() };
  },
  beforeOperation: async (
    args: Parameters<CollectionBeforeOperationHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'audit';
    baseLog.user = extractUser(sharedArgs.req);

    switch (args.operation) {
      case 'create':
      case 'refresh':
      case 'update':
        break;
      case 'delete':
        // @ts-ignore
        baseLog.documentId = args.args.id ? args.args.id.toString() : 'unknown';
        break;
      case 'forgotPassword':
      case 'login': {
        const email = args.args.data?.email;
        const result = await args.req.payload.find({
          collection: sharedArgs.collection.slug,
          limit: 1,
          where: { email: { equals: email } },
        });
        const userId = result?.docs?.[0]?.id;
        baseLog.user = userId
          ? { collection: sharedArgs.collection.slug, id: userId.toString() }
          : null;
        break;
      }
    }
  },
  beforeRead: (
    args: Parameters<CollectionBeforeReadHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info';
    baseLog.documentId = args.doc.id;
    baseLog.user = extractUser(sharedArgs.req);
  },
  beforeValidate: (
    args: Parameters<CollectionBeforeValidateHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'debug';
    baseLog.documentId = args.operation === 'update' ? args.originalDoc?.id : 'unknown';
    baseLog.user = extractUser(sharedArgs.req);
  },
  me: (
    args: Parameters<CollectionMeHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info';
    baseLog.user = { collection: sharedArgs.collection.slug, id: args.user.id.toString() };
  },
  refresh: (
    args: Parameters<CollectionRefreshHook>[0],
    sharedArgs: SharedArgs,
    baseLog: Partial<AuditorLog>,
  ) => {
    baseLog.type = 'info';
    baseLog.user = args.user?.id
      ? { collection: sharedArgs.collection.slug, id: args.user.id.toString() }
      : null;
  },
};
