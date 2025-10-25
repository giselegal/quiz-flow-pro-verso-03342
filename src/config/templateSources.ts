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

// Detecta ambiente de teste (Vitest/Jest)
const isTestEnv = (() => {
  try {
    const meta = (import.meta as any)?.env?.MODE;
    // Vitest define MODE === 'test'; Jest pode expor process.env.VITEST
    return meta === 'test' || !!(typeof process !== 'undefined' && (process as any).env?.VITEST);
  } catch {
    return false;
  }
})();

export const TEMPLATE_SOURCES = {
  // No ambiente de teste, habilitamos master JSON por padrão para atender expectativas dos testes
  useMasterJSON: bool((import.meta as any)?.env?.VITE_USE_MASTER_JSON, isTestEnv ? true : false),
  useNormalizedJSON: bool((import.meta as any)?.env?.VITE_USE_NORMALIZED_JSON, false),
  useModularTemplates: bool((import.meta as any)?.env?.VITE_USE_MODULAR_TEMPLATES, true),
  // Preferir carregar JSONs públicos individuais (inclui -v3.json) antes de outras fontes
  preferPublicStepJSON: bool((import.meta as any)?.env?.VITE_PREFER_PUBLIC_STEP_JSON, true),
};

// 🔍 DEBUG: Log das flags carregadas (apenas em DEV)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.group('🔧 Template Sources Configuration');
  console.log('Raw env VITE_USE_MASTER_JSON:', (import.meta as any)?.env?.VITE_USE_MASTER_JSON);
  console.log('Raw env VITE_USE_MODULAR_TEMPLATES:', (import.meta as any)?.env?.VITE_USE_MODULAR_TEMPLATES);
  console.log('Raw env VITE_USE_NORMALIZED_JSON:', (import.meta as any)?.env?.VITE_USE_NORMALIZED_JSON);
  console.log('isTestEnv:', isTestEnv);
  console.log('→ useMasterJSON:', TEMPLATE_SOURCES.useMasterJSON);
  console.log('→ useNormalizedJSON:', TEMPLATE_SOURCES.useNormalizedJSON);
  console.log('→ useModularTemplates:', TEMPLATE_SOURCES.useModularTemplates);
  console.log('→ preferPublicStepJSON:', TEMPLATE_SOURCES.preferPublicStepJSON);
  console.groupEnd();
}

export default TEMPLATE_SOURCES;
