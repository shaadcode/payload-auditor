import { prettyDebugLog } from './../../../utils/prettyDebugLog.js';
import type { BufferConfig, BufferDebugFields } from './../../../types/pluginOptions.js';

export const handleBufferDebugMode = (
  fields: Record<keyof BufferDebugFields, number | string>,
  bufferConfig: BufferConfig | undefined,
) => {
  const isDebugEnabled = bufferConfig?.modes?.debug?.enabled ?? false;

  if (!isDebugEnabled) {
    return null;
  }
  const debugFields = bufferConfig?.modes?.debug?.fields ?? fields;
  const displayType = bufferConfig?.modes?.debug?.displayType;
  const debugLog = Object.fromEntries(
    Object.entries(fields).filter(([key]) => debugFields[key as keyof BufferDebugFields]),
  );

  prettyDebugLog('Buffer', '', debugLog, displayType);
};
