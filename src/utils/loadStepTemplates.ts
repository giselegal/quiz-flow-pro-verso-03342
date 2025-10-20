/**
 * 🎯 STEP TEMPLATE LOADER - FASE 4 (Com Cache)
 * 
 * Carrega templates JSON dos steps modulares (12, 19, 20)
 * e converte para o formato Block[] usado pelo EditorProvider
 * 
 * ✅ FASE 4: Integrado com TemplateCache para performance
 */

import { Block } from '@/types/editor';
import { templateCache } from '@/utils/TemplateCache';
import { unifiedCache } from '@/utils/UnifiedTemplateCache';
import { templateKey } from '@/utils/cacheKeys';
import { getQuiz21StepsTemplate } from '@/templates/imports';

// Nota: Mantendo imports legados como referência, mas não utilizando no runtime
// Para compatibilidade histórica apenas
import step12Template from '@/data/modularSteps/step-12.json';
import step13Template from '@/data/modularSteps/step-13.json';
import step19Template from '@/data/modularSteps/step-19.json';
import step20Template from '@/data/modularSteps/step-20.json';

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

  // 1. Primeiro tenta obter do template canônico (TS)
  const canonicalTemplate = getQuiz21StepsTemplate();
  if (canonicalTemplate && canonicalTemplate[stepId]) {
    console.log(`✅ [loadStepTemplate] Usando fonte canônica (TS) para ${stepId}`);
    const sections = canonicalTemplate[stepId].sections || [];
    
    // Converter seções para o formato de blocos esperado
    const blocks = sections.map((section: any, index: number) => ({
      id: section.id || `${stepId}-block-${index}`,
      type: section.type,
      order: section.position || index,
      properties: section.properties || section.style || {},
      content: section.content || {},
    }));

    // Salvar no cache
    templateCache.set(cacheKey, blocks);
    unifiedCache.set(cacheKey, blocks);
    
    return blocks;
  }
  
  // 2. Fallback para templates legados (apenas compatibilidade histórica)
  console.warn(`⚠️ [loadStepTemplate] Fonte canônica não encontrou ${stepId}, usando fallback (deprecado)`);
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as StepTemplate,
    'step-13': step13Template as StepTemplate,
    'step-19': step19Template as StepTemplate,
    'step-20': step20Template as StepTemplate,
  };

  const template = templates[stepId];

  if (!template) {
    console.warn(`⚠️ Template não encontrado para ${stepId}`);
    return [];
  }

  const blocks = convertTemplateBlocksToBlocks(template.blocks);

  // ✅ CACHE SET
  templateCache.set(cacheKey, blocks);
  unifiedCache.set(cacheKey, blocks);

  if (import.meta.env.DEV) {
    console.log(`✅ Template carregado para ${stepId}:`, {
      stepId,
      blockCount: blocks.length,
      blockTypes: blocks.map(b => b.type),
      cached: false
    });
  }

  return blocks;
}

/**
 * Carrega todos os templates modulares
 */
export function loadAllModularTemplates(): Record<string, Block[]> {
  return {
    'step-12': loadStepTemplate('step-12'),
    'step-13': loadStepTemplate('step-13'),
    'step-19': loadStepTemplate('step-19'),
    'step-20': loadStepTemplate('step-20'),
  };
}

/**
 * Verifica se um step tem blocos JSON estáticos (steps 12, 19, 20)
 * Estes steps têm arrays de blocos direto no JSON, sem conversão
 */
export function hasStaticBlocksJSON(stepId: string): boolean {
  return ['step-12', 'step-19', 'step-20'].includes(stepId);
}

/**
 * @deprecated Use hasStaticBlocksJSON() para clareza semântica
 * MANTIDO para backward compatibility
 */
export function hasModularTemplate(stepId: string): boolean {
  // ✅ Apenas steps com JSON modular específico (12, 13, 19, 20)
  // Steps 1-11, 14-18, 21 usam Master JSON ou TypeScript fallback
  return ['step-12', 'step-13', 'step-19', 'step-20'].includes(stepId);
}

/**
 * Obtém metadata do template
 */
export function getTemplateMetadata(stepId: string): { name: string; description: string } | null {
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as StepTemplate,
    'step-19': step19Template as StepTemplate,
    'step-20': step20Template as StepTemplate,
  };

  const template = templates[stepId];
  return template?.metadata || null;
}
