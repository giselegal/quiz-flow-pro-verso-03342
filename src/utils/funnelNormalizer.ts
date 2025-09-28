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
  // Exemplo: "funnel_1759089203449_5mx9ze724" → "funnel" (ID genérico)
  let baseId = funnelId;

  // 🔧 CORREÇÃO: Tratar IDs com padrão "funnel_timestamp_suffix"
  if (funnelId.match(/^funnel_\d+_[a-zA-Z0-9]+$/)) {
    // ID genérico, provavelmente deve ser canvas vazio
    console.log('🔍 ID genérico detectado, retornando empty-canvas:', funnelId);
    return {
      baseId: 'empty-canvas',
      originalId,
      isTemplate: false
    };
  }

  // Remove timestamp pattern (números longos no final)
  baseId = baseId.replace(/-\d{13,}_[a-zA-Z0-9]+$/, '');
  baseId = baseId.replace(/-\d{13,}$/, '');
  baseId = baseId.replace(/_\d{13,}_[a-zA-Z0-9]+$/, '');
  baseId = baseId.replace(/_\d{13,}$/, '');

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
  console.log('🔍 getTemplateInfo chamado com funnelId:', funnelId);

  const normalized = normalizeFunnelId(funnelId);
  console.log('📋 Resultado normalizado:', normalized);

  // 🆕 CANVAS VAZIO: Se baseId é empty-canvas, retornar info vazia
  if (normalized.baseId === 'empty-canvas') {
    console.log('🆕 Retornando info para canvas vazio');
    return {
      ...normalized,
      template: null,
      totalSteps: 0,
      templateName: 'Canvas Vazio'
    };
  }

  try {
    // Tentar carregar template do registro unificado
    const registry = await import('@/config/unifiedTemplatesRegistry');
    const template = registry.UNIFIED_TEMPLATE_REGISTRY[normalized.baseId];

    if (template) {
      console.log('✅ Template encontrado no registro unificado:', template);
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
      console.log('✅ Template encontrado no templateLibraryService:', template);
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
  console.log('⚠️ Usando fallback para:', normalized.baseId);
  return {
    ...normalized,
    template: null,
    totalSteps: 1,
    templateName: normalized.baseId
  };
};

export default normalizeFunnelId;