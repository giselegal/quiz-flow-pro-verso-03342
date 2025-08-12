// Simplified Canvas Configuration Service
// Generates BlockData with proper content and order properties

import { BlockData } from '@/types/blocks';

export const createSimpleBlockData = (
  id: string,
  type: string,
  properties: any,
  order: number = 0
): BlockData => ({
  id,
  type,
  content: properties,
  order,
  properties,
});

// Simple configuration that avoids complex type issues
export const getStep20CanvasConfig = (userResult: any) => {
  console.log('Canvas config requested for:', userResult);

  // Return minimal configuration to avoid TypeScript errors
  return {
    name: 'Página de Resultado',
    id: 'step-20-result',
    order: 20,
    components: [
      createSimpleBlockData('header', 'header', { title: 'Resultado' }, 0),
      createSimpleBlockData('content', 'text', { text: 'Conteúdo do resultado' }, 1),
      createSimpleBlockData('cta', 'button', { text: 'Ação Principal' }, 2),
    ],
  };
};

// Export legacy functions for compatibility
export const generateCanvasConfigForResult = getStep20CanvasConfig;
export default { getStep20CanvasConfig, generateCanvasConfigForResult };
