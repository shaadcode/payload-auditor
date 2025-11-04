import type { Access, BasePayload, Config } from 'payload';

import auditor from '../collections/auditor.js';
import { bufferManager } from '../core/buffer/bufferManager.js';
import { autoLogCleaner } from './../collections/hooks/beforeChange.js';
import { cleanupStrategiesDefaultValues } from './../Constant/automation.js';
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

    // console.log(auditor)
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

export const attachAutomationConfig = (
  incomingConfig: Config,
  pluginOpts: PluginOptions,
): Config => {
  const typedAuditorCollection = auditor;

  typedAuditorCollection.hooks = {
    ...typedAuditorCollection.hooks,
    beforeChange: [
      ...(typedAuditorCollection.hooks?.beforeChange || []),
      args =>
        autoLogCleaner({
          ...args,
          context: {
            pluginOptions: pluginOpts,
          },
          data: {
            olderThan:
              pluginOpts.automation?.logCleanup?.strategy?.olderThan
              ?? cleanupStrategiesDefaultValues.manual.olderThan,
          },
        }),
    ],
  };

  return incomingConfig;
};

export const OnInitManager = (originalOnInit: Config['onInit'], pluginOpts: PluginOptions) => {
  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload);
    }

    bufferManager(payload, pluginOpts);
  };
};
