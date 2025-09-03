/**
 * 🔗 MAPEAMENTO DE TIPOS DE COMPONENTES
 * 
 * Mapeia tipos do availableComponents.ts para tipos do modularComponents.ts
 * para resolver a discrepância entre os sistemas.
 */

export const COMPONENT_TYPE_MAPPING: Record<string, string> = {
  // Componentes de estrutura
  'quiz-intro-header': 'main-title',
  'form-container': 'quiz-form',
  'hero': 'header-section',
  
  // Componentes de conteúdo
  'text': 'main-title', // Usar main-title como fallback para texto
  'button': 'submit-button',
  
  // Componentes de interação
  'options-grid': 'submit-button', // Fallback temporário
  
  // Componentes de resultado
  'result-header-inline': 'main-title',
  'style-card-inline': 'header-section',
  'secondary-styles': 'footer-section',
  
  // Componentes de social proof
  'testimonials': 'footer-section',
  'guarantee': 'footer-section',
  'benefits': 'footer-section',
  
  // Componentes de conversão
  'quiz-offer-cta-inline': 'submit-button',
};

/**
 * Mapeia um tipo de componente do sistema do editor para o sistema NOCODE
 */
export function mapComponentType(editorType: string): string {
  return COMPONENT_TYPE_MAPPING[editorType] || editorType;
}

/**
 * Verifica se um tipo tem mapeamento
 */
export function hasTypeMapping(editorType: string): boolean {
  return editorType in COMPONENT_TYPE_MAPPING;
}
