import type { Access, BasePayload, Config } from 'payload';

import auditor from '../collections/auditor.js';
import { bufferManager } from './../core/buffer/bufferManager.js';
import { DEFAULT_QUEUE_NAME } from './../core/automation/tasks/cleanup.js';
import { defaultCollectionValues, hookMap } from './../Constant/Constant.js';
import type { AllCollectionHooks, PluginOptions } from './../types/pluginOptions.js';

type AccessOps = 'create' | 'delete' | 'read' | 'update';

type RoleAccessMap = Partial<Record<AccessOps, string[]>>;

type CustomAccessMap = Partial<Record<AccessOps, Access>>;

export const hookTypes = [
  'beforeOperation',
  'beforeValidate',
  'beforeDelete',
  'beforeChange',
  'beforeRead',
  'afterChange',
  'afterRead',
  'afterDelete',
  'afterOperation',
  'afterError',
  'beforeLogin',
  'afterLogin',
  'afterLogout',
  'afterRefresh',
  'afterMe',
  'afterForgotPassword',
  'refresh',
  'me',
] as const;

export const buildAccessControl = (pluginOpts: PluginOptions) => {
  const roles: RoleAccessMap = pluginOpts?.collection?.Accessibility?.roles ?? {};
  const customAccess: CustomAccessMap = pluginOpts?.collection?.Accessibility?.customAccess ?? {};

  const defaultAccess: Access = ({ req }) => req.user?.role === 'admin';

  const accessOps: AccessOps[] = ['read'];

  const access: Partial<Record<(typeof accessOps)[number], Access>> = {};

  accessOps.forEach((op) => {
    if (roles[op] && roles[op].length > 0) {
      access[op] = ({ req }) => roles[op]!.includes(req.user?.role);
    }
    else if (customAccess[op]) {
      access[op] = customAccess[op];
    }
    else {
      access[op] = defaultAccess;
    }
  });

  auditor.access = { ...auditor.access, ...access };
};

export const attachCollectionConfig = (
  userCollectionsConfig: Config['collections'],
  pluginOpts: PluginOptions,
) => {
  const pluginCollectionsConfig = pluginOpts.collection;
  if (!pluginCollectionsConfig) {
    return userCollectionsConfig;
  }

  // attach localization
  for (const field of auditor.fields) {
    // @ts-ignore
    field.label = pluginCollectionsConfig.locale?.collection?.fields?.[field.name] ?? field.label;
  }

  // Attach Slug
  if (pluginCollectionsConfig.slug && pluginCollectionsConfig.slug.length > 0) {
    auditor.slug = pluginCollectionsConfig.slug;
  }

  // Attaching Log Builders
  if (
    pluginCollectionsConfig.trackCollections
    && pluginCollectionsConfig.trackCollections.length > 0
  ) {
    userCollectionsConfig = (userCollectionsConfig || []).map((collection) => {
      const tracked = pluginCollectionsConfig.trackCollections.find(
        tc => tc.slug === collection.slug,
      );

      if (tracked && !tracked.disabled) {
        collection.hooks = collection.hooks || {};

        if (tracked.hooks) {
          for (const hookName in tracked?.hooks) {
            const typedHookName = hookName as keyof AllCollectionHooks;
            // @ts-ignore
            collection.hooks[typedHookName] = [
              ...(collection.hooks[typedHookName] || []),
              async (args: any) =>
                await hookMap[typedHookName]({
                  ...args,
                  context: {
                    pluginOptions: pluginOpts,
                    userHookConfig: tracked,
                  },
                }),
            ];
          }
        }
      }

      return collection;
    });
  }

  //  add root collection to payload config
  const rootCollection = pluginCollectionsConfig.configureRootCollection
    ? {
        ...auditor,
        ...pluginCollectionsConfig.configureRootCollection(auditor),
      }
    : auditor;

  // attach collection slug
  const collectionSlug = rootCollection.slug ? rootCollection.slug : pluginCollectionsConfig.slug;
  pluginCollectionsConfig.slug = collectionSlug;

  userCollectionsConfig = [
    ...(userCollectionsConfig || []),
    { ...rootCollection, slug: collectionSlug || defaultCollectionValues.slug },
  ];
  // Attaching settings to plugin's internal collection hooks

  return userCollectionsConfig;
};

export const onInitManager = (incomingConfig: Config, pluginOptions: PluginOptions) => {
  const originalOnInit = incomingConfig.onInit;

  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload);
    }

    bufferManager(payload, pluginOptions);

    let autoRun = payload.config.jobs?.autoRun ?? [];
    const queueName = pluginOptions.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
    if (Array.isArray(autoRun)) {
      autoRun = [...(autoRun ?? []), { queue: queueName }];
    }
    else {
      autoRun = [...(await autoRun?.(payload) ?? []), { queue: queueName }];
    }

    payload.config.jobs = {
      ...(payload.config.jobs ?? {}),
      autoRun,
    };
  };
};
