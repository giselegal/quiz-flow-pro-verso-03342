import { Block } from '@/types/editor';
import { SupabaseComponent } from '@/hooks/useEditorSupabase';

/**
 * Mapeia um componente do Supabase para um Block da UI
 */
export const mapSupabaseComponentToBlock = (component: SupabaseComponent): Block => {
  return {
    id: component.id,
    type: component.component_type_key as any,
    properties: {
      ...component.properties,
      customStyling: component.custom_styling || {},
    },
    content: component.properties?.content || component.properties || {},
    order: component.order_index,
  };
};

/**
 * Mapeia um Block da UI para dados do Supabase
 */
export const mapBlockToSupabaseComponent = (
  block: Block,
  stepNumber: number,
  funnelId?: string,
  quizId?: string
): Partial<SupabaseComponent> => {
  return {
    component_type_key: block.type,
    step_number: stepNumber,
    order_index: block.order || 0,
    properties: {
      ...block.properties,
      content: block.content,
    },
    custom_styling: block.properties?.customStyling || {},
    instance_key: `${block.type}_${Date.now()}`,
    is_active: true,
    is_locked: false,
    is_template: false,
    funnel_id: funnelId || null,
    quiz_id: quizId || null,
  };
};

/**
 * Agrupa componentes do Supabase por step_number em formato stepBlocks
 */
export const groupSupabaseComponentsByStep = (
  components: SupabaseComponent[]
): Record<string, Block[]> => {
  const grouped: Record<string, Block[]> = {};

  components.forEach((component) => {
    const stepKey = `step-${component.step_number}`;
    if (!grouped[stepKey]) {
      grouped[stepKey] = [];
    }
    grouped[stepKey].push(mapSupabaseComponentToBlock(component));
  });

  // Ordenar blocos por order_index dentro de cada step
  Object.keys(grouped).forEach((stepKey) => {
    grouped[stepKey].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return grouped;
};

/**
 * Extrai step_number de uma stepKey (ex: "step-1" -> 1)
 */
export const extractStepNumberFromKey = (stepKey: string): number => {
  const match = stepKey.match(/step-(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
};
