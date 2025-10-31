/**
 * 🔄 COMPONENT INSTANCE CONVERTER
 * 
 * Fase 2.1 - Supabase Integration
 * 
 * Converte ComponentInstance[] (Supabase) → Block[] (Editor)
 * 
 * Responsabilidades:
 * - Mapeamento de tipos entre schemas
 * - Extração de properties + content
 * - Ordenação correta por order_index
 * - Validação de dados
 */

import { Block } from '@/types/editor';
import type { ComponentInstance } from '@/services/funnelComponentsService';

/**
 * Converte array de ComponentInstance (Supabase) para Block[] (Editor)
 */
export function convertComponentInstancesToBlocks(
  instances: ComponentInstance[]
): Block[] {
  if (!Array.isArray(instances) || instances.length === 0) {
    return [];
  }

  // Ordenar por order_index
  const sorted = [...instances].sort((a, b) => a.order_index - b.order_index);

  // Converter cada instance para Block
  return sorted.map((instance, idx) => {
    const properties = instance.properties || {};
    
    // Extrair content se estiver em properties
    const content = properties.content || {};
    
    // Remover content de properties para evitar duplicação
    const { content: _, ...cleanProperties } = properties;

    return {
      id: instance.instance_key || instance.id || `block-${idx}`,
      type: instance.component_type_key as any,
      order: instance.order_index ?? idx,
      properties: cleanProperties,
      content: content,
      // Preservar metadata adicional se existir
      style: properties.style || instance.custom_styling || {},
      metadata: {
        supabaseId: instance.id,
        isActive: instance.is_active,
        isLocked: instance.is_locked,
        isTemplate: instance.is_template,
        createdAt: instance.created_at,
        updatedAt: instance.updated_at,
      },
    };
  });
}

/**
 * Converte Block[] (Editor) de volta para ComponentInstance[] (Supabase)
 * Usado para salvar mudanças
 */
export function convertBlocksToComponentInstances(
  blocks: Block[],
  funnelId: string,
  stepNumber: number
): Omit<ComponentInstance, 'id' | 'created_at' | 'updated_at'>[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [];
  }

  return blocks.map((block, idx) => ({
    instance_key: block.id,
    component_type_key: block.type,
    funnel_id: funnelId,
    step_number: stepNumber,
    order_index: block.order ?? idx,
    properties: {
      ...block.properties,
      content: block.content,
      style: block.style,
    },
    custom_styling: block.style || {},
    is_active: (block.metadata as any)?.isActive ?? true,
    is_locked: (block.metadata as any)?.isLocked ?? false,
    is_template: (block.metadata as any)?.isTemplate ?? false,
    stage_id: null,
  }));
}

/**
 * Valida se ComponentInstance tem campos obrigatórios
 */
export function validateComponentInstance(instance: any): instance is ComponentInstance {
  return (
    instance &&
    typeof instance.id === 'string' &&
    typeof instance.instance_key === 'string' &&
    typeof instance.component_type_key === 'string' &&
    typeof instance.funnel_id === 'string' &&
    typeof instance.step_number === 'number' &&
    typeof instance.order_index === 'number'
  );
}

/**
 * Filtra instâncias inválidas e loga avisos
 */
export function filterValidInstances(instances: any[]): ComponentInstance[] {
  const valid: ComponentInstance[] = [];
  const invalid: any[] = [];

  for (const instance of instances) {
    if (validateComponentInstance(instance)) {
      valid.push(instance);
    } else {
      invalid.push(instance);
    }
  }

  if (invalid.length > 0) {
    console.warn(
      `⚠️ ${invalid.length} component instance(s) inválida(s) filtrada(s)`,
      invalid
    );
  }

  return valid;
}
