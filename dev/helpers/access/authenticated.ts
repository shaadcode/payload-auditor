// import type { User } from '@/payload-types'

// type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated = ({ req: { user } }) => {
  return Boolean(user)
}
