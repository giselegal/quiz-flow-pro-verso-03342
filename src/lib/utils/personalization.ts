/**
 * Personalization utilities: placeholder interpolation for dynamic copy
 * Supports placeholders like {username}, {predominantStyle}, {stylePercentages}
 * and arbitrary keys from context.
 */

export type PersonalizationContext = Record<string, string | number | null | undefined> & {
  username?: string;
  predominantStyle?: string;
  stylePercentages?: string; // e.g. "Clássico 40% • Elegante 35% • Romântico 25%"
};

/**
 * Interpolates placeholders in a string using {key} syntax.
 * Escapes undefined/null to empty string.
 */
export function interpolateText(input: string, context: PersonalizationContext): string {
  if (!input) return input;
  return input.replace(/\{([a-zA-Z0-9_\.\-]+)\}/g, (_, key: string) => {
    const raw = resolvePath(context, key);
    return raw == null ? '' : String(raw);
  });
}

/**
 * Interpolates all string values in a shallow object.
 */
export function interpolateObject<T extends Record<string, any>>(obj: T, context: PersonalizationContext): T {
  const out: any = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = interpolateText(v, context);
    else out[k] = v;
  }
  return out as T;
}

function resolvePath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  for (const p of parts) {
    if (current == null) return undefined;
    current = current[p];
  }
  return current;
}
