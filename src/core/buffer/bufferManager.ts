import type { Payload } from 'payload';

import { onEventLog } from './../../core/events/emitter.js';
import type { AuditorLog } from '../../collections/auditor.js';
import { defaultCollectionValues } from './../../Constant/Constant.js';
import type { BufferConfig, PluginOptions } from './../../types/pluginOptions.js';
import { handleBufferDebugMode } from './../../core/buffer/helpers/handleBufferDebugMode.js';

export const DEFAULT_INTERVAL_BUFFER = 10000 as NonNullable<BufferConfig['time']>;
export const DEFAULT_BUFFER_SIZE = 10 as NonNullable<BufferConfig['size']>;
export const DEFAULT_BUFFER_STRATEGY = 'time' as NonNullable<BufferConfig['flushStrategy']>;

export const bufferStore: AuditorLog[] = [];

let payloadInstance: Payload;

const flushBuffer = async (pluginOptions: PluginOptions) => {
  const logsToInsert = [...bufferStore];
  bufferStore.length = 0;
  await Promise.all(
    logsToInsert.map(log =>
      payloadInstance.create({
        collection: pluginOptions.collection?.slug
          ? pluginOptions.collection?.slug
          : defaultCollectionValues.slug,
        data: log,
      }),
    ),
  );
};

export const bufferManager = (payload: Payload, pluginOptions: PluginOptions) => {
  const bufferConfig = pluginOptions.collection?.buffer;
  const size = bufferConfig?.size ?? DEFAULT_BUFFER_SIZE;
  const interval = bufferConfig?.time ?? DEFAULT_INTERVAL_BUFFER;
  const flushStrategy = bufferConfig?.flushStrategy ?? DEFAULT_BUFFER_STRATEGY;
  payloadInstance = payload;

  // When the log is generated, add it to the buffer.
  onEventLog('logGenerated', async (log: AuditorLog) => {
    handleBufferDebugMode({ flushStrategy, interval, size }, bufferConfig);
    bufferStore.push(log);

    if (flushStrategy === 'size') {
      if (bufferStore.length >= size) {
        await flushBuffer(pluginOptions);
      }
    }
    else if (flushStrategy === 'realtime') {
      await flushBuffer(pluginOptions);
    }
  });

  if (flushStrategy === 'time') {
    // Every few seconds, empty the buffer (even if it's not full)
    setInterval(async () => {
      if (bufferStore.length > 0) {
        await flushBuffer(pluginOptions);
      }
    }, interval);
  }
};
