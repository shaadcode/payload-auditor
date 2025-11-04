import type { ManualStrategy } from './../types/pluginOptions.js';

export const cleanupStrategiesDefaultValues = {
  manual: { name: 'manual', amount: 200, olderThan: '1w' } as Required<ManualStrategy>,
};
