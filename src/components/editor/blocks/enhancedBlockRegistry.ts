/**
 * 🔥 FASE 2: Enhanced Block Registry - UNIFIED IMPLEMENTATION
 * Mapeamento CONSERVADOR de componentes verificados
 */

import { ComponentType, lazy } from 'react';

// 🎯 INLINE BLOCKS VERIFICADOS - src/components/editor/blocks/
const ButtonInlineBlock = lazy(() => import('./ButtonInlineBlock'));
const HeadingInlineBlock = lazy(() => import('./HeadingInlineBlock'));
const TextInlineBlock = lazy(() => import('./TextInlineBlock'));
const ImageInlineBlock = lazy(() => import('./ImageInlineBlock'));
const SpacerInlineBlock = lazy(() => import('./SpacerInlineBlock'));
const StyleCardInlineBlock = lazy(() => import('./StyleCardInlineBlock'));
const DecorativeBarInlineBlock = lazy(() => import('./DecorativeBarInlineBlock'));
const TestimonialCardInlineBlock = lazy(() => import('./TestimonialCardInlineBlock'));
const BadgeInlineBlock = lazy(() => import('./BadgeInlineBlock'));
const CTAInlineBlock = lazy(() => import('./CTAInlineBlock'));

// 🎯 RESULT BLOCKS - src/components/blocks/inline/
const ResultCardInlineBlock = lazy(() => import('@/components/blocks/inline/ResultCardInlineBlock'));

// 🎯 CONTAINER BLOCKS VERIFICADOS
const BasicContainerBlock = lazy(() => import('./BasicContainerBlock'));
const FormContainerBlock = lazy(() => import('./FormContainerBlock'));

// 🎯 GRID BLOCKS VERIFICADOS
const StyleCardsGridBlock = lazy(() => import('./StyleCardsGridBlock'));

// 🎯 QUIZ BLOCKS VERIFICADOS
const QuizQuestionBlock = lazy(() => import('./QuizQuestionBlock'));
const QuizOptionBlock = lazy(() => import('./QuizOptionBlock'));
const QuizProgressBlock = lazy(() => import('./QuizProgressBlock'));
const QuizNavigationBlock = lazy(() => import('./QuizNavigationBlock'));
const QuizHeaderBlock = lazy(() => import('./QuizHeaderBlock'));
const QuizIntroHeaderBlock = lazy(() => import('./QuizIntroHeaderBlock'));
const QuizTitleBlock = lazy(() => import('./QuizTitleBlock'));
const QuizTransitionBlock = lazy(() => import('./QuizTransitionBlock'));

// 🎯 FORM BLOCKS VERIFICADOS
const SimpleFormBlock = lazy(() => import('./SimpleFormBlock'));
const LeadFormBlock = lazy(() => import('./LeadFormBlock'));

// 🎯 CONTENT BLOCKS VERIFICADOS
const HeaderBlock = lazy(() => import('./HeaderBlock'));
const SectionDividerBlock = lazy(() => import('./SectionDividerBlock'));
const TestimonialsBlock = lazy(() => import('./TestimonialsBlock'));
const BenefitsBlock = lazy(() => import('./BenefitsBlock'));
const GuaranteeBlock = lazy(() => import('./GuaranteeBlock'));
const FAQSectionBlock = lazy(() => import('./FAQSectionBlock'));
const SocialProofBlock = lazy(() => import('./SocialProofBlock'));

