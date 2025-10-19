/**
 * Interpola tokens em strings do tipo "Olá, {username}!" com base em um contexto.
 * Suporta caminhos aninhados: {user.name}, {result.styleName}
 * Mantém tokens desconhecidos intactos por segurança.
 * Suporta default opcional com pipe: {username|Convidado}
 */
export function getByPath(obj: any, path: string): any {
  try {
    return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  } catch {
    return undefined;
  }
}

export function interpolate(template: string, context: Record<string, any>): string {
  if (!template || typeof template !== 'string') return template as any;
  return template.replace(/\{([^}]+)\}/g, (match, token) => {
    const [path, def] = String(token).split('|');
    const trimmed = path.trim();
    const value = getByPath(context, trimmed);
    if (value === undefined || value === null || value === '') {
      return def !== undefined ? String(def) : match; // mantém o token
    }
    return String(value);
  });
}

/**
 * Interpola recursivamente valores em objetos/arrays.
 * - Strings são interpoladas
 * - Arrays são mapeados
 * - Objetos são clonados e campos string interpolados
 */
export function interpolateDeep<T = any>(value: T, context: Record<string, any>): T {
  if (typeof value === 'string') {
    return interpolate(value, context) as any as T;
  }
  if (Array.isArray(value)) {
    return (value as any[]).map(v => interpolateDeep(v, context)) as any as T;
  }
  if (value && typeof value === 'object') {
    const out: any = Array.isArray(value) ? [] : {};
    for (const key of Object.keys(value as any)) {
      out[key] = interpolateDeep((value as any)[key], context);
    }
    return out as T;
  }
  return value;
}

// Alias compatível com a especificação pedida
export const renderVarTokens = interpolate;
