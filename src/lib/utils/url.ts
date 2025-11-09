/**
 * URL utilities: safely append UTM params and handle existing query strings
 */
export function appendUTMParams(url: string, utm: Partial<Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_term'|'utm_content', string>>): string {
  if (!url) return url;
  try {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
    Object.entries(utm || {}).forEach(([key, value]) => {
      if (!value) return;
      // Não sobrescrever UTM já presentes
      if (!u.searchParams.has(key)) {
        u.searchParams.set(key, value);
      }
    });
    return u.toString();
  } catch {
    // Caso url seja relativa simples sem window disponível
    const hasQuery = url.includes('?');
    const existing = new URLSearchParams(url.split('?')[1] || '');
    Object.entries(utm || {}).forEach(([key, value]) => {
      if (!value) return;
      if (!existing.has(key)) existing.set(key, value);
    });
    return `${url}${hasQuery ? '&' : '?'}${existing.toString()}`;
  }
}
