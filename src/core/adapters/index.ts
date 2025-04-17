import type { SanitizedConfig } from 'payload'

export const initAdapter = (config: SanitizedConfig) => {
  initMongoAdapter(config)
}
