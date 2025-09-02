// Utils de nomenclatura de estilos: converte slugs/tokens em nomes amigáveis

export const removeDiacritics = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const normalizeToken = (s: string) => removeDiacritics(String(s || ''))
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-');

const TABLE: Record<string, string> = {
  natural: 'Natural',
  classico: 'Clássico',
  contemporaneo: 'Contemporâneo',
  elegante: 'Elegante',
  romantico: 'Romântico',
  sexy: 'Sexy',
  dramatico: 'Dramático',
  criativo: 'Criativo',
  'estilo-natural': 'Natural',
  'estilo-classico': 'Clássico',
  'estilo-contemporaneo': 'Contemporâneo',
  'estilo-elegante': 'Elegante',
  'estilo-romantico': 'Romântico',
  'estilo-sexy': 'Sexy',
  'estilo-dramatico': 'Dramático',
  'estilo-criativo': 'Criativo',
  neutro: 'Natural',
  neutral: 'Natural',
  'estilo-neutro': 'Natural',
};

export const mapToFriendlyStyle = (raw: string): string => {
  const t = normalizeToken(raw);
  return TABLE[t] || TABLE[t.replace(/^estilo-/, '')] || 'Natural';
};

export const sanitizeStyleMentions = (text: string, label: string) => {
  if (!text) return text;
  let out = text;
  const tokens = ['estilo-neutro', 'estilo neutro', 'neutro', 'neutral'];
  tokens.forEach(t => {
    const re = new RegExp(`\\b${t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(re, label);
  });
  out = out.replace(new RegExp(`\\bestilo\\s+${label}\\b`, 'gi'), `estilo ${label}`);
  return out;
};
