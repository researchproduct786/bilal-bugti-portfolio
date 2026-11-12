import keys from './keys.json';
export type Dict = Record<string, string>;
export type T = (s: string, vars?: Record<string, string | number>) => string;

const idOf = new Map<string, string>(Object.entries(keys as Record<string, string>).map(([id, en]) => [en, id]));
/** Fields that are identifiers, never prose. */
const SKIP = new Set(['slug', 'id', 'service', 'project', 'accent', 'n', 'letter', 'href', 'demos', 'key', 'code', 'icon', 'tone', 'kind', 'url', 'source', 'status', 'cat', 'hex', 'shape', 'email', 'owner']);

export function makeT(dict: Dict | null): T {
  return (s, vars) => {
    let out = s;
    if (dict) { const id = idOf.get(s); const hit = id ? dict[id] : undefined; if (hit) out = hit; }
    if (vars) for (const k in vars) out = out.split(`{${k}}`).join(String(vars[k]));
    return out;
  };
}
/** Deep-translate every prose string in a data object (arrays and nested objects included). */
export function localize<V>(value: V, t: T): V {
  if (typeof value === 'string') return t(value) as unknown as V;
  if (Array.isArray(value)) return value.map((v) => localize(v, t)) as unknown as V;
  if (value && typeof value === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) o[k] = SKIP.has(k) ? v : localize(v, t);
    return o as V;
  }
  return value;
}

/** Marks module-level copy for extraction; returns its argument unchanged. Render it through `t.x(...)`. */
export const i18n = <V,>(v: V): V => v;
