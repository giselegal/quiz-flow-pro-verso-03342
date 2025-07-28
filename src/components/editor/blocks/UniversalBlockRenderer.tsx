import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';

// === COMPONENTES PRINCIPAIS DO SISTEMA ===
// Componentes de página completa (funcionais)


// Componentes de quiz (funcionais)
import QuizQuestionBlock from './QuizQuestionBlock';
import QuizProgressBlock from './QuizProgressBlock';
import QuestionMultipleBlock from './QuestionMultipleBlock';
import StrategicQuestionBlock from './StrategicQuestionBlock';
import QuizTransitionBlock from './QuizTransitionBlock';
import OptionsGridBlock from './OptionsGridBlock';
import VerticalCanvasHeaderBlock from './VerticalCanvasHeaderBlock';

// === COMPONENTES INLINE MODULARES (ES7+) ===
// Importação corrigida e otimizada dos componentes inline
import {
  TextInlineBlock,
  StyleCardInlineBlock,
  StatInlineBlock,
  BadgeInlineBlock,
  ProgressInlineBlock,
  ImageDisplayInlineBlock,
  PricingCardInlineBlock,
  TestimonialCardInlineBlock,
  // Etapa 20 (Resultado)
  TestimonialsInlineBlock,
  // Etapa 21 (Oferta)
  QuizOfferPricingInlineBlock,
  CountdownInlineBlock,
  // Componentes especializados para Quiz
  LoadingAnimationBlock
} from './inline';

// Componentes básicos (funcionais)
import { SpacerBlock } from './SpacerBlock';
import { VideoPlayerBlock } from './VideoPlayerBlock';
import FormInputBlock from './FormInputBlock';
import ListBlock from './ListBlock';

// Componentes inline básicos e funcionais
import HeadingInlineBlock from './HeadingInlineBlock';
import ImageInlineBlock from './ImageInlineBlock';
import ButtonInlineBlock from './ButtonInlineBlock';
import CTAInlineBlock from './CTAInlineBlock';

// Novos componentes inline criados
import ResultHeaderInlineBlock from './inline/ResultHeaderInlineBlock';
import ResultCardInlineBlock from './inline/ResultCardInlineBlock';
import BeforeAfterInlineBlock from './inline/BeforeAfterInlineBlock';
import BonusListInlineBlock from './inline/BonusListInlineBlock';
import StepHeaderInlineBlock from './inline/StepHeaderInlineBlock';

// Novos componentes modulares para etapas 20 e 21 (temporariamente desabilitados)
import ResultPageHeaderBlock from './ResultPageHeaderBlock';

// Componentes modernos (funcionais)
import TestimonialsGridBlock from './TestimonialsGridBlock';
import FAQSectionBlock from './FAQSectionBlock';
import GuaranteeBlock from './GuaranteeBlock';

export interface BlockRendererProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: Partial<BlockData>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Universal Block Renderer for Schema-Driven Editor (ALL INLINE HORIZONTAL)
 * Renders any block type based on its type property
 * All components are now inline-editable with horizontal flexbox layout
 * Implements responsive, mobile-first design with max 2 columns
 */
