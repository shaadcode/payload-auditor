import type { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types.js';

import ms from './../../utils/toMS.js';
import type { Duration } from './../../utils/toMS.js';
import { defaultCollectionValues } from './../../Constant/Constant.js';
import { cleanupStrategiesDefaultValues } from './../../Constant/automation.js';

interface AutoLogCleanerProps {
  id: string;
  olderThan: Duration;
}

export const autoLogCleaner: BeforeChangeHook<AutoLogCleanerProps> = async ({
  context,
  data,
  // operation,
  req,
}) => {
  try {
    const millisecondsAgo = new Date(
      Date.now() - ms(data.olderThan || cleanupStrategiesDefaultValues.manual.olderThan),
    );
    const collectionSlug = context.pluginOptions.collection?.slug ?? defaultCollectionValues.slug;
    const limit = context.pluginOptions.automation?.logCleanup?.strategy?.amount ?? 100;

    const oldLogsToDelete = await req.payload.find({
      collection: collectionSlug,
      limit,
      where: {
        createdAt: {
          less_than: millisecondsAgo.toISOString(),
        },
      },
    });

    const ids = oldLogsToDelete.docs.map(doc => doc.id);
    if (ids.length > 0) {
      await req.payload.delete({
        collection: collectionSlug,
        where: {
          id: {
            in: ids,
          },
        },
      });
    }
  }
  catch (err) {
    console.error('Error cleaning old logs:', err);
  }
};
