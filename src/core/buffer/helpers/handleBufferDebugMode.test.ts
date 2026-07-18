import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prettyDebugLog } from '../../../utils/prettyDebugLog.js';
import { handleBufferDebugMode } from './handleBufferDebugMode.js';
import type { BufferConfig, BufferDebugFields } from '../../../types/pluginOptions.js';
import { DEFAULT_BUFFER_SIZE, DEFAULT_BUFFER_STRATEGY, DEFAULT_INTERVAL_BUFFER } from '../bufferManager.js';

vi.mock('../../../utils/prettyDebugLog.js');

const mockFields = {
  flushStrategy: DEFAULT_BUFFER_STRATEGY,
  size: DEFAULT_BUFFER_SIZE,
  interval: DEFAULT_INTERVAL_BUFFER,
} satisfies Record<keyof BufferDebugFields, number | string>;

describe('handleBufferDebugMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when debug is disabled', () => {
    it('should return null and not call prettyDebugLog', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: false,
          },
        },
      };

      const result = handleBufferDebugMode(mockFields, bufferConfig);

      expect(result).toBeNull();
      expect(prettyDebugLog).not.toHaveBeenCalled();
    });

    it('should return null when bufferConfig is undefined', () => {
      const result = handleBufferDebugMode(mockFields, undefined);

      expect(result).toBeNull();
      expect(prettyDebugLog).not.toHaveBeenCalled();
    });

    it('should return null when bufferConfig.modes is undefined', () => {
      const bufferConfig: BufferConfig = {};

      const result = handleBufferDebugMode(mockFields, bufferConfig);

      expect(result).toBeNull();
      expect(prettyDebugLog).not.toHaveBeenCalled();
    });
  });

  describe('when debug is enabled', () => {
    it('should call prettyDebugLog with all fields when debugFields is not specified', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledTimes(1);
      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        mockFields,
        'table',
      );
    });

    it('should filter fields based on debugFields configuration', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            fields: {
              size: true,
            },
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      const expectedFiltered = {
        size: 10,
      };

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        expectedFiltered,
        'table',
      );
    });

    it('should use custom displayType when provided', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            displayType: 'manual',
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        mockFields,
        'manual',
      );
    });

    it('should use custom fields when provided in debug configuration', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            fields: {
              size: true,
              interval: true,
            },
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      const expectedFiltered = {
        size: 10,
        interval: 10000,
      };

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        expectedFiltered,
        'table',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty fields object', () => {
      const emptyFields = {} as Record<keyof BufferDebugFields, number | string>;
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
          },
        },
      };

      handleBufferDebugMode(emptyFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        emptyFields,
        'table',
      );
    });

    it('should handle debugFields with all false values', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            fields: {
              size: false,
              flushStrategy: false,
              interval: false,
            },
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        {},
        'table',
      );
    });

    it('should handle undefined displayType', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            displayType: undefined,
          },
        },
      };

      handleBufferDebugMode(mockFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledWith(
        'Buffer',
        '',
        mockFields,
        'table',
      );
    });
  });

  describe('multiple calls', () => {
    it('should work correctly with multiple calls', () => {
      const bufferConfig: BufferConfig = {
        modes: {
          debug: {
            enabled: true,
            fields: {
              size: true,
              interval: true,
            },
          },
        },
      };

      // فراخوانی اول
      handleBufferDebugMode(mockFields, bufferConfig);

      // فراخوانی دوم با داده‌های متفاوت
      const otherFields = {
        ...mockFields,
        size: 2048,
        interval: 50000,
      };
      handleBufferDebugMode(otherFields, bufferConfig);

      expect(prettyDebugLog).toHaveBeenCalledTimes(2);

      const expectedFirstFilter = { size: 10, interval: 10000 };
      const expectedSecondFilter = { size: 2048, interval: 50000 };

      expect(prettyDebugLog).toHaveBeenNthCalledWith(
        1,
        'Buffer',
        '',
        expectedFirstFilter,
        'table',
      );

      expect(prettyDebugLog).toHaveBeenNthCalledWith(
        2,
        'Buffer',
        '',
        expectedSecondFilter,
        'table',
      );
    });
  });
});
