import type { LabelFunction, StaticLabel } from 'payload'

import type { Duration } from './../utils/toMS.js'

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
