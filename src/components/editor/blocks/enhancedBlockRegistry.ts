// Enhanced Block Registry - Componentes específicos do quiz com identidade visual
import { lazy } from 'react';

// Mapeamento de tipos de blocos para componentes específicos do quiz
export const ENHANCED_BLOCK_REGISTRY = {
  // ✅ Componentes principais do quiz (com identidade visual da marca)
  'quiz-intro-header': lazy(() => import('@/components/blocks/unified/UnifiedHeaderVariant').then(module => ({ default: module.QuizIntroHeaderBlock }))),
  'text-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'options-grid': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')), 
  'button-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'lead-form': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  
  // ✅ Componentes específicos do quiz (usando fallbacks para os que não existem)
  'loading-animation': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'progress-bar': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'result-card': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'decorative-bar': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'image-display-inline': lazy(() => import('@/components/blocks/inline/ImageDisplayInlineBlock')),
  
  // ✅ Componentes de fallback (genéricos)
  'heading': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'text': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'image': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback
  'button': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
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
  { type: 'quiz-intro-header', label: 'Cabeçalho Quiz', category: 'quiz' },
  { type: 'text-inline', label: 'Texto', category: 'content' },
  { type: 'options-grid', label: 'Opções em Grid', category: 'quiz' },
  { type: 'button-inline', label: 'Botão', category: 'action' },
  { type: 'lead-form', label: 'Formulário Lead', category: 'conversion' },
  { type: 'image-display-inline', label: 'Imagem', category: 'content' },
  { type: 'result-card', label: 'Card de Resultado', category: 'quiz' },
  { type: 'loading-animation', label: 'Animação de Loading', category: 'ui' },
  { type: 'progress-bar', label: 'Barra de Progresso', category: 'ui' },
  { type: 'decorative-bar', label: 'Barra Decorativa', category: 'ui' },
];

export default ENHANCED_BLOCK_REGISTRY;