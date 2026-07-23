import type { CollectionConfig, Payload } from 'payload';

import type { BufferConfig } from './types.js';
import { onEventLog } from './../../core/events/emitter.js';
import type { AuditorLog } from '../../collections/auditor.js';

export const DEFAULT_INTERVAL_BUFFER = 10000 as NonNullable<BufferConfig['time']>;
export const DEFAULT_BUFFER_SIZE = 10 as NonNullable<BufferConfig['size']>;
export const DEFAULT_BUFFER_STRATEGY = 'time' as NonNullable<BufferConfig['flushStrategy']>;

export const bufferStore: AuditorLog[] = [];

type FlushBufferParams = {
  payload: Payload;
  internalCollectionConfig: CollectionConfig;
};

const flushBuffer = async (params: FlushBufferParams) => {
  const logsToInsert = [...bufferStore];
  bufferStore.length = 0;
  await Promise.all(
    logsToInsert.map(log =>
      params.payload.create({
        collection: params.internalCollectionConfig?.slug,
        data: log,
      }),
    ),
  );
};

type BufferConfigParams = {
  payload: Payload;
  bufferConfig?: BufferConfig;
  internalCollectionConfig: CollectionConfig;
};

export const bufferManager = (params: BufferConfigParams) => {
  const bufferConfig = params.bufferConfig;
  const size = bufferConfig?.size ?? DEFAULT_BUFFER_SIZE;
  const interval = bufferConfig?.time ?? DEFAULT_INTERVAL_BUFFER;
  const flushStrategy = bufferConfig?.flushStrategy ?? DEFAULT_BUFFER_STRATEGY;

  onEventLog('logGenerated', async (log: AuditorLog) => {
    bufferStore.push(log);

    if (flushStrategy === 'size') {
      if (bufferStore.length >= size) {
        await flushBuffer(params);
      }
    }
    else if (flushStrategy === 'realtime') {
      await flushBuffer(params);
    }
  });

  if (flushStrategy === 'time') {
    // Every few seconds, empty the buffer (even if it's not full)
    setInterval(async () => {
      if (bufferStore.length > 0) {
        await flushBuffer(params);
      }
    }, interval);
  }
};
