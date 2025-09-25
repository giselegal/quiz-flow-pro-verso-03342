/**
 * 🎯 TEMPLATES DAS 21 ETAPAS - CARREGAMENTO PRIORITÁRIO DE DADOS REAIS
 *
 * CORREÇÃO CRÍTICA: Prioriza templates JSON reais sobre fallbacks genéricos
 */

// Cache para templates carregados
const templateCache = new Map<number, any>();

// 🎯 FUNÇÃO PRINCIPAL: Carregar template real PRIMEIRO
async function loadRealTemplate(stepNumber: number): Promise<any> {
  const stepId = stepNumber.toString().padStart(2, '0');
  
  try {
    // 🏆 PRIORIDADE 1: Templates JSON reais
    try {
      const localPath = `./step-${stepId}.json`;
      const moduleImport = await import(localPath);
      const template = moduleImport.default || moduleImport;

      if (template && template.blocks && Array.isArray(template.blocks)) {
        console.log(`🏆 Template REAL JSON carregado: ${stepNumber} com ${template.blocks.length} blocos`);
        return template;
      }
    } catch (importError) {
      console.warn(`⚠️ Template JSON não encontrado para step ${stepNumber}:`, importError);
    }

    // 🔄 PRIORIDADE 2: Fetch HTTP (desenvolvimento)
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const templatePath = `/src/config/templates/step-${stepId}.json`;
      
      try {
        const response = await fetch(templatePath);
        if (response.ok) {
          const template = await response.json();
          if (template && template.blocks) {
            console.log(`✅ Template carregado via fetch: ${stepNumber}`);
            return template;
          }
        }
      } catch (fetchError) {
        console.warn(`⚠️ Fetch falhou para template ${stepNumber}:`, fetchError);
      }
    }

    console.warn(`⚠️ NENHUM TEMPLATE REAL encontrado para step ${stepNumber}`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao carregar template real ${stepNumber}:`, error);
    return null;
  }
}

// Exportação principal - compatível com código existente
export const STEP_TEMPLATES = new Proxy({} as Record<number, any>, {
  get(_target, prop) {
    const stepNumber = Number(prop);

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
      return undefined;
    }

    // Retornar do cache se disponível
    if (templateCache.has(stepNumber)) {
      return templateCache.get(stepNumber);
    }

    // Carregar dinamicamente e cachear
    loadRealTemplate(stepNumber).then(template => {
      if (template) {
        templateCache.set(stepNumber, template);
      }
    });

    // Retorno temporário enquanto carrega (MARCA COMO LOADING)
    return {
      metadata: {
        id: `quiz-step-${stepNumber.toString().padStart(2, '0')}`,
        name: `Template Step ${stepNumber}`,
        loading: true,
      },
      blocks: [],
      __loading: true,
    };
  },
});

/**
 * 🔧 FUNÇÃO HELPER: Carregar template específico (PRIORIZA DADOS REAIS)
 */
export async function getStepTemplate(stepNumber: number): Promise<any> {
  if (templateCache.has(stepNumber)) {
    const cached = templateCache.get(stepNumber);
    // Se não está marcado como loading, retornar
    if (!cached.__loading) {
      return cached;
    }
  }

  // Forçar carregamento de template real
  const template = await loadRealTemplate(stepNumber);
  if (template) {
    templateCache.set(stepNumber, template);
    console.log(`🏆 Template REAL cacheado: ${stepNumber}`);
    return template;
  }

  // Se não encontrou template real, retornar null ao invés de fallback
  console.warn(`❌ NENHUM TEMPLATE REAL disponível para step ${stepNumber}`);
  return null;
}

/**
 * 🔧 FUNÇÃO HELPER: Limpar cache (CORREÇÃO CRÍTICA)
 */
export function clearTemplateCache(): void {
  templateCache.clear();
  console.log('🗑️ Template cache limpo - templates reais serão recarregados');
}

/**
 * 🔧 FUNÇÃO HELPER: Forçar reload de template específico
 */
export async function reloadTemplate(stepNumber: number): Promise<any> {
  templateCache.delete(stepNumber);
  return await getStepTemplate(stepNumber);
}
