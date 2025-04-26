import type { CollectionMeHook } from 'payload'

const meCollectionLogBuilder: CollectionMeHook = ({ args, user }) => {
  // if ((context.userHookConfig as TrackedCollection).hooks?.afterLogin?.login?.enabled) {
  //   const log: ActivityLog = {
  //     action: 'login',
  //     collection: collection.slug,
  //     documentId: 'unknown',
  //     timestamp: new Date(),
  //     user: req?.user?.id || null,
  //     userAgent: req.headers.get('user-agent') || 'unknown',
  //   }
  //   emitEvent('logGenerated', log)
  // }
}

export default meCollectionLogBuilder
