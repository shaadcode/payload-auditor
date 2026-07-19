import type { TaskConfig } from 'payload';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PluginConfig } from '../../../../types/pluginOptions.js';
import { CLEANUP_TASK_LABEL, CLEANUP_TASK_SLUG, cleanupLogsTask, DEFAULT_CRON_TIME, DEFAULT_OLDER_THAN, DEFAULT_QUEUE_NAME } from './cleanup.js';

const mockPluginConfig = {
  automation: {
    logCleanup: {
      cronTime: DEFAULT_CRON_TIME,
      olderThan: DEFAULT_OLDER_THAN,
      queueName: DEFAULT_QUEUE_NAME,
    },
  },
  // @ts-expect-error
} as const satisfies PluginConfig;

const mockReq = {
  payload: {
    delete: vi.fn(),
    logger: {
      error: vi.fn(),
      info: vi.fn(),
    },
  },
};

describe('cleanupLogsTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return expected task', () => {
    // @ts-expect-error
    const result = cleanupLogsTask(mockPluginConfig);

    const expectedResultInstance = {
      handler: expect.any(Function),
      slug: expect.any(String),
      label: expect.any(String),
      schedule: expect.any(Array),
    } as TaskConfig<'cleanup-payload-auditor-log'>;

    const expectedResult = {
      handler: expect.any(Function),
      slug: CLEANUP_TASK_SLUG,
      label: CLEANUP_TASK_LABEL,
      schedule: [{ cron: DEFAULT_CRON_TIME, queue: DEFAULT_QUEUE_NAME }],
    } as TaskConfig<'cleanup-payload-auditor-log'>;

    expect(result).toEqual(expectedResultInstance);
    expect(result).toEqual(expectedResult);
  });

  describe('handler task', () => {
    it('should call payload.delete with correct parameters', async () => {
      const pluginOptions: Partial<PluginConfig> = {};
      // @ts-expect-error
      const task = cleanupLogsTask(pluginOptions);

      typeof task.handler === 'function' && await task
        .handler({
          // @ts-expect-error
          req: mockReq,
        });

      expect(mockReq.payload.delete)
        .toHaveBeenCalledWith({
          collection: 'Audit-log',
          where: expect.objectContaining({
            createdAt: {
              less_than: expect.any(String),
            },
          }),
        });
    });

    it('should use configureRootCollection result when provided', async () => {
      const configuredSlug = 'configured-audit-logs';
      const pluginOptions: PluginConfig = {
        collection: {
          configureRootCollection: vi.fn().mockReturnValue({ slug: configuredSlug }),
          track: [],
        },
      };

      const task = cleanupLogsTask(pluginOptions);
      typeof task.handler === 'function' && await task
        .handler({
          // @ts-expect-error
          req: mockReq,
        });

      expect(mockReq.payload.delete).toHaveBeenCalledWith({
        collection: configuredSlug,
        where: expect.any(Object),
      });
    });

    it('should use custom olderThan value', async () => {
      const customOlderThan = 86400000; // 1 day
      // @ts-expect-error
      const pluginOptions: PluginConfig = {
        automation: {
          logCleanup: {
            olderThan: customOlderThan,
          },
        },
      };

      const task = cleanupLogsTask(pluginOptions);
      typeof task.handler === 'function' && await task.handler({
        // @ts-expect-error
        req: mockReq,
      });

      const expectedDate = new Date(Date.now() - customOlderThan).toISOString();

      expect(mockReq.payload.delete).toHaveBeenCalledWith({
        collection: 'Audit-log',
        where: {
          createdAt: {
            less_than: expect.any(String),
          },
        },
      });

      const callArgs = mockReq.payload.delete.mock.calls[0][0];
      const lessThanValue = callArgs.where.createdAt.less_than;
      expect(lessThanValue).toBe(expectedDate);
    });

    it('should return empty output object', async () => {
      const pluginOptions: Partial<PluginConfig> = {};
      // @ts-expect-error
      const task = cleanupLogsTask(pluginOptions);

      const result = typeof task.handler === 'function' && await task.handler({
        // @ts-expect-error
        req: mockReq,
      });

      expect(result).toEqual({ output: {} });
    });

    it('should log error when payload.delete fails', async () => {
      const mockError = new Error('Database connection failed');
      mockReq.payload.delete.mockRejectedValueOnce(mockError);

      const pluginOptions: Partial<PluginConfig> = {};
      // @ts-expect-error
      const task = cleanupLogsTask(pluginOptions);

      typeof task.handler === 'function' && await task.handler({
        // @ts-expect-error
        req: mockReq,
      });

      expect(mockReq.payload.logger.error).toHaveBeenCalledWith(
        `Error while cleaning old logs — task: ${CLEANUP_TASK_SLUG}`,
      );
      expect(mockReq.payload.delete).toHaveBeenCalled();
    });

    it('should not throw error when payload.delete fails', async () => {
      mockReq.payload.delete.mockRejectedValueOnce(new Error('Database error'));

      const pluginOptions: Partial<PluginConfig> = {};
      // @ts-expect-error
      const task = cleanupLogsTask(pluginOptions);

      await expect(
        typeof task.handler === 'function' && task.handler({
          // @ts-expect-error
          req: mockReq,
        }),
      ).resolves.not.toThrow();
    });

    it('should log error with correct message', async () => {
      mockReq.payload.delete.mockRejectedValueOnce(new Error('Any error'));

      const pluginOptions: Partial<PluginConfig> = {};
      // @ts-expect-error
      const task = cleanupLogsTask(pluginOptions);

      typeof task.handler === 'function' && await task.handler({
        // @ts-expect-error
        req: mockReq,
      });

      expect(mockReq.payload.logger.error).toHaveBeenCalledWith(
        `Error while cleaning old logs — task: ${CLEANUP_TASK_SLUG}`,
      );
    });
  });
});
