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
  // Inclui 12, 13, 19 e 20 quando disponíveis como JSON estático importado
  // step-13 foi adicionado para alinhar com os imports e permitir fallback estático
  return ['step-12', 'step-13', 'step-19', 'step-20'].includes(stepId);
}

/**
 * @deprecated Use hasStaticBlocksJSON() para clareza semântica
 * MANTIDO para backward compatibility
 */
export function hasModularTemplate(stepId: string): boolean {
  // ✅ Steps com JSON modular/normalizado específico
  // Inclui: 2–13, 19, 20 (12, 13, 19, 20 com JSON estático; 2–11 normalizados em public)
  const m = stepId.match(/^step-(\d{1,2})$/);
  const n = m ? parseInt(m[1], 10) : NaN;
  if (!Number.isFinite(n)) return false;
  return (n >= 2 && n <= 13) || n === 19 || n === 20;
}

/**
 * Versão assíncrona com suporte a JSONs normalizados (public/templates/normalized)
 * Mantém a função síncrona loadStepTemplate para compatibilidade com chamadas existentes.
 */
export async function loadStepTemplateAsync(stepId: string): Promise<Block[]> {
  const cacheKey = templateKey(stepId);
  const cached = unifiedCache.get<Block[]>(cacheKey);
  if (cached) return cached;

  const stepNum = parseInt(stepId.replace('step-', ''), 10);
  // Removido step 19 do intervalo normalizado para priorizar JSON estático modular
  const isNormalizedRange = (stepNum >= 2 && stepNum <= 11) || (stepNum >= 13 && stepNum <= 18);

  // Tentar JSON normalizado público (await)
  if (isNormalizedRange && typeof window !== 'undefined') {
    try {
      const url = `/templates/normalized/${stepId}.json`;
      const resp = await fetch(url, { cache: 'force-cache' as RequestCache });
      if (resp.ok) {
        const json = await resp.json();
        const blocks = convertTemplateBlocksToBlocks((json?.blocks || []) as any);
        unifiedCache.set(cacheKey, blocks);
        return blocks;
      }
    } catch (e) {
      console.warn(`⚠️ Falha ao carregar JSON normalizado (${stepId})`, e);
    }
  }

  // Fallback: JSON estático importado (12, 13, 19, 20)
  const templates: Record<string, StepTemplate> = {
    'step-12': step12Template as StepTemplate,
    'step-13': step13Template as StepTemplate,
    'step-19': step19Template as StepTemplate,
    'step-20': step20Template as StepTemplate,
  };
  const template = templates[stepId];
  if (!template) return [];
  const blocks = convertTemplateBlocksToBlocks(template.blocks);
  unifiedCache.set(cacheKey, blocks);
  return blocks;
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
