import type { CollectionAfterOperationHook } from 'payload'

import type { AuditorLog } from '../../../../collections/auditor.js'
import type { TrackedCollection } from './../../../../types/pluginOptions.js'

import { emitEvent } from './../../../../core/events/emitter.js'

const afterOperationCollectionLogBuilder: CollectionAfterOperationHook = ({
  args,
  collection,
  // @ts-ignore
  context,
  operation,
  req,
  result,
}) => {
  if (
    operation === 'create' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.create?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'create',
      collection: collection.slug,
      documentId: result.id.toString(),
      hook: 'afterOperation',
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
    for (const doc of result.docs) {
      const log: AuditorLog = {
        type: 'audit',
        action: 'delete',
        collection: collection.slug,
        documentId: doc.id.toString(),
        hook: 'afterOperation',
        timestamp: new Date(),
        user: req?.user?.id || null,
        userAgent: req.headers.get('user-agent') || 'unknown',
      }
      emitEvent('logGenerated', log)
    }
  }
  if (
    operation === 'deleteByID' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.deleteByID?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'deleteByID',
      collection: collection.slug,
      documentId: result.id.toString(),
      hook: 'afterOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'find' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.find?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'find',
      collection: collection.slug,
      documentId: 'unknown',
      hook: 'afterOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }
  if (
    operation === 'findByID' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.findByID?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'findByID',
      collection: collection.slug,
      documentId: result.id.toString(),
      hook: 'afterOperation',
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
    const log: AuditorLog = {
      type: 'audit',
      action: 'forgotPassword',
      collection: collection.slug,
      documentId: 'unknown',
      hook: 'afterOperation',
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
    const log: AuditorLog = {
      type: 'audit',
      action: 'login',
      collection: collection.slug,
      documentId: result.user.id.toString(),
      hook: 'afterOperation',
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
    const log: AuditorLog = {
      type: 'audit',
      action: 'refresh',
      collection: collection.slug,
      documentId: result.user.id,
      hook: 'afterOperation',
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
    for (const doc of result.docs) {
      const log: AuditorLog = {
        type: 'audit',
        action: 'update',
        collection: collection.slug,
        documentId: doc.id.toString(),
        hook: 'afterOperation',
        timestamp: new Date(),
        user: req?.user?.id || null,
        userAgent: req.headers.get('user-agent') || 'unknown',
      }
      emitEvent('logGenerated', log)
    }
  }
  if (
    operation === 'updateByID' &&
    (context.userHookConfig as TrackedCollection).hooks?.afterOperation?.updateByID?.enabled
  ) {
    const log: AuditorLog = {
      type: 'audit',
      action: 'updateByID',
      collection: collection.slug,
      documentId: result.id.toString(),
      hook: 'afterOperation',
      timestamp: new Date(),
      user: req?.user?.id || null,
      userAgent: req.headers.get('user-agent') || 'unknown',
    }
    emitEvent('logGenerated', log)
  }

  return result
}

export default afterOperationCollectionLogBuilder
