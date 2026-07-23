import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emitEvent } from '../../events/emitter.js';
import { logBuilderManager } from './logBuilderManager.js';
import type { PluginConfig } from '../../../types/config.js';
import type { TrackedGlobal } from '../../../types/global.js';
import type { LogBuilderManager } from './logBuilderManager.js';
import type { TrackedCollection } from '../../../types/collection.js';

vi.mock('./../../events/emitter.js', () => ({
  emitEvent: vi.fn(),
}));

const createPluginConfig = (hookLevelConfig: TrackedCollection['hooks'] | TrackedGlobal['hooks']): PluginConfig => ({
  // @ts-expect-error
  collections: { track: [{ slug: 'user-collection', hooks: hookLevelConfig }] },
  // @ts-expect-error
  globals: { track: [{ slug: 'user-global', hooks: hookLevelConfig }] },
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

const createGlobalLogBuilderParams = (pluginConfig: PluginConfig): LogBuilderManager => ({
  scopeSlug: 'global',
  identifier: 'user-global',
  // @ts-expect-error
  hookArgs: {
    operation: 'updateByID',
    global: 'user-global',
    req: { headers: { get: () => 'unknown' } },
  },
  pluginConfig,
  targetHookLevelConfig: pluginConfig.collections?.track[0].hooks?.afterOperation,
  targetHookName: 'afterOperation',
});

describe('logBuilderManager', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('collections', () => {
    it('should emit logGenerated event for collection scope with enabled afterOperation hook', async () => {
      const pluginConfigDebugMode = createPluginConfig({ afterOperation: { updateByID: { enabled: true } } });
      const builderParams = createCollectionLogBuilderParams(pluginConfigDebugMode);
      await logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', {
        operation: 'updateByID',
        identifier: 'user-collection',
        hook: 'afterOperation',
        scope: 'collection',
        userAgent: 'unknown',
        timestamp: expect.any(Date),
      });
      expect(emitEvent).toHaveBeenCalledTimes(1);
    });

    it('should skip save to database when debug mode is active with skipDatabaseSave flag', () => {
      const pluginConfigDebugModeWithFlag = createPluginConfig({ afterOperation: {
        debug: { skipDatabaseSave: true },
      } });
      const builderParams = createCollectionLogBuilderParams(pluginConfigDebugModeWithFlag);
      logBuilderManager(builderParams);
      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should skip save to database when debug mode is active', () => {
      const pluginConfigDebugMode = createPluginConfig({ afterOperation: { debug: true } });
      const builderParams = createCollectionLogBuilderParams(pluginConfigDebugMode);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should not emit logGenerated when operation is disabled for collection', () => {
      const pluginConfigDebugMode = createPluginConfig({ afterOperation: { updateByID: false } });
      const builderParams = createCollectionLogBuilderParams(pluginConfigDebugMode);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should not emit logGenerated when hook is disabled for global', () => {
      const pluginConfig = createPluginConfig({ afterOperation: false });
      const builderParams = createCollectionLogBuilderParams(pluginConfig);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('globals', () => {
    it('should emit logGenerated event for global scope with enabled afterOperation hook', async () => {
      const pluginConfig = createPluginConfig({ afterOperation: { updateByID: { enabled: true } } });
      const builderParams = createGlobalLogBuilderParams(pluginConfig);
      await logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledWith('logGenerated', {
        operation: 'updateByID',
        identifier: 'user-global',
        hook: 'afterOperation',
        scope: 'global',
        userAgent: 'unknown',
        timestamp: expect.any(Date),
      });
      expect(emitEvent).toHaveBeenCalledTimes(1);
    });

    it('should skip save to database when debug mode is active with skipDatabaseSave flag', () => {
      const pluginConfigDebugModeWithFlag = createPluginConfig({ afterOperation: {
        debug: { skipDatabaseSave: true },
      } });
      const builderParams = createGlobalLogBuilderParams(pluginConfigDebugModeWithFlag);
      logBuilderManager(builderParams);
      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should skip save to database when debug mode is active', () => {
      const pluginConfigDebugMode = createPluginConfig({ afterOperation: { debug: true } });
      const builderParams = createGlobalLogBuilderParams(pluginConfigDebugMode);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should not emit logGenerated when operation is disabled for global', () => {
      const pluginConfig = createPluginConfig({ afterOperation: { updateByID: false } });
      const builderParams = createGlobalLogBuilderParams(pluginConfig);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });

    it('should not emit logGenerated when hook is disabled for global', () => {
      const pluginConfig = createPluginConfig({ afterOperation: false });
      const builderParams = createGlobalLogBuilderParams(pluginConfig);

      logBuilderManager(builderParams);

      expect(emitEvent).toHaveBeenCalledTimes(0);
    });
  });
});
