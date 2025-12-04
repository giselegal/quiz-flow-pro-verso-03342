/**
 * 🔄 MIGRATION EXPORT - HierarchicalTemplateSource V1 → V2
 * 
 * Este arquivo permite migração gradual do HierarchicalTemplateSourceV1 para V2.
 * 
 * ESTRATÉGIA:
 * - V2 é a implementação otimizada (300 linhas vs 808)
 * - V1 permanece disponível para compatibilidade
 * - Flag de feature permite escolher versão
 * 
 * COMO MIGRAR:
 * 1. Adicione localStorage.setItem('FEATURE_HIERARCHICAL_V2', 'true')
 * 2. Teste funcionalidade
 * 3. Se OK, ative para todos
 * 4. Remova V1 após 100% migrado
 */

import { HierarchicalTemplateSource as HierarchicalTemplateSourceV1 } from './HierarchicalTemplateSource';
import { HierarchicalTemplateSource as HierarchicalTemplateSourceV2 } from './HierarchicalTemplateSourceV2';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Verificar se V2 está habilitada
 */
function isV2Enabled(): boolean {
  try {
    // Feature flag em localStorage
    if (typeof window !== 'undefined') {
      const flag = window.localStorage?.getItem('FEATURE_HIERARCHICAL_V2');
      if (flag === 'true') return true;
      if (flag === 'false') return false;
    }

    // Env var (Vite)
    const viteFlag = (import.meta as any)?.env?.VITE_HIERARCHICAL_V2;
    if (viteFlag === 'true') return true;
    if (viteFlag === 'false') return false;

    // Padrão: usar V1 (seguro)
    return false;
  } catch {
    return false;
  }
}

/**
 * Instância singleton (compatibilidade com código existente)
 */
const useV2 = isV2Enabled();

export const hierarchicalTemplateSource = useV2
  ? new HierarchicalTemplateSourceV2()
  : new HierarchicalTemplateSourceV1();

// Log de qual versão está ativa
if (useV2) {
  appLogger.info('🚀 [HierarchicalTemplateSource] Usando V2 (otimizada, ~300 linhas)');
} else {
  appLogger.info('📦 [HierarchicalTemplateSource] Usando V1 (legada, 808 linhas)');
}

// Re-export das classes para imports diretos
export { HierarchicalTemplateSourceV1, HierarchicalTemplateSourceV2 };

// Export do tipo para compatibilidade
export type { TemplateDataSource } from './TemplateDataSource';
