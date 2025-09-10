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

/**
 * Normalize common Payload relationship-like shapes to compact identifiers for diffing.
 * - Object with an `id` -> reduce to its `id`.
 * - Array of objects with `id` -> array of ids (sorted as strings for stability).
 * - Leaves other values as-is (e.g., rich text content trees).
 */
export const normalizeForDiff = (
  obj: null | Record<string, unknown> | undefined,
): Record<string, unknown> => {
  if (!obj) {return {}}
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    out[key] = reduceValue(value)
  }
  return out
}

const isRelObject = (v: unknown): v is { id: unknown } =>
  !!v && typeof v === 'object' && 'id' in (v as Record<string, unknown>)

const reduceValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    // If array items are relation-like objects, reduce to their ids
    if (value.every((it) => isRelObject(it) || typeof it === 'string' || typeof it === 'number')) {
      const ids = value.map((it) => (isRelObject(it) ? (it as any).id : it))
      return ids
        .map((x) => (typeof x === 'string' || typeof x === 'number' ? String(x) : ''))
        .sort()
    }
    return value
  }

  if (isRelObject(value)) {
    return (value as any).id
  }

  return value
}
