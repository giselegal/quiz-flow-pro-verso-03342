// Utilidade simples para gerar hash determinístico dos blocos
// Evita dependências externas. Usa FNV-1a 32-bit sobre string compactada
// Block relevante: id,type,order + chaves ordenadas de properties/content
export interface HashableBlock {
  id: string;
  type: string;
  order?: number;
  properties?: Record<string, any>;
  content?: Record<string, any>;
}

function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h >>> 0) * 0x01000193;
  }
  // Convert to unsigned 32-bit hex
  return ('0000000' + (h >>> 0).toString(16)).slice(-8);
}

function stableSerialize(obj: any): string {
  if (obj == null) return '';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableSerialize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => k + ':' + stableSerialize(obj[k])).join(',') + '}';
}

export function computeBlocksHash(blocks: HashableBlock[]): string {
  try {
    const parts = blocks.map(b => {
      const props = stableSerialize(b.properties || {});
      const content = stableSerialize(b.content || {});
      return `${b.id}|${b.type}|${typeof b.order === 'number' ? b.order : ''}|p:${props}|c:${content}`;
    });
    const joined = parts.join('||');
    return fnv1a(joined);
  } catch {
    return '00000000';
  }
}
