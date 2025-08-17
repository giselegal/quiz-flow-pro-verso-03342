// Enhanced Block Registry - Componentes específicos do quiz com identidade visual
import { lazy } from 'react';

// Mapeamento de tipos de blocos para componentes específicos do quiz
export const ENHANCED_BLOCK_REGISTRY = {
  // ✅ Step01 Components - Properly registered for Etapa 1
  'quiz-intro-header': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'decorative-bar': lazy(() => import('@/components/editor/blocks/DecorativeBarInlineBlock')),
  'text': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'image': lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'form-input': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  'button': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'legal-notice': lazy(() => import('@/components/editor/blocks/LegalNoticeInlineBlock')),
  
  // ✅ Componentes principais do quiz (com identidade visual da marca)
  'text-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'options-grid': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')), 
  'button-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock')),
  
  // ✅ Componentes específicos do quiz
  'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'image-display-inline': lazy(() => import('@/components/blocks/inline/ImageDisplayInlineBlock')),
  
  // ✅ Additional aliases for compatibility
  'heading': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
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
];

export default ENHANCED_BLOCK_REGISTRY;