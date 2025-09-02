// Mapa centralizado de palavras-chave -> estilo
// Use em todos os motores de cálculo para evitar divergências
export const STYLE_KEYWORDS_MAPPING: Record<string, string> = {
  // Natural (A)
  natural: 'Natural',
  casual: 'Natural',
  conforto: 'Natural',
  praticidade: 'Natural',
  descontraido: 'Natural',
  jeans: 'Natural',
  tenis: 'Natural',

  // Clássico (B)
  classico: 'Clássico',
  elegancia: 'Clássico',
  sofisticacao: 'Clássico',
  atemporal: 'Clássico',
  refinado: 'Clássico',
  blazer: 'Clássico',
  social: 'Clássico',

  // Contemporâneo (C)
  contemporaneo: 'Contemporâneo',
  equilibrado: 'Contemporâneo',
  pratico: 'Contemporâneo',
  atual: 'Contemporâneo',
  versatil: 'Contemporâneo',
  funcional: 'Contemporâneo',

  // Elegante (D)
  elegante: 'Elegante',
  qualidade: 'Elegante',
  luxo: 'Elegante',
  distinto: 'Elegante',
  premium: 'Elegante',

  // Romântico (E)
  romantico: 'Romântico',
  delicado: 'Romântico',
  feminino: 'Romântico',
  suave: 'Romântico',
  vestidos: 'Romântico',
  floral: 'Romântico',

  // Sexy (F)
  sexy: 'Sexy',
  sensual: 'Sexy',
  confiante: 'Sexy',
  ousado: 'Sexy',
  sedutor: 'Sexy',
  empoderado: 'Sexy',

  // Dramático (G)
  dramatico: 'Dramático',
  marcante: 'Dramático',
  impactante: 'Dramático',
  presenca: 'Dramático',
  statement: 'Dramático',

  // Criativo (H)
  criativo: 'Criativo',
  unico: 'Criativo',
  artistico: 'Criativo',
  individual: 'Criativo',
  expressivo: 'Criativo',
  original: 'Criativo',
};

// Ordem determinística de estilos para desempate
export const STYLE_TIEBREAK_ORDER = [
  'Natural',
  'Clássico',
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo',
] as const;

export type StyleName = (typeof STYLE_TIEBREAK_ORDER)[number];

// Utilitário: cria um novo objeto de scores com inserção em ordem estável
export function stabilizeScoresOrder(scores: Record<string, number>): Record<string, number> {
  const entries = Object.entries(scores);
  entries.sort((a, b) => {
    const diff = (b[1] ?? 0) - (a[1] ?? 0);
    if (diff !== 0) return diff;
    const ia = STYLE_TIEBREAK_ORDER.indexOf(a[0] as StyleName);
    const ib = STYLE_TIEBREAK_ORDER.indexOf(b[0] as StyleName);
    return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
  });
  const ordered: Record<string, number> = {};
  for (const [k, v] of entries) ordered[k] = v;
  return ordered;
}
