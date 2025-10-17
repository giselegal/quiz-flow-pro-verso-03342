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
import step12Template from '@/data/modularSteps/step-12.json';
import step19Template from '@/data/modularSteps/step-19.json';
import step20Template from '@/data/modularSteps/step-20.json';
import step01Template from '@/data/modularSteps/step-01.json';
import step02Template from '@/data/modularSteps/step-02.json';
import step13Template from '@/data/modularSteps/step-13.json';

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
  const cacheKey = `template:${stepId}`;
  if (templateCache.has(cacheKey)) {
    const cached = templateCache.get<Block[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const templates: Record<string, StepTemplate> = {
    'step-01': step01Template as StepTemplate,
    'step-02': step02Template as StepTemplate,
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
    'step-01': loadStepTemplate('step-01'),
    'step-02': loadStepTemplate('step-02'),
    'step-12': loadStepTemplate('step-12'),
    'step-13': loadStepTemplate('step-13'),
    'step-19': loadStepTemplate('step-19'),
    'step-20': loadStepTemplate('step-20'),
  };
}

/**
 * Verifica se um step tem template modular
 */
export function hasModularTemplate(stepId: string): boolean {
  return ['step-01', 'step-02', 'step-12', 'step-13', 'step-19', 'step-20'].includes(stepId);
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
