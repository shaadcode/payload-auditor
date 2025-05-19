import type { LabelFunction, StaticLabel } from 'payload'
import type { AllCollectionHooks } from 'src/types/pluginOptions.js'

import type { Duration } from './../utils/toMS.js'

import { sharedLogic } from './../core/log-builders/collections/shared.js'

type DefaultCollectionValues = {
  labels:
    | {
        plural?: LabelFunction | StaticLabel | undefined
        singular?: LabelFunction | StaticLabel
      }
    | undefined
  slug: string
}

export const defaultCollectionValues: DefaultCollectionValues = {
  slug: 'Audit-log',
  labels: {
    plural: 'Audit-logs',
    singular: 'Audit-log',
  },
}

export const defaultAutoDeleteLog: Duration = '1mo'

export const defaultPluginOpts = {
  collection: {
    trackCollections: [],
  },
  enabled: true,
}

export const hookMap: AllCollectionHooks = {
  afterChange: async (args) => {
    console.log(args.context.userHookConfig?.hooks)
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterChange',
      operation: args.operation,
      req: args.req,
    })

    return args.doc
  },
  afterDelete: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterDelete',
      operation: 'delete',
      req: args.req,
    })

    return {}
  },
  afterError: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterError',
      operation: 'error',
      req: args.req,
    })

    return {}
  },
  afterForgotPassword: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterForgotPassword',
      operation: 'forgotPassword',
      req: args.args.req,
    })

    return {}
  },
  afterLogin: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterLogin',
      operation: 'delete',
      req: args.req,
    })

    return {}
  },
  afterLogout: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterLogout',
      operation: 'logout',
      req: args.req,
    })

    return {}
  },
  afterMe: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterMe',
      operation: 'me',
      req: args.req,
    })

    return {}
  },
  afterOperation: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      // @ts-ignore
      context: args.context,
      hook: 'afterOperation',
      operation: args.operation,
      req: args.req,
    })
    return args.result
  },
  afterRead: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterRead',
      operation: 'read',
      req: args.req,
    })

    return args.doc
  },
  afterRefresh: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'afterRefresh',
      operation: 'refresh',
      req: args.req,
    })
    return {}
  },
  beforeChange: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeChange',
      operation: args.operation,
      req: args.req,
    })

    return args.data
  },
  beforeDelete: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeDelete',
      operation: 'delete',
      req: args.req,
    })

    return {}
  },
  beforeLogin: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeLogin',
      operation: 'read',
      req: args.req,
    })
    return args.user
  },
  beforeOperation: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeOperation',
      operation: args.operation,
      req: args.req,
    })
    return args
  },
  beforeRead: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeRead',
      operation: 'read',
      req: args.req,
    })

    return args.doc
  },
  beforeValidate: async (args) => {
    await sharedLogic(args, {
      collection: args.collection,
      context: args.context,
      hook: 'beforeValidate',
      operation: args.operation,
      req: args.req,
    })
    return args.data
  },
  me: async (args) => {
    await sharedLogic(args, {
      collection: args.args.collection.config,
      // @ts-ignore
      context: args.context,
      hook: 'me',
      operation: 'me',
      req: args.args.req,
    })
  },
  refresh: async (args) => {
    await sharedLogic(args, {
      collection: args.args.collection.config,
      // @ts-ignore
      context: args.context,
      hook: 'refresh',
      operation: 'refresh',
      req: args.args.req,
    })
  },
}
