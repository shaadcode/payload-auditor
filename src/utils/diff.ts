export type ShallowDiff = Record<string, { new: unknown; old: unknown }>

/**
 * Compute a shallow diff between two plain objects (top-level keys only).
 * Returns a map of keys whose values differ, each with `{ old, new }`.
 *
 * @param next The updated object.
 * @param prev The previous object.
 * @param options Optional controls such as `excludeKeys` to skip specific fields.
 */
export const shallowDiff = (
  next: null | Record<string, unknown> | undefined,
  prev: null | Record<string, unknown> | undefined,
  options?: { excludeKeys?: string[] },
): ShallowDiff => {
  const out: ShallowDiff = {}
  if (!next && !prev) {return out}
  const exclude = new Set(options?.excludeKeys ?? [])

  const keys = new Set<string>([
    ...Object.keys((next || {})),
    ...Object.keys((prev || {})),
  ])

  for (const key of keys) {
    if (exclude.has(key)) {continue}
    const a = (prev)?.[key]
    const b = (next)?.[key]
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      out[key] = { new: b, old: a }
    }
  }

  return out
}
