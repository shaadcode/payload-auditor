import type { PartialDeep } from 'type-fest';
import { describe, expect, it } from 'vitest';

import { checkIsOperationEnabled } from './isOperationEnabled.js';
import type { TrackedCollection } from '../../../../types/collection.js';

describe('checkIsOperationEnabled', () => {
  const createPluginConfig = (collectionConfig: PartialDeep<TrackedCollection>): Parameters<typeof checkIsOperationEnabled>[0] => {
    return {
      hookLevelConfig: collectionConfig.hooks?.afterOperation,
      // @ts-expect-error
      hookOperationLevelConfig: collectionConfig.hooks?.afterOperation?.updateByID,
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

  it('should return false when explicitly false at the operation level', () => {
    const config = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: {
          updateByID: false,
        },
      },
    }));
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: { updateByID: { enabled: false } },
      },
    }));
    const configStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: {
          enabled: true,
          updateByID: false,
        },
      },
    }));
    const configWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
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
        afterOperation: false,
      },
    }));
    const configWithEnabled = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: { enabled: false },
      },
    }));

    const configStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: false,
      },
    }));
    const configWithEnabledStrict = checkIsOperationEnabled(createPluginConfig({
      hooks: {
        afterOperation: { enabled: false, updateByID: true },
      },
    }));

    expect(config).toEqual(false);
    expect(configWithEnabled).toEqual(false);
    expect(configStrict).toEqual(false);
    expect(configWithEnabledStrict).toEqual(false);
  });
});
