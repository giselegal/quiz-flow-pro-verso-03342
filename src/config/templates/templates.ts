import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🎯 TEMPLATES DAS 21 ETAPAS - CARREGAMENTO PRIORITÁRIO DE DADOS REAIS
 *
 * CORREÇÃO CRÍTICA: Prioriza templates JSON reais sobre fallbacks genéricos
 */

// Cache para templates carregados
const templateCache = new Map<number, any>();

// 📦 Mapear templates locais estáticos com Vite (elimina warning de import dinâmico)
// Chaves no formato './step-XX.json' → conteúdo JSON
const localTemplates = import.meta.glob('./step-*.json', { eager: true, import: 'default' }) as Record<string, any>;

// 🔧 Normalizador de templates v3 (leve e seguro)
function normalizeTemplateV3(raw: any, stepNumber: number): any {
  if (!raw || typeof raw !== 'object') return raw;

  const clone = JSON.parse(JSON.stringify(raw));

  // Helper: normalizar um array de sections (v3)
  const normalizeSections = (sections: any[]) => {
    if (!Array.isArray(sections)) return sections;
    // Corrige tipos, imagens e conteúdos
    sections.forEach((s) => {
      if (!s || typeof s !== 'object') return;

      // 1) Tipos com nomes inconsistentes
      if (s.type === 'options grid') s.type = 'options-grid';
      // Unificar heading para tipo com schema suportado
      if (s.type === 'heading-inline') s.type = 'text-inline';

      // 2) Mapear conteúdo específico
      if (s.type === 'text-inline') {
        // v3 às vezes vem com content.title para headings → mapear para content.text
        if (s.content && s.content.title && !s.content.text) {
          s.content.text = s.content.title;
        }
      }

      // 3) Normalizar opções de grids (image → imageUrl)
      const opts = s.content?.options;
      if (Array.isArray(opts)) {
        opts.forEach((opt: any) => {
          if (opt && !opt.imageUrl && opt.image) opt.imageUrl = opt.image;
        });
        // Se marcaram showImages mas nenhuma opção tem imagem, desabilitar para evitar quebras de UI
        const hasAnyImage = opts.some((o: any) => !!(o && (o.imageUrl || o.image)));
        if (s.content && s.content.multipleSelection && s.content.showImages && !hasAnyImage) {
          s.content.showImages = false;
        }
      }

      // 4) Pequenos ajustes de conteúdo vazio em transições
      if (stepNumber === 19 && s.type === 'text-inline') {
        if (s.content && !s.content.text) {
          s.content.text = 'Preparando seu resultado personalizado…';
        }
      }
    });

    // 5) Garantir orders únicos (ex.: colisões no step 20)
    const seen = new Set<number>();
    sections.forEach((s) => {
      if (!s) return;
      let order = typeof s.order === 'number' ? s.order : 0;
      while (seen.has(order)) order += 1;
      s.order = order;
      seen.add(order);
    });

    return sections;
  };

  // Normalizar seções quando existirem
  if (Array.isArray(clone.sections)) {
    clone.sections = normalizeSections(clone.sections);
  }

  // Ajustes específicos por step
  if (stepNumber === 1 && clone.validation && clone.validation.rules) {
    // Remover validação de selectedOptions em step-01 (intro)
    if (clone.validation.rules.selectedOptions) {
      delete clone.validation.rules.selectedOptions;
    }
  }

  // Correções textuais pequenas no step 20 (ex.: typos em mensagens de share)
  if (stepNumber === 20 && Array.isArray(clone.sections)) {
    clone.sections.forEach((s: any) => {
      if (s?.type === 'result-share' && s.content?.message) {
        s.content.message = String(s.content.message).replace('Descubri', 'Descobri');
      }
    });
  }

  return clone;
}

