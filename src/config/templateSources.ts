/**
 * 🔧 Configuração de fontes de template via flags de ambiente
 * - Desliga fetch do master JSON e JSON normalizado por padrão
 * - Mantém modular como opcional
 */

const bool = (v: any, def: boolean) => {
  if (v == null) return def;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
};

export const TEMPLATE_SOURCES = {
  useMasterJSON: bool((import.meta as any)?.env?.VITE_USE_MASTER_JSON, false),
  useNormalizedJSON: bool((import.meta as any)?.env?.VITE_USE_NORMALIZED_JSON, false),
  useModularTemplates: bool((import.meta as any)?.env?.VITE_USE_MODULAR_TEMPLATES, true),
};

export default TEMPLATE_SOURCES;
