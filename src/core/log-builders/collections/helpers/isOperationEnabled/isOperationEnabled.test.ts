import type { PartialDeep } from 'type-fest';
import { describe, expect, it } from 'vitest';

import { checkIsOperationEnabled } from './isOperationEnabled.js';
import type { TrackedCollection } from '../../../../../types/pluginOptions.js';

describe('checkIsOperationEnabled', () => {
  const createPluginConfig = (collectionConfig: PartialDeep<TrackedCollection>): Parameters<typeof checkIsOperationEnabled>[0] => {
    return {
      allHooksLevelConfig: collectionConfig.hooks,
      // @ts-expect-error
      hookLevelConfig: collectionConfig.hooks?.afterOperation,
      // @ts-expect-error
      hookOperationLevelConfig: collectionConfig.hooks?.afterOperation?.updateByID,
      // @ts-expect-error
      collectionLevelConfig: collectionConfig,
    };
  };

  it('should return true when explicitly true at the operation level', () => {
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: { afterOperation: { updateByID: { enabled: true } } },
    }));
    const config = checkIsOperationEnabled(createPluginConfig({
      hooks: { afterOperation: { updateByID: true } },
    }));

    expect(config).toEqual(true);
    expect(configWithEnabled).toEqual(true);
  });

  it('should return true when explicitly true at the hook level', () => {
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: { afterOperation: { enabled: true } },
    }));
    const config = checkIsOperationEnabled(createPluginConfig({ hooks: { afterOperation: true } }));

    expect(config).toEqual(true);
    expect(configWithEnabled).toEqual(true);
  });

  it('should return true when explicitly true at the all hooks level', () => {
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: { enabled: true },
    }));
    const config = checkIsOperationEnabled(createPluginConfig({ hooks: true }));

    expect(config).toEqual(true);
    expect(configWithEnabled).toEqual(true);
  });

  it('should return true when explicitly true at the collection level', () => {
    const config = checkIsOperationEnabled(createPluginConfig({ enabled: true }));

    expect(config).toEqual(true);
  });

  it('should return false when explicitly false at the operation level', () => {
    const config = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: true,
        afterOperation: {
          updateByID: false,
        },
      },
    }));
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: true,
        afterOperation: { updateByID: { enabled: false } },
      },
    }));
    const configStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: true,
        afterOperation: {
          enabled: true,
          updateByID: false,
        },
      },
    }));
    const configWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: true,
        afterOperation: {
          enabled: true,
          updateByID: { enabled: false },
        },
      },
    }));

    expect(config).toEqual(false);
    expect(configWithEnabled).toEqual(false);
    expect(configStrict).toEqual(false);
    expect(configWithEnabledStrict).toEqual(false);
  });

  it('should return false when explicitly false at the hook level', () => {
    const config = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: true,
        afterOperation: false,
      },
    }));
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: true,
        afterOperation: { enabled: false },
      },
    }));

    const configStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: true,
        afterOperation: false,
      },
    }));
    const configWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: true,
        afterOperation: { enabled: false, updateByID: true },
      },
    }));

    expect(config).toEqual(false);
    expect(configWithEnabled).toEqual(false);
    expect(configStrict).toEqual(false);
    expect(configWithEnabledStrict).toEqual(false);
  });

  it('should return false when explicitly false at the all hooks level', () => {
    const allHooksLevelConfig = checkIsOperationEnabled(createPluginConfig({ hooks: false }));
    const allHooksLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: { enabled: false },
    }));
    const allHooksLevelConfigStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: false,
    }));
    const allHooksLevelConfigWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: { enabled: false },
    }));

    const hookLevelConfig = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: false,
        afterOperation: true,
      },
    }));
    const hookLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: false,
        afterOperation: { enabled: true },
      },
    }));
    const hookLevelConfigStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: false,
        afterOperation: true,
      },
    }));
    const hookLevelConfigWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: false,
        afterOperation: { enabled: true },
      },
    }));

    const operationLevelConfig = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: false,
        afterOperation: { updateByID: true },
      },
    }));
    const operationLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: false,
        afterOperation: { updateByID: { enabled: true } },
      },
    }));
    const operationLevelConfigStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: true,
      hooks: {
        enabled: false,
        afterOperation: { enabled: true, updateByID: true },
      },
    }));
    const operationLevelConfigWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        enabled: false,
        afterOperation: { enabled: true, updateByID: { enabled: true } },
      },
    }));

    expect(allHooksLevelConfig).toEqual(false);
    expect(allHooksLevelConfigWithEnabled).toEqual(false);
    expect(hookLevelConfig).toEqual(false);
    expect(hookLevelConfigWithEnabled).toEqual(false);
    expect(operationLevelConfig).toEqual(false);
    expect(operationLevelConfigWithEnabled).toEqual(false);
    expect(hookLevelConfigStrict).toEqual(false);
    expect(hookLevelConfigWithEnabledStrict).toEqual(false);
    expect(operationLevelConfigStrict).toEqual(false);
    expect(operationLevelConfigWithEnabledStrict).toEqual(false);
    expect(allHooksLevelConfigStrict).toEqual(false);
    expect(allHooksLevelConfigWithEnabledStrict).toEqual(false);
  });

  it('should return false when explicitly false at the collection level', () => {
    const collectionLevelConfig = checkIsOperationEnabled(createPluginConfig({ enabled: false }));
    const allHooksLevelConfig = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: true,
    }));
    const allHooksLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { enabled: true },
    }));

    const hookLevelConfig = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { afterOperation: true },
    }));
    const hookLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { afterOperation: { enabled: true } },
    }));

    const hookLevelConfigStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { enabled: false, afterOperation: true },
    }));
    const hookLevelConfigWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { enabled: false, afterOperation: { enabled: true } },
    }));

    const operationLevelConfig = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { afterOperation: { updateByID: true } },
    }));
    const operationLevelConfigWithEnabled = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { afterOperation: { updateByID: { enabled: true } } },
    }));

    const operationLevelConfigStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { enabled: false, afterOperation: { enabled: false, updateByID: true } },
    }));
    const operationLevelConfigWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      enabled: false,
      hooks: { enabled: false, afterOperation: { enabled: false, updateByID: { enabled: true } } },
    }));

    expect(collectionLevelConfig).toEqual(false);
    expect(allHooksLevelConfigWithEnabled).toEqual(false);
    expect(allHooksLevelConfig).toEqual(false);
    expect(hookLevelConfigWithEnabled).toEqual(false);
    expect(hookLevelConfig).toEqual(false);
    expect(operationLevelConfig).toEqual(false);
    expect(operationLevelConfigWithEnabled).toEqual(false);
    expect(hookLevelConfigStrict).toEqual(false);
    expect(hookLevelConfigWithEnabledStrict).toEqual(false);
    expect(operationLevelConfigStrict).toEqual(false);
    expect(operationLevelConfigWithEnabledStrict).toEqual(false);
  });
});
