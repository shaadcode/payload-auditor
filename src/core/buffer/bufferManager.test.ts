import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { auditor } from '../../collections/auditor.js';
import type { PluginConfig } from '../../types/config.js';
import { onEventLog } from './../../core/events/emitter.js';
import { bufferManager, bufferStore } from './../../core/buffer/bufferManager.js';

vi.mock('../../core/events/emitter.ts', () => ({
  onEventLog: vi.fn(),
}));

const mockPayload = {
  create: vi.fn(),
};

const mockOnEventLog = onEventLog as Mock;

const sampleLog = { message: 'test log', timestamp: Date.now() };
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  bufferStore.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('bufferManager', () => {
  it('should flush when buffer reaches size limit', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'size',
        size: 2,
      },
    } as PluginConfig;
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });

    // simulate event listener
    const handler = mockOnEventLog.mock.calls[0][1];

    await handler(sampleLog);
    expect(mockPayload.create).not.toHaveBeenCalled();

    await handler(sampleLog);
    expect(mockPayload.create).toHaveBeenCalledTimes(2);
  });

  it('should flush immediately in realtime mode', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'realtime',
      },
    } as PluginConfig;

    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });

    const handler = mockOnEventLog.mock.calls[0][1];

    await handler(sampleLog);
    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: auditor.slug,
      data: sampleLog,
    });
  });

  it('should flush periodically in time mode', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'time',
        time: 2000,
      },
    } as unknown as PluginConfig;
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });
    const handler = mockOnEventLog.mock.calls[0][1];
    await handler(sampleLog);
    expect(mockPayload.create).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);

    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: auditor.slug,
      data: sampleLog,
    });
  });

  it('should flushing logs after create log when size value is 1', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'size',
        size: 1,
      },
    } as PluginConfig;
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });
    const handler = mockOnEventLog.mock.calls[0][1];

    await handler(sampleLog);
    expect(mockPayload.create).toHaveBeenCalledTimes(1);

    // now push another and check it's flushed separately (i.e., buffer reset)
    await handler(sampleLog);
    expect(mockPayload.create).toHaveBeenCalledTimes(2);
  });

  it('should clear buffer store after flushing by size', async () => {
    const pluginOptions: PluginConfig = {
      buffer: {
        flushStrategy: 'size',
        size: 2,
      },
    };
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });

    const handler = mockOnEventLog.mock.calls[0][1];

    await handler({ ...sampleLog, id: 'log-1' });
    await handler({ ...sampleLog, id: 'log-2' });

    expect(mockPayload.create).toHaveBeenCalledTimes(2);
    expect(bufferStore).toHaveLength(0);
  });

  it('should clear buffer store after flushing by time', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'time',
        time: 2000,
      },
    } as PluginConfig;
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });

    const handler = mockOnEventLog.mock.calls[0][1];

    await handler({ ...sampleLog, id: 'log-1' });
    await handler({ ...sampleLog, id: 'log-2' });

    vi.advanceTimersByTime(2000);

    expect(mockPayload.create).toHaveBeenCalledTimes(2);
    expect(bufferStore).toHaveLength(0);
  });

  it('should clear buffer store after flushing by realtime', async () => {
    const pluginOptions = {
      buffer: {
        flushStrategy: 'realtime',
      },
    } as PluginConfig;
    bufferManager({
      payload: mockPayload as any,
      bufferConfig: pluginOptions.buffer,
      internalCollectionConfig: auditor,
    });

    const handler = mockOnEventLog.mock.calls[0][1];

    await handler({ ...sampleLog, id: 'log-1' });
    await handler({ ...sampleLog, id: 'log-2' });

    expect(mockPayload.create).toHaveBeenCalledTimes(2);
    expect(bufferStore).toHaveLength(0);
  });
});