export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  // ES7+ Props comuns padronizados para flexbox inline responsivo
  const commonProps = {
    block,
    isSelected,
    onClick,
    onPropertyChange: (key: string, value: any) => {
      if (onSaveInline) {
        const updatedBlock = {
          ...block,
          properties: { ...block.properties, [key]: value }
        };
        onSaveInline(block.id, updatedBlock);
      }
    },
    disabled,
    className: cn(
      // ES7+ Flexbox container responsivo padronizado
      'flex flex-wrap items-start gap-2 sm:gap-4',
      'w-full min-h-[60px] transition-all duration-300 ease-out',
      // Background e padding responsivos
      'bg-white p-2 sm:p-3 md:p-4 rounded-lg',
      // Estados visuais modernos
      isSelected && 'ring-2 ring-blue-500/50 bg-blue-50/30 shadow-md',
      !disabled && 'hover:bg-gray-50/80 hover:shadow-sm cursor-pointer',
      // Responsividade avançada
      'max-w-full overflow-hidden',
      className
    )
  };

  // TODOS os componentes são agora inline - removido conceito de não-inline
  const isInlineBlock = (blockType: string): boolean => {
    return true; // Todos são inline agora
  };

  // ES7+ Sistema responsivo simplificado - SEM wrapper duplo
  const renderComponent = () => {
    const commonProps = {
      block,
      isSelected,
      onClick,
      onPropertyChange: (key: string, value: any) => {
        if (onSaveInline) {
          const updatedBlock = {
            ...block,
            properties: { ...block.properties, [key]: value }
          };
          onSaveInline(block.id, updatedBlock);
        }
      },
      className: cn(
        // Responsividade nativa mobile-first
        'w-full transition-all duration-200',
        'border border-gray-200 rounded-lg shadow-sm bg-white',
        'hover:shadow-md hover:border-blue-300',
        isSelected && 'ring-2 ring-blue-500 border-blue-400 bg-blue-50'
      )
    };

    const componentMap: Record<string, () => React.ReactNode> = {
      // === COMPONENTES BÁSICOS ===
      header: () => <HeadingInlineBlock {...commonProps} />,
      text: () => <TextInlineBlock {...commonProps} />,
      image: () => <ImageInlineBlock {...commonProps} />,
      button: () => <ButtonInlineBlock {...commonProps} />,
      spacer: () => <SpacerBlock {...commonProps} />,
      'form-input': () => <FormInputBlock {...commonProps} />,
      list: () => <ListBlock {...commonProps} />,
      
      // === COMPONENTES DE RESULTADO ===
      'result-header': () => <HeadingInlineBlock {...commonProps} />,
      'result-description': () => <TextInlineBlock {...commonProps} />,
      
      // === COMPONENTES DE OFERTA ===
      'product-offer': () => <PricingCardInlineBlock {...commonProps} />,
      'urgency-timer': () => <CountdownInlineBlock {...commonProps} />,
      
      // === COMPONENTES ESPECIAIS ===
      'faq-section': () => <FAQSectionBlock {...commonProps} />,
      testimonials: () => <TestimonialsGridBlock {...commonProps} />,
      guarantee: () => <GuaranteeBlock {...commonProps} />,
      'video-player': () => <VideoPlayerBlock {...commonProps} />,
      
      // === COMPONENTES INLINE ESSENCIAIS ===
      'text-inline': () => <TextInlineBlock {...commonProps} />,
      'heading-inline': () => <HeadingInlineBlock {...commonProps} />,
      'button-inline': () => <ButtonInlineBlock {...commonProps} />,
      'badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'progress-inline': () => <ProgressInlineBlock {...commonProps} />,
      'image-display-inline': () => <ImageDisplayInlineBlock {...commonProps} />,
      'style-card-inline': () => <StyleCardInlineBlock {...commonProps} />,
      'result-card-inline': () => <ResultCardInlineBlock {...commonProps} />,
      'result-header-inline': () => <ResultHeaderInlineBlock {...commonProps} />,
      'before-after-inline': () => <BeforeAfterInlineBlock {...commonProps} />,
      'bonus-list-inline': () => <BonusListInlineBlock {...commonProps} />,
      'step-header-inline': () => <StepHeaderInlineBlock {...commonProps} />,
      'testimonial-card-inline': () => <TestimonialCardInlineBlock {...commonProps} />,
      'countdown-inline': () => <CountdownInlineBlock {...commonProps} />,
      'stat-inline': () => <StatInlineBlock {...commonProps} />,
      'pricing-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
      
      // === COMPONENTES QUIZ ===
      'quiz-intro-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      'vertical-canvas-header': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      'loading-animation': () => <LoadingAnimationBlock {...commonProps} />,
      'options-grid': () => <OptionsGridBlock {...commonProps} />,
      'quiz-question': () => <QuizQuestionBlock {...commonProps} />,
      'quiz-progress': () => <QuizProgressBlock {...commonProps} />,
      
      // === COMPONENTES ETAPA 20/21 (sem duplicação) ===
      'quiz-offer-pricing-inline': () => <QuizOfferPricingInlineBlock {...commonProps} />,
      'divider-inline': () => <SpacerBlock {...commonProps} />,
      
      // === COMPONENTES ETAPA 21 ESPECÍFICOS ===
      'hero-badge-inline': () => <BadgeInlineBlock {...commonProps} />,
      'hero-title-inline': () => <HeadingInlineBlock {...commonProps} />,
      'problem-list-inline': () => <ListBlock {...commonProps} />,
      'highlight-box-inline': () => <BadgeInlineBlock {...commonProps} />,
      'product-card-inline': () => <PricingCardInlineBlock {...commonProps} />,
      'price-highlight-inline': () => <PricingCardInlineBlock {...commonProps} />,
      'cta-button-inline': () => <ButtonInlineBlock {...commonProps} />,
      'trust-elements-inline': () => <TestimonialsGridBlock {...commonProps} />,
      'countdown-timer-inline': () => <CountdownInlineBlock {...commonProps} />,
      'guarantee-seal-inline': () => <BadgeInlineBlock {...commonProps} />,
      'faq-item-inline': () => <FAQSectionBlock {...commonProps} />,
      'section-header-inline': () => <HeadingInlineBlock {...commonProps} />,
      'sticky-header-inline': () => <VerticalCanvasHeaderBlock {...commonProps} />,
      
      // === COMPONENTES ESTRATÉGICOS ===
      'strategic-question-image': () => <StrategicQuestionBlock {...commonProps} />,
      'strategic-question-main': () => <StrategicQuestionBlock {...commonProps} />,
      'strategic-question-inline': () => <StrategicQuestionBlock {...commonProps} />,
      
      // === BLOCOS QUIZ ESPECÍFICOS ===
      QuizQuestionBlock: () => <QuizQuestionBlock {...commonProps} />,
      QuestionMultipleBlock: () => <QuestionMultipleBlock {...commonProps} />,
      StrategicQuestionBlock: () => <StrategicQuestionBlock {...commonProps} />,
      QuizTransitionBlock: () => <QuizTransitionBlock {...commonProps} />,

      
      // === MAPEAMENTOS ADICIONAIS ===
      'quiz-title': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-name-input': () => <FormInputBlock {...commonProps} />,
      'quiz-result-header': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-result-card': () => <PricingCardInlineBlock {...commonProps} />,
      'quiz-offer-title': () => <HeadingInlineBlock {...commonProps} />,
      'quiz-offer-countdown': () => <CountdownInlineBlock {...commonProps} />,
      'quiz-offer-faq': () => <FAQSectionBlock {...commonProps} />,
      
      // === NOVOS COMPONENTES MODULARES ===
      'result-page-header': () => <HeadingInlineBlock {...commonProps} />,
      'style-result-card': () => <StyleCardInlineBlock {...commonProps} />,
      'result-cta': () => <CTAInlineBlock {...commonProps} />,
      'offer-header': () => <HeadingInlineBlock {...commonProps} />,
      'product-showcase': () => <PricingCardInlineBlock {...commonProps} />,
      'offer-cta': () => <CTAInlineBlock {...commonProps} />
    };

    // ES7+ Return com fallback usando optional chaining
    return componentMap[block.type as keyof typeof componentMap]?.() ?? 
           <TextInlineBlock {...commonProps} />;
  };

  return (
    <div className={cn(
      // ES7+ Container principal flexbox responsivo
      'universal-block-renderer',
      'flex flex-col w-full',
      'transition-all duration-300 ease-out'
    )}>
      {renderComponent()}
    </div>
  );
};

export default UniversalBlockRenderer;