import { BlockComponent } from '@/components/editor/quiz/types';

/**
 * 🔄 TEMPLATE CONVERTER UTILITY
 * 
 * Converts various quiz template formats to standardized BlockComponent arrays
 */

/**
 * Converts a quiz template section/step object to BlockComponent array
 */
export function convertTemplateToBlocks(template: any): BlockComponent[] {
  if (!template) return [];
  
  // If it's already an array of blocks, return it
  if (Array.isArray(template)) {
    return template.map((block, index) => ({
      id: block.id || `block-${index}`,
      type: block.type || 'text',
      content: block.content || {},
      properties: block.properties || block.props || {},
      order: block.order ?? index,
      parentId: block.parentId || null
    }));
  }
  
  // If it's a step object with sections (new template format v3.0)
  if (template.sections && Array.isArray(template.sections)) {
    return template.sections.map((section: any, index: number) => ({
      id: section.id || `block-${index}`,
      type: section.type || 'container',
      content: section.content || {},
      properties: {
        ...section.style,
        ...section.animation,
        ...(section.properties || {})
      },
      order: index,
      parentId: null
    }));
  }
  
  // Fallback: empty blocks array
  console.warn('⚠️ Template format not recognized, returning empty blocks:', template);
  return [];
}

/**
 * Safely extracts blocks from various template formats
 */
export function safeGetTemplateBlocks(stepId: string, template: any, funnelId?: string): BlockComponent[] {
  try {
    const stepTemplate = template[stepId];
    
    if (!stepTemplate) {
      console.warn(`⚠️ No template found for ${stepId}`);
      return [];
    }
    
    // ✅ FASE 1: Detectar formato v3.0 com sections
    if (stepTemplate?.sections && Array.isArray(stepTemplate.sections)) {
      console.log(`✅ Template v3.0 detectado para ${stepId}, convertendo ${stepTemplate.sections.length} sections`);
      const blocks = convertTemplateToBlocks(stepTemplate);
      console.log(`✅ Convertidos ${blocks.length} blocos para ${stepId}`);
      return blocks;
    }
    
    // ✅ Detectar array direto (formato legacy)
    if (Array.isArray(stepTemplate)) {
      console.log(`✅ Template legacy (array) detectado para ${stepId}, ${stepTemplate.length} blocks`);
      const blocks = convertTemplateToBlocks(stepTemplate);
      console.log(`✅ Convertidos ${blocks.length} blocos para ${stepId}`);
      return blocks;
    }
    
    console.warn(`⚠️ Formato não reconhecido para ${stepId}:`, stepTemplate);
    return [];
  } catch (error) {
    console.error(`❌ Error converting template for ${stepId}:`, error);
    return [];
  }
}
