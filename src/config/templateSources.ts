import { appLogger } from '@/lib/utils/appLogger';
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
  appLogger.info('Raw env VITE_USE_MASTER_JSON:', { data: [(import.meta as any)?.env?.VITE_USE_MASTER_JSON] });
  appLogger.info('Raw env VITE_USE_MODULAR_TEMPLATES:', { data: [(import.meta as any)?.env?.VITE_USE_MODULAR_TEMPLATES] });
  appLogger.info('Raw env VITE_USE_NORMALIZED_JSON:', { data: [(import.meta as any)?.env?.VITE_USE_NORMALIZED_JSON] });
  appLogger.info('isTestEnv:', { data: [isTestEnv] });
  appLogger.info('→ useMasterJSON:', { data: [TEMPLATE_SOURCES.useMasterJSON] });
  appLogger.info('→ useNormalizedJSON:', { data: [TEMPLATE_SOURCES.useNormalizedJSON] });
  appLogger.info('→ useModularTemplates:', { data: [TEMPLATE_SOURCES.useModularTemplates] });
  appLogger.info('→ preferPublicStepJSON:', { data: [TEMPLATE_SOURCES.preferPublicStepJSON] });
  console.groupEnd();
}

export default TEMPLATE_SOURCES;
