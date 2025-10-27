/**
 * 🔄 TEMPLATE CONVERTER ADAPTER - FASE 1.3
 * 
 * Adaptador temporário que redireciona chamadas antigas para UnifiedTemplateRegistry
 * Elimina conversões de formato mantendo compatibilidade
 * 
 * MIGRAÇÃO:
 * 1. Substituir chamadas diretas por templateRegistry.getStep()
 * 2. Remover este adaptador após migração completa
 * 
 * @deprecated Use UnifiedTemplateRegistry diretamente
 */

import { BlockComponent } from '@/components/editor/quiz/types';
import { Block, BlockType } from '@/types/editor';
import { templateRegistry } from '@/services/UnifiedTemplateRegistry';

/**
 * @deprecated Use templateRegistry.getStep() diretamente (retorna Block[])
 */
export async function safeGetTemplateBlocksAsync(
  stepId: string,
  _template?: any,
  _funnelId?: string,
): Promise<BlockComponent[]> {
  console.warn('⚠️ safeGetTemplateBlocksAsync is deprecated. Use templateRegistry.getStep() instead.');
  
  // Usar novo registry
  const blocks = await templateRegistry.getStep(stepId);
  
  // Converter Block[] → BlockComponent[] (última conversão)
  return blocksToBlockComponents(blocks as any as Block[]);
}

/**
 * @deprecated Versão síncrona - Use versão async ou templateRegistry
 */
export function safeGetTemplateBlocks(
  stepId: string,
  _template?: any,
  _funnelId?: string,
): BlockComponent[] {
  console.warn('⚠️ safeGetTemplateBlocks (sync) is deprecated. Use templateRegistry.getStep() instead.');
  
  // Fallback: tentar L1 cache síncrono
  // Nota: Isso só funciona se o step já foi carregado anteriormente
  const cached = (templateRegistry as any).l1Cache?.get(stepId);
  
  if (cached) {
    return blocksToBlockComponents(cached);
  }
  
  // Sem cache: retornar vazio e triggerar carregamento assíncrono
  console.warn(`⚠️ ${stepId} não está em L1 cache. Carregando...`);
  templateRegistry.getStep(stepId).then(blocks => {
    console.log(`✅ ${stepId} carregado assíncrono`);
  });
  
  return [];
}

/**
 * Converter BlockComponent[] → Block[] (eliminando em FASE 2)
 */
export function blockComponentsToBlocks(components: BlockComponent[]): Block[] {
  return components.map(comp => ({
    id: comp.id,
    type: comp.type as BlockType,
    order: comp.order,
    properties: comp.properties || {},
    content: comp.content || {} as any,
  } as Block));
}

/**
 * Converter Block[] → BlockComponent[] (eliminando em FASE 2)
 */
export function blocksToBlockComponents(blocks: Block[]): BlockComponent[] {
  return blocks.map(block => ({
    id: block.id,
    type: block.type as BlockType,
    order: block.order,
    properties: block.properties || {},
    content: block.content || {},
    parentId: null,
  }));
}

/**
 * @deprecated Não é mais necessário - templates já em formato Block[]
 */
export function convertTemplateToBlocks(_template: any): BlockComponent[] {
  console.warn('⚠️ convertTemplateToBlocks is deprecated. Templates are already in Block[] format.');
  return [];
}
