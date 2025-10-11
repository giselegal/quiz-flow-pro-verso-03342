/**
 * 🎯 RESULT COMPONENTS - Barrel Exports
 * 
 * Ponto único de exportação para todos os componentes relacionados a Result (Páginas de Resultado).
 * Organizado por categoria para facilitar imports.
 * 
 * @example
 * // Importação facilitada:
 * import { HeroSection, PricingSection, ResultPageEditor } from '@/components/result';
 * 
 * // Ao invés de:
 * import HeroSection from '@/components/result/HeroSection';
 * import PricingSection from '@/components/result/PricingSection';
 * import ResultPageEditor from '@/components/result/editor/ResultPageEditor';
 */

// ========================================
// COMPONENTES DE LAYOUT
// ========================================

/**
 * Hero Section - Seção principal do topo
 */
export { HeroSection } from './HeroSection';

/**
 * Pricing Section - Seção de preços
 */
export { PricingSection } from './PricingSection';
export { default as EnhancedPricingSection } from './EnhancedPricingSection';

/**
 * Secondary Styles Section
 */
export { default as SecondaryStylesSection } from './SecondaryStylesSection';

/**
 * Before/After Transformation
 */
export { default as BeforeAfterTransformation } from './BeforeAfterTransformation';

/**
 * Bonus Carousel
 */
export { BonusCarousel } from './BonusCarousel';

// ========================================
// ELEMENTOS DE CONFIANÇA/SEGURANÇA
// ========================================

/**
 * Secure Purchase Element
 */
export { default as SecurePurchaseElement } from './SecurePurchaseElement';

// ========================================
// DRAG & DROP
// ========================================

/**
 * Drag & Drop Container
 */

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Performance Monitor
 */
export { default as PerformanceMonitor } from './PerformanceMonitor';

/**
 * Resource Preloader
 */
export { default as ResourcePreloader } from './ResourcePreloader';

/**
 * Error State
 */
export { default as ErrorState } from './ErrorState';

/**
 * Edit Button
 */
export { default as EditResultPageButton } from './EditResultPageButton';

// ========================================
// DEMOS E EXEMPLOS
// ========================================

/**
 * Block System Demo
 */

// ========================================
// SUB-MÓDULOS
// ========================================

/**
 * Result Editor Components
 * @see src/components/result/editor/
 * 
 * Inclui:
 * - ResultPageEditor
 * - BlockEditor
 * - StyleEditor
 * - PropertiesPanel
 * - E muito mais...
 */
export * from './editor';

/**
 * Result Blocks
 * @see src/components/result/blocks/
 * 
 * Inclui todos os blocos de resultado:
 * - HeaderBlock
 * - TextBlock
 * - ImageBlock
 * - CTABlock
 * - TestimonialsBlock
 * - E muito mais...
 */
export * from './blocks';

// ========================================
// TIPOS E INTERFACES
// ========================================

/**
 * Re-export de tipos comuns
 * (adicionar conforme necessário)
 */

// TODO: Adicionar types quando consolidados
// export type { ResultBlock, ResultSection, ResultStyle } from './types';
