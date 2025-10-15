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
    console.log(`🔍 Carregando template para step ${stepNumber} (${stepId})`);

    // 🏆 PRIORIDADE 1: Templates v3 híbridos via HTTP
    if (typeof window !== 'undefined') {
      const templatePath = `/templates/step-${stepId}-v3.json`;
      
      try {
        console.log(`📥 Fazendo fetch: ${templatePath}`);
        const response = await fetch(templatePath);
        
        if (response.ok) {
          const template = await response.json();
          console.log(`✅ Template v3 carregado via HTTP: step ${stepNumber}`);
          console.log(`📊 Template info:`, {
            version: template.templateVersion,
            sections: template.sections?.length || 0,
            blocks: template.blocks?.length || 0,
            id: template.metadata?.id
          });
          
          // Converter template v3 para formato compatível com editor
          if (template.sections && Array.isArray(template.sections)) {
            // Template v3 com seções
            return {
              ...template,
              blocks: template.sections.map((section: any) => ({
                id: section.id,
                type: section.type,
                properties: section.props || {},
                content: {},
                position: section.order || 0
              }))
            };
          } else if (template.blocks && Array.isArray(template.blocks)) {
            // Template v2 com blocos
            return template;
          } else {
            console.warn(`⚠️ Template ${stepNumber} tem estrutura inválida`);
          }
        } else {
          console.warn(`⚠️ HTTP ${response.status} para template ${stepNumber}: ${templatePath}`);
        }
      } catch (fetchError) {
        console.warn(`⚠️ Fetch falhou para template ${stepNumber}:`, fetchError);
      }
    }

    // 🔄 PRIORIDADE 2: Tentar template local (fallback)
    try {
      const localPath = `./step-${stepId}.json`;
      const moduleImport = await import(localPath);
      const template = moduleImport.default || moduleImport;

      if (template && (template.blocks || template.sections)) {
        console.log(`📁 Template local carregado: ${stepNumber}`);
        return template;
      }
    } catch (importError) {
      console.warn(`⚠️ Template local não encontrado para step ${stepNumber}:`, importError);
    }

    console.warn(`❌ NENHUM TEMPLATE encontrado para step ${stepNumber}`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao carregar template ${stepNumber}:`, error);
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
