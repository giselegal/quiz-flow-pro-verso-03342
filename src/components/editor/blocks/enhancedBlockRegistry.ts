// Enhanced Block Registry - Componentes específicos do quiz com identidade visual
import { lazy } from 'react';

// Mapeamento de tipos de blocos para componentes específicos do quiz
export const ENHANCED_BLOCK_REGISTRY = {
  // ✅ Step01 Components - Properly registered for Etapa 1
  'quiz-intro-header': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'decorative-bar': lazy(() => import('@/components/editor/blocks/DecorativeBarInlineBlock')),
  text: lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  image: lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'form-input': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  button: lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'legal-notice': lazy(() => import('@/components/editor/blocks/LegalNoticeInlineBlock')),

  // ✅ CRITICAL MISSING COMPONENTS - Template block types
  'form-container': lazy(() => import('@/components/editor/blocks/FormContainerBlock')),
  'options-grid': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')),
  hero: lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
  'result-header-inline': lazy(() => import('@/components/editor/blocks/ResultHeaderInlineBlock')),
  'style-card-inline': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'secondary-styles': lazy(() => import('@/components/editor/blocks/QuizResultSecondaryStylesBlock')),
  benefits: lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
  testimonials: lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
  guarantee: lazy(() => import('@/components/editor/blocks/GuaranteeBlock')),
  'quiz-offer-cta-inline': lazy(() => import('@/components/editor/blocks/CTAInlineBlock')),

  // ✅ Componentes principais do quiz (com identidade visual da marca)
  'text-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'button-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock')),

  // ✅ Componentes específicos do quiz
  'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'image-display-inline': lazy(() => import('@/components/editor/blocks/ImageDisplayInline')),

  // ✅ COMPONENTES AVANÇADOS - Funcionalidades do Step01 para todos os steps
  'connected-template-wrapper': lazy(
    () => import('@/components/editor/blocks/ConnectedTemplateWrapperBlock')
  ),
  'connected-lead-form': lazy(() => import('@/components/editor/blocks/ConnectedLeadFormBlock')),
  'quiz-navigation': lazy(() => import('@/components/editor/blocks/QuizNavigationBlock')),
  'style-cards-grid': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'gradient-animation': lazy(() => import('@/components/editor/blocks/GradientAnimationBlock')),

  // ✅ Additional aliases for compatibility
  heading: lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
};

// Função para obter componente do registry
export const getEnhancedBlockComponent = (type: string) => {
  const component = ENHANCED_BLOCK_REGISTRY[type as keyof typeof ENHANCED_BLOCK_REGISTRY];

  if (!component) {
    console.warn(`⚠️ Componente não encontrado no registry: ${type}`);
    // Fallback para componente de texto
    return ENHANCED_BLOCK_REGISTRY['text-inline'];
  }

  return component;
};

// Lista de componentes disponíveis na sidebar
export const AVAILABLE_COMPONENTS = [
  // Step01 Components
  { type: 'quiz-intro-header', label: 'Cabeçalho Quiz', category: 'step01' },
  { type: 'decorative-bar', label: 'Barra Decorativa', category: 'step01' },
  { type: 'text', label: 'Texto', category: 'step01' },
  { type: 'image', label: 'Imagem', category: 'step01' },
  { type: 'form-input', label: 'Campo de Nome', category: 'step01' },
  { type: 'button', label: 'Botão', category: 'step01' },
  { type: 'legal-notice', label: 'Aviso Legal', category: 'step01' },

  // Quiz Components
  { type: 'text-inline', label: 'Texto Inline', category: 'content' },
  { type: 'options-grid', label: 'Opções em Grid', category: 'quiz' },
  { type: 'button-inline', label: 'Botão Inline', category: 'action' },
  { type: 'lead-form', label: 'Formulário Lead', category: 'conversion' },
  { type: 'image-display-inline', label: 'Imagem Display', category: 'content' },
  { type: 'result-card', label: 'Card de Resultado', category: 'quiz' },
  { type: 'loading-animation', label: 'Animação de Loading', category: 'ui' },
  { type: 'progress-bar', label: 'Barra de Progresso', category: 'ui' },

  // ✅ COMPONENTES AVANÇADOS - Funcionalidades do Step01 para todos os steps
  { type: 'connected-template-wrapper', label: 'Template Wrapper Conectado', category: 'advanced' },
  { type: 'connected-lead-form', label: 'Formulário Conectado', category: 'advanced' },
  { type: 'quiz-navigation', label: 'Navegação Premium', category: 'advanced' },
  { type: 'style-cards-grid', label: 'Grid de Estilos', category: 'advanced' },
  { type: 'gradient-animation', label: 'Gradiente Animado', category: 'advanced' },
];

export default ENHANCED_BLOCK_REGISTRY;
