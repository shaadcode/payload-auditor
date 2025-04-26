import type { CollectionAfterOperationHook } from 'payload'

const afterOperationCollectionLogBuilder: CollectionAfterOperationHook = ({
  args,
  collection,
  context,
  operation,
  req,
  result,
}) => {
  console.log(context)
  // if ((context.userHookConfig as TrackedCollection).hooks?.afterDelete?.delete?.enabled) {
  //   const log: ActivityLog = {
  //     action: 'delete',
  //     collection: collection.slug,
  //     documentId: 'unknown',
  //     timestamp: new Date(),
  //     user: req?.user?.id || null,
  //     userAgent: req.headers.get('user-agent') || 'unknown',
  //   }
  //   emitEvent('logGenerated', log)
  // }
  return result
}

export default afterOperationCollectionLogBuilder
