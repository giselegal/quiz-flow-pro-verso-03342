import { SupabaseComponent } from '@/hooks/useEditorSupabase';
import { Block } from '@/types/editor';

/**
 * Mapeia um componente do Supabase para um Block da UI
 * Implementação robusta com fallbacks
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
 * Normaliza dados para inserção/atualização
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
 * Implementação otimizada com ordenação automática
 */
export const groupSupabaseComponentsByStep = (
  components: SupabaseComponent[]
): Record<string, Block[]> => {
  console.log('🔄 Grouping Supabase components by step:', components.length);

  const grouped: Record<string, Block[]> = {};

  components.forEach(component => {
    const stepNumber = component.step_number || 0;
    const stepKey = `step-${stepNumber}`;

    if (!grouped[stepKey]) {
      grouped[stepKey] = [];
    }

    try {
      const block = mapSupabaseComponentToBlock(component);
      grouped[stepKey].push(block);
    } catch (error) {
      console.error('❌ Error mapping component:', component.id, error);
    }
  });

  // Ordenar blocos por order_index dentro de cada step
  Object.keys(grouped).forEach(stepKey => {
    grouped[stepKey].sort((a, b) => (a.order || 0) - (b.order || 0));
    console.log(`✅ Step ${stepKey}: ${grouped[stepKey].length} blocks`);
  });

  return grouped;
};

/**
 * Extrai step_number de uma stepKey (ex: "step-1" -> 1)
 * Com validação e fallback
 */
export const extractStepNumberFromKey = (stepKey: string): number => {
  const match = stepKey.match(/step-(\d+)/);
  const stepNumber = match ? parseInt(match[1], 10) : 1;

  if (isNaN(stepNumber) || stepNumber < 1) {
    console.warn('⚠️ Invalid step key:', stepKey, 'defaulting to 1');
    return 1;
  }

  return stepNumber;
};

/**
 * Cria um Block temporário para updates otimistas
 */
export const createTempBlock = (blockData: Partial<Block>): Block => {
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: blockData.type || 'text',
    order: blockData.order ?? 0,
    content: blockData.content ?? {},
    properties: blockData.properties ?? {},
    ...blockData,
  };
};