/**
 * 📋 REGISTRY UNIFICADO - Componentes VERIFICADOS com exports corretos
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
  // ═══════════════════════════════════════════════════════════
  // 🎯 INLINE BLOCKS
  // ═══════════════════════════════════════════════════════════
  'button-inline': ButtonInlineBlock,
  'heading-inline': HeadingInlineBlock,
  'text-inline': TextInlineBlock,
  'image-inline': ImageInlineBlock,
  'spacer-inline': SpacerInlineBlock,
  'style-card-inline': StyleCardInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'decorative-bar-inline': DecorativeBarInlineBlock,
  'testimonial-card-inline': TestimonialCardInlineBlock,
  'badge-inline': BadgeInlineBlock,
  'cta-inline': CTAInlineBlock,

  // ═══════════════════════════════════════════════════════════
  // 🎯 CONTAINER BLOCKS
  // ═══════════════════════════════════════════════════════════
  'basic-container': BasicContainerBlock,
  'form-container': FormContainerBlock,
  container: BasicContainerBlock,

  // ═══════════════════════════════════════════════════════════
  // 🎯 GRID BLOCKS
  // ═══════════════════════════════════════════════════════════
  'style-cards-grid': StyleCardsGridBlock,

  // ═══════════════════════════════════════════════════════════
  // 🎯 QUIZ BLOCKS
  // ═══════════════════════════════════════════════════════════
  'quiz-question': QuizQuestionBlock,
  'quiz-option': QuizOptionBlock,
  'quiz-progress': QuizProgressBlock,
  'quiz-navigation': QuizNavigationBlock,
  'quiz-header': QuizHeaderBlock,
  'quiz-intro-header': QuizIntroHeaderBlock,
  'quiz-title': QuizTitleBlock,
  'quiz-transition': QuizTransitionBlock,

  // ═══════════════════════════════════════════════════════════
  // 🎯 FORM BLOCKS
  // ═══════════════════════════════════════════════════════════
  'simple-form': SimpleFormBlock,
  'lead-form': LeadFormBlock,
  form: SimpleFormBlock,

  // ═══════════════════════════════════════════════════════════
  // 🎯 CONTENT BLOCKS
  // ═══════════════════════════════════════════════════════════
  header: HeaderBlock,
  'section-divider': SectionDividerBlock,
  testimonials: TestimonialsBlock,
  benefits: BenefitsBlock,
  guarantee: GuaranteeBlock,
  'faq-section': FAQSectionBlock,
  'social-proof': SocialProofBlock,

  // ═══════════════════════════════════════════════════════════
  // 🔄 ALIASES - Para compatibilidade
  // ═══════════════════════════════════════════════════════════
  button: ButtonInlineBlock,
  heading: HeadingInlineBlock,
  text: TextInlineBlock,
  image: ImageInlineBlock,
  spacer: SpacerInlineBlock,
  'style-card': StyleCardInlineBlock,
  'result-card': ResultCardInlineBlock,
  divider: SectionDividerBlock,
  cta: CTAInlineBlock,
};

/**
 * 📊 AVAILABLE COMPONENTS - Lista VERIFICADA de componentes com exports corretos
 */