// 🎯 FUNÇÃO PRINCIPAL: Carregar template real PRIMEIRO
async function loadRealTemplate(stepNumber: number): Promise<any> {
  const stepId = stepNumber.toString().padStart(2, '0');
  
  try {
    appLogger.info(`🔍 Carregando template para step ${stepNumber} (${stepId})`);

    // 🏆 PRIORIDADE 1: Templates v3 híbridos via HTTP
    if (typeof window !== 'undefined') {
      const templatePath = `/templates/step-${stepId}-v3.json`;
      
      try {
        appLogger.info(`📥 Fazendo fetch: ${templatePath}`);
        const response = await fetch(templatePath);
        
        if (response.ok) {
          const rawTemplate = await response.json();
          const template = normalizeTemplateV3(rawTemplate, stepNumber);
          appLogger.info(`✅ Template v3 carregado via HTTP: step ${stepNumber}`);
          appLogger.info('📊 Template info:', { data: [{
                        version: template.templateVersion,
                        sections: template.sections?.length || 0,
                        blocks: template.blocks?.length || 0,
                        id: template.metadata?.id,
                      }] });
          
          // Converter template v3 para formato compatível com editor
          if (template.sections && Array.isArray(template.sections)) {
            // Template v3 com seções
            return {
              ...template,
              blocks: template.sections.map((section: any) => ({
                id: section.id,
                type: section.type,
                // Consolidar dados: usar props (estilo) + content (conteúdo)
                properties: section.props || section.style || {},
                content: section.content || {},
                position: section.order || 0,
              })),
            };
          } else if (template.blocks && Array.isArray(template.blocks)) {
            // Template v2 com blocos
            return template;
          } else {
            appLogger.warn(`⚠️ Template ${stepNumber} tem estrutura inválida`);
          }
        } else {
          appLogger.warn(`⚠️ HTTP ${response.status} para template ${stepNumber}: ${templatePath}`);
        }
      } catch (fetchError) {
        appLogger.warn(`⚠️ Fetch falhou para template ${stepNumber}:`, { data: [fetchError] });
      }
    }

    // 🔄 PRIORIDADE 2: Tentar template local (fallback) via import.meta.glob
    {
      const localPath = `./step-${stepId}.json`;
      const rawLocal = localTemplates[localPath];
      if (rawLocal && (rawLocal.blocks || rawLocal.sections)) {
        appLogger.info(`📁 Template local carregado: ${stepNumber}`);
        const template = normalizeTemplateV3(rawLocal, stepNumber);
        // Converter sections (se existir) para blocks padronizados
        if (template.sections && Array.isArray(template.sections)) {
          return {
            ...template,
            blocks: template.sections.map((section: any) => ({
              id: section.id,
              type: section.type,
              properties: section.props || section.style || {},
              content: section.content || {},
              position: section.order || 0,
            })),
          };
        }
        return template;
      } else {
        appLogger.warn(`⚠️ Template local não encontrado para step ${stepNumber} em ${localPath}`);
      }
    }

    appLogger.warn(`❌ NENHUM TEMPLATE encontrado para step ${stepNumber}`);
    return null;
  } catch (error) {
    appLogger.error(`❌ Erro ao carregar template ${stepNumber}:`, { data: [error] });
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
    appLogger.info(`🏆 Template REAL cacheado: ${stepNumber}`);
    return template;
  }

  // Se não encontrou template real, retornar null ao invés de fallback
  appLogger.warn(`❌ NENHUM TEMPLATE REAL disponível para step ${stepNumber}`);
  return null;
}

/**
 * 🔧 FUNÇÃO HELPER: Limpar cache (CORREÇÃO CRÍTICA)
 */
export function clearTemplateCache(): void {
  templateCache.clear();
  appLogger.info('🗑️ Template cache limpo - templates reais serão recarregados');
}

/**
 * 🔧 FUNÇÃO HELPER: Forçar reload de template específico
 */
export async function reloadTemplate(stepNumber: number): Promise<any> {
  templateCache.delete(stepNumber);
  return await getStepTemplate(stepNumber);
}
