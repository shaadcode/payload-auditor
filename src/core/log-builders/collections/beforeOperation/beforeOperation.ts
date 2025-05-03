import type { CollectionBeforeOperationHook } from 'payload'

import type { ActivityLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const beforeOperationCollectionLogBuilder: CollectionBeforeOperationHook = ({
  args,
  collection,
  context,
  operation,
  req,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.create?.enabled
  ) {
    const log: ActivityLog = {
      action: 'create',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'delete' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.delete?.enabled
  ) {
    const log: ActivityLog = {
      action: 'delete',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  if (
    operation === 'forgotPassword' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.forgotPassword?.enabled
  ) {
    const log: ActivityLog = {
      action: 'forgotPassword',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'login' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.login?.enabled
  ) {
    const log: ActivityLog = {
      action: 'login',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'refresh' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.refresh?.enabled
  ) {
    const log: ActivityLog = {
      action: 'refresh',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'update' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.update?.enabled
  ) {
    const log: ActivityLog = {
      action: 'update',
      collection: collection.slug,
      documentId: 'unknown',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  return args
}

export default beforeOperationCollectionLogBuilder
