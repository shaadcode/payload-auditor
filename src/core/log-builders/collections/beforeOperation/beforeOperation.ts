import type { CollectionBeforeOperationHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeOperationCollectionLogBuilder: CollectionBeforeOperationHook = async ({
  args,
  collection,
  context,
  operation,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.create?.enabled
  ) {
    const log: AuditorLog = {
      action: 'create',
      collection: collection.slug,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'delete' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.delete?.enabled
  ) {
    const log: AuditorLog = {
      action: 'delete',
      collection: collection.slug,
      documentId: args.id,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }

  if (
    operation === 'forgotPassword' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.forgotPassword?.enabled
  ) {
    const userDoc = await args.req.payload.find({
      collection: collection.slug,
      limit: 1,
      where: { email: { equals: args.data.email } },
    })

    const userId = userDoc?.docs?.[0]?.id
    const log: AuditorLog = {
      action: 'forgotPassword',
      collection: collection.slug,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: userId || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'login' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.login?.enabled
  ) {
    const userDoc = await args.req.payload.find({
      collection: collection.slug,
      limit: 1,
      where: { email: { equals: args.data.email } },
    })

    const userId = userDoc?.docs?.[0]?.id
    const log: AuditorLog = {
      action: 'login',
      collection: collection.slug,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: userId || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'refresh' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.refresh?.enabled
  ) {
    const log: AuditorLog = {
      action: 'refresh',
      collection: collection.slug,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: req.user?.id || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.beforeOperation?.update?.enabled
  ) {
    const log: AuditorLog = {
      action: 'update',
      collection: collection.slug,
      hook: 'beforeOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'anonymous',
    }
    emitEvent('logGenerated', log)
  }

  return args
}

export default beforeOperationCollectionLogBuilder
