/**
 * 🎯 STEP TEMPLATE LOADER
 * 
 * Carrega templates JSON dos steps modulares (12, 19, 20)
 * e converte para o formato Block[] usado pelo EditorProvider
 */

import { Block } from '@/types/editor';
import step12Template from '@/data/templates/step-12-template.json';
import step19Template from '@/data/templates/step-19-template.json';
import step20Template from '@/data/templates/step-20-template.json';

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
 * Normaliza stepId para aceitar ambos formatos (step-01, step-1)
 */
function normalizeStepId(stepId: string): string {
  const match = stepId.match(/step-0?(\d+)/);
  if (match) {
    return `step-${match[1]}`;
  }
  return stepId;
}

/**
 * Carrega template de um step específico
 */
export function loadStepTemplate(stepId: string): Block[] {
  // Normalizar para formato sem padding (step-12, step-19, step-20)
  const normalizedId = normalizeStepId(stepId);
  
  console.log('🔍 [loadStepTemplate] Tentando carregar:', {
    original: stepId,
    normalized: normalizedId
  });
  
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as StepTemplate,
    'step-19': step19Template as StepTemplate,
    'step-20': step20Template as StepTemplate,
  };

  const template = templates[normalizedId];
  
  if (!template) {
    console.warn(`⚠️ [loadStepTemplate] Template não encontrado para ${stepId} (normalizado: ${normalizedId})`);
    return [];
  }

  const blocks = convertTemplateBlocksToBlocks(template.blocks);
  
  console.log(`✅ [loadStepTemplate] Template carregado:`, {
    stepId,
    normalized: normalizedId,
    blockCount: blocks.length,
    blockTypes: blocks.map(b => b.type),
    blocks: blocks // Log completo dos blocos
  });

  return blocks;
}

/**
 * Carrega todos os templates modulares
 */
export function loadAllModularTemplates(): Record<string, Block[]> {
  return {
    'step-12': loadStepTemplate('step-12'),
    'step-19': loadStepTemplate('step-19'),
    'step-20': loadStepTemplate('step-20'),
  };
}

/**
 * Verifica se um step tem template modular
 */
export function hasModularTemplate(stepId: string): boolean {
  const normalizedId = normalizeStepId(stepId);
  return ['step-12', 'step-19', 'step-20'].includes(normalizedId);
}

/**
 * Obtém metadata do template
 */
export function getTemplateMetadata(stepId: string): { name: string; description: string } | null {
  const normalizedId = normalizeStepId(stepId);
  
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as StepTemplate,
    'step-19': step19Template as StepTemplate,
    'step-20': step20Template as StepTemplate,
  };

  const template = templates[normalizedId];
  return template?.metadata || null;
}
