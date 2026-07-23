import type { BasePayload, CollectionConfig, Config } from 'payload';

import type { PluginConfig } from '../types/config.js';
import { bufferManager } from './../core/buffer/bufferManager.js';
import { DEFAULT_QUEUE_NAME } from '../core/automation/tasks/cleanup/cleanup.js';

type OnInitManagerParams = {
  payloadConfig: Config;
  pluginConfig: PluginConfig;
  internalCollectionConfig: CollectionConfig;
};

export const onInitManager = (params: OnInitManagerParams) => {
  const originalOnInit = params.payloadConfig.onInit;
  const bufferConfig = params.pluginConfig.buffer;
  const internalCollectionConfig = params.internalCollectionConfig;

  return async (payload: BasePayload) => {
    if (originalOnInit) {
      await originalOnInit(payload);
    }

    bufferManager({ payload, bufferConfig, internalCollectionConfig });

    let autoRun = payload.config.jobs?.autoRun ?? [];
    const queueName = params.pluginConfig.automation?.logCleanup?.queueName ?? DEFAULT_QUEUE_NAME;
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
