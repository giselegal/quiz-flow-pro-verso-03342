/**
 * 🎯 STEP TEMPLATE LOADER - FASE 4 (Com Cache)
 * 
 * Carrega templates JSON dos steps modulares (12, 19, 20)
 * e converte para o formato Block[] usado pelo EditorProvider
 * 
 * ✅ FASE 4: Integrado com TemplateCache para performance
 */

import { Block } from '@/types/editor';
import { templateCache } from '@/lib/utils/TemplateCache';
import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
import { templateKey } from '@/lib/utils/cacheKeys';
import { getQuiz21StepsTemplate } from '@/templates/imports';
import { TemplateRegistry } from '@/services/canonical/TemplateService';

// Alias para compatibilidade
const unifiedCache = unifiedCacheService;

// Nota: Mantendo imports legados como referência, mas não utilizando no runtime
// Para compatibilidade histórica apenas
import step12Template from '@/services/data/modularSteps/step-12.json';
import step13Template from '@/services/data/modularSteps/step-13.json';
import step19Template from '@/services/data/modularSteps/step-19.json';
import step20Template from '@/services/data/modularSteps/step-20.json';
import { appLogger } from '@/lib/utils/appLogger';

interface StepTemplate {
  id: string;
  type: string;
  metadata?: {
    name: string;
    description: string;
  };
  blocks: Array<{
    id: string;
    type: string;
    order: number;
    properties: Record<string, any>;
    content: Record<string, any>;
  }>;
}

/**
 * Converte blocos do template JSON para formato Block
 */
function convertTemplateBlocksToBlocks(templateBlocks: StepTemplate['blocks']): Block[] {
  return templateBlocks.map((block) => ({
    id: block.id,
    type: block.type as any, // Forçar para aceitar tipos personalizados
    order: block.order,
    properties: block.properties || {},
    content: block.content || {},
  }));
}

/**
 * Carrega template de um step específico
 * ✅ FASE 4: Com cache para evitar conversões repetidas
 */
export function loadStepTemplate(stepId: string): Block[] {
  // ✅ CACHE HIT
  const cacheKey = templateKey(stepId);
  // Primeiro, tentar cache unificado
  const unifiedCached = unifiedCache.get<Block[]>(cacheKey);
  if (unifiedCached) return unifiedCached;
  // Manter compatibilidade com TemplateCache existente
  if (templateCache.has(cacheKey)) {
    const cached = templateCache.get<Block[]>(cacheKey);
    if (cached) {
      // também salvar no unificado para chamadas futuras
      unifiedCache.set(cacheKey, cached);
      return cached;
    }
  }

  // 1. Preferir TemplateRegistry (pode conter overrides v3.1 blocks ou v3 sections)
  try {
    const registry = TemplateRegistry.getInstance();
    const fromRegistry = registry.get(stepId);
    if (fromRegistry) {
      const tpl: any = fromRegistry;
      // Caso override venha como blocks (v3.1), já convertemos diretamente
      if (Array.isArray(tpl.blocks)) {
        const blocks = convertTemplateBlocksToBlocks(tpl.blocks);
        templateCache.set(cacheKey, blocks);
        unifiedCache.set(cacheKey, blocks);
        return blocks;
      }
      // Caso venha como sections (v3), mapear sections → blocks
      if (Array.isArray(tpl.sections)) {
        const blocks = (tpl.sections as any[]).map((section: any, index: number) => ({
          id: section.id || `${stepId}-block-${index}`,
          type: section.type,
          order: section.position || index,
          properties: section.properties || section.style || {},
          content: section.content || {},
        }));
        templateCache.set(cacheKey, blocks);
        unifiedCache.set(cacheKey, blocks);
        return blocks;
      }
    }
  } catch {}

  // 2. Tentar obter do template canônico (TS)
  const canonicalTemplate = getQuiz21StepsTemplate();
  if (canonicalTemplate && canonicalTemplate[stepId]) {
    appLogger.info(`✅ [loadStepTemplate] Usando fonte canônica (TS) para ${stepId}`);
    const blocks = Array.isArray(canonicalTemplate[stepId]) ? canonicalTemplate[stepId] : [];
    
    // Salvar no cache
    templateCache.set(cacheKey, blocks);
    unifiedCache.set(cacheKey, blocks);
    
    return blocks;
  }
  
  // 3. Fallback para templates legados (apenas compatibilidade histórica)
  appLogger.warn(`⚠️ [loadStepTemplate] Fonte canônica não encontrou ${stepId}, usando fallback (deprecado)`);
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as unknown as StepTemplate,
    'step-13': step13Template as unknown as StepTemplate,
    'step-19': step19Template as unknown as StepTemplate,
    'step-20': step20Template as unknown as StepTemplate,
  };

  const template = templates[stepId];

  if (!template) {
    appLogger.warn(`⚠️ Template não encontrado para ${stepId}`);
    return [];
  }

  const blocks = convertTemplateBlocksToBlocks(template.blocks);

  // ✅ CACHE SET
  templateCache.set(cacheKey, blocks);
  unifiedCache.set(cacheKey, blocks);

  if (import.meta.env.DEV) {
    appLogger.info(`✅ Template carregado para ${stepId}:`, { data: [{
            stepId,
            blockCount: blocks.length,
            blockTypes: blocks.map(b => b.type),
            cached: false,
          }] });
  }

  return blocks;
}

/**
 * Carrega todos os templates modulares
 */
export function loadAllModularTemplates(): Record<string, Block[]> {
  // Carregar 1..21 dinamicamente
  const result: Record<string, Block[]> = {};
  for (let i = 1; i <= 21; i++) {
    const id = `step-${String(i).padStart(2, '0')}`;
    result[id] = loadStepTemplate(id);
  }
  return result;
}

/**
 * Verifica se um step tem blocos JSON estáticos (steps 12, 19, 20)
 * Estes steps têm arrays de blocos direto no JSON, sem conversão
 */
export function hasStaticBlocksJSON(stepId: string): boolean {
  try {
    const registry = TemplateRegistry.getInstance();
    const tpl: any = registry.get(stepId);
    return Array.isArray(tpl?.blocks);
  } catch {
    return ['step-12', 'step-19', 'step-20'].includes(stepId);
  }
}

/**
 * @deprecated Use hasStaticBlocksJSON() para clareza semântica
 * MANTIDO para backward compatibility
 */
export function hasModularTemplate(stepId: string): boolean {
  // Preferir detecção dinâmica via TemplateRegistry
  try {
    const registry = TemplateRegistry.getInstance();
    const tpl: any = registry.get(stepId);
    if (tpl && (Array.isArray(tpl.blocks) || Array.isArray(tpl.sections))) return true;
  } catch {}
  // Caso contrário, considerar canônico TS disponível
  const canonical = getQuiz21StepsTemplate() as any;
  if (canonical && canonical[stepId]) return true;
  // Fallback legado
  return ['step-12', 'step-13', 'step-19', 'step-20'].includes(stepId);
}

/**
 * Obtém metadata do template
 */
export function getTemplateMetadata(stepId: string): { name: string; description: string } | null {
  try {
    const registry = TemplateRegistry.getInstance();
    const tpl: any = registry.get(stepId);
    if (tpl?.metadata) return tpl.metadata;
  } catch {}
  const canonical = getQuiz21StepsTemplate() as any;
  return canonical?.[stepId]?.metadata || null;
}
