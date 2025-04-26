import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterErrorHook,
  CollectionAfterForgotPasswordHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterMeHook,
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionAfterRefreshHook,
  CollectionBeforeChangeHook,
  CollectionBeforeLoginHook,
  CollectionBeforeOperationHook,
  CollectionBeforeReadHook,
  CollectionBeforeValidateHook,
  CollectionMeHook,
  CollectionRefreshHook,
} from 'payload'

import type { hookTypes } from './../../pluginUtils/configHelpers.js'

import afterChangeCollectionLogBuilder from './../../core/log-builders/collections/afterChange/afterChange.js'
import afterDelete from './../../core/log-builders/collections/afterDelete/afterDelete.js'
import afterErrorCollectionLogBuilder from './../../core/log-builders/collections/afterError/afterError.js'
import afterForgotPasswordCollectionLogBuilder from './../../core/log-builders/collections/afterForgotPassword/afterForgotPassword.js'
import afterLoginCollectionLogBuilder from './../../core/log-builders/collections/afterLogin/afterLogin.js'
import afterLogoutCollectionLogBuilder from './../../core/log-builders/collections/afterLogout/afterLogout.js'
import afterMeCollectionLogBuilder from './../../core/log-builders/collections/afterMe/afterMe.js'
import afterOperationCollectionLogBuilder from './../../core/log-builders/collections/afterOperation/afterOperation.js'
import afterReadCollectionLogBuilder from './../../core/log-builders/collections/afterRead/afterRead.js'
import afterRefreshCollectionLogBuilder from './../../core/log-builders/collections/afterRefresh/afterRefresh.js'
import beforeChangeCollectionLogBuilder from './../../core/log-builders/collections/beforeChange/beforeChange.js'
import beforeDeleteCollectionLogBuilder from './../../core/log-builders/collections/beforeDelete/beforeDelete.js'
import beforeLoginCollectionLogBuilder from './../../core/log-builders/collections/beforeLogin/beforeLogin.js'
import beforeReadCollectionLogBuilder from './../../core/log-builders/collections/beforeRead/beforeRead.js'
import beforeValidateCollectionLogBuilder from './../../core/log-builders/collections/beforeValidate/beforeValidate.js'
import meCollectionLogBuilder from './../../core/log-builders/collections/me/me.js'
import refreshCollectionLogBuilder from './../../core/log-builders/collections/refresh/refresh.js'
import beforeOperationCollectionLogBuilder from './collections/beforeOperation/beforeOperation.js'

export const collectionHooks: Record<
  (typeof hookTypes)[number],
  | CollectionAfterChangeHook
  | CollectionAfterDeleteHook
  | CollectionAfterErrorHook
  | CollectionAfterForgotPasswordHook
  | CollectionAfterLoginHook
  | CollectionAfterLogoutHook
  | CollectionAfterMeHook
  | CollectionAfterOperationHook
  | CollectionAfterReadHook
  | CollectionAfterRefreshHook
  | CollectionBeforeChangeHook
  | CollectionBeforeLoginHook
  | CollectionBeforeOperationHook
  | CollectionBeforeReadHook
  | CollectionBeforeValidateHook
  | CollectionMeHook
  | CollectionRefreshHook
> = {
  afterChange: afterChangeCollectionLogBuilder,
  afterDelete,
  afterError: afterErrorCollectionLogBuilder,
  afterForgotPassword: afterForgotPasswordCollectionLogBuilder,
  afterLogin: afterLoginCollectionLogBuilder,
  afterLogout: afterLogoutCollectionLogBuilder,
  afterMe: afterMeCollectionLogBuilder,
  afterOperation: afterOperationCollectionLogBuilder,
  afterRead: afterReadCollectionLogBuilder,
  afterRefresh: afterRefreshCollectionLogBuilder,
  beforeChange: beforeChangeCollectionLogBuilder,
  beforeDelete: beforeDeleteCollectionLogBuilder,
  beforeLogin: beforeLoginCollectionLogBuilder,
  beforeOperation: beforeOperationCollectionLogBuilder,
  beforeRead: beforeReadCollectionLogBuilder,
  beforeValidate: beforeValidateCollectionLogBuilder,
  me: meCollectionLogBuilder,
  refresh: refreshCollectionLogBuilder,
}
