/**
 * 🔧 NORMALIZADOR DE FUNNEL ID
 * 
 * Extrai e normaliza o ID base do funil a partir de URLs e slugs
 * Exemplo: "quiz-cores-perfeitas-1758512392351_o1cke0" → "quiz-cores-perfeitas"
 */

export interface NormalizedFunnelResult {
  baseId: string;
  originalId: string;
  isTemplate: boolean;
  templateId?: string;
}

/**
 * Normaliza funnelId extraindo apenas o ID base do template
 * Remove timestamps e sufixos de instância
 */
export const normalizeFunnelId = (funnelId: string | null | undefined): NormalizedFunnelResult => {
  if (!funnelId || typeof funnelId !== 'string') {
    return {
      baseId: 'default-funnel',
      originalId: funnelId || 'default-funnel',
      isTemplate: false
    };
  }

  const originalId = funnelId;

  // Se é template com prefixo
  if (funnelId.startsWith('template-')) {
    return {
      baseId: funnelId.replace('template-', ''),
      originalId,
      isTemplate: true,
      templateId: funnelId.replace('template-', '')
    };
  }

  // Extrair ID base removendo timestamp e sufixo
  // Exemplo: "quiz-cores-perfeitas-1758512392351_o1cke0" → "quiz-cores-perfeitas"
  let baseId = funnelId;

  // Remove timestamp pattern (números longos no final)
  baseId = baseId.replace(/-\d{13,}_[a-zA-Z0-9]+$/, '');
  baseId = baseId.replace(/-\d{13,}$/, '');

  // Se após limpeza ficou vazio ou muito curto, usar original
  if (baseId.length < 3) {
    baseId = originalId;
  }

  return {
    baseId,
    originalId,
    isTemplate: false
  };
};

/**
 * Obtém informações do template baseado no funnelId normalizado
 */
export const getTemplateInfo = async (funnelId: string) => {
  const normalized = normalizeFunnelId(funnelId);
  
  try {
    // Tentar carregar template do registro unificado
    const registry = await import('@/config/unifiedTemplatesRegistry');
    const template = registry.UNIFIED_TEMPLATE_REGISTRY[normalized.baseId];
    
    if (template) {
      return {
        ...normalized,
        template,
        totalSteps: template.stepCount || 1,
        templateName: template.name || normalized.baseId
      };
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar template do registro unificado:', error);
  }

  // Fallback: tentar templateLibraryService
  try {
    const { templateLibraryService } = await import('@/services/templateLibraryService');
    const template = templateLibraryService.getById(normalized.baseId);
    
    if (template) {
      return {
        ...normalized,
        template,
        totalSteps: Object.keys(template.steps || {}).length || 1,
        templateName: template.name || normalized.baseId
      };
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar template do templateLibraryService:', error);
  }

  // Fallback: retornar info básica
  return {
    ...normalized,
    template: null,
    totalSteps: 1,
    templateName: normalized.baseId
  };
};

export default normalizeFunnelId;