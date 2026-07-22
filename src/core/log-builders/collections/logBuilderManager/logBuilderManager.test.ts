import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emitEvent } from './../../../events/emitter.js';
import { logBuilderManager } from './logBuilderManager.js';
import type { LogBuilderManager } from './logBuilderManager.js';
import type { TrackedCollection } from '../../../../types/collection.js';
import type { PluginConfig } from './../../../../types/pluginOptions.js';

vi.mock('./../../../events/emitter.js', () => ({
  emitEvent: vi.fn(),
}));

const createPlugin = (hookLevelConfig: TrackedCollection['hooks']): PluginConfig => ({
  collections: { track: [{ slug: 'user-collection', hooks: hookLevelConfig }] },
});

const createCollectionLogBuilderParams = (pluginConfig: PluginConfig): LogBuilderManager => ({
  scopeSlug: 'collection',
  identifier: 'user-collection',
  // @ts-expect-error
  hookArgs: {
    operation: 'updateByID',
    collection: 'user-collection',
    req: { headers: { get: () => 'unknown' } },
  },
  pluginConfig,
  targetHookLevelConfig: pluginConfig.collections?.track[0].hooks?.afterOperation,
  targetHookName: 'afterOperation',
});

describe('logBuilderManager', () => {
  beforeEach(() => vi.clearAllMocks());
  it('should correct hook name', async () => {
    const pluginConfigDebugMode = createPlugin({ afterOperation: { updateByID: { enabled: true } } });
    const builderParams = createCollectionLogBuilderParams(pluginConfigDebugMode);
    await logBuilderManager(builderParams);

    expect(emitEvent).toHaveBeenCalledWith('logGenerated', {
      operation: 'updateByID',
      onCollection: 'user-collection',
      hook: 'afterOperation',
      userAgent: 'unknown',
      timestamp: expect.any(Date),
    });
    expect(emitEvent).toHaveBeenCalledTimes(1);
  });

  it('should skip save to database when debug mode is active with skipDatabaseSave flag', () => {
    const pluginConfigDebugModeWithFlag = createPlugin({ afterOperation: {
      debug: { skipDatabaseSave: true },
    } });
    const builderParams = createCollectionLogBuilderParams(pluginConfigDebugModeWithFlag);
    logBuilderManager(builderParams);
    expect(emitEvent).toHaveBeenCalledTimes(0);
  });

  it('should skip save to database when debug mode is active', () => {
    const pluginConfigDebugMode = createPlugin({ afterOperation: { debug: true } });
    const builderParams = createCollectionLogBuilderParams(pluginConfigDebugMode);

    logBuilderManager(builderParams);

    expect(emitEvent).toHaveBeenCalledTimes(0);
  });
});
