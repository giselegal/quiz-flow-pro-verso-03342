
/**
 * Componentes de Resultado Reutilizáveis - ETAPAS 20-21 DO FUNIL COMPLETO
 * 
 * Blocos 100% editáveis para uso no editor visual /editor
 * Cada componente é totalmente configurável via props e pode ser usado
 * independentemente ou integrado com o DynamicBlockRenderer.
 * 
 * COBERTURA COMPLETA:
 * - Etapa 20: Página de resultado completa ✅
 * - Etapa 21: Página de oferta/venda ✅
 */

// Blocos principais de resultado (apenas os que existem)
export { default as PrimaryStyleCardBlock } from './PrimaryStyleCardBlock';
export { default as FinalCTABlock } from './FinalCTABlock';

// Re-export types para facilitar importação
export type { PrimaryStyleCardBlockProps } from './PrimaryStyleCardBlock';

// Export StyleResult types from the main component
export type { StyleResultData, StyleResultProps } from '@/components/result/StyleResult';

// Types dos blocos específicos
export interface FinalCTABlockProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
  className?: string;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}