export const AVAILABLE_COMPONENTS: Array<{
  type: string;
  component: ComponentType<any>;
  displayName: string;
  label: string;
  category: string;
}> = [
  // Inline Blocks
  { type: 'button-inline', component: ButtonInlineBlock, displayName: 'Button Inline', label: 'Botão', category: 'Elementos do Quiz' },
  { type: 'heading-inline', component: HeadingInlineBlock, displayName: 'Heading Inline', label: 'Título', category: 'Componentes de Conteúdo' },
  { type: 'text-inline', component: TextInlineBlock, displayName: 'Text Inline', label: 'Texto', category: 'Componentes de Conteúdo' },
  { type: 'image-inline', component: ImageInlineBlock, displayName: 'Image Inline', label: 'Imagem', category: 'Componentes de Conteúdo' },
  { type: 'spacer-inline', component: SpacerInlineBlock, displayName: 'Spacer Inline', label: 'Espaçador', category: 'Componentes de Conteúdo' },
  { type: 'style-card-inline', component: StyleCardInlineBlock, displayName: 'Style Card', label: 'Card de Estilo', category: 'Passos do Quiz' },
  { type: 'result-card-inline', component: ResultCardInlineBlock, displayName: 'Result Card', label: 'Card de Resultado', category: 'Passos do Quiz' },
  { type: 'cta-inline', component: CTAInlineBlock, displayName: 'CTA Inline', label: 'Chamada para Ação', category: 'Elementos do Quiz' },
  
  // Quiz Blocks
  { type: 'quiz-question', component: QuizQuestionBlock, displayName: 'Quiz Question', label: 'Pergunta', category: 'Passos do Quiz' },
  { type: 'quiz-option', component: QuizOptionBlock, displayName: 'Quiz Option', label: 'Opção', category: 'Passos do Quiz' },
  { type: 'quiz-progress', component: QuizProgressBlock, displayName: 'Quiz Progress', label: 'Progresso', category: 'Elementos do Quiz' },
  { type: 'quiz-header', component: QuizHeaderBlock, displayName: 'Quiz Header', label: 'Cabeçalho', category: 'Passos do Quiz' },
  
  // Container Blocks
  { type: 'basic-container', component: BasicContainerBlock, displayName: 'Container', label: 'Container', category: 'Componentes de Conteúdo' },
  { type: 'form-container', component: FormContainerBlock, displayName: 'Form Container', label: 'Container de Form', category: 'Componentes de Conteúdo' },
  
  // Content Blocks
  { type: 'testimonials', component: TestimonialsBlock, displayName: 'Testimonials', label: 'Depoimentos', category: 'Componentes de Conteúdo' },
  { type: 'benefits', component: BenefitsBlock, displayName: 'Benefits', label: 'Benefícios', category: 'Componentes de Conteúdo' },
  { type: 'guarantee', component: GuaranteeBlock, displayName: 'Guarantee', label: 'Garantia', category: 'Componentes de Conteúdo' },
  { type: 'faq-section', component: FAQSectionBlock, displayName: 'FAQ', label: 'Perguntas Frequentes', category: 'Componentes de Conteúdo' },
];

/**
 * 🔍 GET ENHANCED BLOCK COMPONENT
 * Busca componente no registry com fallback inteligente
 */
export function getEnhancedBlockComponent(type: string): ComponentType<any> | null {
  if (!type) {
    console.warn('getEnhancedBlockComponent: tipo vazio');
    return null;
  }

  // Busca direta
  if (ENHANCED_BLOCK_REGISTRY[type]) {
    return ENHANCED_BLOCK_REGISTRY[type];
  }

  // Normalizar tipo (remover sufixos, lowercase)
  const normalizedType = type.toLowerCase().replace(/block$/, '').trim();
  if (ENHANCED_BLOCK_REGISTRY[normalizedType]) {
    return ENHANCED_BLOCK_REGISTRY[normalizedType];
  }

  // Tentar com sufixo -inline
  const inlineType = `${normalizedType}-inline`;
  if (ENHANCED_BLOCK_REGISTRY[inlineType]) {
    return ENHANCED_BLOCK_REGISTRY[inlineType];
  }

  console.warn(`Componente não encontrado no registry: ${type}`);
  return null;
}

/**
 * 🔧 NORMALIZE BLOCK PROPERTIES
 * Normaliza propriedades de blocos para formato consistente
 */
export function normalizeBlockProperties(props: any): any {
  if (!props) return {};

  // Garantir estrutura básica
  return {
    id: props.id || props.blockId || '',
    type: props.type || props.blockType || 'text-inline',
    content: props.content || props.data || {},
    settings: props.settings || {},
    style: props.style || {},
    ...props
  };
}

/**
 * 📈 GET REGISTRY STATS
 * Retorna estatísticas do registry
 */
export function getRegistryStats() {
  const uniqueComponents = new Set(Object.values(ENHANCED_BLOCK_REGISTRY));
  
  return {
    total: Object.keys(ENHANCED_BLOCK_REGISTRY).length,
    unique: uniqueComponents.size,
    aliases: Object.keys(ENHANCED_BLOCK_REGISTRY).length - uniqueComponents.size,
    components: Array.from(uniqueComponents).map((c: any) => c.name || 'Anonymous')
  };
}

// Default export
export default ENHANCED_BLOCK_REGISTRY;
